import CreatePost from '@/components/related/CreatePost'
import React from 'react'

const Create = () => {
  return (
    <section className=' lg:px-4 py-4 pb-10'>
      <h1 className=' text-2xl font-semibold px-4'>Create new Posts</h1>
      <div className=' flex'>
         <CreatePost />
      </div>
    </section>
  )
}

export default Create

