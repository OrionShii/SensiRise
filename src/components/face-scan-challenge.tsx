"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { detectFace } from "@/ai/flows/detect-face-flow";
import { Camera, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

type FaceScanChallengeProps = {
  onChallengeComplete: () => void;
};

export function FaceScanChallenge({ onChallengeComplete }: FaceScanChallengeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  const setupCamera = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
        setError("Camera not supported on this device.");
        setHasCameraPermission(false);
        return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setHasCameraPermission(true);
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      setError("Camera access denied. Please enable camera permissions in your browser settings.");
      setHasCameraPermission(false);
    }
  }, []);

  useEffect(() => {
    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [setupCamera]);

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current || !hasCameraPermission) {
      setError("Camera not ready.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
        setError("Could not get canvas context.");
        setIsLoading(false);
        return;
    }
    
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const photoDataUri = canvas.toDataURL("image/jpeg");

    try {
      const { isAwake } = await detectFace({ photoDataUri });
      if (isAwake) {
        setIsComplete(true);
        toast({
          title: "You're Awake!",
          description: "Challenge passed. Good morning!",
        });
        setTimeout(onChallengeComplete, 1500);
      } else {
        setError("You don't seem to be awake. Please open your eyes and try again.");
        toast({
          title: "Scan Failed",
          description: "We couldn't verify you're awake. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      setError("An AI error occurred. Please try again.");
      toast({
        title: "AI Error",
        description: "Failed to process the image. Check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 border rounded-lg bg-background">
      <canvas ref={canvasRef} className="hidden" />
      <div className="relative w-full aspect-square max-w-xs rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        {isComplete ? (
          <div className="flex flex-col items-center text-green-500">
            <CheckCircle className="w-24 h-24" />
            <p className="mt-4 text-lg font-semibold">You're Awake!</p>
          </div>
        ) : (
          <>
            {hasCameraPermission === false && (
              <div className="text-center p-4 text-destructive">
                <AlertTriangle className="w-12 h-12 mx-auto" />
                <p className="mt-2 font-semibold">Camera permission denied</p>
              </div>
            )}
            {hasCameraPermission === null && (
              <div className="text-center p-4 text-muted-foreground">
                <Loader2 className="w-12 h-12 mx-auto animate-spin" />
                <p className="mt-2 font-semibold">Accessing Camera...</p>
              </div>
            )}
            <video ref={videoRef} className={`w-full h-full object-cover transform -scale-x-100 ${hasCameraPermission ? '' : 'hidden'}`} playsInline muted autoPlay />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            <Camera className="absolute top-4 left-4 text-white/80 w-6 h-6" />
          </>
        )}
      </div>
      
      <Button
        onClick={handleScan}
        disabled={isLoading || isComplete || !hasCameraPermission}
        className="w-full max-w-xs bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Analyzing..." : isComplete ? "Done!" : "I'm Awake"}
      </Button>
      
      {error && !isLoading && (
        <p className="text-sm text-destructive font-medium text-center">{error}</p>
      )}

      <p className="text-xs text-center text-muted-foreground max-w-xs">
        Look into the camera with your eyes open to prove you're awake.
      </p>
    </div>
  );
}
