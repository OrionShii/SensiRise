"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

type MathChallengeProps = {
  onChallengeComplete: () => void;
};

type Operator = '+' | '×' | '-';

export function MathChallenge({ onChallengeComplete }: MathChallengeProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState<Operator>('+');
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);

  const correctAnswer = useMemo(() => {
    switch (operator) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '×':
        return num1 * num2;
    }
  }, [num1, num2, operator]);

  const generateProblem = () => {
    const operators: Operator[] = ['+', '-', '×'];
    const selectedOperator = operators[Math.floor(Math.random() * operators.length)];
    setOperator(selectedOperator);

    let n1 = 0;
    let n2 = 0;

    if (selectedOperator === '×') {
      n1 = Math.floor(Math.random() * 10) + 2; // 2-11
      n2 = Math.floor(Math.random() * 10) + 2; // 2-11
    } else if (selectedOperator === '-') {
      n1 = Math.floor(Math.random() * 20) + 10; // 10-29
      n2 = Math.floor(Math.random() * n1) + 1;   // 1-n1 to avoid negatives
    } else { // addition
      n1 = Math.floor(Math.random() * 50) + 1; // 1-50
      n2 = Math.floor(Math.random() * 50) + 1; // 1-50
    }
    
    setNum1(n1);
    setNum2(n2);
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
      setError("Incorrect answer. A new question will appear.");
      setTimeout(() => generateProblem(), 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 border rounded-lg bg-background">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Solve the equation!</AlertTitle>
        <AlertDescription className="text-3xl font-bold text-center py-4 font-mono">
          {num1} {operator} {num2} = ?
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
