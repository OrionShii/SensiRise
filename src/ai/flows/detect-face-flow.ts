'use server';
/**
 * @fileOverview Detects if a face is present in a photo.
 *
 * - detectFace - A function that handles the face detection process.
 * - DetectFaceInput - The input type for the detectFace function.
 * - DetectFaceOutput - The return type for the detectFace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectFaceInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a potential face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectFaceInput = z.infer<typeof DetectFaceInputSchema>;

const DetectFaceOutputSchema = z.object({
  isFaceDetected: z.boolean().describe('Whether or not a face was detected in the photo.'),
});
export type DetectFaceOutput = z.infer<typeof DetectFaceOutputSchema>;

export async function detectFace(input: DetectFaceInput): Promise<DetectFaceOutput> {
  return detectFaceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectFacePrompt',
  input: {schema: DetectFaceInputSchema},
  output: {schema: DetectFaceOutputSchema},
  prompt: `You are an expert in face detection. Analyze the provided image and determine if a human face is clearly visible.

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
