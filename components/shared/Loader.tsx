import Image from 'next/image'
import React from 'react'

const Loader = () => {
  return (
    <div className=' animate-spin flex-center min-h-screen'>
        <Image
            src='/assets/icons/loader.svg'
            alt='loader'
            height={28}
            width={28}
            className=''
        />
    </div>
  )
}

export default Loader