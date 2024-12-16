import React, { useEffect, useRef, useState } from 'react'
import { FaRegFileImage } from 'react-icons/fa6';
import { MdDeleteOutline } from 'react-icons/md';

const ImageSelector = ({image,setImage,handleDeleteImg}) => {

    const inputRef=useRef(null);
    const [previewUrl,setPreviewurl]=useState(null)

    const handleImageChnage=(event)=>{

        const file=event.target.files[0];
        if(file){
            setImage(file)
        }
    };

    const handleRmoveImage=()=>{
        setImage(null)
        handleDeleteImg()
    }


    const onChooseFile=()=>{
        inputRef.current.click();
    }

    useEffect(()=>{
        if(typeof image === "string"){
            setPreviewurl(image)
        }
        else if(image){
            setPreviewurl(URL.createObjectURL(image))
        }
        else{
            setPreviewurl(null)
        }
        return()=>{
         if(previewUrl&& typeof previewUrl === "string" && !image ){
             URL.revokeObjectURL(previewUrl)
         }
        }

    },[image])

  return (
    <div>
       <input type="file"
       accept='image/*'
       ref={inputRef}
       onChange={handleImageChnage}
       className='hidden'
       />
       {!image ? <button className='w-full h-[220px] flex flex-col items-center justify-center gap-4  bg-slate-50 rounded border border-slate-200/50' 
       onClick={()=>onChooseFile()}>
            <div className='w-14 h-14 flex items-center justify-center bg-cyan-100 rounded-full border border-cyan-100'>
                <FaRegFileImage  className='text-xl text-cyan-500'/>
            </div>

            <p className='text-sm text-slate-500 '>Browse image files to upload</p>

       </button> :
       <div className='w-full relative'>
        <img src={previewUrl} alt='Selected' className='w-full h-[250px] object-cover rounded-lg' />

        <button className='btn-small btn-delete absolute top-2 right-2'
        onClick={handleRmoveImage}
        >
        <MdDeleteOutline className='text-lg'/>
        </button>
       </div>
       }
    </div>
  )
}

export default ImageSelector