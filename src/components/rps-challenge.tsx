
"use client";

import { useState, useRef, useEffect, useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { detectHandGesture, DetectHandGestureOutput } from "@/ai/flows/detect-hand-gesture";
import { useToast } from "@/hooks/use-toast";
import { Hand, Scissors, AlertTriangle, Loader2, CheckCircle, RefreshCw, XCircle } from "lucide-react";

type RpsChallengeProps = {
  onChallengeComplete: () => void;
};

const GestureIcon = ({ gesture, className }: { gesture: string | undefined, className?: string }) => {
  switch (gesture) {
    case "rock": return <Hand className={`w-10 h-10 transform -rotate-90 ${className}`} />;
    case "paper": return <Hand className={`w-10 h-10 ${className}`} />;
    case "scissors": return <Scissors className={`w-10 h-10 ${className}`} />;
    default: return null;
  }
};


export function RpsChallenge({ onChallengeComplete }: RpsChallengeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [result, setResult] = useState<DetectHandGestureOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const isBusy = isCountingDown || isPending;

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

  const captureAndPlay = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !videoRef.current.srcObject) {
        setError("Camera not ready.");
        setIsCountingDown(false);
        return;
    }
    
    setError(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (video.readyState < video.HAVE_ENOUGH_DATA) {
      setError("Camera is still loading. Please try again.");
      setIsCountingDown(false);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
        setError("Could not get canvas context.");
        setIsCountingDown(false);
        return;
    }
    
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const photoDataUri = canvas.toDataURL("image/jpeg");

    startTransition(async () => {
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
      }
    });
  }, [onChallengeComplete, toast, startTransition]);

  useEffect(() => {
    if (!isCountingDown || countdown === null) {
      return;
    }
    
    if (countdown === 0) {
      setIsCountingDown(false);
      setCountdown(null);
      captureAndPlay();
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, isCountingDown, captureAndPlay]);

  const startCountdownAndPlay = () => {
      if (isBusy || (result?.result === 'win')) return;
      
      setIsCountingDown(true);
      setError(null);
      setResult(null);
      setCountdown(3);
  }

  const resetGame = () => {
    setResult(null);
    setError(null);
    setIsCountingDown(false);
    setCountdown(null);
  }

  const getResultInfo = () => {
    if (!result) return { text: '', color: '', icon: null };
    switch (result.result) {
      case 'win':
        return { text: 'You Win!', color: 'text-green-500', icon: <CheckCircle className="w-12 h-12" /> };
      case 'lose':
        return { text: 'You Lose!', color: 'text-destructive', icon: <XCircle className="w-12 h-12" /> };
      case 'draw':
        return { text: 'It\'s a Draw!', color: 'text-muted-foreground', icon: <p className="text-3xl font-bold">=</p> };
      default:
        return { text: '', color: '', icon: null };
    }
  }

  const renderResult = () => {
    if (!result) return null;
    const { text, color, icon } = getResultInfo();

    return (
      <div className="flex flex-col items-center space-y-2">
        <div className={`flex items-center gap-2 font-bold text-xl ${color}`}>
          {icon}
          <span>{text}</span>
        </div>
        {result.result !== 'win' && (
          <Button onClick={resetGame} variant="outline" size="sm" className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        )}
      </div>
    );
  };

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
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
            <p className="text-8xl font-bold text-white drop-shadow-lg">{countdown}</p>
          </div>
        )}
      </div>

      {result && (
        <div className="w-full flex justify-around items-center p-4 bg-muted rounded-lg">
            <div className="flex flex-col items-center space-y-1">
                <p className="text-sm font-semibold">You</p>
                <GestureIcon gesture={result.userGesture} className="h-12 w-12" />
                <p className="text-xs uppercase font-medium">{result.userGesture}</p>
            </div>
            <p className="text-lg font-bold text-muted-foreground">vs</p>
            <div className="flex flex-col items-center space-y-1">
                <p className="text-sm font-semibold">App</p>
                <GestureIcon gesture={result.appGesture} className="h-12 w-12" />
                <p className="text-xs uppercase font-medium">{result.appGesture}</p>
            </div>
        </div>
      )}

      <div className="h-20 flex items-center justify-center">
        {isPending ? (
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        ) : (
          renderResult()
        )}
      </div>

      <Button onClick={startCountdownAndPlay} disabled={isBusy || (result && result.result === 'win') || !hasCameraPermission} className="w-full max-w-xs bg-accent text-accent-foreground hover:bg-accent/90">
        <Hand className="mr-2" /> 
        {countdown !== null ? 'Get Ready!' : (result?.result === 'win' ? 'You Won!' : 'Play Rock, Paper, Scissors')}
      </Button>
      
      {error && !isBusy && <p className="text-sm text-destructive font-medium text-center">{error}</p>}
    </div>
  );
}
