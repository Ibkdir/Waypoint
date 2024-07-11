'use client'

import { useState, type KeyboardEvent, type ChangeEvent  } from "react"
import { type EndpointsContext } from "~/app/agent"
import { useActions } from "~/utils/client"
import { HumanMessageText } from "./message"
import { LocalContext } from "~/app/shared"
import { useMapContext } from "./map/mapcontext"

const Chat = () => {
    const actions = useActions<typeof EndpointsContext>()

    const [History, setHistory] = useState<[role: string, content: string][]>([])
    const [UserInput, setUserInput] = useState("")
    const [Elements, setElements] = useState<React.JSX.Element[]>([]);
    const [IsLoading, setIsLoading] = useState(false)
    const { addMarker } = useMapContext()
    
    const handleSubmit = async (input: string) => {
        setIsLoading(true);
        setUserInput('');
        
        const userMessageElement = (
            <div className="flex flex-col w-full gap-1 mt-auto" key={History.length}>
                <HumanMessageText content={input} />
            </div>
        );
        
        setElements(prevElements => [...prevElements, userMessageElement]);
        setHistory(prevHistory => [...prevHistory, ['user', input]]);
    
        try {
            const res = await actions.agent({ input, chatHistory: History }) as AgentResponse;
            const agentResponseElement = (
                <div className="flex flex-col w-full gap-1 mt-auto" key={History.length + 1}>
                    <div className="flex flex-col gap-1 w-full max-w-fit mr-auto py-3">
                        {res.ui}
                    </div>
                </div>
            );
            
            setElements(prevElements => [...prevElements, agentResponseElement]);
            
            const lastEvent = await res.lastEvent;
    
            if (lastEvent.useAgent?.results) {
                setHistory(prevHistory => [
                    ...prevHistory,
                    ['assistant', lastEvent.useAgent?.results ?? '']
                ]);
            }
            
            if (lastEvent.useAgent?.toolCall) {
                const toolRes = lastEvent.useAgent.toolCall;
                if (toolRes.name === 'markerTool') {
                    const coordinates = lastEvent.useTools?.toolResult?.[0];
                    if (coordinates) {
                        const { lat, lng } = coordinates;
                        addMarker(lat, lng);
                    }
                }
                const toolResString = JSON.stringify(toolRes, null, 2);
                setHistory(prevHistory => [
                    ...prevHistory,
                    ['assistant', toolResString]
                ]);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error during handleSubmit:", error);
            setIsLoading(false);
        }
    };


    return (
        <div className="w-6/12 pt-8">
            <div className="overflow-y-scroll scroll-smooth h-agent text-lg mr-1">
            <LocalContext.Provider value={handleSubmit}>
                <div className="flex flex-col w-full gap-1 mt-auto">{Elements}</div>
            </LocalContext.Provider>
            </div>
            <form onSubmit={ async (e) => {
                e.stopPropagation()
                e.preventDefault()
                await handleSubmit(UserInput)
            }} className="pt-custom">
                <p className="font-medium">Where would you like to go?</p>
                
                <input 
                    type="text" 
                    placeholder="Start typing or upload a file..." 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {setUserInput(e.target.value)}}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { e.key === "Enter" && handleSubmit}}
                    value={UserInput}
                    disabled={IsLoading}
                    className="h-12 border-0 outline-none bg-transparent focus:outline-none focus:border-0 text-md w-full"/>
            </form>
        </div>
    )
}

// Interfaces

interface LastEvent {
    // Types from Graph
    useAgent?: {
        results?: string
        toolCall?: { name: string, parameters: Record<string, unknown>; }
    },
    useTools?: { toolResult?: {lat: number, lng: number}[] }
}
interface AgentResponse {
    lastEvent: Promise<LastEvent>;
    ui: React.JSX.Element;
}

export default Chat