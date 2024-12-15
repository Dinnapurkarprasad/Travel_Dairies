import mongoose, { Schema } from "mongoose";


const travelStorySchema=new Schema({
    title:{type:String,required:true},
    story:{type:String,required:true},
    visitedLocation:{type:[String],default:[]},
    isFavourite:{type:Boolean,default:false},
    // count:{type:Number,default:0},
    userId:{type:Schema.Types.ObjectId,ref:"User",required:true},
    createdOn:{type:String,default:Date.now()},
    imageUrl:{type:String,required:true},
    visitedDate:{type:Date, required:true}
})
export default mongoose.model("TravelStory",travelStorySchema)