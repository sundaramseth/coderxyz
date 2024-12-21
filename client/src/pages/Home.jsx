
import { useEffect, useState } from 'react';
import HomeRightSection from "../components/HomeRightSection";
import BlogPostPreviewCard from "../components/CustomComponent/BlogPostPreviewCard";
import CustomCarousel from '../components/CustomComponent/CustomCarousel';

export default function Home() {

  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);


  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const res = await fetch(`/api/post/getPosts?limit=10`);
        const data = await res.json();
        // Sort by createdAt in descending order (newest first)
        setPosts( data.posts.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn)));
        if(data.posts.length < 10){
          setShowMore(false);
        }
      };
      fetchPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);


  const handleShowMoreForPost =  async () =>{
    const startIndex = posts.length;
    try {
      const res = await fetch(`/api/post/getPosts?startIndex=${startIndex}`); 
      const data = await res.json();
      if(res.ok){
        setPosts((prev)=>[...prev, ...data.posts]);
        if(data.posts.length <10){
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

<div className="flex flex-col w-full pt-20 justify-center items-center">
<div className="flex flex-col w-full md:w-3/5 justify-center gap-5">
 

 {/* top section */}
 <div className="flex flex-row w-full">
 <CustomCarousel />
 </div>

 {/* mid section */}
<div className="flex md:flex-row flex-col w-full justify-center">

 {/* left section */}
 <div className="flex flex-col w-full p-2">
  
 {posts && posts.length > 0 && (
  <>
    {posts.map((post) => (
          <BlogPostPreviewCard key={post._id} post={post} />
        ))}
      </>
    )}

{showMore && (
  <button onClick={handleShowMoreForPost} className="w-full text-teal-500 self-center text-sm pb-2">
      Show more
  </button>
  )}
 </div>

 <div className="hidden md:block">
 {/* Right Section  */} 
 <HomeRightSection/>
 </div>

</div>

</div>

</div>

  </>

)}
