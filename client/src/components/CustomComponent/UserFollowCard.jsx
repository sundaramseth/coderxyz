import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {  useNavigate } from "react-router-dom";
import { Toast, Modal, Button } from "flowbite-react";
import { HiExclamation } from 'react-icons/hi';
import { RiUserUnfollowLine } from 'react-icons/ri';
export default function UserFollowCard({user}) {
      const navigate = useNavigate();
      const API_URL = import.meta.env.VITE_API_URL;

      const { currentUser } = useSelector((state) => state.user);

      const [followTheChannel, setFollowTheChannel] = useState(false);

      const [followError, setFollowError] = useState(null);
      const [openModal, setOpenModal] = useState(false);
      useEffect(()=>{
        const getUser = async () =>{
            try {

                const res = await fetch(`${API_URL}/api/user/${currentUser.rest._id}`);
                const data = await res.json();
                if(res.ok){
                  if(data.following.includes(user._id)){
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
        getUser();
      },[user._id]);
    
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

    function truncateContent(content, maxLength) {
      if (content.length <= maxLength) {
        return content;
      }
      return content.slice(0, maxLength) + '...';
    }

    

  return (
    <div key={user._id} className="py-3 flex flex-row gap-1 border-b border-b-gray-100 dark:border-b-gray-600 ">
    <div className="flex flex-row w-full justify-between items-center text-left gap-2">
    
    <div className="w-1/5 rounded-full">
     <img src={user.profilePicture}  className="w-8 rounded-full"/>
    </div>

    <div className="w-2/5">
    <p className="text-sm text-left text-gray-800 dark:text-gray-300 font-semibold"> {truncateContent(user.username, 10)} </p>
    </div>

    <div className="w-2/5 flex justify-end">
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
