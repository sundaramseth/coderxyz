import { Alert, Button, Modal, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const CommentSection = ({postId}) => {
  
    const API_URL = import.meta.env.VITE_API_URL;
    const {currentUser} = useSelector(state => state.user);
    const [comment,setComment] = useState('');



    const [commentError, setCommentError] = useState(null);

    const [comments,setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const navigate = useNavigate();

    
    const handleSubmit = async (e)=>{
     e.preventDefault();
     if(comment.length > 200){
      return;
     }


     try {
      const res  = await fetch(`${API_URL}/api/comment/create`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({content:comment, postId, userId:currentUser._id})
       });
       const data = await res.json();
       if(res.ok){
        setComment('')
        setCommentError(null);
        setComments([data,...comments]);       
      }
  

     } catch (error) {
      setCommentError(error.message)
      console.log(error)
     }

  
    }

    useEffect(()=>{
        try {
          const getComments = async () =>{
          const res = await fetch(`${API_URL}/api/comment/getPostComments/${postId}`);
          if(res.ok){
            const data = await res.json();
            setComments(data);
          }
        }
        getComments();
          
        } catch (error) {
          console.log(error)
        }
   

    },[postId]);

    const handleLikes = async (commentId) =>{
      try {
        if(!currentUser){
          navigate('/signin');
          return;
        }

        const res = await fetch(`${API_URL}/api/comment/likeComment/${commentId}` , {
          method:'PUT',
        });

        if(res.ok){
          const data = await res.json();
          console.log(data)
          setComments(
            comments.map((comment) =>
              comment._id === commentId
                ? {
                    ...comment,
                    likes: data.likes,
                    numberOfLikes: data.numberOfLikes,
                  }
                : comment
            )
          );
        }

      } catch (error) {
        console.log(error.message);
      }

      }


      const handleEdit = async (comment, editedContent) => {
        setComments(
          comments.map((c) =>
            c._id === comment._id ? { ...c, content: editedContent } : c
          )
        );
      };

      const handleDelete = async (commentId) =>{
        console.log(commentToDelete)
        setShowModal(false);
        try {
          if(!currentUser){
            navigate('/signin');
            return;
          }

          const res = await fetch(`${API_URL}/api/comment/deleteComment/${commentId}`,{
            method:'DELETE',
          });
          if (res.ok) {
            const data = await res.json();
            setComments(comments.filter((comment) => comment._id !== commentId));
            console.log(data)
          }
          
        
        } catch (error) {
          console.log(error.message);
        }
      }

   
   
    return (
      <div className='flex flex-col p-5'>
      {currentUser ? 
      (
        <div className="flex flex-col md:flex-row gap-2 items-start p-3">
            <p className='text-sm font-semibold'>
                Signed in as:
            </p>
            <div className="flex justify-center items-center gap-2">
            <img src={currentUser.profilePicture} alt={currentUser.username} className='w-7 h-7' />
           
           <Link to={'/dashboard?tab=profile'} className='text-sm text-cyan-700 hover:underline'>
            @ {currentUser.email}
           </Link>
           
           </div>

        </div>
      )
      :
      (
        <div className="flex py-3 gap-2">

            <p className='text-md font-semibold'>Sign In for comment!</p>
            <Link to={'/signin'} className='text-blue-600 font-semibold'>
            Sign In
            </Link>

        </div>
      ) 
      }
      {currentUser && (
        <form onSubmit={handleSubmit} className=' p-3 rounded-sm items-center'>
          <Textarea 
          placeholder='Add a comment...'
          rows='3'
          maxLength='200'
          onChange={(e)=> setComment(e.target.value)}
          value={comment}
          />
          <div className="flex justify-between my-2">
            <p className='text-sm font-semibold'>{200 - comment.length} character remaning</p>
            <Button pill outline size='xs' type='submit'>Submit</Button>
          </div>
          {commentError && (
               <Alert color='failure' className='mt-5'>
            
               {commentError}
               </Alert>
          )}
       
        </form>
      
      )}
      {comments.length === 0 ? 
      (
        <p className='text-sm my-5'>No comments yet!</p>
      )
      :
      (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
          <p>Comments</p>
          <div className="border border-gray-400 py-1 px-2 rounded-sm">
            <p>{comments.length}</p>
          </div>
        </div>
        
        {comments.map((comment) =>
          <Comment
          key={comment._id}
          comment={comment}
          onLike={handleLikes}
          onEdit={handleEdit}
          onDelete={(commentId)=>{
            setShowModal(true);
            setCommentToDelete(commentId);          
          }}
          />
        )}
        </>
     
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                color='failure'
                onClick={() => handleDelete(commentToDelete)}
              >
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
     </div>
     )
}
export default CommentSection;