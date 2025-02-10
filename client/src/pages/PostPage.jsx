import { Spinner, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa";
import ProfileComponent from "../components/HomeComponent/ProfileComponent";
import CommentSection from "../components/CustomComponent/CommentSection";
import { useSelector } from "react-redux";
import { FaDotCircle } from "react-icons/fa";
import axios from "axios"; // Import Axios
import { MdInsertComment, MdShare } from "react-icons/md";
import { ShareSocial } from "react-share-social";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import RecentPostCard from "../components/CustomComponent/RecentPostCard";
import FooterCom from "../components/Footer";
import JoinCommunityCard from "../components/HomeComponent/JoinCommunityCard";
import CodeHighlighter from "../components/CustomComponent/CodeHighlighter";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [recentPost, setRecentPost] = useState(null);

  const [recentPostAuthor, setRecentPostAuthor] = useState(null);
  const [user, setUser] = useState({});
  const [openComment, setOpenComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [openMediaModal, setMediaOpenModal] = useState(false);
  const [saveyourPost, setSaveYourPost] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Retrieve token stored after login

  // console.log(currentUser)
  // console.log(error)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        // Fetch post data
        const resPost = await axios.get(
          `${API_URL}/api/post/getposts?slug=${postSlug}`
        );

        const post = resPost.data.posts[0];
       // Apply the function to add the copy button
        
        setPost(post);
  

        if (!resPost.status === 200) {
          setLoading(false);
          return;
        }

        // Check if the post is saved by the current user
        if (post.usersavedpost.includes(currentUser && currentUser.rest._id)) {
          setSaveYourPost(true);
        } else {
          setSaveYourPost(false);
        }

        // Fetch recent posts by the same author
        const resAuthorPosts = await axios.get(
          `${API_URL}/api/post/getauthorposts/${post.userId}`
        );
        if (resAuthorPosts.status === 200) {
          setRecentPostAuthor(resAuthorPosts.data);
          // console.log(resAuthorPosts.data)
        }

        // Fetch user data after fetching the post
        const resUser = await axios.get(`${API_URL}/api/user/${post.userId}`);
        if (resUser.status === 200) {
          setUser(resUser.data);
          // console.log(resUser.data)
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching post or user data:", error);
      }
    };

    fetchPost();
  }, [postSlug, API_URL, currentUser]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await axios.get(`${API_URL}/api/post/getPosts?limit=5`);
        const data = res.data.posts;
        if (res.status === 200) {
          setRecentPost(data);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    try {
      const getComments = async () => {
        const res = await axios.get(
          `${API_URL}/api/comment/getPostComments/${post && post._id}`
        );
        if (res.ok) {
          const data = res.data.comments;
          setComments(data);
        }
      };
      getComments();
    } catch (error) {
      console.log(error);
    }
  }, [post && post._id]);

  const handlePostLikes = async (postId) => {
    try {
      if (!currentUser) {
        navigate("/signin");
        return;
      }

      const res = await fetch(`${API_URL}/api/post/likepost/${postId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        // console.log(data);
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

  const savePost = async (userId, postId) => {
    try {
      if (!currentUser) {
        navigate("/signin");
        return;
      }

      const res = await fetch(
        `${API_URL}/api/post/savepost/${postId}/${userId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          // body:JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setSaveYourPost(true);
      }

      if (!res.ok) {
        console.log(data.message);
        return;
      }
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  const unsavePost = async (userId, postId) => {
    try {
      if (!currentUser) {
        navigate("/signin");
        return;
      }

      const res = await fetch(
        `${API_URL}/api/post/unsavepost/${postId}/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setSaveYourPost(false);
        console.log(data);
      }
    } catch (error) {
      console.log("Something went wrong");
    }
  };


  useEffect(() => {
    const updateProfileView = async () => {
      try {
         if (!user) return;
       // Update User post impressions
        await fetch(`${API_URL}/api/user/update-impressions`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?._id }),
        });

        // Update post impressions
        await fetch(`${API_URL}/api/post/update-impressions`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?._id }),
        });
  
        console.log("Post impressions updated");
      } catch (error) {
        console.error("Error updating profile view or post impressions:", error);
      }
    };
  
    updateProfileView();
  }, [user]);
  
  
  // console.log("Found code blocks:", document.querySelectorAll("ql-syntax"));

  return (
    <div className="flex flex-col md:flex-row w-full mx-auto min-h-screen pt-20 pb-0 md:pb-5 justify-center gap-3">
      <div className="flex flex-col md:flex-row w-full min-h-screen gap-4 justify-center items-start md:px-4">
        {/* Left Section */}
        <div className="hidden md:flex flex-col w-[225px] min-h-screen gap-2">
          {currentUser ? (
              <ProfileComponent />
          ):(
              <JoinCommunityCard/>
          )}
     
        </div>

        {/* mid section */}
        <div className="flex flex-col md:w-[580px] w-full min-h-screen gap-2">
          {loading ? (
            <div className="w-full flex flex-row justify-center items-start pt-10">
              <Spinner size="xl" />
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <div className="flex flex-col  bg-white dark:bg-transparent  md:rounded-lg rounded-none border dark:border-gray-600  w-full">
                  <div className="flex w-full">
                    <h1 className="text-start font-bold text-2xl p-5 lg:text-4xl">
                      {post && post.title}
                    </h1>
                  </div>

                  <div className="flex flex-row justify-between p-5 ">
                    <div className="flex flex-row w-4/5 gap-2">
                      <div className="flex flex-col w-12 h-12">
                      <Link to={`/user/${user.username}`} rel="canonical">
                        <img
                          className="border rounded-full w-12 h-12"
                          alt="user"
                          src={user && user.profilePicture}
                          loading="lazy"
                        />
                        </Link>
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-sm font-semibold">
                        <Link to={`/user/${user.username}`} rel="canonical">
                          {user && user.username}
                          </Link>
                        </h4>
                        <p className="text-sm">
                          {" "}
                          {new Date(
                            post && post.updatedAt
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-sm flex flex-row items-center gap-2">
                          {post && post.category} <FaDotCircle size={7} />{" "}
                          {post && (post.content.length / 1000).toFixed(0)} min
                          read
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row">
                      <div className="flex flex-row justify-center items-center gap-2">
                    
                        {saveyourPost ? (
                          <>
                              <h4 className="md:text-md text-sm font-semibold">
                          Post&nbsp;Saved!
                        </h4>
                        <FaBookmark
                            className="cursor-pointer hover:text-red-600 text-sm"
                            onClick={() =>
                              unsavePost(
                                currentUser && currentUser.rest._id,
                                post._id
                              )
                            }
                          />
                          </>
                   
                        ) : (
                          <>
                          <h4 className="md:text-md text-sm font-semibold">
                          Save&nbsp;Post
                        </h4>
                        <FaRegBookmark
                            className="cursor-pointer hover:text-red-600 text-sm"
                            onClick={() =>
                              savePost(
                                currentUser && currentUser.rest._id,
                                post._id
                              )
                            }
                          />
                        </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex flex-row w-full px-0">
                    <div className="h-px bg-gray-300 dark:bg-gray-600  w-full"></div>
                  </div>

                  <div className="flex flex-col w-full lg:min-h-[300px] min-h-[200px] p-2 rounded-lg">
                    <img
                      src={post && post.postImage}
                      alt={post && post.slug}
                      className="w-full h-auto object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                  <div
                    className="py-5 px-5 mx-auto w-full post-content"
                    dangerouslySetInnerHTML={{ __html: post?.content }}
                  ></div>
                    <CodeHighlighter post={post?.content}/>

                  <div className="flex flex-row justify-between text-xs px-4 py-2 ">
                    <div className="flex flex-row gap-1">
                      {post && post.numberOfLikes > 0 && (
                        <FaThumbsUp className={`text-sm pt-1 text-blue-500`} />
                      )}
                      <p>
                        {post &&
                          post.numberOfLikes > 0 &&
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
                            post?.likes?.includes(currentUser.rest._id) &&
                            "!text-blue-500"
                          }`}
                        >
                          <FaThumbsUp
                            className={`text-md ${
                              currentUser &&
                              post?.likes?.includes(currentUser.rest._id) &&
                              "!text-blue-500"
                            }`}
                          />
                        </button>
                        <span className="font-sans text-sm font-semibold">
                          Like
                        </span>
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
                      <span className="font-sans text-sm font-semibold">
                        Comment
                      </span>
                    </div>

                    <div className="flex flex-row gap-2 items-center cursor-pointer">
                      <button
                        type="button"
                        onClick={() => setMediaOpenModal(true)}
                        className={`text-gray-400 hover:text-blue-500`}
                      >
                        <MdShare className="text-md" />
                      </button>
                      <span className="font-sans text-sm font-semibold">
                        Share
                      </span>
                    </div>
                  </div>

                  {openComment && <CommentSection postId={post && post._id} />}
                </div>
                <div className="flex flex-col md:mt-10 mt-5 gap-2">
                  <p className="text-lg font-semibold p-2">
                    More From {user.username}
                  </p>
                  <div className=" grid grid-flow-row-dense grid-cols-2 md:gap-4 gap-2 p-2">
                    {recentPostAuthor &&
                      recentPostAuthor.map((rpost) => (
                        <RecentPostCard key={rpost._id} post={rpost} />
                      ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Section  */}
        <div className="hidden md:flex flex-col w-[300px] min-h-screen gap-2">
          <div className="flex flex-col md:sticky md:top-20">
            <div className="flex flex-col w-full bg-white dark:bg-transparent md:rounded-lg rounded-none border dark:border-gray-600">
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

                <div className="flex flex-col min-h-80 gap-2 justify-center p-2">
                  {recentPost &&
                    recentPost.map((post, index) => (
                      <div key={index} className="flex flex-col gap-1 min-h-10">
                        <Link to={`/post/${post.slug}`}>
                          <p className="text-sm text-gray-800 dark:text-gray-300 font-semibold">
                            {" "}
                            {post.title}
                          </p>
                        </Link>
                        <p className="text-xs text-gray-500 flex flex-row gap-1 items-center">
                          {new Date(post.updatedAt).toLocaleDateString()}{" "}
                          <FaDotCircle size={8} /> {post.numberOfLikes} likes
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <FooterCom />

            {/* <Ads /> */}
          </div>
        </div>
      </div>

      {/* Modal Post Media*/}
      <Modal show={openMediaModal} onClose={() => setMediaOpenModal(false)}>
        <Modal.Header>Share post on</Modal.Header>
        <Modal.Body>
          <ShareSocial
            title={"share on social media"}
            url={`https://coderxyz.com/post/${postSlug}`}
            socialTypes={[
              "facebook",
              "twitter",
              "reddit",
              "linkedin",
              "whatsapp",
              "telegram",
              "email",
            ]}
            style={style}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

// We can use inline-style
const style = {
  root: {},
  copyContainer: {},
  title: {},
};
