import React, { useState } from 'react'
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md'
import DateSelector from '../../components/Input/DateSelector'
import ImageSelector from '../../components/Input/ImageSelector';
import TagInput from '../../components/Input/TagInput';
import axiosInstance from '../../utils/axiosinstance';
import moment from 'moment';
import { toast } from 'react-toastify';
import uploadImage from '../../utils/uploadImage';


const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllTravelstories

}) => {

    const [title, setTitle] = useState(storyInfo?.title ||"");
    const [storyImg, setStoryImg] = useState(storyInfo ?.imageUrl ||null);
    const [story, setStory] = useState(storyInfo?.story||"");
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation||[]);
    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate ||null)
    const [error, setError] = useState("")

    //update the story
    const updateTravelStory = async () => {
        const storyId = storyInfo._id;
        try {
            let imageUrl = storyInfo.imageUrl || "";
    
            const postData = {
                title,
                story,
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            };
    
            // Only upload image if a new image is selected
            if (typeof storyImg === "object") {
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || "";
            }
    
            // Add imageUrl to postData
            postData.imageUrl = imageUrl;
    
            const response = await axiosInstance.put("/edit-story/" + storyId, postData);
            
            if (response.data && response.data.story) {
                toast.success("Story Updated Successfully");
                getAllTravelstories();
                onClose();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please Try Again.";
            setError(errorMessage);
        }
    };

    //add new story
    const addNewTravelStory = async () => {
        try {
            let imageUrl = ""
            //upload image if presenet
            const imgUploadRes = await uploadImage(storyImg)
            //get image url
            imageUrl = imgUploadRes.imageUrl || "";

            const responce = await axiosInstance.post("/add-travel-story", {
                title,
                story,
                imageUrl: imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            })
            if (responce.data && responce.data.story) {
                toast.success("Story is live now")

                getAllTravelstories();

                onClose()
            }
        } catch (error) {
            if( error.responce &&
                error.responce.data &&
                error.responce.data.message
               ){
                setError[error.responce.data.message]
               }
               else{
                setError["An unexpected error occured.Please Try Again."]
               }
    
        }
    }

    const handleAddOrUpadteClick = () => {
        console.log("INPUT", { title, setStoryImg, story, visitedLocation, visitedDate })

        if (!title) {
            setError("Please enter the title")
            return
        }
        if (!story) {
            setError("Please enter the story")
            return
        }
        setError("")

        if (type === "edit") {
            updateTravelStory();
        }
        else {
            addNewTravelStory();
        }

    }
    //Delete story image and upadte the story
    const handleDeleteImg = async () => {
    
        const deleteImagRes=await axiosInstance.delete("/delete-image",{
            params:{
                imageUrl:storyInfo.imageUrl,
            }
        })

        if(deleteImagRes.data){
            const storyId=storyInfo._id;
        
        const postData={
            title,
            story,
            visitedLocation,
            visitedDate:moment().valueOf(),
            imageUrl:""
        }

        //upadting story
       
    }
    setStoryImg(null);
    }

    return (
        <div className='relative'>
            <div className='flex items-center justify-between'>
                <h5 className='text-xl font-medium text-slate-700'>
                    {type === "add" ? "Add Story" : "Update Story"}
                </h5>

                <div>
                    <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg '>
                        {type === "add" ?
                            <button className='btn-small' onClick={handleAddOrUpadteClick}>
                                <MdAdd className='text-lg' />
                                ADD STORY
                            </button> : <>
                                <button className='btn-small' onClick={handleAddOrUpadteClick}>
                                    <MdUpdate className='text-lg' />
                                    UPDATE STORY
                                </button>
                            </>}

                        <button
                            className=''
                            onClick={onClose}>
                            <MdClose className='text-xl text-slate-400'></MdClose>
                        </button>
                    </div>

                    {error && (
                        <p className='text-red-500 text-xs pt-1 text-right'>{error}</p>
                    )}

                </div>
            </div>

            <div>
                <div className='flex-1 flex flex-col gap-2 pt-4'>
                    <label className='input-label'>TITLE</label>
                    <input type="text"
                        className='text-2xl text-slate-950 outline-none'
                        placeholder='A DAY AT SHIMLA'
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />

                </div>
            </div>

            <div className='my-5'>
                <DateSelector date={visitedDate} setDate={setVisitedDate} />
            </div>

            <ImageSelector
                image={storyImg}
                setImage={setStoryImg}
                handleDeleteImg={handleDeleteImg}
            />

            <div className='flex flex-col gap-4 mt-10'>
                <label className='input-label'>STORY</label>
                <textarea
                    type="text"
                    className='text-sm text-slate-950 outline-none bg-sky-100 p-2 rounded'
                    placeholder='Your Story'
                    rows={10}
                    value={story}
                    onChange={({ target }) => setStory(target.value)} // Corrected this line
                />

            </div>
            <div className='py-3'>
                <label className='input-label'>VISITED LOCATIONS</label>
                <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
            </div>
        </div>
    )
}

export default AddEditTravelStory



// <button className='btn-small btn-delete' onClick={onClose}>
// <MdDeleteOutline className='text-lg' /> DELETE
// </button>