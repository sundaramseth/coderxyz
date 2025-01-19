import { useEffect, useState } from "react";
import { Modal, Button } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CiTimer } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { TfiCommentsSmiley } from "react-icons/tfi";
import { HiOutlineExclamationCircle } from "react-icons/hi";
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
        const res = await fetch(
          `${API_URL}/api/post/getPosts?userId=${currentUser.rest._id}`
        );
        const data = await res.json();
        if (res.ok) {
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
      const res = await fetch(
        `${API_URL}/api/post/getPosts?userId=${currentUser.rest._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
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
        const res = await fetch(
          `${API_URL}/api/comment/getPostComments/${userPosts._id}`
        );
        if (res.ok) {
          const data = await res.json();
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
        ? `${differenceInMinutes} minute ago`
        : `${differenceInMinutes} minutes ago`;
    }
  
    return differenceInHours === 1
      ? `${differenceInHours} hour ago`
      : `${differenceInHours} hours ago`;
  }
  
  return (
    <>
      <div className=" md:mx-auto p-3">
        {currentUser && userPosts.length > 0 ? (
          <>
            {userPosts.map((post,index) => (
                <div key={index} className="flex flex-col w-full py-1 px-2">
                  {/* post card */}
                  <div className="flex flex-col w-full">
                    <div className="flex flex-row w-full my-2 bg-white dark:bg-transparent  border dark:border-gray-600 rounded-lg gap-2">
                      <div className="md:w-1/3 w-full md:mt-0 flex flex-col md:justify-center justify-start mt-4 ml-2 items-center">
                        <Link to={`/post/${post.slug}`}>
                          <img
                            src={post.postImage}
                            className="w-40 md:h-28 h-16"
                          />
                        </Link>
                      </div>

                      <div className="w-3/4 md:w-full py-3 md:pr-3 pr-2 flex flex-col justify-between">

                        <Link to={`/post/${post.slug}`}>
                          <h1 className="text-sm md:text-2xl font-bold">
                            {post.title}
                          </h1>
                        </Link>

                        <div
                          className={`overflow-hidden text-xs md:text-sm text-ellipsis pt-2 pr-2`}
                          dangerouslySetInnerHTML={{
                            __html: post && truncateContent(post.content, 112), // Limit to 100 characters
                          }}
                        ></div>

                        <div className="flex flex-row md:gap-4 gap-3 justify-between mt-4 mb-2">
                          <div className="flex flex-row md:gap-4 gap-2 justify-between items-center">
                            <div className="md:text-sm text-xs text-gray-600 flex flex-row gap-2 items-center">
                              <CiTimer className="text-sm" />{" "}
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
                         
                              <button className="bg-transparent border rounded-full md:px-4 px-2 md:text-sm text-[11px] text-blue-600 hover:bg-gray-100 font-semibold">
                              <Link
                              className="text-teal-500"
                              to={`/update-post/${post._id}`}
                            >
                                Edit 
                                </Link>

                              </button>
                        

                            <button
                              className="bg-transparent border rounded-full md:px-4 px-2 md:text-sm text-[11px] text-red-600 hover:bg-gray-100 font-semibold"
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
                className="w-full text-teal-500 self-center text-sm py-7"
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
