// Validates incoming request parameters
// Configures OpenAI model with specified parameters
// Streams response text using AI SDK
// Uses system prompt "You are a helpful assistant"
// Set Model and Temprature based on the global context

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge'; // Use edge runtime for smaller bundle

export async function POST(req: Request) {
    try {
        const { messages, selectedModel, temperatureValue, contextData } = await req.json();

        const systemPrompt = contextData?.knowledge 
            ? `You are a helpful AI Assistant. Your knowledge is enriched by this document ${contextData.knowledge}. When possible explain the reasoning for your response based on this knowledge`
            : 'You are a helpful AI Assistant';

        const result = streamText({
            model: openai(selectedModel),
            temperature: temperatureValue,
            system: systemPrompt,
            messages,
        });

        return result.toDataStreamResponse();

    } catch (error) {
        console.error('Error in chat route:', error);
        return new Response('Error processing your request', { status: 500 });
    }
}