import { createOrReadVectorStoreIndex } from "@/app/lib/vector-store";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const { MetadataMode } = await import('llamaindex');

        const index = await createOrReadVectorStoreIndex();
        
        if (!index) {
            return Response.json({ knowledge: null });
        }

        const retriever = index.asRetriever({
            similarityTopK: 1
        });

        const matchingNodes = await retriever.retrieve(message);

        const knowledge = matchingNodes.length > 0 && matchingNodes[0].score > 0.7
            ? matchingNodes[0].node.getContent(MetadataMode.NONE)
            : null;

        return Response.json({ knowledge });
    } catch (error) {
        console.error('Error in context route:', error);
        return new Response('Error processing context', { status: 500 });
    }
}