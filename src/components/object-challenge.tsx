
"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { detectObject } from "@/ai/flows/detect-object-flow";
import { Camera, CheckCircle, AlertTriangle, Loader2, ScanSearch } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type ObjectChallengeProps = {
  onChallengeComplete: () => void;
};

const objectList = ['toothbrush', 'cup', 'book', 'keys', 'phone', 'bottle', 'wallet'];

export function ObjectChallenge({ onChallengeComplete }: ObjectChallengeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  const targetObject = useMemo(() => objectList[Math.floor(Math.random() * objectList.length)], []);

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
    if (!videoRef.current || !canvasRef.current || !hasCameraPermission || videoRef.current.readyState < 2) {
      setError("Camera is not ready. Please wait a moment and try again.");
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
      const { isObjectFound } = await detectObject({ photoDataUri, objectName: targetObject });
      if (isObjectFound) {
        setIsComplete(true);
        toast({
          title: "Object Found!",
          description: `You successfully showed a ${targetObject}. Challenge complete!`,
        });
        setTimeout(onChallengeComplete, 1500);
      } else {
        setError(`That doesn't look like a ${targetObject}. Please try again.`);
        toast({
          title: "Scan Failed",
          description: `We couldn't find a ${targetObject}. Please try again.`,
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
      <Alert className="text-center">
        <ScanSearch className="h-4 w-4" />
        <AlertTitle>Object Hunt Challenge</AlertTitle>
        <AlertDescription>
          Please find and show a <strong>{targetObject}</strong> to the camera.
        </AlertDescription>
      </Alert>

      <canvas ref={canvasRef} className="hidden" />
      <div className="relative w-full aspect-video max-w-sm rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        {isComplete ? (
          <div className="flex flex-col items-center text-green-500">
            <CheckCircle className="w-24 h-24" />
            <p className="mt-4 text-lg font-semibold">Object Found!</p>
          </div>
        ) : (
          <>
            {hasCameraPermission === false && (
              <Alert variant="destructive" className="m-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Camera Access Denied</AlertTitle>
                <AlertDescription>
                  Please enable camera permissions to continue.
                </AlertDescription>
              </Alert>
            )}
            {hasCameraPermission === null && (
              <div className="text-center p-4 text-muted-foreground">
                <Loader2 className="w-12 h-12 mx-auto animate-spin" />
                <p className="mt-2 font-semibold">Accessing Camera...</p>
              </div>
            )}
            <video ref={videoRef} className={`w-full h-full object-cover transform -scale-x-100 ${hasCameraPermission ? '' : 'hidden'}`} playsInline muted autoPlay />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </>
        )}
      </div>
      
      <Button
        onClick={handleScan}
        disabled={isLoading || isComplete || !hasCameraPermission}
        className="w-full max-w-sm"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Analyzing..." : isComplete ? "Done!" : "Confirm Object"}
      </Button>
      
      {error && !isLoading && (
        <p className="text-sm text-destructive font-medium text-center">{error}</p>
      )}
    </div>
  );
}
