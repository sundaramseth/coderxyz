import { Link } from "react-router-dom";
import { CiTimer } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { TfiCommentsSmiley } from "react-icons/tfi";

import { useEffect, useState, memo } from "react";

const RecentPostCard = memo(function RecentPostCard({ post }) {
  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    try {
      const getUser = async () => {
        const res = await fetch(`${API_URL}/api/user/${post.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      };
      getUser();
    } catch (error) {
      console.log(error.message);
    }
  }, [post]);

  useEffect(() => {
    try {
      const getComments = async () => {
        const res = await fetch(
          `${API_URL}/api/comment/getPostComments/${post._id}`
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
    <div className="flex flex-col w-full bg-white dark:bg-[rgb(16,23,42)] rounded gap-1 justify-between">
      <div className="flex-1 justify-center items-center w-full h-28 md:h-48 p-2">
        <Link to={`/post/${post.slug}`}>
          <img
            src={post.postImage}
            alt="post cover"
            className="md:min-h-48 h-28 w-full object-cover rounded-md" loading="lazy" 
          />
        </Link>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <div className="text-sm text-gray-600 flex flex-row gap-1 items-center ">
          <img
            src={user.profilePicture}
            className="md:w-7 md:h-7 w-5 h-5 rounded-full bg-gray-300" loading="lazy" 
          />{" "}
          <span className="font-semibold text-xs md:text-sm">
            {user.username}{" "}
          </span>
        </div>

        <Link to={`/post/${post.slug}`}>
          {" "}
          <h2 className="text-sm md:text-lg font-bold line-clamp-2">
            {post.title}
          </h2>
        </Link>
        <Link to={`/post/${post.slug}`}>
          <div
            className={`overflow-hidden text-sm text-ellipsis md:pt-2 pt-0`}
            dangerouslySetInnerHTML={{
              __html: post && truncateContent(post.content, 80), // Limit to 100 characters
            }}
          ></div>
        </Link>

        <div className="flex flex-row md:gap-4 gap-2 mt-4 mb-2 items-center">
          <div className="text-sm text-gray-600 flex flex-row  md:gap-2 gap-1 items-center">
            <CiTimer className="pt-[2px] md:text-sm text-xs" />{" "}
            <span>{calculateTimeAgo(post.updatedAt)}</span>
          </div>

          <div className="text-sm text-gray-600 flex flex-row  md:gap-2 gap-1 items-center">
            <FcLike className="md:text-sm text-xs" />{" "}
            <span className="text-xs md:text-sm">{post.numberOfLikes}</span>
          </div>

          <div className="text-gray-600 flex flex-row md:gap-2 gap-1 items-center">
            {comments && comments.length === 0 ? (
              <>
                <TfiCommentsSmiley className="pt-[2px] md:text-sm text-xs" />{" "}
                <span className="text-xs md:text-sm">0</span>
              </>
            ) : (
              <>
                <TfiCommentsSmiley className="pt-[2px] md:text-sm text-xs" />{" "}
                <span className="text-xs md:text-sm">{comments.length}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default RecentPostCard;
