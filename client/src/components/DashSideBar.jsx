import { Sidebar } from "flowbite-react";
import {HiDocumentText, HiOutlineChat, HiOutlineUserGroup,HiChartPie, HiUser, HiSave} from 'react-icons/hi'
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom";
import { PiSignOutFill } from "react-icons/pi";
import { signOutUser } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";


import { useSelector } from "react-redux"
export default function DashSideBar() {

  const API_URL = import.meta.env.VITE_API_URL;

  const {currentUser} = useSelector(state => state.user);
  const dispatch= useDispatch();
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(()=>{
      const urlParams = new URLSearchParams(location.search);
      const tabFormUrl = urlParams.get('tab');
      if(tabFormUrl){
        setTab(tabFormUrl);
      }
    }, [location.search])

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

  return (
   <Sidebar className="w-full md:w-56">
    <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">


          {currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}

            <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin? 'Admin':'User'} labelColor='dark' as='div'>
                Profile
             </Sidebar.Item>
             </Link>

             <Link to='/dashboard?tab=savedpost'>
            <Sidebar.Item active={tab === 'savedpost'} icon={HiSave} as='div'>
                Saved Posts
             </Sidebar.Item>
             </Link>

             {currentUser.isAdmin && (
             <Link to='/dashboard?tab=posts'>
             <Sidebar.Item  active={tab === 'posts'} icon={HiDocumentText} as='div'>
                Posts
             </Sidebar.Item>
             </Link>
             
             )}

             {currentUser.isAdmin && (
             <Link to='/dashboard?tab=comments'>
             <Sidebar.Item  active={tab === 'comments'} icon={HiOutlineChat} as='div'>
                Comments
             </Sidebar.Item>
             </Link>
             
             )}


           {currentUser.isAdmin && (
             <Link to='/dashboard?tab=users'>
             <Sidebar.Item  active={tab === 'users'} icon={HiOutlineUserGroup} as='div'>
                Users
             </Sidebar.Item>
             </Link>
             
             )}

             <Sidebar.Item  onClick={handleSignOut} icon={PiSignOutFill} className='cursor-pointer'>
              Sign Out
             </Sidebar.Item>
        </Sidebar.ItemGroup>
    </Sidebar.Items>
   </Sidebar>
  )
}
