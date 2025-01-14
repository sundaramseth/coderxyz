
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

import NetworkUserCard from "../CustomComponent/NetworkUserCard";



export default function DashProfile() {
  
  const API_URL = import.meta.env.VITE_API_URL;
  

  const {currentUser} = useSelector(state => state.user);

  const [userPostsLength, setUserPostsLength] = useState(0);


  const [userPosts, setUserPost] = useState({});

  const [user,setUser] = useState({})


  useEffect(()=>{

        try {
          const fetchPost = async () =>{
            const res = await fetch(`${API_URL}/api/post/getPosts?userId=${currentUser.rest._id}`);
            const data = await res.json();
            if(res.ok){
                setUserPost(data.posts);
                setUserPostsLength(data.posts.length);
            }
      
        }
        fetchPost();
      } catch (error) {
        console.log(error);
    }
    
    try {
          const getUser = async () =>{
          const res = await fetch(`${API_URL}/api/user/${currentUser.rest._id}`);
          const data = await res.json();
          if(res.ok){
             setUser(data)
        }
      } 
      getUser();
      }
      catch (error) {
        console.log(error.message);
    }
   
  

  },[currentUser.rest._id]);


  return (
    
    <div className="mx-auto w-full md:w-3/5 flex flex-col gap-4">

      {/* profile header */}
      <div className="flex flex-col w-full mx-auto gap-4 md:px-0 px-2">

        <div className="flex flex-row justify-between items-center w-full rounded-lg overflow-hidden">
          <img src={currentUser.rest.profileBgPicture} className="w-full h-28 md:h-48 object-cover" alt="background picture" />
        </div>

        <div className="flex flex-row gap-4">

          <div className="w-1/4 md:w-1/6">
            <div className="relative w-20 h-20 md:w-32 md:h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
              <img src={currentUser.rest.profilePicture} alt="user" className="rounded-full w-full h-full object-cover" />
            </div>
          </div>

          <div className="w-full flex flex-col gap-1 justify-center items-start">
          <h1 className="text-2xl font-semibold">{currentUser.rest.channelName}</h1>
          <p className="flex flex-row justify-center items-center gap-2 md:text-sm text-xs"><span className="font-semibold">@{currentUser.rest.username}</span> <FaDotCircle size={5}/> {currentUser.rest.followers && currentUser.rest.followers.length|| 0} Followers <FaDotCircle size={5}/> {userPostsLength} Posts</p>
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
        <div className="flex flex-col gap-4 w-full mx-auto">
        <div className="flex flex-col gap-3 ">
        <Tabs aria-label="Tabs with icons" variant="underline">
        <Tabs.Item active title="Posts" icon={PiArticleMedium}>
       
        <div className="flex flex-col gap-4">

        <div className="flex flex-row gap-2 md:px-0 px-2">
            <button className="bg-gray-100 text-gray-800 active:bg-gray-400 border px-3 py-1 rounded-lg text-xs font-medium">Latest</button>
            <button className="bg-gray-100 text-gray-800 active:bg-gray-400 px-3 py-1 rounded-lg text-xs font-medium">Top</button>
            <button className="bg-gray-100 text-gray-800 active:bg-gray-400 px-3 py-1 rounded-lg text-xs font-medium">Oldest</button>
          </div>

          <div className="items-center grid grid-cols-2 grid-flow-row-dense md:grid-cols-4  gap-4 md:px-0 px-2">
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
      <Tabs.Item title="My Network" icon={LuUsers} >
      <div className="flex flex-col bg-white rounded-md md:mx-0 mx-2 dark:bg-[rgb(16,23,42)]">
        <h1 className="text-md font-medium px-2 py-3 border-b">{currentUser.rest.channelName}&apos;s Networks</h1>
        <div className="custom-tabs">
          <Tabs aria-label="Tabs with icons" variant="underline"  className="">
           <Tabs.Item title="Followers" className="!p-0">
           <div className="flex flex-col">
          {user.followers ? ( 
          <>
           {user.followers.map((userId)=>(
            <NetworkUserCard key={userId} userId={userId} />
          ))}
          </>
        ):(
           <p>Not found any followers!</p>
        )}
          </div>
          </Tabs.Item>
          <Tabs.Item title="Following" className="p-0">
          <div className="flex flex-col">
          {user.following ? ( 
          <>
           {user.following.map((userId)=>(
            <NetworkUserCard key={userId} userId={userId} />
          ))}
          </>
        ):(
           <p>You Not following Any Channel!</p>
        )}
          </div>
          </Tabs.Item>
        </Tabs>
        </div>
          </div>

      </Tabs.Item>
      <Tabs.Item title="Contacts" icon={HiClipboardList}>
       <div className="flex flex-col gap-4  md:mx-0 mx-2">
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
