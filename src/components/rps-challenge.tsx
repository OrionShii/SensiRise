"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { detectHandGesture, DetectHandGestureOutput } from "@/ai/flows/detect-hand-gesture";
import { useToast } from "@/hooks/use-toast";
import { Hand, Scissors, AlertTriangle, Loader2, CheckCircle, RefreshCw } from "lucide-react";

type RpsChallengeProps = {
  onChallengeComplete: () => void;
};

const GestureIcon = ({ gesture }: { gesture: string | undefined }) => {
  switch (gesture) {
    case "rock": return <Hand className="w-10 h-10 transform -rotate-90" />;
    case "paper": return <Hand className="w-10 h-10" />;
    case "scissors": return <Scissors className="w-10 h-10" />;
    default: return null;
  }
};


export function RpsChallenge({ onChallengeComplete }: RpsChallengeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectHandGestureOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  const setupCamera = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
        return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
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

  const captureAndPlay = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const photoDataUri = canvas.toDataURL("image/jpeg");

    try {
      const aiResult = await detectHandGesture({ photoDataUri });
      setResult(aiResult);
      if (aiResult.result === "win") {
        toast({
          title: "You Win!",
          description: "You've successfully beaten the challenge.",
        });
        setTimeout(onChallengeComplete, 1500);
      } else if (aiResult.result === 'lose') {
         toast({
          title: "You Lose!",
          description: "The app beat you. Try again!",
          variant: "destructive"
        });
      } else {
         toast({
          title: "It's a Draw!",
          description: "Nobody wins. Try again!",
        });
      }
    } catch (err) {
      console.error(err);
      setError("Could not detect gesture. Please try again.");
      toast({
        title: "AI Error",
        description: "Failed to process the image. Check your connection or try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }

  const renderResult = () => {
    if (!result) return null;
    if (result.result === 'win') {
      return (
        <div className="flex flex-col items-center space-y-2 text-green-500">
          <CheckCircle className="w-12 h-12" />
          <p className="font-bold text-xl">You WIN!</p>
        </div>
      );
    }
    return (
      <Button onClick={resetGame} variant="outline">
        <RefreshCw className="mr-2 h-4 w-4" /> Try Again
      </Button>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 border rounded-lg bg-background">
      <canvas ref={canvasRef} className="hidden" />
      <div className="relative w-full aspect-square max-w-xs rounded-lg overflow-hidden bg-muted flex items-center justify-center">
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
      </div>

      {result && (
        <div className="w-full flex justify-around items-center p-4 bg-muted rounded-lg">
            <div className="flex flex-col items-center space-y-1">
                <p className="text-sm font-semibold">You</p>
                <GestureIcon gesture={result.userGesture} />
                <p className="text-xs uppercase">{result.userGesture}</p>
            </div>
            <p className="text-lg font-bold">vs</p>
            <div className="flex flex-col items-center space-y-1">
                <p className="text-sm font-semibold">App</p>
                <GestureIcon gesture={result.appGesture} />
                <p className="text-xs uppercase">{result.appGesture}</p>
            </div>
        </div>
      )}

      <div className="h-16 flex items-center justify-center">
        {isLoading ? (
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        ) : (
          renderResult()
        )}
      </div>

      <Button onClick={captureAndPlay} disabled={isLoading || (result && result.result === 'win')} className="w-full max-w-xs bg-accent text-accent-foreground hover:bg-accent/90">
        <Hand className="mr-2" /> Play Rock, Paper, Scissors
      </Button>
      <p className="text-xs text-center text-muted-foreground max-w-xs">
        Win a game of rock-paper-scissors to turn off the alarm. Show your hand to the camera.
      </p>
      {error && !isLoading && <p className="text-sm text-destructive font-medium text-center">{error}</p>}
    </div>
  );
}
