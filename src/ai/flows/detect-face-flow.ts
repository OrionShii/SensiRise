'use server';
/**
 * @fileOverview Detects if a person in a photo is awake.
 *
 * - detectFace - A function that handles the awake-face detection process.
 * - DetectFaceInput - The input type for the detectFace function.
 * - DetectFaceOutput - The return type for the detectFace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectFaceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectFaceInput = z.infer<typeof DetectFaceInputSchema>;

const DetectFaceOutputSchema = z.object({
  isAwake: z.boolean().describe('Whether the person in the photo appears to be awake and alert with their eyes open.'),
});
export type DetectFaceOutput = z.infer<typeof DetectFaceOutputSchema>;

export async function detectFace(input: DetectFaceInput): Promise<DetectFaceOutput> {
  return detectFaceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAwakeFacePrompt',
  input: {schema: DetectFaceInputSchema},
  output: {schema: DetectFaceOutputSchema},
  prompt: `You are an expert in analyzing faces to determine if a person is awake. Your task is to analyze the provided image and determine if the person's eyes are clearly open and they appear to be awake and alert. A sleeping person or someone with their eyes closed should not be considered awake.

  Photo: {{media url=photoDataUri}}
  `,
});

const detectFaceFlow = ai.defineFlow(
  {
    name: 'detectFaceFlow',
    inputSchema: DetectFaceInputSchema,
    outputSchema: DetectFaceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The LLM did not return an output.');
    }
    return output;
  }
);
