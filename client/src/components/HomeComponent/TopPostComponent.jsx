import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { FaDotCircle } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Spinner } from 'flowbite-react';

export default function TopPostComponent() {

  const API_URL = import.meta.env.VITE_API_URL;
  const [showMore, setShowMore] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      setLoading(true);
      const fetchPosts = async () => {
        const res = await axios.get(`${API_URL}/api/post/getPosts?limit=5`);
        const data = res.data;
        if (res.status === 200) {
          setPosts(data.posts);
          setLoading(false);
          if (data.posts.length < 5) {
            setShowMore(false);
          }
        }
      };
      fetchPosts();
    } catch (error) {
      console.log(error.message);
    }

  }, [API_URL, currentUser]);

  const handleShowMoreForPost = async () => {
    const startIndex = posts.length;
    try {
      const res = await axios.get(`${API_URL}/api/post/getPosts?startIndex=${startIndex}`);
      const data = res.data;
      if (res.status === 200) {
        setPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 5) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }


  return (
    <div className="flex flex-col w-full min-h-96 bg-white dark:bg-transparent rounded-lg border dark:border-gray-600">
      <div className="flex flex-col w-full">

        <div className="p-2">
          <h1 className="text-md font-semibold text-gray-800 dark:text-gray-300 pt-px">Top Posts</h1>
        </div>

        {/* Divider */}
        <div className="flex flex-row w-full px-2">
          <div className="h-px bg-gray-300 dark:bg-gray-600  w-full">
          </div>
        </div>

        <div className="flex flex-col min-h-80 gap-2 justify-center p-2">
          {loading ? (
            <div className="w-full flex flex-row justify-center items-start pt-10">
              <Spinner size="xl" />
            </div>
          ) : (
            <>
              {
                posts.map((post, index) => (

                  <div key={index} className="flex flex-col gap-1 min-h-10" loading="lazy">
                    <Link to={`/post/${post.slug}`} rel="canonical">
                      <p className="text-sm text-gray-800 dark:text-gray-300 font-semibold"> {post.title}</p></Link>
                    <p className="text-xs text-gray-500 flex flex-row gap-1 items-center">{new Date(post.updatedAt).toLocaleDateString()} <FaDotCircle size={8} /> {post.numberOfLikes} likes</p>
                  </div>
                ))
              }
            </>
          )}
        </div>

        {showMore && (
          <div className="flex flex-col w-full min-h-7">
            <button onClick={handleShowMoreForPost} className="w-full text-teal-500 self-center text-sm">
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
