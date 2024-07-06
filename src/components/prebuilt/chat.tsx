'use client'

import { useState, type KeyboardEvent, type ChangeEvent  } from "react"
import { type EndpointsContext } from "~/app/agent"
import { useActions } from "~/utils/client"
import { HumanMessageText } from "./Message"

const Chat = () => {
    const actions = useActions<typeof EndpointsContext>()

    const [History, setHistory] = useState<[role: string, content: string][]>([])
    const [UserInput, setUserInput] = useState("")
    const [Elements, setElements] = useState<React.JSX.Element[]>([]);

    const handleSubmit = async (input: string) => {
        setUserInput('');
        const newElements = [...Elements];
        
        try {
            const res = await actions.agent({ input, chatHistory: History }) as AgentResponse
            const lastEvent = await res.lastEvent;
    
            newElements.push(
                <div className="flex" key={History.length}>
                    <HumanMessageText content={input} />
                    <div>
                        {res.ui}
                    </div>
                </div>
            );

            setElements(newElements);
            if (lastEvent.useAgent!.results) {
                const parsedLastEvent = lastEvent.useAgent?.results;
                console.log(parsedLastEvent);
            } else {
                console.log(lastEvent.useAgent!)
            }
        } catch (error) {
            console.error("Error during handleSubmit:", error);
        }
    };

    return (
        <div className="w-6/12 pt-8">
            <div className="overflow-y-auto h-agent text-lg mr-1">
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
        toolResult?: Record<string, unknown>
    };
}
interface AgentResponse {
    lastEvent: Promise<LastEvent>;
    ui: React.JSX.Element;
}

export default Chat