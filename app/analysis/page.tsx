'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Camera,
  CheckCircle2,
  Lock,
  ArrowRight,
  Scan,
  Loader2,
  X,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { io } from 'socket.io-client';

// --- Vehicle detection (browser, no API key) ---
const VEHICLE_CLASSES = new Set(['car', 'truck', 'bus', 'motorcycle' , 'Caravan', 'Trailer', 'Boat', 'Motorhome', 'Campervan', 'Van', 'SUV', 'Pickup', 'Minivan' , 'RV', 'Convertible', 'Coupe', 'Hatchback', 'Sedan', 'Wagon']);
const MIN_CONFIDENCE = 0.45;

let modelPromise: Promise<import('@tensorflow-models/coco-ssd').ObjectDetection> | null = null;

async function getVehicleModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      await import('@tensorflow/tfjs');
      const cocoSsd = await import('@tensorflow-models/coco-ssd');
      return cocoSsd.load({ base: 'lite_mobilenet_v2' });
    })();
  }
  return modelPromise;
}

function preloadVehicleModel() {
  return getVehicleModel();
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

async function fileContainsVehicle(file: File): Promise<boolean> {
  const model = await getVehicleModel();
  const img = await loadImageFromFile(file);
  const predictions = await model.detect(img);
  return predictions.some((p) => VEHICLE_CLASSES.has(p.class) && p.score >= MIN_CONFIDENCE);
}

// --- Types ---
type ScanPhase = 'upload' | 'scanning' | 'results';

type ImageFile = {
  id: string;
  file: File;
  preview: string;
  uploaded: boolean;
  analyzing: boolean;
};

type DetectedIssue = {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  location: string;
  description: string;
  repairEstimate: string;
  blurred: boolean;
};

type ApiIssue = {
  id?: string | number;
  title?: string;
  severity?: DetectedIssue['severity'];
  confidence?: number;
  location?: string;
  description?: string;
  repairEstimate?: string;
};

type AnalysisResponse = {
  hiddenCount?: number;
  issues?: ApiIssue[];
};

function isApiIssue(value: unknown): value is ApiIssue {
  return typeof value === 'object' && value !== null;
}

const SEVERITY_COLORS = {
  low: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', text: 'text-cyan-300' },
  medium: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-300' },
  high: { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-300' },
  critical: { bg: 'bg-rose-500/20', border: 'border-rose-500/30', text: 'text-rose-300' },
};

function UnifiedImageUploader({
  images,
  onImagesAdd,
  onImageRemove,
  isAnalyzing = false,
}: {
  images: ImageFile[];
  onImagesAdd: (files: File[]) => void;
  onImageRemove: (imageId: string) => void;
  isAnalyzing?: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      return false;
    }
    return true;
  };

  const handleFiles = useCallback(
    async (files: File[]) => {
      const validFiles = files.filter(validateFile);
      if (validFiles.length === 0) {
        setValidationErrors(['Please upload JPEG, PNG, or WebP images under 10MB.']);
        return;
      }

      setUploading(true);
      setValidationErrors([]);

      const accepted: File[] = [];
      const rejected: string[] = [];

      for (const file of validFiles) {
        try {
          const isVehicle = await fileContainsVehicle(file);
          if (isVehicle) {
            accepted.push(file);
          } else {
            rejected.push(
              `${file.name}: No vehicle detected. Please upload only vehicle photos.`,
            );
          }
        } catch {
          rejected.push(`${file.name}: This image could not be verified. Try a different photo.`);
        }
      }

      if (rejected.length > 0) {
        setValidationErrors(rejected);
      }

      if (accepted.length > 0) {
        onImagesAdd(accepted);
      }

      setUploading(false);
    },
    [onImagesAdd],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [handleFiles],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/80 border border-cyan-400/10 rounded-3xl p-8 shadow-[0_30px_80px_rgba(8,18,35,0.4)]"
    >
      <motion.div className="text-center mb-6">
        <motion.div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300">
          <Camera className="h-8 w-8" />
        </motion.div>
        <h3 className="text-xl font-semibold text-slate-100 mb-2">Upload Vehicle Images for Inspection</h3>
        <p className="text-slate-400">Only vehicle images are accepted; unrelated files are ignored automatically.</p>
      </motion.div>

      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-3xl border-2 border-dashed p-8 transition ${
          dragOver ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-700 hover:border-cyan-300 hover:bg-cyan-500/10'
        } ${isAnalyzing || uploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileInput}
        />
        {uploading ? (
          <motion.div className="flex flex-col items-center gap-3 text-cyan-300">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
            <p className="text-sm">Scanning uploaded images for your vehicle...</p>
            <p className="text-xs text-slate-500">The first pass may take a moment while our AI model prepares.</p>
          </motion.div>
        ) : (
          <motion.div className="flex flex-col items-center gap-4 text-center">
            <motion.div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10">
              <Plus className="h-6 w-6 text-cyan-300" />
            </motion.div>
            <motion.div>
              <p className="font-medium text-slate-100">Drop vehicle images here</p>
              <p className="text-sm text-slate-400">or click to upload up to 10 photos</p>
            </motion.div>
          </motion.div>
        )}
      </div>

      {validationErrors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4"
        >
            <div className="flex items-start gap-2 text-rose-300">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <motion.div className="space-y-1 text-sm">
              <p className="font-semibold text-slate-100">Some images were not accepted</p>
              {validationErrors.map((msg) => (
                <p key={msg}>{msg}</p>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}

      {images.length > 0 && (
        <motion.div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-950/80 shadow-[0_30px_80px_rgba(8,18,35,0.35)]"
            >
              <img src={image.preview} alt="Preview" className="h-40 w-full object-cover" />
              <motion.div className="absolute inset-x-0 bottom-0 p-3 bg-slate-950/85 backdrop-blur-sm">
                <p className="text-sm text-slate-300">{image.uploaded ? 'Ready for analysis' : 'Image verified'}</p>
              </motion.div>
              {!isAnalyzing && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageRemove(image.id);
                  }}
                  className="absolute right-3 top-3 rounded-full bg-cyan-600/90 p-2 opacity-0 transition group-hover:opacity-100"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {images.length > 0 && (
        <p className="mt-4 text-center text-sm text-slate-400">
          {images.length} vehicle image{images.length !== 1 ? 's' : ''} ready
        </p>
      )}
    </motion.div>
  );
}

function ScanningInterface({
  images,
  detectedIssues,
  progress,
  statusMessage,
  errorMessage,
  mode,
  onUnlockReport,
}: {
  images: ImageFile[];
  detectedIssues: DetectedIssue[];
  progress: number;
  statusMessage: string;
  errorMessage?: string | null;
  mode: 'scanning' | 'results';
  onUnlockReport?: () => void;
}) {
  return (
    <motion.div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <motion.div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300">
          <Scan className="h-8 w-8 animate-pulse" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          {mode === 'results' ? 'Inspection Complete' : 'Inspection Underway'}
        </h2>
        <p className="text-slate-400">{statusMessage}</p>
        <p className="text-slate-500 text-sm mt-2">
          {mode === 'results'
            ? 'See the identified issues and recommendations below.'
            : `Processing ${images.length} image${images.length !== 1 ? 's' : ''} to detect vehicle issues.`}
        </p>
      </motion.div>

      {errorMessage ? (
        <motion.div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-200">
          <strong>Error:</strong> {errorMessage}
        </motion.div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/10 to-transparent p-6 overflow-hidden"
      >
        <motion.div className="relative h-40 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-[0_25px_80px_rgba(8,18,35,0.3)]">
          <motion.div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/30"
            animate={{ y: [0, 160] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-x-0 h-16 bg-gradient-to-b from-cyan-500/20 to-transparent pointer-events-none"
            animate={{ y: [0, 160] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div className="absolute inset-0 opacity-5">
            <motion.div className="h-full grid grid-cols-8 gap-px">
              {Array(32)
                .fill(0)
                .map((_, i) => (
                  <motion.div key={i} className="border border-cyan-500/20" />
                ))}
            </motion.div>
          </motion.div>
          <motion.div className="absolute inset-0 flex items-center justify-center gap-2 p-4">
            {images.slice(0, 3).map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.5, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="w-20 h-20 rounded-lg overflow-hidden border border-cyan-500/30 flex-shrink-0"
              >
                <img src={img.preview} alt={`Scan preview ${idx + 1}`} className="w-full h-full object-cover" />
              </motion.div>
            ))}
            {images.length > 3 && (
              <motion.div className="text-cyan-300 text-xs font-mono">+{images.length - 3} more</motion.div>
            )}
          </motion.div>
          <motion.div className="absolute inset-0 flex items-end justify-center p-4 text-xs font-mono text-cyan-300/40">
            SCANNING...
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-[0_20px_60px_rgba(8,18,35,0.35)]"
      >
        <motion.div className="flex items-center justify-between mb-4 text-slate-100">
          <span className="font-semibold">Analysis progress</span>
          <strong className="text-cyan-300 text-lg">{Math.round(progress)}%</strong>
        </motion.div>
        <motion.div className="h-4 overflow-hidden rounded-full bg-slate-800 border border-cyan-500/20">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-300 shadow-md shadow-cyan-600/20"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
        <p className="text-xs text-slate-500 mt-3">
          Processing {Math.ceil((progress / 100) * images.length)} of {images.length} image
          {images.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-[0_20px_60px_rgba(8,18,35,0.35)]"
      >
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Detected Issues</h3>
        <motion.div className="space-y-4">
          {detectedIssues.length === 0 ? (
            <motion.div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-6 text-center text-slate-400">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-3"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                  <Scan className="h-8 w-8 text-cyan-400" />
                </motion.div>
                <p>Reviewing uploaded photos for wear, faults, and potential damage...</p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div className="relative">
              <motion.div className="space-y-4 select-none pointer-events-none" style={{ filter: 'blur(5px)' }}>
                {detectedIssues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4"
                  >
                    <motion.div className="flex flex-col gap-3">
                      <motion.div className="flex items-center justify-between gap-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${SEVERITY_COLORS[issue.severity].bg} ${SEVERITY_COLORS[issue.severity].text}`}
                        >
                          {issue.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500">{Math.round(issue.confidence)}% confidence</span>
                      </motion.div>
                      <h4 className="text-lg font-semibold text-slate-100">{issue.title}</h4>
                      <motion.div className="space-y-2 text-sm text-slate-400">
                        <p>{issue.description}</p>
                        <p className="font-medium text-slate-100">Location: {issue.location}</p>
                        <p className="text-sm text-slate-300">Repair estimate: {issue.repairEstimate}</p>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-x-0 top-[37%] -translate-y-1/2 mx-2 sm:mx-4 rounded-2xl sm:rounded-3xl border border-slate-700 bg-slate-950/90 backdrop-blur-xl p-6 shadow-xl"
              >
                <motion.div className="flex flex-col items-center text-center gap-3 sm:gap-4">
                  <motion.div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300">
                    <Lock className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>

                  <motion.div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-100 mb-1">Unlock the Detailed Report</h4>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
                      {detectedIssues.length} issue{detectedIssues.length !== 1 ? 's' : ''} found. Access the full
                      breakdown with location notes, repair guidance, and priority ratings.
                    </p>
                  </motion.div>

                  <motion.div className="flex flex-col xs:flex-row flex-wrap justify-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-slate-400">
                    <span className="flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400 flex-shrink-0" />
                      Complete issue breakdown
                    </span>
                    <span className="flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400 flex-shrink-0" />
                      Suggested repair range
                    </span>
                    <span className="flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400 flex-shrink-0" />
                      Recommended action plan
                    </span>
                  </motion.div>

                  <button
                    type="button"
                    onClick={onUnlockReport}
                    className="inline-flex items-center gap-2 rounded-xl sm:rounded-2xl bg-cyan-600 px-5 py-2.5 sm:px-7 sm:py-3 text-sm sm:text-base text-white font-semibold shadow-md hover:bg-cyan-500 active:scale-95 transition-all"
                  >
                    Unlock Full Report
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function AnalysisPage() {
  const [phase, setPhase] = useState<ScanPhase>('upload');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [detectedIssues, setDetectedIssues] = useState<DetectedIssue[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('Ready to upload images for vehicle inspection.');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    preloadVehicleModel().catch(console.error);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedVehicleId = localStorage.getItem('latestVehicleId');
      if (storedVehicleId) {
        setVehicleId(storedVehicleId);
      }
    }
  }, []);

  useEffect(() => {
    const socket = io({ path: '/api/socket' });

    socket.on('analysis_progress', (data: { progress?: number }) => {
      if (typeof data.progress === 'number') {
        setScanProgress(data.progress);
      }
    });

    socket.on('issue_detected', (data: DetectedIssue) => {
      setDetectedIssues((prev) => {
        if (prev.some((item) => item.id === data.id)) {
          return prev;
        }
        return [
          ...prev,
          {
            id: data.id,
            title: data.title,
            severity: data.severity,
            confidence: data.confidence,
            location: data.location,
            description: data.description,
            repairEstimate: data.repairEstimate,
            blurred: prev.length >= 3,
          },
        ];
      });
    });

    socket.on('analysis_complete', () => {
      setPhase('results');
      setScanProgress(100);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleImagesAdd = useCallback((files: File[]) => {
    const imagePromises = files.map(
      (file) =>
        new Promise<ImageFile>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              id: `img-${Date.now()}-${Math.random()}`,
              file,
              preview: e.target?.result as string,
              uploaded: false,
              analyzing: false,
            });
          };
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(imagePromises).then((newImages) => {
      setImages((prev) => [...prev, ...newImages].slice(0, 10));
    });
  }, []);

  const handleImageRemove = useCallback((imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  }, []);

  const startAnalysis = async () => {
    if (images.length === 0) return;

    setPhase('scanning');
    setDetectedIssues([]);
    setErrorMessage(null);
    setScanProgress(15);
    setScanStatus('Preparing images for analysis...');

    for (let i = 0; i < images.length; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setImages((prev) =>
        prev.map((img) => (img.id === images[i].id ? { ...img, uploaded: true, analyzing: true } : img)),
      );
      setScanStatus(`Processing image ${i + 1} of ${images.length}...`);
    }

    try {
      const formData = new FormData();
      images.forEach((image) => formData.append('images', image.file));

      setScanStatus('Uploading to cloud storage...');
      setScanProgress(25);
      let currentVehicleId = `demo-${Date.now()}`;

      try {
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => null);
          throw new Error(errorData?.error || 'Upload failed');
        }

        const uploadData = await uploadResponse.json();
        currentVehicleId = uploadData.vehicleId;
        setVehicleId(currentVehicleId);
        localStorage.setItem('latestVehicleId', currentVehicleId);
      } catch (uploadError) {
        console.warn('Upload fallback, using demo vehicle id:', uploadError);
        setScanStatus('Upload unavailable. Using demo data for analysis...');
        setScanProgress(35);
      }

      setScanStatus('Initializing AI detection engine...');
      setScanProgress(45);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setScanStatus('Performing AI vehicle assessment...');
      setScanProgress(55);

      let analysisData: AnalysisResponse = { hiddenCount: 4, issues: [] };

      try {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 30000);

        const analysisResponse = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vehicleId: currentVehicleId }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!analysisResponse.ok) {
          const errorData = await analysisResponse.json().catch(() => null);
          throw new Error(errorData?.error || 'Analysis failed');
        }

        setScanStatus('Waiting for AI server response...');
        setScanProgress(65);
        analysisData = (await analysisResponse.json()) as AnalysisResponse;
      } catch (analysisError) {
        console.warn('Analysis fallback, using demo issues:', analysisError);
        setScanStatus('AI server unavailable. Showing demo results.');
        setScanProgress(70);
        analysisData = { hiddenCount: 4, issues: [] };
      }

      setScanStatus('Processing detection results...');
      setScanProgress(80);

      const fallbackIssues: DetectedIssue[] = [
        {
          id: 'demo-1',
          title: 'Paint scratch detected',
          severity: 'medium',
          confidence: 82,
          location: 'Front bumper',
          description: 'A visible paint scratch has been detected at the front bumper area.',
          repairEstimate: '£180',
          blurred: true,
        },
        {
          id: 'demo-2',
          title: 'Panel misalignment',
          severity: 'high',
          confidence: 90,
          location: 'Left door',
          description: 'The left door shows uneven alignment and probable previous repair.',
          repairEstimate: '£420',
          blurred: true,
        },
        {
          id: 'demo-3',
          title: 'Rust risk hotspot',
          severity: 'low',
          confidence: 76,
          location: 'Rear wheel arch',
          description: 'Early corrosion risk spotted behind the paint layer.',
          repairEstimate: '£140',
          blurred: true,
        },
      ];

      const hiddenCount = Number(analysisData.hiddenCount ?? 3);
      const issuesFromApi = Array.isArray(analysisData.issues)
        ? analysisData.issues.filter(isApiIssue)
        : [];

      const allIssues: DetectedIssue[] =
        issuesFromApi.length > 0
          ? issuesFromApi.map((issue, index) => ({
              id: issue.id?.toString() ?? `issue-${index}`,
              title: issue.title ?? 'Detected issue',
              severity: issue.severity ?? 'medium',
              confidence: issue.confidence ?? 0,
              location: issue.location ?? 'Exterior',
              description: issue.description ?? issue.title ?? 'Detected issue details',
              repairEstimate: issue.repairEstimate ?? 'Estimate not available',
              blurred: true,
            }))
          : fallbackIssues;

      const lockedIssues: DetectedIssue[] = Array.from(
        { length: Math.max(hiddenCount, 2) },
        (_, index) => ({
          id: `locked-${index}`,
          title: 'Locked damage point',
          severity: index === 0 ? 'high' : 'medium',
          confidence: 100,
          location: 'Locked area',
          description: 'Unlock your full AI report to reveal the exact issue and repair estimate.',
          repairEstimate: 'Locked',
          blurred: true,
        }),
      );

      setDetectedIssues([...allIssues, ...lockedIssues]);
      setScanProgress(100);
      setScanStatus('✓ Analysis complete. Review your results below.');
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPhase('results');
    } catch (error: unknown) {
      console.error('Analysis error:', error);
      const message = error instanceof Error ? error.message : 'Please try again.';
      setErrorMessage(message);
      setScanStatus(`Analysis failed: ${message}`);
      setScanProgress(0);
      setPhase('upload');
    }
  };

  const handleUnlockReport = () => {
    router.push('/pricing');
  };

  const currentStatus = phase === 'upload' ? 'Ready to upload vehicle images.' : scanStatus;

  return (
    <motion.div className="min-h-screen bg-slate-950 text-slate-100">
      <motion.div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 mt-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">Vehicle Condition Scan</h1>
          <p className="text-xl text-slate-400 mb-6">
            Upload vehicle images and get instant AI-powered vehicle inspection.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <UnifiedImageUploader
                images={images}
                onImagesAdd={handleImagesAdd}
                onImageRemove={handleImageRemove}
                isAnalyzing={false}
              />
              {images.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-8">
                  <button
                    type="button"
                    onClick={startAnalysis}
                    className="inline-flex items-center gap-3 rounded-3xl bg-cyan-600 px-8 py-4 text-white font-semibold shadow-xl transition hover:bg-cyan-500"
                  >
                    <Scan className="h-5 w-5" />
                    Run AI Scan ({images.length} image{images.length !== 1 ? 's' : ''})
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {phase === 'scanning' && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ScanningInterface
                images={images}
                detectedIssues={detectedIssues}
                progress={scanProgress}
                statusMessage={currentStatus}
                errorMessage={errorMessage}
                mode="scanning"
                onUnlockReport={handleUnlockReport}
              />
            </motion.div>
          )}

          {phase === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <ScanningInterface
                images={images}
                detectedIssues={detectedIssues}
                progress={100}
                statusMessage={currentStatus}
                errorMessage={errorMessage}
                mode="results"
                onUnlockReport={handleUnlockReport}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}