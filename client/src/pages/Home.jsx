
import { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import HomeRightSection from "../components/HomeRightSection";
import BlogPostPreviewCard from "../components/CustomComponent/BlogPostPreviewCard";
import CustomCarousel from '../components/CustomComponent/CustomCarousel';
import { Spinner } from 'flowbite-react';


export default function Home() {

  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Utility to fetch posts and cache them
  const fetchPosts = async (startIndex = 0, limit = 10) => {
    const cacheKey = `posts_${startIndex}_${limit}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await axios.get(`${API_URL}/api/post/getPosts`, {
      params: { startIndex, limit },
    });

    if (response.status === 200) {
      const posts = response.data.posts;
      // Cache the fetched data
      localStorage.setItem(cacheKey, JSON.stringify(posts));
      return posts;
    }

    throw new Error("Failed to fetch posts");
  };


  useEffect(() => {
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

    loadInitialPosts();
  }, [API_URL]);

  // useEffect(() => {
  //   try {
  //     const fetchPosts = async () => {
  //       setLoading(true);
  //       const res = await fetch(`${API_URL}/api/post/getPosts?limit=10`);
  //       const data = await res.json();

  //       if(res.ok){
  //         setLoading(false);
  //       }
  //       // Sort by createdAt in descending order (newest first)
  //       setPosts( data.posts);
  //       if(data.posts.length < 10){
  //         setShowMore(false);
  //       }
  //     };
  //     fetchPosts();
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }, [API_URL]);

  
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


  // const handleShowMoreForPost =  async () =>{
  //   const startIndex = posts.length;
  //   try {
  //     const res = await fetch(`${API_URL}/api/post/getPosts?startIndex=${startIndex}?limit=5`); 
  //     const data = await res.json();
  //     if(res.ok){
  //       setPosts((prev)=>[...prev, ...data.posts]);
  //       if(data.posts.length <5){
  //         setShowMore(false);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  return (
    <>

{/* main section */}

<div className="flex flex-col w-full pt-20 pb-4 justify-center items-center">
<div className="flex flex-col w-full md:w-4/5 lg:w-3/4 xl:w-3/5 justify-center gap-4">
 

 {/* top section */}
 <div className="flex flex-row w-full">
        <div className='min-h-16 w-full'>
          {/* Reserve space for the carousel */}
          <CustomCarousel />
        </div>
 </div>

 {/* mid section */}
<div className="flex md:flex-row flex-col w-full justify-center gap-2">

 {/* left section */}
 <div className="flex flex-col w-full min-h-screen gap-2">

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
              className="transition-all duration-300 min-h-48"
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

 <div className="hidden md:flex min-w-64 min-h-screen">
 {/* Right Section  */} 
 <HomeRightSection/>
 </div>

</div>

</div>

</div>

  </>

)}
