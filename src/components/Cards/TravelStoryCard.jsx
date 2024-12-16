import React from 'react'
import { FaHeart, FaMonument } from "react-icons/fa6"
import { GrMapLocation } from "react-icons/gr"
import moment from "moment"

const TravelStoryCard = ({
  imageUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavourite,
  onFavouriteClick,
  onClick,
  onEdit
}) => {
  return (
    <div className="overflow-hidden w-[400px] bg-cyan-200 rounded-xl shadow-sm hover:shadow-2xl transition-shadow duration-200 ease-in-out cursor-pointer">
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-40 sm:h-48 md:h-52 lg:h-56 object-cover"
          onClick={onClick}
        />
        <button
          className="absolute top-2 right-4 w-10 h-9 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-full shadow-sm transition-colors duration-300 ease-in-out hover:bg-white"
          onClick={onFavouriteClick}
        >
          <FaHeart className={`icon-btn ${isFavourite ? "text-red-500":"text-white"}`}/>
        </button>
      </div>
      
      <div className='p-4 space-y-3' onClick={onClick}>
        <div>
          <h6 className='text-lg font-semibold text-gray-800 mb-1'>{title}</h6>
          <span className="text-sm text-gray-500">
            {date ? moment(date).format("DD MMM YYYY") : ""}
          </span>
        </div>

        <p className='text-sm text-gray-600 line-clamp-2'>{story}</p>

        <div className='inline-flex items-center gap-2 text-xs font-medium text-cyan-700 bg-cyan-50 rounded-full px-5 py-1'>
          <GrMapLocation className='text-cyan-500'/>
          {visitedLocation.join(', ')}
        </div>
      </div>
    </div>
  )
}

export default TravelStoryCard
