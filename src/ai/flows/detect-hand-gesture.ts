'use server';

/**
 * @fileOverview Detects hand gestures for a rock-paper-scissors game to turn off the alarm.
 *
 * - detectHandGesture - A function that handles the hand gesture detection and game logic.
 * - DetectHandGestureInput - The input type for the detectHandGesture function.
 * - DetectHandGestureOutput - The return type for the detectHandGesture function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectHandGestureInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a hand gesture (rock, paper, or scissors), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectHandGestureInput = z.infer<typeof DetectHandGestureInputSchema>;

const gestures = ['rock', 'paper', 'scissors'] as const;
type Gesture = (typeof gestures)[number];

const DetectHandGestureOutputSchema = z.object({
  userGesture: z.enum(gestures).describe('The hand gesture detected from the user.'),
  appGesture: z.enum(gestures).describe('The hand gesture chosen by the application.'),
  result: z.enum(['win', 'lose', 'draw']).describe('The result of the rock-paper-scissors game.'),
});
export type DetectHandGestureOutput = z.infer<typeof DetectHandGestureOutputSchema>;

export async function detectHandGesture(input: DetectHandGestureInput): Promise<DetectHandGestureOutput> {
  return detectHandGestureFlow(input);
}

// Schema for just the gesture from the image
const UserGestureOutputSchema = z.object({
  userGesture: z.enum(gestures).describe('The hand gesture detected from the user (rock, paper, or scissors).'),
});

const prompt = ai.definePrompt({
  name: 'detectHandGesturePrompt',
  input: {schema: DetectHandGestureInputSchema},
  output: {schema: UserGestureOutputSchema}, // Use the simpler output schema
  prompt: `You are a rock-paper-scissors game expert. You will receive a photo of a user's hand gesture. Your only task is to determine whether it is rock, paper, or scissors and return the result.

  Photo: {{media url=photoDataUri}}
  `,
});

const detectHandGestureFlow = ai.defineFlow(
  {
    name: 'detectHandGestureFlow',
    inputSchema: DetectHandGestureInputSchema,
    outputSchema: DetectHandGestureOutputSchema,
  },
  async (input): Promise<DetectHandGestureOutput> => {
    // 1. Get the user's gesture from the AI
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The LLM did not return an output.');
    }
    const {userGesture} = output;

    // 2. The app randomly picks its gesture
    const appGesture = gestures[Math.floor(Math.random() * gestures.length)];

    // 3. Determine the winner with deterministic logic
    let result: 'win' | 'lose' | 'draw';
    if (userGesture === appGesture) {
      result = 'draw';
    } else if (
      (userGesture === 'rock' && appGesture === 'scissors') ||
      (userGesture === 'scissors' && appGesture === 'paper') ||
      (userGesture === 'paper' && appGesture === 'rock')
    ) {
      result = 'win';
    } else {
      result = 'lose';
    }

    // 4. Return the full result
    return {
      userGesture,
      appGesture,
      result,
    };
  }
);
