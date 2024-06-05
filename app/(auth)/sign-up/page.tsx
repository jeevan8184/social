import SignUpForm from '@/components/related/SignUpForm'
import React from 'react'

const SignUp = () => {
  return (
    <section className='wrapper h-full my-auto relative'>
      <div className=' mt-24'>
        <div className=' h-full flex flex-col bg-gray-100 dark:bg-black form gap-4 mt-32'>
          <h2 className=' font-semibold flex-center text-xl'>SignUp</h2>
          <SignUpForm />
        </div>
      </div>
  </section>
  )
}

export default SignUp
