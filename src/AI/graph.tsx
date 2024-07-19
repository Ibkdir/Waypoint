
import { ChatOpenAI } from "@langchain/openai";
import { type BaseMessage } from "@langchain/core/messages";
import { type RunnableConfig } from "@langchain/core/runnables";
import { ChatPromptTemplate,MessagesPlaceholder } from "@langchain/core/prompts";
import { StateGraph, START, END } from "@langchain/langgraph";
import { markerTool, weatherTool } from "./Tools/exports";

// Graph Nodes

const invokeModel = async ( state: AgentState, config?: RunnableConfig  ): Promise<Partial<AgentState>>=> {
    const systemPrompt = ChatPromptTemplate.fromMessages([ 
        ["system", 
            `You are a travel assistant AI designed to help users with travel-related inquiries.\n 
            Analyze each query to determine if it requires plain text information or an action via a tool.\n
            For informational queries like "What are the top attractions in Paris?", respond with text, then place a marker down on the location you answered with using the 'markerTool'. Always say something before or after tool usage.\n
            Provide a response clearly and concisely. Always be polite, informative, and efficient.`], 
        new MessagesPlaceholder({ variableName: "chatHistory", optional: true }) , ["human", "{input}"]
    ])
    const tools = [markerTool, weatherTool]

    const Model = new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0.1,
        apiKey: process.env.OPENAI_API_KEY,
        streaming: true,
        verbose: true,
    }).bindTools(tools);

    const chain = systemPrompt.pipe(Model)

    const res = await chain.invoke({ input: state.input, chatHistory: state.chatHistory }, config)
    if (res.tool_calls && res.tool_calls.length > 0) {
        return { toolCall: {
            name: res.tool_calls[0]!.name, 
            parameters: res.tool_calls[0]!.args
    }}}
    return { results: res.content as string }
}

const invokeTools = async ( state: AgentState, config?: RunnableConfig ): Promise <Partial<AgentState>> => {
    if (!state.toolCall) {
        throw new Error('No tool call found')
    }
    const toolMap = {
        [markerTool.name]: markerTool,
        [weatherTool.name]: weatherTool,
    }

    const selectedTool = toolMap[state.toolCall.name];
    if (!selectedTool) {
        throw new Error('Tool is not available')
    }

    const stateParams = state.toolCall.parameters as ToolParameters

    const toolResult = await selectedTool.invoke(stateParams, config) as string
    const parsedToolResult = JSON.parse(toolResult) as Record<string, unknown>

    return { toolResult: parsedToolResult };
}

const toolDecision = ( state: AgentState ) => { // Conditional Edge
    if (state.toolCall) { 
        return "useTools"
    }
    if (state.results) {
        return END
    }
    throw new Error('No tool found. Cannot make decision')
}

// Model Graph

export const runAgent = () => {
    const workflow = new StateGraph<AgentState>({
        channels: {
            input: null,
            chatHistory: null,
            results: null,
            toolCall: null,
            toolResult: null,
        }
    })
        .addNode('useAgent', invokeModel)
        .addNode('useTools', invokeTools)
        .addConditionalEdges('useAgent', toolDecision)
        .addEdge(START, "useAgent")
        .addEdge("useTools", END);
    
    const graph = workflow.compile()
    return graph
}

// Interfaces
interface AgentState {
    input: string // Required
    chatHistory: BaseMessage[]; // Required

    results?: string // Applicable if there was no tool used. Plain text

    toolCall?: { // Applicable if there was a tool call
        name: string,
        parameters: Record<string, unknown>;
    }
    toolResult?: Record<string, unknown> // Result from tool usage
}

type ToolParameters = {
    address: string | string[];
  } & {
    city: string;
    country: string;
    state?: string;
};