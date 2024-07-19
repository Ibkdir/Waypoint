'use client'

import Link from 'next/link'
import { Compass, GithubLogo }  from "@phosphor-icons/react"
import { siteConfig } from '~/lib/siteConfig'
import { navigationMenuTriggerStyle } from '../ui/navigation-menu'
import { ThemeSwitch } from './SwitchTheme'

const Navbar = () => {
    return (
        <div className="flex items-center w-screen px-6 static md:sticky top-0 z-50 pt-2 nav-blur h-20 dark:bg-black">
            <div className="flex items-center flex-1">
                <Link href="/" className="flex items-center text-lg">
                <Compass size={32} className="pr-1 size-8"/>
                    <h3>Waypoint</h3>
                </Link>
            </div>

            <div className="flex items-center flex-1 justify-end">
            <ThemeSwitch />
            <Link href={siteConfig.externalLinks.github} target='_blank'>
                <GithubLogo size={32} className={`${navigationMenuTriggerStyle()} border ml-1`}/>
            </Link>
            </div>            
        </div>
    )
}

export default Navbar