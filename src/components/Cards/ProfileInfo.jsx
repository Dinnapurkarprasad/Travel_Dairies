import React from 'react';
import logout from '../../assets/images/logout.png'


const ProfileInfo = ({onLogout }) => {
 
  return (
    <div>
      <div className='flex items-center gap-3'>
        <div>
          <button className='text-sm mr-4 bg-sky-400 font-semibold p-3 px-4 rounded-full ' onClick={onLogout}>
            logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
