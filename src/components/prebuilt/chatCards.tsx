
'use client'

import { useEffect, useState, useRef } from 'react';
import { City, PersonSimpleBike, Bank, Coffee, Mountains, Books, ForkKnife } from '@phosphor-icons/react';
import { getRandomIndexes } from '~/lib/utils';

interface Prompt {
    prompt: string;
    icon: JSX.Element;
}

interface ChatCardsProps {
    onCardClick: (prompt: string) => void;
}

export const ChatCards: React.FC<ChatCardsProps> = ({ onCardClick }) => {
    const [selectedPrompts, setSelectedPrompts] = useState<Prompt[]>([]);
    const hasMounted = useRef(false);

    const Prompts: Prompt[] = [ 
        { prompt: "Must see attractions in Tokyo?", icon: <City weight='light' size={18} color="#2a4fa7"/> },
        { prompt: "Top scenic bike routes in Amsterdam?", icon: <PersonSimpleBike weight='light' size={18} color="#752dcd"/> },
        { prompt: "Historical sites to visit in Athens?", icon: <Bank weight='light' size={18} color="#1fd184"/> },
        { prompt: "Best coffee shops in Vienna?", icon: <Coffee weight='light' size={18} color='#6f4e37'/> },
        { prompt: "Best hiking trails in the Swiss Alps?", icon: <Mountains weight='light' size={18} color="#2dcd38"/> },
        { prompt: "Must-see museums in Paris?", icon: <Books weight='light' size={18} color="#1fcee5"/> },
        { prompt: "Best restaurants in New York City?", icon: <ForkKnife weight='light' size={18} color="#e51f6e"/> },
    ];

    useEffect(() => {
        if (!hasMounted.current) {
            const randomIndexes = getRandomIndexes(Prompts.length, 3);
            const selected = randomIndexes.map(index => Prompts[index]!);
            setSelectedPrompts(selected);
            hasMounted.current = true;
        }
    }, []);

    return (
        <div className="flex px-3 items-center sticky self-center md:pb-0 pb-5">
            {selectedPrompts.map((item, index) => (
                <div key={index} onClick={() => onCardClick(item.prompt)} className="flex text-[8px] border rounded-sm px-3 text-center mx-2 h-[5.5rem] w-[6.2rem] items-center justify-center flex-col hover:bg-gray-100">
                    {item.icon}
                    <p className="ml-2">{item.prompt}</p>
                </div>
            ))}
        </div>
    );
};