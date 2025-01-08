

import { TfiCommentsSmiley } from 'react-icons/tfi';
import { FcLike } from 'react-icons/fc';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserPostCard({post}) {

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
    
    
      },[post._id]);
    
    function truncateContent(content, maxLength) {
        if (content.length <= maxLength) {
          return content;
        }
        return content.slice(0, maxLength) + '...';
      }

    return(
            <div className="flex flex-col gap-4 w-full items-center bg-white dark:border-gray-700 dark:bg-gray-800 p-2 rounded-lg">
                 <Link to={`/post/${post.slug}`}>
                 <img src={post.postImage} alt={post.title} className="w-full h-28 object-cover bg-gray-300 rounded-sm" />
                 <p className="font-medium text-gray-800 dark:text-white text-left">{truncateContent(post.title, 45)}</p>
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
                <span>{new Date(post.createdOn).getHours()} hours ago</span>
                </div>
            </div>
          </div>
    );

}