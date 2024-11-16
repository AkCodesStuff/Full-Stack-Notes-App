import React, { useState } from 'react'
import Eye from '../images/eye.svg'
import Eyes from '../images/eyeS.svg'



const PasswordEnter = ({value,onChange,placeholder}) => {
    const [isPasswordDisplayed,setPasswordDisplay] = useState(false);;

    const toggleDisplayPassword = () =>{
        setPasswordDisplay(!isPasswordDisplayed)
    }
  return (
    <div className='flex items-center bg-transparet border-[1.5px] px-5 rounded mb-3'>

        
        <input value={value} 
        onChange={onChange} 
        type={isPasswordDisplayed? "text":"password"} 
        placeholder={placeholder||"Password"} 
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
        />

        {isPasswordDisplayed? (
            <img  src={Eye}  size={22} className="text-primary cursor-pointer w-[20px]" onClick={()=>toggleDisplayPassword()}/>


        ):(
            <img src={Eyes} size={22} className="text-slate-400 cursor-pointer w-[20px]"
            onClick={()=>{
                toggleDisplayPassword()
            }}/>
        )}
        
    </div>
  )
}

export default PasswordEnter