
import { runAgent } from "~/AI/graph";
import { exposeEndpoints, streamRunnableUI } from "~/utils/server";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const convertChatHistoryToMessages = ( chatHistory: [role: string, content: string][] ) => {
    return chatHistory.map( ( [role, content] ) => {
        switch (role) {
            case 'human': return new HumanMessage(content);
            case "assistant":
                case "ai": return new AIMessage(content)
            default: return new HumanMessage(content);
        }
    } 
)}

const processInput = (inputs: { input: string; chatHistory: [role: string, content: string][]; }) => {
    const { input, chatHistory } = inputs
    return { input: input, chatHistory: convertChatHistoryToMessages(chatHistory) }
}

export const agent = async (inputs: { input: string; chatHistory: [role: string, content: string][]; }) => {
    "use server";
    const processedInput = processInput(inputs)
    return streamRunnableUI(runAgent(), processedInput)
}

export const EndpointsContext = exposeEndpoints({ agent });
