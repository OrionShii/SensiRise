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

const DetectHandGestureOutputSchema = z.object({
  userGesture: z.enum(['rock', 'paper', 'scissors']).describe('The hand gesture detected from the user.'),
  appGesture: z.enum(['rock', 'paper', 'scissors']).describe('The hand gesture chosen by the application.'),
  result: z.enum(['win', 'lose', 'draw']).describe('The result of the rock-paper-scissors game.'),
});
export type DetectHandGestureOutput = z.infer<typeof DetectHandGestureOutputSchema>;

export async function detectHandGesture(input: DetectHandGestureInput): Promise<DetectHandGestureOutput> {
  return detectHandGestureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectHandGesturePrompt',
  input: {schema: DetectHandGestureInputSchema},
  output: {schema: DetectHandGestureOutputSchema},
  prompt: `You are a rock-paper-scissors game expert. You will receive a photo of a user's hand gesture and determine whether it is rock, paper, or scissors. Then, you will randomly pick rock, paper, or scissors for the application.

  Based on the user's gesture and the application's gesture, determine the winner. The possible results are win, lose, or draw.

  Photo: {{media url=photoDataUri}}
  `,
});

const detectHandGestureFlow = ai.defineFlow(
  {
    name: 'detectHandGestureFlow',
    inputSchema: DetectHandGestureInputSchema,
    outputSchema: DetectHandGestureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // If the output is null or undefined, throw an error, otherwise return the result.
    if (!output) {
      throw new Error('The LLM did not return an output.');
    }
    return output;
  }
);
