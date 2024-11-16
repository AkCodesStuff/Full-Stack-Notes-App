import React, { useState } from 'react'
import Profileinfo from './Cards/Profileinfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar/SearchBar'

//Search bar waale pange ko solve karna hai ASAP

const Navbar = ({userInfo,SearchNote,clearSearch}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate();
  const onLogout = () =>{
    localStorage.clear();
    navigate("/login");
  }
  const handleSearch = () =>{
    if(searchQuery){
      SearchNote(searchQuery);
    }
  }
  const onClearSearch = () =>{
    setSearchQuery("");
    clearSearch()
  }
  return (
    <div className="bg-white flex items=center justify-between px-6 py-2 drop-shadow">
        <h2 className="text-xl font-medium-semibold text-black py-2 ">Notes</h2>
        <SearchBar 
          onChange={({target})=>{
            setSearchQuery(target.value);
          } }
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
          value={searchQuery}
        />
        <Profileinfo userInfo={userInfo} onLogout ={onLogout}/>
    </div>
  )
}

export default Navbar