
import { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import { useSelector } from 'react-redux'; // Import useSelector
import ChannelFollowCardComponent from "../components/HomeComponent/ChannelFollowCardComponent";
import BlogPostPreviewCard from "../components/HomeComponent/BlogPostPreviewCard";
import { Spinner } from 'flowbite-react';
import StartPost from '../components/HomeComponent/StartPost';
import ProfileComponent from '../components/HomeComponent/ProfileComponent';
import TopPostComponent from '../components/HomeComponent/TopPostComponent';
import Footer from '../components/Footer';
import ProfileAnalyticsComponent from '../components/HomeComponent/ProfileNavigationComponent';
import JoinCommunityCard from '../components/HomeComponent/JoinCommunityCard';

export default function Home() {

  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const API_URL = import.meta.env.VITE_API_URL;

  // Utility to fetch posts and cache them
  const fetchPosts = async (startIndex = 0, limit = 10, order = -1) => {
    // alert("fetching posts")
    // const cacheKey = `posts_${startIndex}_${limit}`;
    // const cachedData = localStorage.getItem(cacheKey);

    // if (cachedData) {
    //   return JSON.parse(cachedData);
    // }

    const response = await axios.get(`${API_URL}/api/post/getPosts`, {
      params: { startIndex, limit, order },
    });

    if (response.status === 200) {
      const posts = response.data.posts;
      // Cache the fetched data
      // localStorage.setItem(cacheKey, JSON.stringify(posts));
      return posts;
    }

    throw new Error("Failed to fetch posts");
  };



    const loadInitialPosts = async () => {
      setLoading(true);
      try {
        const initialPosts = await fetchPosts(0, 10);
        setPosts(initialPosts);

        if (initialPosts.length < 10) {
          setShowMore(false);
        }
      } catch (error) {
        console.error("Error fetching initial posts:", error);
      } finally {
        setLoading(false);
      }
    };


useEffect(() => {
  loadInitialPosts();
  }, []);




  const handleShowMoreForPost = async () => {
    const startIndex = posts.length;

    try {
      const morePosts = await fetchPosts(startIndex, 5);
      setPosts((prev) => [...prev, ...morePosts]);

      if (morePosts.length < 5) {
        setShowMore(false);
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    }
  };


  return (
    <>

{/* main section */}

<div className="flex flex-col w-full pt-20 pb-4 justify-center items-center">
<div className="flex flex-col w-full justify-center items-center gap-4 px-4">

 {/* top mid section */}
<div className="flex md:flex-row flex-col w-full justify-center md:items-start items-center gap-4">
{/* Left Section */}
<div className="hidden md:flex flex-col w-[225px] min-h-screen gap-2">

{currentUser ? (
  <>
    <ProfileComponent/>
    <ProfileAnalyticsComponent/>
  </>
):(
  <JoinCommunityCard/>
)}
</div>

 {/* mid section */}
 <div className="flex flex-col md:w-[580px] w-full min-h-screen">
  {/* First Section - Start Post */}
  <div className="flex flex-row w-full justify-center">
    {currentUser && (
  <StartPost onPostCreated={loadInitialPosts}/>
    )}
  </div>
  {/* Second Section - Blog Post Preview */}
  <div className="flex flex-col w-full justify-center items-center gap-2 mt-2">
    {loading ?
      (
      <div className="flex justify-center items-start pt-10 min-h-screen">
          <Spinner size="xl" />
      </div>
      ):(
        <>
          {posts && posts.length > 0 ? (
            <>
            {posts.map((post) => (
            <div
              key={post._id}
              className="transition-all duration-300 min-h-48 w-full hover:shadow-md rounded-lg"
            >
            <BlogPostPreviewCard post={post} />
            </div>
           ))}
            </>
          ): (
            <p className="text-center text-gray-500">No posts available</p>
          )}
        </>
      )
   }

{showMore && (
  <div className="flex flex-col w-full min-h-5">
  <button onClick={handleShowMoreForPost} className=" text-teal-500 self-center text-sm p-2">
      Show more
  </button>
  </div>
  )}
 </div>
 </div>

 {/* Right Section  */} 
 <div className="hidden md:flex flex-col w-[300px] min-h-screen gap-2 sticky top-20">
 <TopPostComponent/>
 <ChannelFollowCardComponent/>
 <Footer/>
 </div>

</div>

</div>

</div>

  </>

)}
