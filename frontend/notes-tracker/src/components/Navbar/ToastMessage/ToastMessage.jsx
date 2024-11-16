import React, { useEffect } from 'react'
import check from '../images/Check.svg'
import del from '../images/del.svg'
const ToastMessage = ({isShown, message, type, closeToast}) => {
  useEffect(()=>{
    const timeout = setTimeout(()=>{
      closeToast();
    },3000)
    return ()=>{
      clearTimeout(timeout)
    }
  },[closeToast])
  return (
    <div className={`absolute bottom-0 mb-5 left-1/2 -translate-x-1/2 transition-all duration-400 ${isShown?"opacity-100":"opacity-0"}`}>
      <div className='flex items-center gap-3 py-2 px-4'>
        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${type=="delete"?"bg-red-100":"bg-green-100"} after:absolute after:left-0 after:top-0 after:rounded-l-lg after:bg-slate-400`}>
          {
            type =="delete"? <img src={del} alt="" />:<img src={check} alt="" />
          }
        </div>
        <p className='text-sm text-slate-900'>{message}</p>
      </div>
    </div>
  )
}

export default ToastMessage