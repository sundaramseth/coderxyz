
import { Avatar, Button, Dropdown, Navbar,  } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TextInput } from "flowbite-react";
import { AiOutlineSearch, AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {toggleTheme} from '../redux/theme/themeSlice';
import { PiSignOutFill } from "react-icons/pi";
import { signOutUser } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

export default function Header() {

  const API_URL = import.meta.env.VITE_API_URL;


  // const path = useLocation().pathname;
  const dispatch= useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const {currentUser} = useSelector(state => state.user);
  const {theme} = useSelector(state => state.theme);
  const [searchTerm, setSearchTerm] = useState('');


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
    
      <div className="flex w-1/4 justify-start items-start gap-2">
       <Link to='/' 
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold">
        Coder XYZ
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

        <div className="sm:hidden">
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
            img={currentUser.profilePicture}
            rounded
            />
          }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
             <Dropdown.Item>
              Profile
             </Dropdown.Item>
            </Link>
            <Link to={'/dashboard?tab=savedpost'}>
             <Dropdown.Item>
              Library
             </Dropdown.Item>
            </Link>
            <Dropdown.Divider />
             <Dropdown.Item onClick={handleSignOut}>
              <PiSignOutFill className="font-bold"/><span className="ml-2">Sign Out</span>
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


