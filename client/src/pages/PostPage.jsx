import { Spinner,Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa";
import CommentSection from "../components/CommentSection";
import { useSelector } from "react-redux";
import { FaDotCircle } from "react-icons/fa";
import Ads from "../components/Advertisement/Ads";
import { MdInsertComment, MdShare } from "react-icons/md";
import {ShareSocial} from 'react-share-social' 
import { BsBookmarkHeart } from "react-icons/bs";
import { BsBookmarkHeartFill } from "react-icons/bs";
import RecentPostCard from "../components/RecentPostCard";
export default function PostPage() {
  const location = useLocation();
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [recentPost, setRecentPost] = useState(null);

  const [recentPostAuthor, setRecentPostAuthor] = useState(null);
  const [user, setUser] = useState({});
  const [openComment, setOpenComment] = useState(false);
  const [comments,setComments] = useState([]);
  const [openMediaModal, setMediaOpenModal] = useState(false);
  const [saveyourPost, setSaveYourPost] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const token = localStorage.getItem('token'); 
  
  console.log(token);
  // Retrieve token stored after login
  
  useEffect(() => {

      try {
        const fetchPost = async () => {
        setLoading(false);
        const res = await fetch(`${API_URL}/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
          if(data.posts[0].usersavedpost.includes(currentUser._id)){
            setSaveYourPost(true);
          }

          const res2 = await fetch(`${API_URL}/api/post/getauthorposts/${data.posts[0].userId}`);
          const data2 = await res2.json();
          if (res2.ok) {
            setRecentPostAuthor(data2);
          }
          
        }
      };
      fetchPost();
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log(error);
      }
  }, [postSlug]);


  const handlePostLikes = async (postId) => {
    try {
      if (!currentUser) {
        navigate("/signin");
        return;
      }

      const res = await fetch(`${API_URL}/api/post/likepost/${postId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,// Include the token
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setPost({
          ...post,
          likes: data.likes,
          numberOfLikes: data.numberOfLikes,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOpenComment = () => {
    if (openComment) {
      setOpenComment(false);
    } else {
      setOpenComment(true);
    }
  };



  useEffect(()=>{
    try {
      const getComments = async () =>{
      const res = await fetch(`${API_URL}/api/comment/getPostComments/${post && post._id}`);
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


useEffect(()=>{
  try {
    const getUser = async () =>{
  const res = await fetch(`${API_URL}/api/user/${post && post.userId}`);
  const data = await res.json();
  if(res.ok){
    setUser(data);
  }

}
getUser();
} catch (error) {
  console.log(error.message);
}

},[post && post.userId]);


useEffect(() => {
  try {
    const fetchRecentPosts = async () => {
      const res = await fetch(`${API_URL}/api/post/getPosts?limit=5`);
      const data = await res.json();
      if (res.ok) {
        setRecentPost(data.posts);
      }
    };
    fetchRecentPosts();
  } catch (error) {
    console.log(error.message);
  }
}, []);



const savePost = async(userId, postId)=>{
  try {
    if (!currentUser) {
      navigate("/signin");
      return;
    }

    const res = await fetch(`${API_URL}/api/post/savepost/${postId}/${userId}`, {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the token
      },
      // body:JSON.stringify(formData),
      });
      const data = await res.json();
      if(res.ok){
        setSaveYourPost(true);
      }


      if(!res.ok){
        console.log(data.message)
        return
      }

    } catch (error) {
      console.log('Something went wrong');
    }

}


const unsavePost = async(userId, postId)=>{
  try {
    if (!currentUser) {
      navigate("/signin");
      return;
    }

    const res = await fetch(`/${API_URL}api/post/unsavepost/${postId}/${userId}`, {
      method:'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the token
      },
      });
      const data = await res.json();

      if(res.ok){
      setSaveYourPost(false);
      console.log(data);
      }

    } catch (error) {
      console.log('Something went wrong');
    }

}


  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="flex flex-col md:flex-row w-full mx-auto min-h-screen py-20 justify-center gap-3">
   

      <div className="flex flex-col md:flex-row w-full md:p-0 p-2 md:w-3/5 gap-4">
            {/* Left Section */}
        <div className="flex flex-col">
        <div className="flex flex-col  bg-white dark:bg-transparent  rounded-lg border dark:border-gray-600  w-full">
          <div className="flex w-full">
            <h1 className="text-start font-bold text-2xl p-5 lg:text-4xl">
              {post && post.title}
            </h1>
          </div>

          <div className="flex flex-row justify-between p-5 ">
            
            <div className="flex flex-row w-4/5 gap-2">

            <div className="flex flex-col w-12">
              <img
                className="border rounded-full w-12"
                alt="user"
                src={user && user.profilePicture}
              />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold">{user && user.username}</p>
              <p className="text-sm">
                {" "}
                {new Date(post && post.createdOn).toLocaleDateString()}
              </p>
              <p className="text-sm flex flex-row items-center gap-2">
                {post && post.category} <FaDotCircle size={7} />{" "}
                {post && (post.content.length / 1000).toFixed(0)} min read
              </p>
            </div>
            </div>

            <div className="flex flex-row">
              <div className="flex flex-row justify-center items-center gap-2">
              <p className="text-md font-semibold">Save Post</p>
              {saveyourPost ? (
               <BsBookmarkHeartFill className="cursor-pointer hover:text-red-600 h-5 font-bold" onClick={()=>unsavePost(currentUser._id, post._id)} />

              ):(
                <BsBookmarkHeart className="cursor-pointer hover:text-red-600 h-5 font-bold" onClick={()=>savePost(currentUser._id, post._id)} />
              )}

              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex flex-row w-full px-0">
            <div className="h-px bg-gray-300 dark:bg-gray-600  w-full"></div>
          </div>

          <img
            src={post && post.postImage}
            alt={post && post.slug}
            className="max-h-[500px] w-full object-cover mt-10 p-3 rounded-3xl"
          />

          <div
            className="py-5 px-10 mx-auto w-full post-content"
            dangerouslySetInnerHTML={{ __html: post && post.content }}
          ></div>

          <div className="flex flex-row justify-between text-xs px-4 py-2 ">
            <div className="flex flex-row gap-1">
              {post && post.numberOfLikes > 0 && (
                <FaThumbsUp className={`text-sm pt-1 text-blue-500`} />
              )}
              <p>
                {post && post.numberOfLikes > 0 &&
                  post.numberOfLikes +
                    " " +
                    (post.numberOfLikes === 1 ? "like" : "likes")}
              </p>
            </div>

            <div className="text-xs flex flex-row items-center gap-1">
              {comments && comments.length === 0 ? (
                <p className="text-sm">No comments yet!</p>
              ) : (
                <>
                  <p>{comments && comments.length}</p>
                  <p>Comments</p>
                </>
              )}
            </div>
            
          </div>

          <div className="flex flex-row justify-between px-6 py-2 border-b border-t dark:border-gray-600  w-full">
            <div className="flex flex-row gap-1">
              <div
                className="flex flex-row gap-2 items-center cursor-pointer"
                onClick={() => handlePostLikes(post._id)}
              >
                <button
                  type="button"
                  className={`text-gray-400 hover:text-blue-500 ${
                    currentUser &&
                    post?.likes?.includes(currentUser._id) &&
                    "!text-blue-500"
                  }`}
                >
                  <FaThumbsUp className="text-md" />
                </button>
                <span className="font-sans text-sm font-semibold">Like</span>
              </div>
            </div>

            <div
              className="flex flex-row gap-2 items-center cursor-pointer"
              onClick={handleOpenComment}
            >
              <button
                type="button"
                className={`text-gray-400 hover:text-blue-500`}
              >
                <MdInsertComment className="text-md" />
              </button>
              <span className="font-sans text-sm font-semibold">Comment</span>
            </div>


            
          <div className="flex flex-row gap-2 items-center cursor-pointer">
          <button
                type='button'
                 onClick={() => setMediaOpenModal(true)}
                className={`text-gray-400 hover:text-blue-500`}
              >
          <MdShare className="text-md"/>
        </button>
        <span className="font-sans text-sm font-semibold">Share</span>
          </div>
          </div>

          {openComment && <CommentSection postId={post && post._id} />}

        </div>
    <div className="flex flex-col mt-10 ">
       
      <p className="text-lg font-semibold">More From {user.username}</p>
      <div className=" grid grid-flow-row-dense grid-cols-2 mt-10 gap-4">

       {recentPostAuthor && recentPostAuthor.map((rpost)=>(
            <RecentPostCard key={rpost} post={rpost}/>
       ))}
    

      </div>

      </div>
</div>
        
      {/* Right Section  */}
      <div className="flex flex-col w-auto p-3 md:p-0">
        <div className="flex flex-col md:sticky md:top-20">
          <div className="flex flex-col md:w-60 w-full bg-white dark:bg-transparent rounded-lg border dark:border-gray-600">
            <div className="flex flex-col w-full">
              <div className="p-2">
                <h1 className="text-md font-semibold  pt-px">
                  Recent Blog Post
                </h1>
              </div>

              {/* Divider */}
              <div className="flex flex-row w-full px-2">
                <div className="h-px bg-gray-300 w-full"></div>
              </div>

              <div className="pb-2 pr-2">
                {recentPost &&
                  recentPost.map((post) => (
                    <div
                      key={post._id}
                      className="mt-2 mb-1 ml-2 flex flex-col gap-1"
                    >
                      <Link to={`/post/${post.slug}`}>
                        <p className="text-sm font-semibold">
                          {" "}
                          {post.title}
                        </p>
                      </Link>
                      <p className="text-xs text-gray-500 flex flex-row gap-1 items-center">
                        {new Date(post.createdOn).toLocaleDateString()}{" "}
                        <FaDotCircle size={8} /> {post.numberOfLikes} likes
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <Ads />
        </div>
      </div>

      </div>

      
   {/* Modal Post Media*/}
       <Modal show={openMediaModal} onClose={() => setMediaOpenModal(false)}>
        <Modal.Header>Share post on</Modal.Header>
        <Modal.Body>
        <ShareSocial 
          title={'share on social media'} 
     url ={`https://coderxyz.com${location.pathname}`}
     socialTypes={['facebook','twitter','reddit','linkedin', 'whatsapp','telegram','email']}
     style={style}
   />
        </Modal.Body>
      </Modal>

    </main>
  );
}

// We can use inline-style
const style = {
  root: {


  },
  copyContainer: {

  },
  title: {
  
  }
};
