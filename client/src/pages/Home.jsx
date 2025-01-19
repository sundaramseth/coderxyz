
import { useEffect, useState } from 'react';
import HomeRightSection from "../components/HomeRightSection";
import BlogPostPreviewCard from "../components/CustomComponent/BlogPostPreviewCard";
import CustomCarousel from '../components/CustomComponent/CustomCarousel';
import { Spinner } from 'flowbite-react';

export default function Home() {

  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/post/getPosts?limit=10`);
        const data = await res.json();

        if(res.ok){
          setLoading(false);
        }
        // Sort by createdAt in descending order (newest first)
        setPosts( data.posts);
        if(data.posts.length < 10){
          setShowMore(false);
        }
      };
      fetchPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, [API_URL]);


  const handleShowMoreForPost =  async () =>{
    const startIndex = posts.length;
    try {
      const res = await fetch(`${API_URL}/api/post/getPosts?startIndex=${startIndex}?limit=5`); 
      const data = await res.json();
      if(res.ok){
        setPosts((prev)=>[...prev, ...data.posts]);
        if(data.posts.length <5){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>

{/* main section */}

<div className="flex flex-col w-full pt-20 pb-4 justify-center items-center">
<div className="flex flex-col w-full md:w-3/4 lg:w-3/5 justify-center gap-5">
 

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
  <button onClick={handleShowMoreForPost} className="w-full text-teal-500 self-center text-sm pb-2">
      Show more
  </button>
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
