'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { ModeToggle } from './ThemeBtn';

function toTitleCase(str) {
    return str
        .replace(/[-_]+/g, " ")
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

const CsrTop = () => {
    const path = usePathname();
    console.log(path)

    let part = toTitleCase(path.split("/").filter(Boolean)[1]);
    if (part[0] === 'C' && part[1] === 's' && part[2] === 'r'){
        part = 'CSR Dashboard'
    }

    return (
        <main>
            <div className='flex justify-between px-10'>
                <h1 className='text-2xl font-bold'>{part}</h1>
                <ModeToggle />
            </div>
        </main>
    )
}

export default CsrTop