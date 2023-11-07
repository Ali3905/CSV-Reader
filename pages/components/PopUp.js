import { firestore } from '@/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

const PopUp = ({element, closePopup, getData}) => {
    const [student, setStudent] = useState({
        name : "",
        class : 0,
        roll_no : 0,
    })

    const updateData = () => {
        const ref = doc(firestore, "students", element.id)
        const updatedDoc = updateDoc(ref, student).then((doc)=>{
          alert("Updated")
        })
        closePopup()
        getData()
        
    }

    useEffect(()=>{
        setStudent({
            name : element.name,
            class : element.class,
            roll_no : element.roll_no,
        })
    }, [])
    
  return (
    <div className='absolute bg-[rgba(0,0,0,0.4)] p-10 rounded-lg w-full h-full flex items-center justify-center'>
      <form className='flex items-center flex-col relative p-10 rounded-lg gap-5 bg-gray-500 min-w-[50vw]'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" onClick={closePopup} className="w-6 h-6 absolute top-5 right-5 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>

        <input className='w-[80%] px-5 py-3 outline-none bg-gray-400 placeholder:text-black' type='text' placeholder='Enter the Name of student' value={student.name} onChange={(e)=>setStudent({...student, name:e.target.value})}/>
        <input className='w-[80%] px-5 py-3 outline-none bg-gray-400 appearance-none m-0 placeholder:text-black' type='number' placeholder='Enter the class of Student' value={student.class} onChange={(e)=>setStudent({...student, class:e.target.value})}/>
        <input className='w-[80%] px-5 py-3 outline-none bg-gray-400 appearance-none placeholder:text-black' type='number' placeholder='Enter the roll no of Student'value={student.roll_no} onChange={(e)=>setStudent({...student, roll_no:e.target.value})} />
        <button className='bg-gray-600 text-white px-5 py-3 text-base rounded-md' onClick={updateData} > Update </button>
      </form>
    </div>
  )
}

export default PopUp
