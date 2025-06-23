"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FaceScanChallenge } from "@/components/face-scan-challenge";
import { RpsChallenge } from "@/components/rps-challenge";
import { MathChallenge } from "@/components/math-challenge";
import { Progress } from "@/components/ui/progress";

type ChallengeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChallengeComplete: () => void;
};

type ChallengeStep = 'rps' | 'math' | 'face';

const challengeConfig: Record<ChallengeStep, { title: string; description: string; step: number }> = {
  rps: {
    title: "Step 1: Rock, Paper, Scissors",
    description: "Win a game of rock-paper-scissors to proceed.",
    step: 1,
  },
  math: {
    title: "Step 2: Math Quiz",
    description: "Solve a quick math problem.",
    step: 2,
  },
  face: {
    title: "Step 3: Awake Check",
    description: "Prove you're awake for the final step.",
    step: 3,
  },
};

export function ChallengeDialog({
  open,
  onOpenChange,
  onChallengeComplete,
}: ChallengeDialogProps) {
  const [currentStep, setCurrentStep] = useState<ChallengeStep>('rps');
  
  // Reset to the first step when the dialog is opened
  useEffect(() => {
    if (open) {
      setCurrentStep('rps');
    }
  }, [open]);

  const handleRpsComplete = () => {
    setCurrentStep('math');
  };

  const handleMathComplete = () => {
    setCurrentStep('face');
  };

  const currentChallenge = challengeConfig[currentStep];
  const progressValue = (currentChallenge.step / 3) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">{currentChallenge.title}</DialogTitle>
          <DialogDescription>
            {currentChallenge.description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Progress value={progressValue} className="w-full" />
        </div>
        <div>
          {currentStep === 'rps' && (
            <RpsChallenge onChallengeComplete={handleRpsComplete} />
          )}
          {currentStep === 'math' && (
            <MathChallenge onChallengeComplete={handleMathComplete} />
          )}
          {currentStep === 'face' && (
            <FaceScanChallenge onChallengeComplete={onChallengeComplete} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
