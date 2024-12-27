import { Link } from 'react-router-dom';
import { CiTimer } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { TfiCommentsSmiley } from "react-icons/tfi";

import { useEffect, useState } from 'react';

export default function RecentPostCard({ post }) {

    const [user,setUser] = useState({});
    const [comments,setComments] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL;

      useEffect(()=>{
          try {
            const getUser = async () =>{
          const res = await fetch(`${API_URL}/api/user/${post.userId}`);
          const data = await res.json();
          if(res.ok){
            setUser(data);
          }
    
        }
        getUser();
        } catch (error) {
          console.log(error.message);
        }
    
      },[post]);
      
    
      useEffect(()=>{
          
    
          try {
            const getComments = async () =>{
            const res = await fetch(`${API_URL}/api/comment/getPostComments/${post._id}`);
            if(res.ok){
              const data = await res.json();
              setComments(data);
            }
          }
          getComments();
            
          } catch (error) {
            console.log(error)
          }
    
    
      },[post._id]);
    
    
function truncateContent(content, limit) {
  const strippedContent = content.replace(/<[^>]*>?/gm, ""); // Remove HTML tags
  if (strippedContent.length > limit) {
    return strippedContent.substring(0, limit) + "...";
  }
  return strippedContent;
}
      
  return (
    <div className='flex flex-col w-full'>
      <div className="flex w-full h-28 md:h-52">

      <Link to={`/post/${post.slug}`}>
        <img
          src={post.postImage}
          alt='post cover'
          className='h-28 md:h-52 w-full'
        />
      </Link>
      </div>
      <div className='p-3 flex flex-col gap-2'>
      <div className="text-sm text-gray-600 mt-2 mb-3 flex flex-row gap-1 items-center">
                <img
                  src={user.profilePicture}
                  className="w-7 rounded-full bg-gray-300"
                />{" "}
                <span className="font-semibold">{user.username} </span>
              </div>

              <Link to={`/post/${post.slug}`}>   <p className='text-lg font-semibold line-clamp-2'>{post.title}</p></Link>
              <Link to={`/post/${post.slug}`}>  <div
                      className={`overflow-hidden text-sm text-ellipsis pt-2`}
                      dangerouslySetInnerHTML={{
                        __html: post && truncateContent(post.content, 80), // Limit to 100 characters
                      }}
                    ></div></Link>
      
                    <div className="flex flex-row gap-4 mt-4 mb-2">
                      <div className="text-sm text-gray-600 flex flex-row gap-2 items-center">
                        <CiTimer />{" "}
                        <span>{new Date(post.createdOn).getHours()} hours ago</span>
                      </div>
      
                      <div className="flex text-sm text-gray-600 flex flex-row gap-2 items-center">
                        <FcLike /> <span>{post.numberOfLikes}</span>
                      </div>
      
                      <div className="flex text-sm text-gray-600 flex flex-row gap-2 items-center">
                        {comments && comments.length === 0 ? (
                          <TfiCommentsSmiley />
                           ) : (
                          <>
                            <TfiCommentsSmiley /> <span>{comments.length}</span>
                          </>
                        )}
                      </div>
            </div>
      </div>
    </div>
  );
}