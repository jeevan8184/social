
import { ThemeProvider } from '@/lib/theme-provider'
import { Metadata } from 'next'
import React from 'react'


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
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
    </html>
  )
}

export default RootLayout
