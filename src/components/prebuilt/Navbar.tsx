'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Compass, GithubLogo, Moon, Sun }  from "@phosphor-icons/react"
import { siteConfig } from '~/lib/siteConfig'
import { Button } from '~/components/ui/button'
import { navigationMenuTriggerStyle } from '../ui/navigation-menu'

const Navbar = () => {

    const [BrightTheme, setBrightTheme] = useState(true)

    return (
        <div className="flex items-center w-screen px-6 sticky top-0 z-50 pt-2 nav-blur h-20">
            <div className="flex items-center flex-1">
            <Link href="/" className="flex items-center text-lg">
            <Compass size={32} className="pr-1 size-8"/>
                <h3>Waypoint</h3>
            </Link>
            </div>
            <div className="flex items-center flex-1 justify-end">
            <Button onClick={() => setBrightTheme((PrevValue => !PrevValue))} size="icon" variant="outline">
                {BrightTheme ? <Sun size={18} /> : <Moon size={18} />}
            </Button>

            <Link href={siteConfig.externalLinks.github} target='_blank'>
                <GithubLogo size={32} className={`${navigationMenuTriggerStyle()} border ml-1`}/>
            </Link>
            </div>            
        </div>
    )
}

export default Navbar