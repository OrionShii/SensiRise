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
import { ObjectChallenge } from "@/components/object-challenge";
import { Progress } from "@/components/ui/progress";

type ChallengeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChallengeComplete: () => void;
};

type ChallengeStep = 'rps' | 'object' | 'math' | 'face';

const challengeConfig: Record<ChallengeStep, { title: string; description: string; step: number }> = {
  rps: {
    title: "Step 1: Rock, Paper, Scissors",
    description: "Win a game of rock-paper-scissors to proceed.",
    step: 1,
  },
  object: {
    title: "Step 2: Object Hunt",
    description: "Find the requested object and show it to the camera.",
    step: 2,
  },
  math: {
    title: "Step 3: Math Quiz",
    description: "Solve a quick math problem.",
    step: 3,
  },
  face: {
    title: "Step 4: Awake Check",
    description: "Prove you're awake for the final step.",
    step: 4,
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
    setCurrentStep('object');
  };

  const handleObjectComplete = () => {
    setCurrentStep('math');
  };

  const handleMathComplete = () => {
    setCurrentStep('face');
  };

  const currentChallenge = challengeConfig[currentStep];
  const progressValue = (currentChallenge.step / 4) * 100;

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
          {currentStep === 'object' && (
            <ObjectChallenge onChallengeComplete={handleObjectComplete} />
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
