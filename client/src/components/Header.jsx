
import { Avatar, Button, Dropdown  } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {toggleTheme} from '../redux/theme/themeSlice';
import { signOutUser } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import { MdArticle, MdBookmark, MdDarkMode, MdLightMode, MdPerson, MdQueryStats, MdSettings, MdOutlineSearch  } from "react-icons/md";


export default function Header() {

  const API_URL = import.meta.env.VITE_API_URL;


  // const path = useLocation().pathname;
  const dispatch= useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const {currentUser} = useSelector(state => state.user);
  const {theme} = useSelector(state => state.theme);
  const [searchTerm, setSearchTerm] = useState('');

  // console.log(currentUser)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () =>{
    try{
      const res = await fetch(`${API_URL}/api/user/signout`,{
        method:'POST',
      });

      const data = await res.json();

      if(!res.ok){
        console.log(data.message)
      }else{
          dispatch(signOutUser());
      }
    }catch(error){
      console.log(error);
    }
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-row border-b-1 w-full fixed z-10 justify-center bg-white dark:bg-[rgb(16,23,42)]">

      <div className="flex flex-row w-full md:w-4/5 lg:w-3/4 xl:w-3/5 justify-center items-center py-3 md:px-0 md:mx-0 mx-2">
    
      <div className="flex w-1/4 justify-start items-start">
       <Link to='/' 
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold">
       <img src="https://firebasestorage.googleapis.com/v0/b/adhyatma-ce6a3.appspot.com/o/1735566563733_coderxyz.png?alt=media&token=aa59cda9-b542-469f-9a36-9c73c87502e2" className="w-36"  />
        </Link>
      </div>

      <div className="flex w-1/4 md:w-1/2 justify-center">
      <div className="search w-72">
      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={MdOutlineSearch}
          className='hidden md:inline-block'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

        <div className="md:hidden pl-1">
        <Link to='/searchpage'>
        <Button
        className="w-12 h-9"
        color='gray'
        pill
        ><MdOutlineSearch />
        </Button>
          </Link>

        </div>
      </div>
      </div>
  
        <div className="flex w-1/2 md:w-1/4 justify-end items-center gap-3">

        {currentUser && (
        <Link to={'/create-post'}>
         <Button size={"sm"} 
         color="gray"
         pill
         >
          Create Post
         </Button>
         </Link>
         )
        }
         {currentUser ? (
          <Dropdown 
          arrowIcon={false}
          inline
          label={
            <Avatar 
            alt='user'
            img={currentUser.rest.profilePicture}
            rounded
            loading="lazy" 
            />
          }
          >
            <Dropdown.Header>
              <span className='block text-sm font-semibold'>@{currentUser.rest.username}</span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
             <Dropdown.Item icon={MdPerson}>
              Profile
             </Dropdown.Item>
            </Link>
            <Link to={'/dashboard?tab=savedpost'}>
             <Dropdown.Item icon={MdBookmark}>
              Library
             </Dropdown.Item>
            </Link>
            <Link to={'/dashboard?tab=posts'}>
             <Dropdown.Item icon={MdArticle}>
              Posts
             </Dropdown.Item>
            </Link>
            <Link to={'/dashboard?tab=dash'}>
             <Dropdown.Item icon={MdQueryStats}>
              Stats
             </Dropdown.Item>
            </Link>
            <Dropdown.Item icon={theme === 'light' ? MdDarkMode : MdLightMode} onClick={()=>dispatch(toggleTheme())}>
              <div>Theme {theme === 'light' ? "Dark": "Light" }</div>
            </Dropdown.Item>
            <Link to={'/dashboard?tab=settings'}>
             <Dropdown.Item icon={MdSettings}>
              Settings
             </Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            
          <Dropdown.Item  onClick={handleSignOut} className="flex flex-col items-start">
           <span className="block text-sm">Sign Out</span>
          <span className="block truncate text-xs ">{currentUser.rest.email}</span>
          </Dropdown.Item>

          </Dropdown>

          ):(
        <>
      <div className="flex flex-row gap-1 pr-1">
 
      <Button
        color='0094FF'
         size="sm"
        > 
        <Link to='/signup'>
        Join Now 
        </Link>
        </Button>

        <Button
        pill
        color="blue" 
        size="sm"
        >
        <Link to='/signin' className="">
        Sign In        </Link>
        </Button>

        </div>

        </>
         )
         }
        </div>
      </div>
</div>

  )
}


