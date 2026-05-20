import os
from typing import List

import cv2
import httpx
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from pydantic import BaseModel, HttpUrl
from ultralytics import YOLO

app = FastAPI(
    title="Car Readers AI Service",
    description="AI backend for Car Readers Vehicle Health Analysis using YOLOv8 and computer vision.",
)

MODEL_PATH = os.getenv("YOLO_MODEL_PATH", "yolov8n")

try:
    model = YOLO(MODEL_PATH)
except Exception as error:
    model = None
    print(f"Warning: YOLO model could not be loaded: {error}")

class AnalysisRequest(BaseModel):
    imageUrls: List[HttpUrl]

class Issue(BaseModel):
    title: str
    severity: str
    confidence: float
    repair_estimate: str
    risk_level: str

class AnalysisResponse(BaseModel):
    condition_score: int
    risk_level: str
    issues: List[Issue]

async def download_image(url: str) -> bytes:
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.content

def normalize_confidence(confidence: float) -> float:
    return round(min(max(confidence * 100, 35), 99), 2)

def estimate_severity(confidence: float) -> str:
    if confidence >= 90:
        return "Critical"
    if confidence >= 75:
        return "High"
    if confidence >= 55:
        return "Medium"
    return "Low"

def estimate_risk_level(severity: str) -> str:
    if severity == "Critical":
        return "High"
    if severity == "High":
        return "Medium"
    return "Low"

def estimate_repair_cost(severity: str) -> str:
    if severity == "Critical":
        return "£850"
    if severity == "High":
        return "£420"
    if severity == "Medium":
        return "£180"
    return "£90"

ALLOWED_VEHICLE_LABELS = {
    "car",
    "truck",
    "bus",
    "motorcycle",
    "motorbike",
    "bicycle",
    "van",
    "suv",
    "pickup",
    "vehicle",
    "train",
    "boat",
}


def is_vehicle_detection(result) -> bool:
    if not hasattr(result, "boxes"):
        return False

    for box in result.boxes:
        try:
            cls = int(box.cls.cpu().numpy()) if hasattr(box.cls, "cpu") else int(box.cls)
            try:
                label = str(result.names.get(cls, "")).lower()
            except AttributeError:
                label = str(result.names[cls]).lower() if cls < len(result.names) else ""
        except Exception:
            continue
        if label in ALLOWED_VEHICLE_LABELS:
            return True

    return False


def summarize_condition(issues: List[Issue]) -> int:
    if not issues:
        return 96
    penalty = sum({"Low": 1, "Medium": 3, "High": 6, "Critical": 10}[issue.severity] for issue in issues)
    score = max(40, 100 - penalty - len(issues) * 2)
    return round(score)

def build_issue(title: str, confidence: float) -> Issue:
    const_confidence = normalize_confidence(confidence)
    const_severity = estimate_severity(const_confidence)
    const_risk = estimate_risk_level(const_severity)
    return Issue(
        title=title,
        severity=const_severity,
        confidence=const_confidence,
        repair_estimate=estimate_repair_cost(const_severity),
        risk_level=const_risk,
    )

@app.post("/analysis", response_model=AnalysisResponse)
async def analyze(request: AnalysisRequest):
    if not request.imageUrls:
        raise HTTPException(status_code=400, detail="imageUrls list is required.")

    images = []
    for image_url in request.imageUrls:
        try:
            content = await download_image(str(image_url))
            images.append(content)
        except Exception as error:
            raise HTTPException(status_code=400, detail=f"Unable to download image {image_url}: {error}")

    issues = []

    if model is None:
        issues.append(build_issue("Visible anomaly detected during basic analysis", 78))
    else:
        for image_buffer in images:
            np_img = np.frombuffer(image_buffer, np.uint8)
            image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
            if image is None:
                continue

            try:
                results = model(image, verbose=False)
            except Exception:
                continue

            for result in results:
                for box in result.boxes:
                    confidence = float(box.conf.cpu().numpy()) if hasattr(box, "conf") else 0.5
                    class_name = result.names[int(box.cls.cpu().numpy())] if hasattr(box, "cls") else "damage"
                    label = str(class_name).replace("_", " ").title()
                    issues.append(build_issue(label, confidence))

    if not issues:
        issues.append(build_issue("No visible issues detected", 48))

    combined_score = summarize_condition(issues)
    highest_risk = "High" if any(issue.risk_level == "High" for issue in issues) else "Medium"

    return AnalysisResponse(
        condition_score=combined_score,
        risk_level=highest_risk,
        issues=issues,
    )


@app.post("/vehicle-check")
async def validate_vehicle_image(image: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Vehicle validation model is not available.")

    content = await image.read()
    np_img = np.frombuffer(content, np.uint8)
    cv_image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    if cv_image is None:
        raise HTTPException(status_code=400, detail="Unable to parse image data.")

    try:
        results = model(cv_image, verbose=False)
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Vehicle validation failed: {error}")

    is_vehicle = any(is_vehicle_detection(result) for result in results)
    return {"isVehicle": is_vehicle}
