

import { TfiCommentsSmiley } from 'react-icons/tfi';
import { FcLike } from 'react-icons/fc';
import { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';

const UserPostCard = memo(function UserPostCard({post}) {

      const API_URL = import.meta.env.VITE_API_URL;
      
      const [comments,setComments] = useState([]);

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
    
    
      },[post && post._id]);
    
    function truncateContent(content, maxLength) {
        if (content.length <= maxLength) {
          return content;
        }
        return content.slice(0, maxLength) + '...';
      }

      function calculateTimeAgo(updatedAt) {
        const now = new Date(); // Current time
        const updatedTime = new Date(updatedAt); // Time from post
        const differenceInMs = now - updatedTime; // Difference in milliseconds
        const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60)); // Convert to hours
      
        if (differenceInHours === 0) {
          const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));
          return differenceInMinutes <= 1
            ? `${differenceInMinutes} min ago`
            : `${differenceInMinutes} mins ago`;
        }
      
        return differenceInHours === 1
          ? `${differenceInHours} hr ago`
          : `${differenceInHours} hrs ago`;
      }
      
    

    return(
            <div className="flex flex-col gap-4 w-full h-auto items-center bg-white dark:border-gray-700 dark:bg-gray-800 p-2 rounded-lg">
                 <Link to={`/post/${post.slug}`}>
                 <img src={post && post.postImage} alt={post.title} className="w-full min-h-28 object-cover bg-gray-300 rounded-sm" />
                 <h1 className="font-medium text-gray-800 dark:text-white text-left mt-2 text-sm">{truncateContent(post.title, 35)}</h1>
                 </Link>
        
            <div className="flex flex-row gap-2 justify-start items-center w-full">
                  <div className="text-sm text-gray-600 flex flex-row gap-2 items-center">
                    <FcLike /> <span>{post.numberOfLikes}</span>
                  </div>

                <div className="text-sm text-gray-600 flex flex-row gap-2 items-center">
                  {post.comments && post.comments.length === 0 ? (
                    <TfiCommentsSmiley />
                    ) : (
                    <>
                      <TfiCommentsSmiley /> <span>{comments.length}</span>
                    </>
                  )}
                </div>

                <div className="text-sm text-gray-600 flex flex-row gap-2 items-center">
                <span>{calculateTimeAgo(post.updatedAt)}</span>
                </div>
            </div>
            
          </div>

          
    );

});

export default UserPostCard;