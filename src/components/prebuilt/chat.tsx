'use client'

import { useState, type KeyboardEvent, type ChangeEvent, useRef  } from "react"
import { type EndpointsContext } from "~/app/agent"
import { useActions } from "~/utils/client"
import { HumanMessageText } from "./message"
import { LocalContext } from "~/app/shared"
import { useMapContext } from "./map/mapcontext"
import { ChatCards } from "./chatCards"
import { Button } from "../ui/button"
import { ArrowCircleUp } from "@phosphor-icons/react"

const Chat = () => {
    const actions = useActions<typeof EndpointsContext>()

    const [History, setHistory] = useState<[role: string, content: string][]>([])
    const [UserInput, setUserInput] = useState("")
    const [Elements, setElements] = useState<React.JSX.Element[]>([]);
    const [IsLoading, setIsLoading] = useState(false)

    const { addMarker, removeMarkers, setNewZoom  } = useMapContext()
    const messageRef = useRef<HTMLDivElement | null>(null)
    const ButtonIsDisabled = IsLoading || !UserInput

    
    const handleSubmit = async (input: string) => {
        setIsLoading(true);
        setUserInput('');

        const userMessageElement = (
            <div className="flex flex-col w-full gap-1 mt-auto" key={History.length}>
                <HumanMessageText content={input} />
            </div>
        );

        setElements(prevElements => [...prevElements, userMessageElement])
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
                    const { coordinates, removePrevMarkers, zoomLevel  } = lastEvent.useTools!.toolResult!

                    if (removePrevMarkers) {
                        removeMarkers(removePrevMarkers)
                    }

                    if (coordinates) {
                        addMarker(coordinates);
                    }

                    if (zoomLevel) {
                        setNewZoom(zoomLevel)
                    }

                }
                const toolResString = JSON.stringify(toolRes, null, 2);
                setHistory(prevHistory => [
                    ...prevHistory,
                    ['assistant', toolResString]
                ]);
            }
            setIsLoading(false);

            if (messageRef.current) {
                messageRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error("Error during handleSubmit:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col border rounded mt-3 min-h-[19rem] max-h-[19rem] max-w-screen-xl pt-2
                        md:mt-0 md:w-1/2 md:mx-0 md:min-h-[none] md:max-h-[none] self-center dark:text-white">
            <div className="flex-grow overflow-y-scroll scroll-smooth p-4 rounded-t-lg min-w-full">
                <LocalContext.Provider value={handleSubmit}>
                    <div className="flex flex-col w-full gap-2">{Elements}</div>
                    <div ref={messageRef}></div>
                </LocalContext.Provider>
            </div>

           { (!History.length) && <ChatCards onCardClick={handleSubmit} /> }

            <form
                className="p-4 rounded-b-lg flex flex-col md:sticky md:bottom-0 fixed bottom-2 left-0 right-0 w-full dark:bg-zinc-950"
                onSubmit={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    await handleSubmit(UserInput);
                }}
            >
                <p className="font-medium mb-2">Where would you like to go?</p>

                <div className="flex border rounded-md border-gray-300 items-center bg-inherit">
                    <input
                    type="text"
                    placeholder="Start typing..."
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setUserInput(e.target.value) }}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { e.key === "Enter" && handleSubmit }}
                    value={UserInput}
                    disabled={IsLoading}
                    className="h-12 px-4 rounded-lg focus:outline-none w-full dark:bg-zinc-950"
                />
                <Button
                    className="mr-2"
                    size="icon"
                    variant="ghost"
                    disabled={ButtonIsDisabled}>
                    <ArrowCircleUp size={28} weight={ButtonIsDisabled ? 'regular': "fill"}/>
                    </Button>
                </div>
            </form>
        </div>
    );
}

// Interfaces

interface LastEvent {
    // Types from Graph
    useAgent?: {
        results?: string
        toolCall?: { name: string, parameters: Record<string, unknown>; }
    },
    useTools?: { 
        toolResult?: {
            coordinates: { lat: number, lng: number }[];
            removePrevMarkers: boolean;
            zoomLevel: number;
          }
    }
}
interface AgentResponse {
    lastEvent: Promise<LastEvent>;
    ui: React.JSX.Element;
}
interface Prompt {
    prompt: string,
    icon: JSX.Element
}

export default Chat