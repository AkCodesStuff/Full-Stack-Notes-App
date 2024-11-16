import React from 'react'
import Pin from '../images/pin.svg'
import PinS from '../images/pinS.svg'
import Pen from '../images/pen.svg'
import Bin from '../images/bin.svg'
import moment from 'moment'
const NotesCards = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  OnPinNote }) => {
  return (
    <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in flex flex-col'>
      <div className='flex flex-row  justify-between'>
      <div className='flex flex-col items-start justify-center gap-4'>
        <h6 className='tex-sm font-medium'>{title}</h6>
        <span className='tex-xs text-slate-500'>{moment(date).format('DD MM YYYY')}</span>
      </div>
      <div className='w-[10px] mt-2' onClick={OnPinNote}>{isPinned ? (<img src={PinS} alt="" className='icon-btn text-primary fill-primary' />) : (<img src={Pin} className='icon-btn text-slate-600 fill-slate-300' />)}</div>
      </div>

      <p className='text-xs text-slate-600 mt-2'>{content?.slice(0, 60)}</p>

      <div className='flex items-center justify-between mt-2'>
        <div className='text-xs text-slate-500'>{tags}</div>
        <div className='flex items-center gap-4'>
          <img src={Pen} alt="" className='icon-btn w-[10px]' onClick={onEdit}/>
          <img src={Bin} alt="" className='icon-btn w-[10px]' onClick={onDelete}/>
        </div>
      </div>
    </div>
  )
}

export default NotesCards