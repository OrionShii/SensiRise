"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

type MathChallengeProps = {
  onChallengeComplete: () => void;
};

export function MathChallenge({ onChallengeComplete }: MathChallengeProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);

  const correctAnswer = useMemo(() => num1 + num2, [num1, num2]);

  const generateProblem = () => {
    setNum1(Math.floor(Math.random() * 20) + 1);
    setNum2(Math.floor(Math.random() * 20) + 1);
    setAnswer("");
    setError(null);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answer, 10) === correctAnswer) {
      setError(null);
      onChallengeComplete();
    } else {
      setError("Incorrect answer. Please try again.");
      setTimeout(() => generateProblem(), 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 border rounded-lg bg-background">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Solve the equation!</AlertTitle>
        <AlertDescription className="text-3xl font-bold text-center py-4 font-mono">
          {num1} + {num2} = ?
        </AlertDescription>
      </Alert>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <Input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer"
          className="text-center text-lg"
          required
        />
        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          Submit Answer
        </Button>
      </form>
      {error && (
        <p className="text-sm text-destructive font-medium">{error}</p>
      )}
    </div>
  );
}
