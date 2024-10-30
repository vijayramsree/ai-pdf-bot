import { createOrReadVectorStoreIndex } from '@/lib/vector-store';
// import { MAX_RESPONSE_TOKENS, trimMessages } from '@/lib/tokens'
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { MetadataMode } from 'llamaindex';
import OpenAI from 'openai';

const openAI = new OpenAI();

export async function POST(req:Request) {
    const { messages } = await req.json();
    console.log("messsgas", messages)
    const latestMessage = messages[messages.length - 1];

    const index = await createOrReadVectorStoreIndex();

    const systemMessage =  {
        role: 'system',
        content: 'You are a helpful AI Assistant'
    };


    const retriever = index.asRetriever();
    retriever.similarityTopK = 1;

    const [matchingNodes] = await retriever.retrieve(latestMessage.content);

    console.log('matchingNodes', matchingNodes);

    if(matchingNodes.score > 0.8) {
        const knowledge = matchingNodes.node.getContent(MetadataMode.NONE)
        systemMessage.content =`You are a helpful AI Assistant. Your knowledge is enriched by this document ${knowledge}. When possible explain the reasoning for your respnse based on for this knowledge`
    }

    const response = await openAI.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [systemMessage, ...messages],
        stream: true
    })

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream)

}