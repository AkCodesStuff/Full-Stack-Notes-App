import React from 'react'
import MagGlass from '../images/mag.svg'
import X from '../images/Xmark.svg'
const SearchBar = ({value,onChange, handleSearch, onClearSearch}) => {
  return <div className='w-80 flex items-center px-4 bg-blue-100 rounded-full'>
    <input type="text" placeholder = "Search Notes" className='w-full text-xs bg-transparent py-[11px] outline-none'
    value = {value}
    onChange={onChange}
    />
    {
      value && <button onClick={onClearSearch}><img src={X} className='w-2 mx-2' alt="" /></button>
      
}
    <button onClick={handleSearch}>
    <img src={MagGlass} alt="" className='w-[20px] fill-slate-800 hover:fill-slate-400 cursor-pointer' />
    </button>
    
  </div>
  
}

export default SearchBar