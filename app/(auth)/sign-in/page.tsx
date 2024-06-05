import SignInForm from '@/components/related/SignInForm'
import React from 'react'

const SignIn = () => {
  return (

    <section className='wrapper h-full my-auto relative'>
      <div className=' mt-24'>
        <div className=' h-full flex flex-col bg-gray-100 dark:bg-black form gap-4 mt-32'>
          <h2 className=' font-semibold flex-center text-xl'>SignIn</h2>
          <SignInForm />
        </div>
      </div>
  </section>
  )
}

export default SignIn
