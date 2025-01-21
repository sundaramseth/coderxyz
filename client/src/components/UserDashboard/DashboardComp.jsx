
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
    HiAnnotation,
    HiDocumentText,
    HiOutlineUserGroup,
  } from 'react-icons/hi';


export default function DashboardComp() {

  
    const API_URL = import.meta.env.VITE_API_URL;

    const [totalComments, setTotalComments] = useState(0);
    const { currentUser } = useSelector((state) => state.user);


    const [userPostsLength, setUserPostsLength] = useState(0);

    useEffect(() => {
      
            try {
              const fetchPost = async () =>{
                const res = await fetch(`${API_URL}/api/post/getPosts?userId=${currentUser.rest._id}`);
                const data = await res.json();
                if(res.ok){
                    setUserPostsLength(data.posts.length);
                }
          
            }
            fetchPost();
          } catch (error) {
            console.log(error);
        }

          const fetchComments = async () => {
            try {
              const res = await fetch(`${API_URL}/api/comment/getusercomments/${currentUser.rest._id}`);
              const data = await res.json();
              if (res.ok) {
                setTotalComments(data.length);
                console.log(data)
              }
            } catch (error) {
              console.log(error.message);
            }
          };

            fetchComments();

    },[currentUser.rest._id]);

    return (
        <div className='p-3 md:mx-auto w-full flex flex-row justify-center'>
          <div className="flex flex-col md:w-4/5 lg:w-3/4 xl:w-3/5 justify-start">
          <h1 className='text-4xl font-semibold p-3 mt-5 mb-5 text-start'>
          Your story stats
          </h1>
          <div className='flex flex-col md:flex-row gap-4 justify-left'>
            <div className='flex flex-col p-3 bg-white dark:bg-slate-800 gap-4 w-full rounded-md shadow-md'>
              <div className='flex justify-between'>
                <div className=''>
                  <h3 className='text-gray-500 text-md uppercase'>Total Followers</h3>
                  <p className='text-2xl'>{currentUser.rest.followers.length}</p>
                </div>
                <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
              </div>
            </div>
            <div className='flex flex-col p-3 bg-white dark:bg-slate-800 gap-4  w-full rounded-md shadow-md'>
              <div className='flex justify-between'>
                <div className=''>
                  <h3 className='text-gray-500 text-md uppercase'>
                    Total Comments
                  </h3>
                  <p className='text-2xl'>{totalComments}</p>
                </div>
                <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
              </div>
            </div>
            <div className='flex flex-col p-3 bg-white dark:bg-slate-800 gap-4 w-full rounded-md shadow-md'>
              <div className='flex justify-between'>
                <div className=''>
                  <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                  <p className='text-2xl'>{userPostsLength}</p>
                </div>
                <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
              </div>
            </div>
          </div>
        </div>
        </div>
      );
}
