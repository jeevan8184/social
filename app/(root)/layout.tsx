
import Bottombar from '@/components/shared/Bottombar'
import Navbar from '@/components/shared/Navbar'
import Sidebar from '@/components/shared/Sidebar'
import { Metadata } from 'next'
import React from 'react'
import { Toaster } from "@/components/ui/toaster"


export const metadata:Metadata={
    title:"Socila media platform",
    description:"We can connect to our friends.",
    icons:{
        icon:''
    }
}

const RootLayout = ({children}:{children:React.ReactNode}) => {

  return (
    <html lang='en'>
        <body>
        <Toaster />
           <div className=' wrapper flex flex-col'>
            <Navbar />
                <div className=' flex  flex-grow'>
                    <Sidebar />
                    <div className='wrapper flex flex-col flex-grow relative  '>
                        {children}
                        <Bottombar />
                    </div>
                </div>
           </div>
        </body>
    </html>
  )
}

export default RootLayout
