'use client';

const VEHICLE_CLASSES = new Set(['car', 'truck', 'bus', 'motorcycle']);
const MIN_CONFIDENCE = 0.45;

let modelPromise: Promise<import('@tensorflow-models/coco-ssd').ObjectDetection> | null = null;

async function getModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      await import('@tensorflow/tfjs');
      const cocoSsd = await import('@tensorflow-models/coco-ssd');
      return cocoSsd.load({ base: 'lite_mobilenet_v2' });
    })();
  }
  return modelPromise;
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image'));
    };
    img.src = url;
  });
}

export function preloadVehicleModel() {
  return getModel();
}

export async function fileContainsVehicle(file: File): Promise<boolean> {
  const model = await getModel();
  const img = await loadImageFromFile(file);
  const predictions = await model.detect(img);

  return predictions.some(
    (p) => VEHICLE_CLASSES.has(p.class) && p.score >= MIN_CONFIDENCE,
  );
}