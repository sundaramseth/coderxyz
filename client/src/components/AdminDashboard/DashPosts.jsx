import { Table, Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
export default function DashPosts() {
  
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token'); 
  
    const {currentUser} = useSelector((state)=> state.user)
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState('');
    
    useEffect(()=>{
    const fetchPost = async () =>{
        try {
            const res = await fetch(`${API_URL}/api/post/getPosts?userId=${currentUser._id}`);
            const data = await res.json();
            if(res.ok){
                setUserPosts(data.posts);
                if(data.posts.length <9){
                  setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    if(currentUser.isAdmin) fetchPost();

  },[currentUser._id]);
  
  const handleShowMore =  async () =>{
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`${API_URL}/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`); 
      const data = await res.json();
      if(res.ok){
        setUserPosts((prev)=>[...prev, ...data.posts]);
        if(data.posts.length <9){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeletepost = async ()=>{
    setShowModal(false);
    try {
      const res = await fetch(`${API_URL}/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,{
        method:'DELETE',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`, // Include the token
        },
      });
      const data = await res.json();
      if(!res.ok){
       console.log(data.message);
      }
      else{
        setUserPosts((prev)=>prev.filter((post)=>post._id !== postIdToDelete));
      }
  } catch (error) {
      console.log(error);
  }
  }


    return (
    <div className="mywidth table-auto overflow-x-auto md:mx-auto p-3">
         {currentUser.isAdmin && userPosts.length>0 ? (  
          <>
            <Table hoverable className="shadow-md" >
                <Table.Head>
                    <Table.HeadCell>
                        Date updated
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Post Image
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Post Title
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Category
                    </Table.HeadCell>
                    <Table.HeadCell>
                      Delete
                    </Table.HeadCell>

                    <Table.HeadCell>
                        <span >Edit</span>
                    </Table.HeadCell>
                </Table.Head>
                
               
          
                {userPosts.map((post)=>(
              <Table.Body className='divide-y' key={post._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' >
                  <Table.Cell>
                        {new Date(post.createdOn).toLocaleDateString()}
                  </Table.Cell>

                        <Table.Cell>
                        <Link to={`/post/${post.slug}`}>
                            <img 
                            src={post.postImage}
                            alt={post.title}
                            className="w-20 h-10 object-cover bg-gray-300"
                            />
                            </Link>
                        </Table.Cell>

                        <Table.Cell className="font-medium text-gray-800 dark:text-white">
                        <Link to={`/post/${post.slug}`}>
                            {post.title}
                            </Link>
                        </Table.Cell>

                        <Table.Cell>
                            {post.category}
                        </Table.Cell>
                        <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='text-teal-500 hover:underline'
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>

                </Table.Row>
                </Table.Body>
                ))}

            </Table>
            {showMore && (
              <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Show more
              </button>
            )}
            </>
      
         ):(
            <p>You Dont have any posts yet!</p>
         )}

         
    <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
     <Modal.Header />  
     <Modal.Body>
      <div className="text-center">
        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure! You want to delete this Post ?</h3>
     <div className="flex justify-center gap-4">
     <Button color='failure' onClick={handleDeletepost}>Yes, I am sure</Button>
     <Button color='gray' onClick={()=>setShowModal(false)}>No, Cancel</Button>
     </div>
      </div>
     </Modal.Body>
    </Modal>
    </div>
  )
}


