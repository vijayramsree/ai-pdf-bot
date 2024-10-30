import { encoding_for_model } from "@dqbd/tiktoken";
import { Message } from "ai";

const encoding = encoding_for_model("gpt-3.5-turbo")
const TOKEN_LIMIT = 4097 * 0.9;
export const MAX_RESPONSE_TOKENS = 600;

function countToken(text: string) {
    const tokens = encoding.encode(text);
    return tokens.length
}

export function trimMessages (messages: Message[]): Message[] {
    const [systemMessage, ...restMessages] = messages;

    let totalTokens = countToken(systemMessage.content) + MAX_RESPONSE_TOKENS;

    const trimmedMessages = [];

    for( const message of restMessages.reverse()) {
        const newTotalTokens = totalTokens + countToken(message.content);

        if(newTotalTokens > TOKEN_LIMIT) {
            break;
        } else {
            trimmedMessages.unshift(message)
            totalTokens = newTotalTokens;
        }
    }

    console.log(`Total tokens: ${totalTokens}`)

    trimmedMessages.unshift(systemMessage)
    return trimmedMessages;

}