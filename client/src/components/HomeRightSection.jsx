
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import {  FaDotCircle } from "react-icons/fa";
import FooterCom from './Footer';
import UserFollowCard from './CustomComponent/UserFollowCard';
export default function HomeRightSection() {
     const API_URL = import.meta.env.VITE_API_URL;

    const [showMore, setShowMore] = useState(true);

    
    const [showMoreUser, setShowMoreUser] = useState(true);
    const [users, setAllUsers] = useState([]);
    const [posts, setPosts] = useState([]);


    const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const res = await fetch(`${API_URL}/api/post/getPosts?limit=5`);
        const data = await res.json();
        setPosts(data.posts);
        if(data.posts.length < 5){
          setShowMore(false);
        }
      };
      fetchPosts();
    } catch (error) {
      console.log(error.message);
    }


      try {
        const fetchPost = async () =>{
          const res = await fetch(`${API_URL}/api/user/getusers?limit=5`);
          const data = await res.json();
          if(res.ok){
             
              for(let i=0; i<data.users.length; i++ ){
                if(data.users[i]._id === currentUser.rest._id){
                  const index = data.users[i];
                  data.users.splice(index, 1);
                }
              } 

              setAllUsers(data.users);
              if(data.users.length <4){
                setShowMoreUser(false);
              }
          }
      } 
      fetchPost(); 
  }
      catch (error) {
        console.log(error);
    }

  }, []);

  const handleShowMoreForPost =  async () =>{
    const startIndex = posts.length;
    try {
      const res = await fetch(`${API_URL}/api/post/getPosts?startIndex=${startIndex}`); 
      const data = await res.json();
      if(res.ok){
        setPosts((prev)=>[...prev, ...data.posts]);
        if(data.posts.length <5){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }


  const handleShowMore =  async () =>{
    const startIndex = users.length;
    try {
      const res = await fetch(`${API_URL}/api/user/getusers?startIndex=${startIndex}`); 
      const data = await res.json();
      if(res.ok){
        const index = data.users.indexOf(currentUser._id);
        data.users.splice(index, 1);
        setAllUsers((prev)=>[...prev, ...data.users]);
        if(data.users.length <4){
          setShowMoreUser(false);
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col w-auto md:p-0">
    <div className="flex flex-col sticky top-20">
    <div className="flex flex-col md:w-64 w-full bg-white dark:bg-transparent rounded-lg border dark:border-gray-600">
      <div className="flex flex-col w-full">
      
      <div className="p-2">
      <h1 className="text-md font-semibold text-gray-800 dark:text-gray-300 pt-px">Top Blogs Post</h1>
      </div> 

      {/* Divider */}
      <div className="flex flex-row w-full px-2">
        <div className="h-px bg-gray-300 dark:bg-gray-600  w-full">
        </div>
      </div>

      <div className="pb-2 pr-2">

      {
       posts.map((post)=>(
        <div key={post._id} className="my-3 ml-2 flex flex-col gap-1">
         <Link to={`/post/${post.slug}`}>
        <p className="text-sm text-gray-800 dark:text-gray-300 font-semibold"> {post.title}</p></Link>
        <p className="text-xs text-gray-500 flex flex-row gap-1 items-center">{new Date(post.createdOn).toLocaleDateString()} <FaDotCircle size={8}/> {post.numberOfLikes} likes</p>
        </div>
  
       ))
      }
      </div>

      {showMore && (
              <button onClick={handleShowMoreForPost} className="w-full text-teal-500 self-center text-sm pb-2">
              Show more
              </button>
            )}
     </div>
     </div>

     <div className="w-full justify-center my-5">

     <div className="flex flex-col w-full  md:w-64  bg-white dark:bg-transparent mt-2 rounded-lg border dark:border-gray-600">
    <div className="flex flex-col w-full">
      
      <div className="p-2">
      <h1 className="text-md font-semibold text-gray-800 dark:text-gray-300 pt-px">Follow Authors</h1>
      </div> 

      {/* Divider */}
      <div className="flex flex-row w-full px-2">
        <div className="h-px bg-gray-300 dark:bg-gray-600  w-full">
        </div>
      </div>

      <div className="m-2">
      {
       users.map((user)=>(
       <UserFollowCard key={user._id} user={user} />  
       ))
      }

      </div>
        {showMoreUser && (
        <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-1">
        Show more
        </button>
      )}
     </div>
     </div>
     </div>

     <FooterCom/>
   </div>
    </div>
  )
}
