'use server';
/**
 * @fileOverview Extracts points of conflict between two sets of ideas, now accepting multiple PDF inputs.
 *
 * - extractConflictPoints - A function that extracts conflict points.
 * - ExtractConflictPointsInput - The input type for the extractConflictPoints function.
 * - ExtractConflictPointsOutput - The return type for the extractConflictPoints function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ExtractConflictPointsInputSchema = z.object({
  ideasA: z.array(z.string()).describe('The first set of ideas as an array of strings (PDF contents).'),
  ideasB: z.array(z.string()).describe('The second set of ideas as an array of strings (PDF contents).'),
});
export type ExtractConflictPointsInput = z.infer<typeof ExtractConflictPointsInputSchema>;

const ExtractConflictPointsOutputSchema = z.object({
  conflictPoints: z
    .array(z.string())
    .describe('The points of conflict between the two sets of ideas.'),
});
export type ExtractConflictPointsOutput = z.infer<typeof ExtractConflictPointsOutputSchema>;

export async function extractConflictPoints(input: ExtractConflictPointsInput): Promise<ExtractConflictPointsOutput> {
  return extractConflictPointsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractConflictPointsPrompt',
  input: {
    schema: z.object({
      ideasA: z.array(z.string()).describe('The first set of ideas as an array of strings (PDF contents).'),
      ideasB: z.array(z.string()).describe('The second set of ideas as an array of strings (PDF contents).'),
    }),
  },
  output: {
    schema: z.object({
      conflictPoints: z
        .array(z.string())
        .describe('The points of conflict between the two sets of ideas.'),
    }),
  },
  prompt: `You are an AI expert in identifying conflicting ideas between two different viewpoints.

You will be given two sets of ideas, each potentially consisting of multiple documents. Your task is to extract the main points of conflict between them.

Ideas A (multiple documents concatenated):
{{#each ideasA}}{{{this}}}{{#unless @last}}
---Document Separator---
{{/unless}}{{/each}}

Ideas B (multiple documents concatenated):
{{#each ideasB}}{{{this}}}{{#unless @last}}
---Document Separator---
{{/unless}}{{/each}}

Points of Conflict:
`,
});

const extractConflictPointsFlow = ai.defineFlow<
  typeof ExtractConflictPointsInputSchema,
  typeof ExtractConflictPointsOutputSchema
>(
  {
    name: 'extractConflictPointsFlow',
    inputSchema: ExtractConflictPointsInputSchema,
    outputSchema: ExtractConflictPointsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

