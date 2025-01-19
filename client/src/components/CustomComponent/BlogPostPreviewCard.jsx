import { useEffect, useState, memo } from 'react';
import { Link } from "react-router-dom";
import { CiTimer } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { TfiCommentsSmiley } from "react-icons/tfi";

const BlogPostPreviewCard = memo(function BlogPostPreviewCard({ post }) {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/${post.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [post]);

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/comment/getPostComments/${post._id}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getComments();
  }, [post._id]);

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
      <div className="flex flex-col w-full">
        <div className="flex flex-row w-full bg-white dark:bg-transparent border dark:border-gray-600 rounded-none md:rounded-lg gap-1">
          <div className="w-2/6 md:mt-0 mt-5 ml-4 flex flex-col justify-start md:justify-center items-center">
            <Link to={`/post/${post.slug}`}>
              <img src={post.postImage} className=" bg-gray-300" />
            </Link>
          </div>

          <div className="w-full m-3 flex flex-col justify-between">
            <div className="text-sm text-gray-600 mt-2 mb-3 flex flex-row gap-1 items-center">
              <div className="w-7 h-7 bg-gray-300 rounded-full">
              <img
                src={user.profilePicture}
                className="h-full rounded-full bg-gray-300"
              />
              </div>
              <span className="font-semibold">{user.username}</span>
            </div>

            <Link to={`/post/${post.slug}`}>
              <h1 className="text-xl md:text-2xl font-bold">{post.title}</h1>
            </Link>

            <div
              className={`overflow-hidden text-sm text-ellipsis pt-2`}
              dangerouslySetInnerHTML={{
                __html: post && truncateContent(post.content, 112), // Limit to 100 characters
              }}
            ></div>

            <div className="flex flex-row gap-4 mt-4 mb-2">
              <div className="text-sm text-gray-600 flex flex-row gap-2 items-center">
                <CiTimer />
                <span>{calculateTimeAgo(post.updatedAt)}</span>
              </div>

              <div className="flex text-sm text-gray-600 flex flex-row gap-2 items-center">
                <FcLike />
                <span>{post.numberOfLikes}</span>
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
      </div>
  );
});

export default BlogPostPreviewCard;
