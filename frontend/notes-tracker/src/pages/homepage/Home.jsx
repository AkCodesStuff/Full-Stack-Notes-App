import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NotesCards from '../../components/Navbar/Cards/NotesCards'
import AddEditPopUp from './AddEditPopUp'
import { useState } from 'react'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosinstance'
import ToastMessage from '../../components/Navbar/ToastMessage/ToastMessage'
import EmptyCard from '../../components/Navbar/Cards/EmptyCard'
import addNotesImg from '../../components/Navbar/images/fileAdd.svg'

const Home = () => {
  const [ModifyCreateAddNotesPage, setModifyCreateAddNotesPage] = useState({
    isShown: true,
    type: "add",
    data: null,
  });


  const [toastMessage,setToastMessage] = useState({
    isShown: false,
    message: "",
    type:"add"
  })

  const [isSearch, setIsSearch] = useState(false)

  const editFunc=(noteData)=>{
    setModifyCreateAddNotesPage({
      isShown: true,
      data:noteData,
      type: "edit",
  
    })
  }
  const [userInfo, setUserInfo] = useState(null);
  const [notes, setNotes] = useState([])
  const navigate = useNavigate();
  
  const getInfo = async () => {
    
    try {
      const response = await axiosInstance.get("/get-user");
      console.log(response)
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (err) {
      if (err.response.status == 401) {
        localStorage.clear();
        navigate("/login");
      };
    };
  };

  
  //Get all notes
  const getAllNotes = async () => {
    console.log("function works")
    try {
      const response = await axiosInstance.get("/get-notes");
      if (response.data && response.data.notes) {
        setNotes(response.data.notes)
        console.log(response.data.notes)
        
      }
    } catch (err) {
      console.log("An error occured")
    }
  }

  const deleteNote = async(data)=>{
    const noteId = data._id
    console.log(noteId)
    const response = await axiosInstance.delete("/delete-note/"+noteId);
    try{
    if(response.data && !response.data.error){
      showToast("Note Deleted Successfully","delete");
      getAllNotes();
      
    }
  }catch(err){
    if(err.response && err.response.data && err.response.data.message){
      console.log("Unexpected Error")
    }
  }
  }

  const closeToast = ()=>{
    setToastMessage({
      isShown:false,
      message:""
    })
    
  }
  const showToast = (message,type)=>{
    setToastMessage({
      isShown:true,
      message,
      type
    })
  }


  const SearchNote = async (query) =>{
    
    try {
      const response = await axiosInstance.get("/note-search/",{
        params:{ query },
      }); 
      console.log(`The query is ${query}`)
      if (response.data && response.data.notes){
        setIsSearch(true)
        setNotes(response.data.notes)
      }
    }catch(err){
      console.log(err)
    }
  }
  const clearSearch = () =>{
    setIsSearch(false);
    getAllNotes();
  }

  const updatePin = async (note) =>{
    const noteId = note._id;

    try{
      const response = await axiosInstance.put("/pin-update/"+noteId,{
          isPinned:!note.isPinned,
      })
      if(response.data && response.data.note){
        showToast("Note updated succesfully");
        getAllNotes();
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    getInfo();
    getAllNotes();
    
    return () => { };
  }, [])



  return (
    <>
    
      <Navbar userInfo={userInfo} SearchNote = {SearchNote} clearSearch={clearSearch}/>

      {notes.length>0?
        <div className='container mx-[20px] grid grid-cols-3 gap-4 mt-8'>
        {notes.map((ele, ind) => (
          
          <NotesCards 
            key={ele._id}
            title={ele.title}
            date={ele.createdOn}
            content={ele.content}
            tags={ele.tags}
            isPinned={ele.isPinned}
            onEdit={() => editFunc(ele)}
            onDelete={() => {deleteNote(ele) }}
            OnPinNote={() => {updatePin(ele)}}
          />
        ))
      }

      </div>: <EmptyCard imgSrc={addNotesImg} isSearch={isSearch}/>
      }

      <button
        className='bg-primary rounded-2xl flex items-center justify-center w-[60px] h-[60px] hover:bg-blue-400 absolute bottom-0 right-0 mx-5 my-5'
        onClick={() => {
          setModifyCreateAddNotesPage({ isShown: true, type: "add", data: null })
        }}>
        <div className='font-bold text-white text-[50px]'>+</div>
      </button>

      <Modal
        isOpen={ModifyCreateAddNotesPage.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)"
          },
        }}
        contentLabel=''
        className='w-[50%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 '>
        <AddEditPopUp type={ModifyCreateAddNotesPage.type}
          noteData={ModifyCreateAddNotesPage.data}
          onClose={() => {
            setModifyCreateAddNotesPage({ isShown: false, type: "add", data: null })
          }} 
          getAllNotes={getAllNotes} 
          showToast = {showToast}/>
      </Modal>
          <ToastMessage 
          isShown = {toastMessage.isShown}
          message = {toastMessage.message}
          type = {toastMessage.type}
          closeToast = {closeToast}
          
          />

    </>


  )
}

export default Home