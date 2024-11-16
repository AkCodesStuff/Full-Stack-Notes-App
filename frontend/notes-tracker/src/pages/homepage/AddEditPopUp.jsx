import React from 'react'
import TagInput from '../../components/Navbar/input/TagInput'
import { useState } from 'react';
import X from '../../components/Navbar/images/x'
import axiosInstance from '../../utils/axiosinstance';
const AddEditPopUp = ({onClose,noteData,getAllNotes,type,showToast}) => {
    const [title,setTitle] = useState(type=="edit"?noteData.title:" ");
    const [content,setContent] = useState(type=="edit"?noteData.content:" ");
    const [tags,setTags] = useState(type=="edit"?noteData.tags:[]);
    const [error,setError]= useState("");
    
    const addNew = async () =>{
        console.log(tags)
        try{
            const response = await axiosInstance.post('/note-add', {
                title,
                content,
                tags
            })
            if (response.data && response.data.note){
                showToast("Note Added Successfully",)
                getAllNotes()
                onClose()
            }
        }catch(err){
            if(err.response&&err.response.data&&err.response.data.message){
                setError(err.response.data.message)
            }
        }
    }   

    const editNote = async () =>{
        const noteId = noteData._id;
        try{
            const response = await axiosInstance.put("/note-edit/"+noteId,{
                title,
                content,
                tags
            })
            if(response.data && response.data.note){
                showToast("Note Updated successfully")
                getAllNotes();
                onClose();
            }
        }catch(err){
            console.log(err)
            setError(err.response.data.message)
        }   
    }


    //Add API call
 

    const handleAddNote = () =>{
       if(!title){
        setError("Please enter the title")
        return;
       } 
       if(!content){
        setError("Please enter the content")
        return;
       }
       setError("")

       if(type=="edit"){
        editNote()
       }
       else{
        addNew()
       }
    }
  return (


    <div className='relative'>
        <div className='absolute flex justify-center items-center top-0 right-0' onClick={onClose}>
        <X width={"10px"}/>
        </div>
        
        <div className='flex flex-col gap-2'>
            <label className='labelInput'>Title</label>
            <input type="text" 
            className='text-2xl text-slate-900 outline-none' 
            placeholder='Walk the Dog'
            value={title}
            onChange = {({target})=>{setTitle(target.value)}}
            />
        </div>
        <div className='flex flex-col gap-2 mt-4'>
            <label className='labelInput'>CONTENT</label>
            <textarea
                type="text"
                className='text-sm text-slate-900 outline-none bg-slate-50 p-2 rounded resize-none'
                placeholder='Content'
                rows={10}
                value = {content}
                onChange = {({target}) =>setContent(target.value)}
            />

            
        </div>
        <div className='mt-3'>
            <label className='labelInput'>TAGS</label>
            <TagInput tags = {tags} setTags = {setTags}/>
        </div>


        {error && <p className='text-red-500 mt-4'>{error}</p>}
        <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>
            {type==="edit"?'UPDATE':'ADD'}
            </button>
    </div>
  )
}

export default AddEditPopUp