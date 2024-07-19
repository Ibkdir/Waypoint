'use client'

import { Sun, Moon } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"

export const ThemeSwitch = () => {
    const [ Mounted, setMounted ] = useState(false)
    const { setTheme, resolvedTheme } = useTheme()

    useEffect(() => setMounted(true), [])

    if (!Mounted) {
        return <Button size="icon" className="animate-pulse" disabled={true}></Button>
    }

    if (resolvedTheme == 'dark') {
        return (
            <Button size='icon' variant='outline' onClick={() => setTheme('light')}>
                 <Moon size={22} weight="light"/>
            </Button>
        )
    }

    if (resolvedTheme == 'light') {
        return (
            <Button size='icon' variant='outline' onClick={() => setTheme('dark')}>
                <Sun size={22} weight="light"/>
            </Button>
        )
    }
}