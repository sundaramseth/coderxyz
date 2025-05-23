import { useEffect, useState } from "react"
import moment from 'moment';
import {FaThumbsUp} from 'react-icons/fa';
import { Button, Textarea } from 'flowbite-react';
import { useSelector } from "react-redux";

export default function Comment({comment, onLike, onEdit, onDelete}) {
   
  const API_URL = import.meta.env.VITE_API_URL;
  
  const token = localStorage.getItem('token'); 

  const [user,setUser] = useState({});
  const {currentUser} = useSelector((state)=>state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);



  useEffect(()=>{
        const getUser = async () =>{
            try {

                const res = await fetch(`${API_URL}/api/user/${comment.userId}`);
                const data = await res.json();
                if(res.ok){
                  setUser(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getUser();
        
    },[comment]);

    const handleEdit = () => {

      setIsEditing(true);
      setEditedContent(comment.content);

    }

    const handleSave = async () =>{
      
      try {
        const res = await fetch(`${API_URL}/api/comment/editComment/${comment._id}`,{
          method:'PUT',
          headers: {
            'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`, // Include the token
          },
          body: JSON.stringify({
            content:editedContent,
          })
        });

        if(res.ok){
          setIsEditing(false);
           onEdit(comment, editedContent);
        }
      } catch (error) {
        console.log(error.message);
      }

    }


  return (
    <div className="flex pt-4 px-2  dark:border-gray-600 text-sm">
       <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 rounded-full bg-gray-200'
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
     
     
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate" >{user ? `@${user.username}` : `anonymos user`}</span>
          <span className="text-gray-500 xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
             <>
             <Textarea
               className='mb-2'
               value={editedContent}
               onChange={(e) => setEditedContent(e.target.value)}
             />
             <div className='flex justify-end gap-2 text-xs'>
               <Button
                 type='button'
                 size='sm'
                 gradientDuoTone='purpleToBlue'
                 onClick={handleSave}
               >
                 Save
               </Button>
               <Button
                 type='button'
                 size='sm'
                 gradientDuoTone='purpleToBlue'
                 outline
                 onClick={() => setIsEditing(false)}
               >
                 Cancel
               </Button>
             </div>
           </>
         ) : (
           <>
        <p className="text-gray-500 pb-2">{comment.content}</p>

        <div className="flex items-center gap-2 text-xs max-w-fit  pt-2">
        <button
                type='button'
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment?.likes?.includes(currentUser._id) &&
                  '!text-blue-500'
                }`}
              >
          <FaThumbsUp className="text-sm"/>
        </button>
        <p>
          {
            comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")
          }
        </p>
        {
          currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
           <>
            <button 
            type="button"
            onClick={handleEdit}
            className="text-gray-400 hover:text-blue-500 text-xs"
            >
              Edit
            </button>

          <button 
          type="button"
          onClick={()=>onDelete(comment._id)}
          className="text-gray-400 hover:text-red-500 text-xs"
          >
            Delete
          </button>
          </>
                
          )
        }
      </div>
      </>
      )}
      </div>
    </div>
  )
}
