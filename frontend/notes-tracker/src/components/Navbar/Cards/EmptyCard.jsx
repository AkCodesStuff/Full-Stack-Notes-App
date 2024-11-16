import React from 'react'
import imgSource from '../../Navbar/images/fileAdd.svg'
import Sad from '../images/Sad.svg'
const EmptyCard = ({isSearch}) => {
  return (
    <div className='flex flex-col items-center justify-center mt-28'>
    <img src={isSearch?Sad:imgSource} className='w-60 px-5 py-5'/>
    <p className='w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5'>
        {isSearch?"Nothing found here, wanna create a new one?":"Click on the add button below to create your first Note"}
    </p>
    </div>
  )
}

export default EmptyCard