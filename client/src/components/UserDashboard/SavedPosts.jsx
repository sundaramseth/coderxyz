
import { useEffect, useState } from 'react';
import BlogPostPreviewCard from '../CustomComponent/BlogPostPreviewCard';
import { useSelector } from "react-redux"
import { Link } from 'react-router-dom';


export default function SavedPosts() {

const { currentUser } = useSelector((state) => state.user);
const [posts, setPosts] = useState([]);

const API_URL = import.meta.env.VITE_API_URL;

console.log(currentUser.rest._id)

useEffect(() => {
try {
    const fetchPosts = async () => {
    const res = await fetch(`${API_URL}/api/post/getsavedpost/${currentUser.rest._id}`);
    const data = await res.json();
    // Sort by createdAt in descending order (newest first)
    setPosts(data);

    };
    fetchPosts();
} catch (error) {
    console.log(error.message);
}
}, [currentUser.rest._id]);


    

      
  return (
<div className="flex flex-col w-full items-center">
   <div className="flex md:flex-row w-full md:w-3/5 flex-col-reverse justify-center gap-4">
    
    {/* search result left section */}
      <div className='w-full'>
        <h1 className='text-3xl font-semibold p-3 mt-5 '>
         Saved Item
        </h1>

         <div className="flex flex-col w-full p-2">
          
         {posts && posts.length > 0 ? (
          <>
            {posts.map((post) => (
                  <BlogPostPreviewCard key={post._id} post={post} />
                ))}
              </>
            ):(

              <p>No Saved Post Found! ~ You can add post here.</p>

            )}
        
    
         </div>
      </div>

      {/* right section */}

    <div className="w-auto">
    <div className="w-full justify-center md:mt-2 md:sticky md:top-20">
    <div className="flex flex-col md:w-60 bg-white dark:bg-transparent md:m-0 m-5 mt-2 rounded-lg border dark:border-gray-600 ">
    <div className="flex flex-col w-full rounded-lg ">
      <div className="flex flex-col">
      <img 
      className="w-full max-h-24 rounded-tr-lg rounded-tl-lg" 
        alt='background'
        src="https://t4.ftcdn.net/jpg/05/49/86/39/360_F_549863991_6yPKI08MG7JiZX83tMHlhDtd6XLFAMce.jpg"
        />
      <Link to='/dashboard?tab=profile'>
      <img 
    className="border rounded-full w-14 relative bottom-6 left-3"
      alt='user'
      src={currentUser.rest?.profilePicture}
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
