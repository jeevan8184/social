import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
  
const ModeSettings = () => {
    const {setTheme}=useTheme();
  
  return (
        <DropdownMenu>
            <DropdownMenuTrigger className='' asChild>
                <Button variant="none" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] text-white rounded-xl rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-110" />
                <span className=" sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='down'>
                <DropdownMenuItem className=' item' onClick={()=> setTheme('light')}>Light</DropdownMenuItem>
                <DropdownMenuItem className='item' onClick={()=> setTheme('dark')}>Dark</DropdownMenuItem>
                {/* <DropdownMenuItem className='item' onClick={()=> setTheme('system')}>System</DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>

  )
}

export default ModeSettings