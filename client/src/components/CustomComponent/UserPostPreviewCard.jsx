import { useEffect, useState } from "react";
import { Modal, Button } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CiTimer } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { TfiCommentsSmiley } from "react-icons/tfi";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from "axios";
export default function UserPostPreviewCard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/post/getPosts?userId=${currentUser.rest._id}`
        );
        const data = res.data;
        if (res.status === 200) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.rest.isAdmin) fetchPost();
  }, [currentUser.rest._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await axios.get(
        `${API_URL}/api/post/getPosts?userId=${currentUser.rest._id}&startIndex=${startIndex}`
      );
      const data = res.data;
      if (res.status === 200) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    try {
      const getComments = async () => {
        const res = await axios.get(
          `${API_URL}/api/comment/getPostComments/${userPosts._id}`
        );
        if (res.status === 200) {
          const data = res.data;
          setComments(data);
        }
      };
      getComments();
    } catch (error) {
      console.log(error);
    }
  }, [userPosts._id]);

  const handleDeletepost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${API_URL}/api/post/deletepost/${postIdToDelete}/${currentUser.rest._id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  function truncateContent(content, limit) {
    const strippedContent = content.replace(/<[^>]*>?/gm, ""); // Remove HTML tags
    if (strippedContent.length > limit) {
      return strippedContent.substring(0, limit) + "...";
    }
    return strippedContent;
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
  
  return (
    <>
      <div className="flex flex-col gap-2 min-h-screen w-full">
      <h1 className='md:text-3xl text-xl font-bold p-3'>
         Manage Your Posts
        </h1>
        {currentUser && userPosts.length > 0 ? (
          <>
            {userPosts.map((post,index) => (
                <div key={index} className="flex flex-col w-full">
                  {/* post card */}
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col w-full bg-white dark:bg-transparent  border dark:border-gray-600 md:rounded-lg rounded-none">
                      
                      <div className="flex flex-row w-full gap-2">
                      <div className="md:w-1/3 min-h-24 w-40 flex flex-col justify-start items-start py-3 pl-2">
                        <Link to={`/post/${post.slug}`}>
                          <img
                            src={post.postImage}
                            className="w-full min-h-24 object-cover"
                            loading="lazy" 
                          />
                        </Link>
                      </div>
                      <div className="w-3/4 md:w-full py-3 md:pr-3 pr-2 flex flex-col justify-start">

                            <Link to={`/post/${post.slug}`} className="link-container">
                              <h1 className="text-sm md:text-xl font-bold open-sans-h1">
                                {post.title}
                              </h1>
                            </Link>

                            <div
                              className={`overflow-hidden text-xs md:text-sm text-ellipsis pt-2 pr-2`}
                              dangerouslySetInnerHTML={{
                                __html: post && truncateContent(post.content, 102), // Limit to 100 characters
                              }}
                            ></div>
                            </div>
                        </div>
  
                      <div className="flex flex-row justify-between mx-2 py-3 border-t border-t-gray-200 dark:border-t-gray-600">
                          <div className="flex flex-row md:gap-4 gap-2 justify-between items-center">
                            <div className="md:text-sm text-xs text-gray-600 flex flex-row gap-2 items-center">
                              <CiTimer />
                              <span>{calculateTimeAgo(post.updatedAt)}</span>
                            </div>

                            <div className=" text-gray-600 flex flex-row md:gap-2 gap-1 items-center">
                              <FcLike className="text-sm" /> <span className="md:text-sm text-xs">{post.numberOfLikes}</span>
                            </div>

                            <div className=" text-gray-600 flex flex-row md:gap-2 gap-1 items-center">
                              {comments && comments.length === 0 ? (
                                <TfiCommentsSmiley className="text-sm" />
                              ) : (
                                <>
                                  <TfiCommentsSmiley />{" "}
                                  <span className="md:text-sm text-xs">{comments.length}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-row md:gap-3 gap-2 justify-end items-center">
                         
                              <button className="bg-transparent border rounded-full md:px-4 px-3 md:text-sm text-[11px] text-blue-600 hover:bg-gray-100 font-semibold">
                              <Link
                              className="text-teal-500"
                              to={`/update-post/${post._id}`}
                            >
                                Edit 
                                </Link>

                              </button>
                        

                            <button
                              className="bg-transparent border rounded-full md:px-4 px-3 md:text-sm text-[11px] text-red-600 hover:bg-gray-100 font-semibold"
                              onClick={() => {
                                setShowModal(true);
                                setPostIdToDelete(post._id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                    </div>
                  </div>

                  <Modal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    popup
                    size="md"
                  >
                    <Modal.Header />
                    <Modal.Body>
                      <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                          Are you sure! You want to delete this Post ?
                        </h3>
                        <div className="flex justify-center gap-4">
                          <Button color="failure" onClick={handleDeletepost}>
                            Yes, I am sure
                          </Button>
                          <Button
                            color="gray"
                            onClick={() => setShowModal(false)}
                          >
                            No, Cancel
                          </Button>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
            ))}
            {showMore && (
              <button
                onClick={handleShowMore}
                className="w-full text-teal-500 self-center text-sm py-2"
              >
                Show more
              </button>
            )}
          </>
        ) : (
          <p>You Dont have any posts yet!</p>
        )}
      </div>
    </>
  );
}
