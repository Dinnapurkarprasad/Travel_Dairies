import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from "react-router-dom"
import axiosInstance from '../../utils/axiosinstance'
import TravelStoryCard from '../../components/Cards/TravelStoryCard'
import Modal from "react-modal";
import { MdAdd } from "react-icons/md" 
import { ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddEditTravelStory from './AddEditTravelStory'
import ViewTravelStrory from './ViewTravelStrory'
import EmptyCard from '../../components/Cards/EmptyCard'
import airplane from '../../assets/images/airplane.png'
import { DayPicker } from 'react-day-picker'



const Home = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [allstories, setAllstories] = useState([])
  const [searchQuery,setSearchQuery]=useState("")
  const[openAddEditModel, setOpenAddEditModel]=useState({
    iShown:false,
    type:"add",
    data:null
  })

  const [openViewModal,setOpenViewModal]=useState(
    {
      iShown:false,
      data:null,
    }
  )
  const[filterType,setFilterType]=useState("")
  const [dateRange, setDateRange] = useState({form:null, to:null})



  const navigate = useNavigate()

  //get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
      }
    }
  }

  //get all travel stories
  const getAllTravelstories = async () => {
    try {
      const response = await axiosInstance.get('/get-all-stories');
      if (response.data && response.data.stories) {
        setAllstories(response.data.stories)
      }
    } catch (error) {
      console.error('Error fetching stories:', error)
    }
 }

  //handle edit story click
  const handleEdit = (data) => { 
   
    setOpenAddEditModel({iShown:true,type:"edit",data:data})
     
  }

  //handle travel story click
  const handleViewstory = (data) => { 
    
    setOpenViewModal({iShown:true,data});
  }

  //Handle update fav
  const updateIsFavourite = async(storyData) => { 
    const storyId=storyData._id;
  
    try {
      const response=await axiosInstance.put("/update-is-fav/"+storyId,{
        isFavourite:!storyData.isFavourite,
      });

      if(response.data && response.data.story){
        if(storyData.isFavourite) {
          toast.error("Removed from liked")
      } else {
          toast.success("Post liked",{
            icon: false,
          })
      }
      getAllTravelstories(); 
      }
      
    } catch (error) {
      console.error('Error fetching stories:', error)
    }
  }

  //Delete Story
  const deleteTravelStory=async(data)=>{
     const storyId=data._id

    try{
      const response=await axiosInstance.delete("/delete-story/"+storyId)
      if(response.data && !response.data.error){
        toast.error("Story Deleted");
        setOpenViewModal((prevState)=>({...prevState,iShown:false}))
        getAllTravelstories();
      }
    }
    catch (error) {
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

  //Seacrh stories

  const onSearchStory=async(query)=>{
    if(!query){
      getAllTravelstories()
      return;
    }    
    
    try {
          const response=await axiosInstance.get("/search",{
            params:{
              query,
            }
          })
          if(response.data && response.data.stories){
            setFilterType("search")
            setAllstories(response.data.stories)
          }
        } catch (error) {
          getAllTravelstories();
        }
  }

  const handleClearSearch=()=>{
    setFilterType("");
    setSearchQuery(""); 
    getAllTravelstories()
  }

  //handle Filter travel Stories by date Range
  const filterStoriesByDate= async(day)=>{
     
  }

  //handle Date Range select
  const handleDayClick=(day)=>{
    setDateRange(day)
    filterStoriesByDate(day)
  }



  useEffect(() => {
    getUserInfo()
    getAllTravelstories()
    return () => {
    }
  }, [])

  return (
    <>
     <Navbar userInfo={userInfo} 
     searchQuery={searchQuery} 
     setSearchQuery={setSearchQuery}
     onSearchNotes={onSearchStory}
     handleClearSearch={handleClearSearch}
     />
     <div className=''>
     <div className='conatiner mx-auto px-[30px] py-10'>
      <div className='flex'>
        <div>
          {allstories.length>0?
          (
            <div className='grid grid-cols-2 gap-8 px-5'>
                {allstories.map((item,index)=>{
                  return(
                    <TravelStoryCard 
                    key={item.id || index}
                    imageUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onEdit={()=>handleEdit(item)}
                    onClick={()=>handleViewstory(item)}
                    onFavouriteClick={()=>updateIsFavourite(item)}
                    />
                  );
                })}
            </div>
          ):<EmptyCard imgSrc={airplane} message={"Your journey awaits! Begin sharing your travel stories and unforgettable experiences. Click the Add button to start your first adventure!"}/>}
        </div>
        <div className='w-[400px] ml-[110px]'>
            <div className='bg-red-white border border-slate-200 shadow-lg shadow-slate-200 rounded-lg sh'>
                <div className='p-0'>
                <DayPicker
                captionLayout="dropdown-buttons"
                mode="range"
                selected={dateRange}
                onSelect={handleDayClick}
                pagedNavigation
                />
                </div>
            </div>
        </div>
      </div>
     </div>
     </div>

     {/* ADD & EDIT Travl story model */}

     <Modal
      isOpen={openAddEditModel.iShown}
      onRequestClose={()=>{}}
      style={{
        overlay:{
          backgroundColor:"rgba(0,0,0,0.2)",
          zIndex:999,
        },
      }}
      appElement={document.getElementById("root")}
      className="model-box"
     >
      <AddEditTravelStory
        storyInfo={openAddEditModel.data}
        type={openAddEditModel.type}
        onClose={()=>{
          setOpenAddEditModel({iShown:false,type:"add",data:null})
        }}
        getAllTravelstories={getAllTravelstories}
      />

     </Modal>
        

        {/* view Travel story model */}
     <Modal
      isOpen={openViewModal.iShown}
      onRequestClose={()=>{}}
      style={{
        overlay:{
          backgroundColor:"rgba(0,0,0,0.2)",
          zIndex:999,
        },
      }}
      appElement={document.getElementById("root")}
      className="model-box"
     >
      <ViewTravelStrory
        storyInfo={openViewModal.data||null}
        onClose={()=>{
          setOpenViewModal((prevState)=>({...prevState,iShown:false}));
        }}
        onEditClick={()=>{
          setOpenViewModal((prevState)=>({...prevState,iShown:false}));
          handleEdit(openViewModal.data||null)
        }}
        onDeleteClick={()=>{
          deleteTravelStory(openViewModal.data|| null)
        }}
      />

     </Modal>



     <button className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10 '
     onClick={()=>{
      setOpenAddEditModel({iShown:true,type:"add",data:null})
     }}
     >
         <MdAdd className="text-[30px] text-white"/>
     </button>

     <ToastContainer/>
    </>
  )
}

export default Home
