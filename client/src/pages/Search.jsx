
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BlogPostPreviewCard from '../components/CustomComponent/BlogPostPreviewCard';
import { Badge } from "flowbite-react";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  console.log(sidebarData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);


  const location = useLocation();

  const navigate = useNavigate();

  var category = ["uncategorized","LifeStyle", "Programming", "Science", "Technology", "News", "Jobs", "Informative", "Entertainment", "Products", "Maths"];

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);



  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };


  const searchByTag = (e) =>{
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', e);
    urlParams.set('sort', null);
    urlParams.set('category', e);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    console.log(e)
  }




  return (
    <div className="flex flex-col w-full pt-20 justify-center items-center">
   <div className="flex flex-col md:flex-row w-full md:w-3/5 justify-center gap-4">
    
    {/* search result left section */}
      <div className='w-full'>
        <h1 className='text-3xl font-semibold p-3 mt-5 '>
         Result for {sidebarData.searchTerm}
        </h1>
        <div className='p-3 flex flex-wrap gap-0'>
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <BlogPostPreviewCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>

      {/* right section */}

    <div className="w-auto">
    <div className="w-full justify-center md:mt-2 md:sticky md:top-20">
    <div className="flex flex-col md:w-60 bg-white dark:bg-transparent md:m-0 m-5 mt-2 rounded-lg border dark:border-gray-600 ">
    <div className="flex flex-col w-full">
      
      <div className="p-2">
      <h1 className="text-md font-semibold pt-px">Search by Tag</h1>
      </div> 

      {/* Divider */}
      <div className="flex flex-row w-full px-2">
        <div className="h-px bg-gray-300 dark:bg-gray-600  w-full">
        </div>
      </div>

      <div className="p-2 flex flex-row flex-wrap">

      
       {category && category.map((value) => (
        <>
        <Badge  key={value} color="gray" value={value} className='p-1 m-1 cursor-pointer' onClick={()=>searchByTag(value.toLowerCase())}>
        {value}
       </Badge>
       </> 
        ))}
      
      </div>
     </div>
     </div>

     </div>




    </div>

    </div>
    </div>
  );
}