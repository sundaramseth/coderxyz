
import { useSelector } from "react-redux"
import { useState, useEffect } from "react";
import 'react-circular-progressbar/dist/styles.css';
import { Link } from "react-router-dom";
import { FaDotCircle, FaLocationArrow, FaMailchimp } from "react-icons/fa";
import { Tabs } from "flowbite-react";
import { HiClipboardList } from "react-icons/hi";
import { PiArticleMedium } from "react-icons/pi";
import { LuUsers } from "react-icons/lu";
import UserPostCard from "../CustomComponent/UserPostCard";



export default function DashProfile() {
  
  const API_URL = import.meta.env.VITE_API_URL;
  

  const {currentUser} = useSelector(state => state.user);

  const [userPostsLength, setUserPostsLength] = useState(0);


  const [userPosts, setUserPost] = useState({});


  useEffect(()=>{
    const fetchPost = async () =>{
        try {
            const res = await fetch(`${API_URL}/api/post/getPosts?userId=${currentUser.rest._id}`);
            const data = await res.json();
            if(res.ok){
                setUserPost(data.posts);
                setUserPostsLength(data.posts.length);
            }
        } catch (error) {
            console.log(error);
        }
      }
    
      fetchPost();
  

  },[currentUser.rest._id]);


  return (
    
    <div className="mx-auto w-full md:w-3/4 flex flex-col gap-4">

      {/* profile header */}
      <div className="flex flex-col w-11/12 mx-auto gap-4">

        <div className="flex flex-row justify-between items-center w-full rounded-lg overflow-hidden">
          <img src={currentUser.rest.profileBgPicture} className="w-full h-48 object-cover" alt="background picture" />
        </div>

        <div className="flex flex-row gap-4">

          <div className="w-1/6">
            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
              <img src={currentUser.rest.profilePicture} alt="user" className="rounded-full w-full h-full object-cover" />
            </div>
          </div>

          <div className="w-full flex flex-col gap-1 justify-center items-start">
          <h1 className="text-2xl font-semibold">{currentUser.rest.channelName}</h1>
          <p className="flex flex-row justify-center items-center gap-2 text-sm"><span className="font-semibold">@{currentUser.rest.username}</span> <FaDotCircle size={5}/> {currentUser.rest.followers && currentUser.rest.followers || 0} Followers <FaDotCircle size={5}/> {userPostsLength} Posts</p>
          <p className="text-gray-500 text-sm font-medium">{currentUser.rest.about}</p>
          <div className="flex flex-row gap-2">
            <Link to='/dashboard?tab=settings'>
            <button className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-medium">Customize</button>
            </Link>
            <Link to='/dashboard?tab=posts'>
            <button className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-medium">Posts</button>
            </Link>
          </div>
          </div>

        </div>

      </div>
      
       {/* profile header end */}

       {/* profile bddy */}
        <div className="flex flex-col gap-4 w-11/12 mx-auto">
        <div className="flex flex-col gap-3">
        <Tabs aria-label="Tabs with icons" variant="underline">
      <Tabs.Item active title="Posts" icon={PiArticleMedium}>
       
        <div className="flex flex-col gap-4">

        <div className="flex flex-row gap-2">
            <button className="bg-gray-100 text-gray-800 active:bg-gray-400 border px-3 py-1 rounded-lg text-xs font-medium">Latest</button>
            <button className="bg-gray-100 text-gray-800 active:bg-gray-400 px-3 py-1 rounded-lg text-xs font-medium">Top</button>
            <button className="bg-gray-100 text-gray-800 active:bg-gray-400 px-3 py-1 rounded-lg text-xs font-medium">Oldest</button>
          </div>

          <div className="items-center grid grid-flow-row-dense grid-cols-4 gap-4">
          {currentUser.rest && userPosts.length>0 ? ( 
          <>
           {userPosts.map((post)=>(
            <UserPostCard key={post._id} post={post} />
          ))}
          </>
        ):(
           <p>You Dont have any posts yet!</p>
        )}
          </div>

        </div>
      </Tabs.Item>
      <Tabs.Item title="Followers" icon={LuUsers}>
        This is <span className="font-medium text-gray-800 dark:text-white">Settings tab's associated content</span>.
        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
        control the content visibility and styling.
      </Tabs.Item>
      <Tabs.Item title="Contacts" icon={HiClipboardList}>
       <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 items-center">
          <FaLocationArrow/>
          <p className="font-sm font-semibold">Location:</p>
          <p>{currentUser.rest.location}</p>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <FaMailchimp/>
          <p className="font-sm font-semibold">Email:</p>
          <p>{currentUser.rest.email}</p>
        </div>
        </div>
      </Tabs.Item>
    </Tabs>

        </div>
    </div>
    </div>
  )
}
