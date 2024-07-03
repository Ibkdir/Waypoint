'use client'

import { useState, type KeyboardEvent, type ChangeEvent  } from "react"
import { type EndpointsContext } from "~/app/agent"
import { useActions } from "~/utils/client"

const Chat = () => {
    const actions = useActions<typeof EndpointsContext>()

    const [History, setHistory] = useState<[role: string, content: string][]>([])
    const [UserInput, setUserInput] = useState("")
    const [Elements, setElements] = useState<React.JSX.Element[]>([]);

    const handleSubmit = async (input: string) => {
        const newElements = [...Elements]
        const Element = await actions.agent({ input, chatHistory: History })

        newElements.push()

        setElements(newElements)
        setUserInput('')
    }

    return (
        <div className="w-6/12 pt-8">
            <div className="overflow-y-auto h-agent text-lg mr-1">
            </div>
            <form onSubmit={async (e) => {
                e.stopPropagation()
                e.preventDefault()
                await handleSubmit(UserInput)
            }
                
                } className="pt-custom">
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

export default Chat