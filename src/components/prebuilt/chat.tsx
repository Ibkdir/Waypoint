'use client'

import { useState, type KeyboardEvent, type ChangeEvent, type FormEvent,  } from "react"

const Chat = () => {
    const [History, setHistory] = useState<[role: string, content: string][]>([])
    const [UserInput, setUserInput] = useState("")

    const handleSubmit = (e: FormEvent | KeyboardEvent ): null => {
        e.stopPropagation()
        return null
    }

    const handleUserInputChange = (e: ChangeEvent<HTMLInputElement>): null => {
        setUserInput(e.target.value)
        return null
    }

    return (
        <div className="w-6/12 pt-8">
            <div className="overflow-y-auto h-agent text-lg mr-1">
                {/* {History?.map((m) => (
                    <div key={m.length}>
                        <p>{m.role}: {m.content}</p>
                    </div>
                ))} */}
            </div>
            <form onSubmit={handleSubmit} className="pt-custom">
                <p className="font-medium">Where would you like to go?</p>
                <input 
                    type="text" 
                    placeholder="Start typing or upload a file..." 
                    onChange={handleUserInputChange}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { e.key === "Enter" && handleSubmit}}
                    value={UserInput}
                    className="h-12 border-0 outline-none bg-transparent focus:outline-none focus:border-0 text-md w-full"/>
            </form>  
        </div>
    )
}

export default Chat