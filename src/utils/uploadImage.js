import axiosInstance from "./axiosinstance";

const uploadImage=async(imageFile)=>{
    const formData=new FormData();

    formData.append('image',imageFile);

    try {
        const response=await axiosInstance.post("/image-upload",formData,{
            headers:{
              "Content-Type":"multipart/form-data"
            }
        })
        return response.data;
        
    } catch (error) {
        console.log('Error uploding the image',error);
        throw error;
    }
}

export default uploadImage;