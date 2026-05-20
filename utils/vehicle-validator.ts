import { allowedImageTypes } from "@/utils/validators";

const VEHICLE_VALIDATION_SERVICE_URL = process.env.VEHICLE_VALIDATION_SERVICE_URL || "http://localhost:8000/vehicle-check";

export async function validateVehicleFile(file: File): Promise<boolean> {
  if (!file) {
    return false;
  }

  if (!allowedImageTypes.includes(file.type)) {
    return false;
  }

  const formData = new FormData();
  formData.append("image", new Blob([await file.arrayBuffer()], { type: file.type }), file.name || "upload");

  const response = await fetch(VEHICLE_VALIDATION_SERVICE_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Vehicle validation service error: ${response.status} ${response.statusText} ${errorBody}`);
  }

  const data = await response.json();
  return data?.isVehicle === true;
}
