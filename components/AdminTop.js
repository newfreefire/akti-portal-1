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

const AdminTop = () => {
    const path = usePathname();
    console.log(path)

    const part = toTitleCase(path.split("/").filter(Boolean)[1]);

    return (
            <div className='flex justify-between'>
                <h1 className='ml-10 sm:text-xl lg:text-2xl font-bold'>{part}</h1>
                <ModeToggle />
            </div>
    )
}

export default AdminTop