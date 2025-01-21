import {  useLocation, useNavigate } from "react-router-dom";
import { TextInput } from "flowbite-react";
import { MdOutlineSearch } from "react-icons/md";

import { useEffect, useState } from "react";

export default function SearchPage() {

  // const path = useLocation().pathname;

  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);


  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (

      <div className="flex flex-col w-full pt-20 px-4 justify-start items-start min-h-96">
      <div className="flex flex-col search w-full">
      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={MdOutlineSearch}
          className='inline w-full'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      </div>
      
      <div className="flex flex-col">
      <h1 className="pt-5 text-lg font-semibold">Recent Searches</h1>

      <p className="text-sm pt-4">You have no recent searches</p>
      </div>
      </div>

  )
}


