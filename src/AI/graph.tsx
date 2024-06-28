
import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage } from "@langchain/core/messages";
import { StateGraph, START, END } from "@langchain/langgraph";
import { pinpointTool } from "./Tools/exports";

// Nodes

const invokeModel = () => {
    return null
}

const invokeTools = () => {
    return null
}

const toolDecision = () => { // Will be the conditional edge
    return null
}

// LLM Graph

const tools = [pinpointTool]

const Model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.1,
    apiKey: process.env.OPENAI_API_KEY,
    streaming: true,
    verbose: true,
}).bindTools(tools);

export const runAgent = () => {
    const workflow = new StateGraph<runAgentState>({
        channels: {
            input: null,
            chatHistory: null,
            results: null,
            toolCall: null,
            toolResult: null,
        }
    })
    
    const graph = workflow.compile()
    return graph
}

// Interfaces

interface runAgentState {
    input: string // Required
    chatHistory: BaseMessage[]; // Required

    results?: string // Applicable if there was no tool used. Plain text
    toolCall?: { // Applicable if there was a tool call
        name: string,
        parameters: Record<string, unknown>;
    }
    toolResult?: Record<string, unknown>; // Result from tool usage
}

