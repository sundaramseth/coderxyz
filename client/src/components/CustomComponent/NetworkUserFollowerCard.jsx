import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {  useNavigate } from "react-router-dom";
import { Toast, Modal, Button } from "flowbite-react";
import { HiExclamation } from 'react-icons/hi';
import { RiUserUnfollowLine } from 'react-icons/ri';
export default function NetworkUserFollowerCard({userId}) {

    // alert(userId);
      const navigate = useNavigate();
      const API_URL = import.meta.env.VITE_API_URL;

      const { currentUser } = useSelector((state) => state.user);

      const [user, setUser] = useState({});

      const [followTheChannel, setFollowTheChannel] = useState(false);

      const [followError, setFollowError] = useState(null);
      const [openModal, setOpenModal] = useState(false);

      useEffect(()=>{
        const getCurrentUser = async () =>{
            try {

                const res = await fetch(`${API_URL}/api/user/${currentUser.rest._id}`);
                const data = await res.json();
                if(res.ok){
                  if(data.following.includes(userId)){
                    setFollowTheChannel(true);
                  }
                  else{
                    setFollowTheChannel(false);
                }
              }
            } catch (error) {
                console.log(error.message);
            }
        }
        getCurrentUser();

        const getUser = async () =>{
          try {

            const res = await fetch(`${API_URL}/api/user/${userId}`);
            const data = await res.json();
            if(res.ok){
               setUser(data)
          }
        } catch (error) {
            console.log(error.message);
        }
        }
        getUser();
      },[userId]);

      const followChannel = async (userId) =>{
    
        try {
          if(!currentUser){
            navigate('/signin');
            return;
         }
          const res = await fetch(`${API_URL}/api/user/follow/${userId}`,{
            method:'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({userId})
          });
          const data = await res.json();
          if(!res.ok){
           console.log(data.message);
           setFollowError(data.message);
          }
          else{
            setFollowTheChannel(true);
          }
      } catch (error) {
          console.log(error);
      }
    }
    
    const unfollowChannel = async (userId) =>{
     
      try {
        if(!currentUser){
          navigate('/signin');
          return;
       }
        const res = await fetch(`${API_URL}/api/user/unfollow/${userId}`,{
          method:'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({userId})
        });
        const data = await res.json();
        if(!res.ok){
         console.log(data.message);
        }
        else{
          setFollowTheChannel(false);
          setOpenModal(false);
        }
    } catch (error) {
        console.log(error);
    }
    }
    

  return (
    <div key={user._id} className="p-3 flex flex-row gap-1 border-b border-b-gray-100 dark:border-b-gray-600 ">
    <div className="flex flex-row w-full justify-between items-center text-left gap-2">
    
    <div className="w-auto rounded-full">
     <img src={user.profilePicture}  className="w-10 rounded-full"/>
    </div>

    <div className="w-3/4">
    <p className="text-sm text-left text-gray-800 dark:text-gray-300 font-semibold"> {user.username} </p>
    <p className='text-sm text-left text-gray-700 dark:text-gray-400'>{user.about}</p>
    </div>

    <div className="w-1/4 flex justify-end">
    {followTheChannel ? (
    <button type='text' className='p-0 px-1 m-0 text-xs rounded-sm  bg-slate-50 text-gray-900 font-medium' onClick={()=>setOpenModal(true)}>Following</button>
    ):(
    <button type='text' className='p-0 px-1 m-0 text-xs rounded-sm bg-slate-50 text-gray-900 font-medium'  onClick={()=>{followChannel(user._id)}}>Follow</button>
 
    )
  }
    </div>
    </div>

  <Modal show={openModal} size="sm" onClose={() => setOpenModal(false)} popup>
    <Modal.Body className='py-5 px-0'>
          <div className="text-center">
            <RiUserUnfollowLine  className="mx-auto mb-4 h-9 w-9 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-sm font-semibold text-gray-500 dark:text-gray-400">
              You are about to unfollow {user.username}?
            </h3>
            <div className="flex justify-center gap-4">
        
              <Button color="gray" size="sm" onClick={() => setOpenModal(false)} outline pill>
                No, cancel
              </Button>
              <Button color="failure" size="sm" onClick={()=>{unfollowChannel(user._id)}} pill>
                {"UnFollow"}
              </Button>
            </div>
          </div>
        </Modal.Body>
</Modal>
   {followError && 
   (
    <Toast className='absolute bottom-2'>
         <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
          <HiExclamation className="h-5 w-5" />
        </div>
    <div className="ml-3 text-sm font-normal">{followError}</div>
    <Toast.Toggle />
    </Toast>   
   )}       
  </div>
  )
}

NetworkUserFollowerCard.propTypes = {
  userId: PropTypes.string.isRequired,
};