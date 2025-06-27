
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle, XCircle } from "lucide-react";

type MathChallengeProps = {
  onChallengeComplete: () => void;
};

type Operator = '+' | '×' | '-';
type Status = 'idle' | 'correct' | 'incorrect';

export function MathChallenge({ onChallengeComplete }: MathChallengeProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState<Operator>('+');
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<Status>('idle');

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
      n1 = Math.floor(Math.random() * 9) + 2; // 2-10
      n2 = Math.floor(Math.random() * 9) + 2; // 2-10
    } else if (selectedOperator === '-') {
      n1 = Math.floor(Math.random() * 20) + 10; // 10-29
      n2 = Math.floor(Math.random() * (n1 - 1)) + 1; // 1 to n1-1
    } else { // addition
      n1 = Math.floor(Math.random() * 50) + 1; // 1-50
      n2 = Math.floor(Math.random() * 50) + 1; // 1-50
    }
    
    setNum1(n1);
    setNum2(n2);
    setAnswer("");
    setStatus('idle');
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'idle') return;

    if (parseInt(answer, 10) === correctAnswer) {
      setStatus('correct');
      setTimeout(onChallengeComplete, 1500);
    } else {
      setStatus('incorrect');
      setTimeout(() => generateProblem(), 1500);
    }
  };

  const getStatusContent = () => {
    if (status === 'correct') {
      return (
        <div className="flex items-center justify-center gap-2 text-green-600">
          <CheckCircle className="h-6 w-6" />
          <span className="font-semibold">Correct!</span>
        </div>
      );
    }
    if (status === 'incorrect') {
      return (
        <div className="flex items-center justify-center gap-2 text-destructive">
          <XCircle className="h-6 w-6" />
          <span className="font-semibold">Incorrect. New question...</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 border rounded-lg bg-background">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Solve the equation!</AlertTitle>
        <AlertDescription className="text-4xl font-bold text-center py-6 font-mono tracking-wider">
          {num1} {operator} {num2} = ?
        </AlertDescription>
      </Alert>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <Input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer"
          className="text-center text-lg h-12"
          required
          disabled={status !== 'idle'}
        />
        <Button type="submit" className="w-full h-12 text-lg" disabled={status !== 'idle'}>
          Submit Answer
        </Button>
      </form>
      <div className="h-8 flex items-center">
        {getStatusContent()}
      </div>
    </div>
  );
}
