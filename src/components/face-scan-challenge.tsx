"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Camera, CheckCircle } from "lucide-react";
import Image from "next/image";

type FaceScanChallengeProps = {
  onChallengeComplete: () => void;
};

export function FaceScanChallenge({ onChallengeComplete }: FaceScanChallengeProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setIsComplete(true);
          setTimeout(onChallengeComplete, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 border rounded-lg bg-background">
      <div className="relative w-full aspect-square max-w-xs rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        {isComplete ? (
          <div className="flex flex-col items-center text-green-500">
            <CheckCircle className="w-24 h-24" />
            <p className="mt-4 text-lg font-semibold">Scan Complete!</p>
          </div>
        ) : (
          <Image
            src="https://placehold.co/400x400.png"
            alt="Face scan placeholder"
            width={400}
            height={400}
            data-ai-hint="person portrait"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <Camera className="absolute top-4 left-4 text-white/80 w-6 h-6" />
      </div>
      {isScanning && <Progress value={scanProgress} className="w-full max-w-xs" />}
      <Button
        onClick={handleScan}
        disabled={isScanning || isComplete}
        className="w-full max-w-xs bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {isScanning ? "Scanning..." : isComplete ? "Done!" : "Scan Face"}
      </Button>
      <p className="text-xs text-center text-muted-foreground max-w-xs">
        Position your face in the frame to deactivate the alarm.
      </p>
    </div>
  );
}
