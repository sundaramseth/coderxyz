
import { Avatar, Button, Dropdown, Navbar,  } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TextInput } from "flowbite-react";
import { AiOutlineSearch, AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import { HiViewGrid } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {toggleTheme} from '../redux/theme/themeSlice';
import { PiSignOutFill } from "react-icons/pi";
import { signOutUser } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import { MdArticle, MdBookmark, MdPerson, MdQueryStats } from "react-icons/md";


export default function Header() {

  const API_URL = import.meta.env.VITE_API_URL;


  // const path = useLocation().pathname;
  const dispatch= useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const {currentUser} = useSelector(state => state.user);
  const {theme} = useSelector(state => state.theme);
  const [searchTerm, setSearchTerm] = useState('');

  console.log(currentUser)

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
    <Navbar className="border-b-1 w-full fixed z-10">
      <div className="flex flex-row w-full justify-center items-center">
      <div className="flex flex-row w-full md:w-3/4 justify-center items-center">
    
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
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

        <div className="sm:hidden pl-1">
        <Link to='/searchpage'>
        <Button
        className="w-12 h-9"
        color='gray'
        pill
        ><AiOutlineSearch />
        </Button>
          </Link>

        </div>
      </div>
      </div>
  
        <div className="flex w-1/2 md:w-1/4 justify-end items-center gap-2 md:order-2">

        {currentUser && (
         <Button className="w-12 h-9" 
         color="gray"
         pill
         onClick={()=>dispatch(toggleTheme())}
         >
          {theme === 'light' ? <AiOutlineSun/>:  <AiOutlineMoon /> }
         </Button>
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
            <Dropdown.Divider />
            
          <Dropdown.Item  onClick={handleSignOut} className="flex flex-col items-start">
           <span className="block text-sm">Sign Out</span>
          <span className="block truncate text-xs ">{currentUser.rest.email}</span>
          </Dropdown.Item>

          </Dropdown>

          ):(
        <>
      <Link to='/signup' className="">
      <Button
        color='0094FF'
         size="sm"
        >
        Join Now
        </Button>
      </Link>
        <Link to='/signin' className="">
        <Button
        pill
        color="blue" 
        size="sm"
        >
        Sign In
        </Button>
        </Link>
        </>
         )
         }
        </div>
      </div>
</div>
    </Navbar>

  )
}


