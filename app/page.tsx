import CareerChat from '@/components/pages/mainClient'
import React from 'react'
import { logo } from '@/public/images'
import Image from 'next/image'
const MainRootPage = () => {
  return (
    <div>
      <div className='p-2 flex flex-row items-center justify-center space-x-2 mb-2'>
        <Image src={logo} width={80} height={80} alt='ollolaiser'></Image>
        <h1 className='text-xl font-bold text-gray-800 md:text-2xl'>Ollolaiser High School Career Chatbot</h1>
      </div>
      <CareerChat></CareerChat>
    </div>
  )
}

export default MainRootPage