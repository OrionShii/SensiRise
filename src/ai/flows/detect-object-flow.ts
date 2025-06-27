'use server';
/**
 * @fileOverview Detects if a specific object is present in a photo.
 *
 * - detectObject - A function that handles the object detection process.
 * - DetectObjectInput - The input type for the detectObject function.
 * - DetectObjectOutput - The return type for the detectObject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectObjectInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo from the user's camera, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  objectName: z.string().describe("The name of the object to look for in the photo (e.g., 'toothbrush', 'cup').")
});
export type DetectObjectInput = z.infer<typeof DetectObjectInputSchema>;

const DetectObjectOutputSchema = z.object({
  isObjectFound: z.boolean().describe('Whether the specified object was found in the photo.'),
});
export type DetectObjectOutput = z.infer<typeof DetectObjectOutputSchema>;

export async function detectObject(input: DetectObjectInput): Promise<DetectObjectOutput> {
  return detectObjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectObjectPrompt',
  input: {schema: DetectObjectInputSchema},
  output: {schema: DetectObjectOutputSchema},
  prompt: `You are an expert in object recognition. Your task is to analyze the provided image and determine if it contains a specific object.

  Object to find: {{{objectName}}}
  Photo: {{media url=photoDataUri}}
  
  Carefully examine the photo and determine if the '{{{objectName}}}' is clearly visible.
  `,
});

const detectObjectFlow = ai.defineFlow(
  {
    name: 'detectObjectFlow',
    inputSchema: DetectObjectInputSchema,
    outputSchema: DetectObjectOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The LLM did not return an output.');
    }
    return output;
  }
);
