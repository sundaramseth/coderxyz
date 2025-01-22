
import { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import BlogPostPreviewCard from '../CustomComponent/BlogPostPreviewCard';
import { useSelector } from "react-redux"
import { Link } from 'react-router-dom';


export default function SavedPosts() {

const { currentUser } = useSelector((state) => state.user);
const [posts, setPosts] = useState([]);

const API_URL = import.meta.env.VITE_API_URL;



useEffect(() => {
try {
    const fetchPosts = async () => {
    const res = await axios.get(`${API_URL}/api/post/getsavedpost/${currentUser.rest._id}`);
    const data = res.data;
    // Sort by createdAt in descending order (newest first)
    if(res.status === 200){
    setPosts(data);
    }

    };
    fetchPosts();
} catch (error) {
    console.log(error.message);
}
}, [currentUser.rest._id]);


    

      
  return (
<div className="flex flex-col w-full items-center">
   <div className="flex md:flex-row w-full md:w-4/5 lg:w-3/4 xl:w-3/5 flex-col-reverse justify-center gap-4">
    
    {/* search result left section */}
      <div className='w-full'>
        <h1 className='md:text-3xl text-xl font-bold p-3'>
         Saved Item
        </h1>

         <div className="flex flex-col w-full gap-2">
          
         {posts && posts.length > 0 ? (
          <>
            {posts.map((post) => (
                <div
                   key={post._id}
                   className="transition-all duration-300 min-h-48"
                 >
                  <BlogPostPreviewCard post={post} />
                  </div>
                ))}
              </>
            ):(

              <p>No Saved Post Found! ~ You can add post here.</p>

            )}
        
    
         </div>
      </div>

      {/* right section */}

    <div className="w-auto md:block hidden">
    <div className="w-full justify-center md:mt-2 md:sticky md:top-20">
    <div className="flex flex-col md:w-60 bg-white dark:bg-transparent mt-2 md:rounded-lg rounded-none border dark:border-gray-600 ">
    <div className="flex flex-col w-full md:rounded-lg rouded-none">
      <div className="flex flex-col">
      <img 
      className="w-full max-h-24 md:rounded-tr-lg md:rounded-tl-lg rouded-none" 
        alt='background'
        src={currentUser.rest?.profileBgPicture}
        loading="lazy" 
        />
      <Link to='/dashboard?tab=profile'>
      <img 
    className="border rounded-full w-14 relative bottom-6 left-3"
      alt='user'
      src={currentUser.rest?.profilePicture}
      loading="lazy" 
      /></Link>
      </div>

      <div className="pl-2">
      <h1 className="text-lg font-semibold">{currentUser.rest.username}</h1>
      <p className="text-sm text-gray-800 dark:text-gray-300 pt-px">{currentUser.rest.about}</p>
      <p className="text-gray-500 text-xs pt-px pb-2">
      {currentUser.rest.location}
      </p>
      </div>

     </div>
     </div>

     </div>




    </div>

    </div>
    </div>
  )
}
