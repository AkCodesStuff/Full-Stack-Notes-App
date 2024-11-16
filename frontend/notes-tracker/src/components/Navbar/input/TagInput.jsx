import React, { useState } from 'react'
import X from '../images/x';

const TagInput = ({tags,setTags}) => {

    const [inputValue,setInputValue] = useState("");
    const handleInputChange = (e) =>{
        setInputValue(e.target.value);
    }
    const addNewTag = () =>{
        if(inputValue.trim !==""){
            const newTags = [...tags,inputValue.trim()]
            setTags(newTags);
            setInputValue("");
            console.log(newTags)
            
        }
    }
    const handleKeyDown = (e) =>{
        if(e.key == "Enter"){
            addNewTag()
            
        }
    }
    const handleRemove = (TheTag) =>{
        setTags(tags.filter(tag=>tag!==TheTag))
    }
  return (
    <div>
        {tags.length > 0 &&
        (<div className='flex items-center gap-2 flex-wrap mt-2'>
            {tags?.map((tag,index)=>
                 (
                    <span key = {index} className='flex flex-row justify-between items-center rounded outline-none bg-slate-300 text-slate-900'>
                        #{tag}
                    <button onClick={()=>{
                        handleRemove(tag)
                    }} className='w-2 mr-8 ml-2'>
        
                            <X/>
                        
                        </button>
                        </span>
                ))
            }
        </div>)
        }
        <div className='flex items-center gap-4 mt-3'>
            
            <input type="text" 
            value = {inputValue}
            className='text-sm bg-transparent border px-3 py-2 rounded outline:none' 
            placeholder='Add Tags'
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}/>
            <button className='w-8 h-8 items-center flex justify-center rounded border border-blue-700 hover:bg-blue-600 ' onClick={addNewTag}>
                <div className='text-[10px] bold text-blue-700 hover:text-white text-cneter'>
                X
                </div>
            </button>
        </div>
    </div>
  )
}

export default TagInput