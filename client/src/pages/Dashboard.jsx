import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import DashProfile from "../components/UserDashboard/DashProfile.jsx"
import DashUsers from "../components/AdminDashboard/DashUsers.jsx";
import DashComments from "../components/AdminDashboard/DashComments.jsx";
import DashboardComp from "../components/UserDashboard/DashboardComp.jsx";
import SavedPosts from "../components/UserDashboard/SavedPosts.jsx";
import DashPosts from "../components/UserDashboard/DashPosts.jsx";
import DashSetting from "../components/UserDashboard/DashSetting.jsx";


export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');

  
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get('tab');

    if(tabFormUrl){
      setTab(tabFormUrl);
    }

  }, [location.search])
  return (
    <div className="min-h-screen flex flex-col md:flex-row py-20">

      {/* Profile */}
      {tab === 'profile' && <DashProfile/>} 

       {/* Posts */}
       {tab === 'posts' && <DashPosts/>}

      {/* Save Posts */}
      {tab === 'savedpost' && <SavedPosts/>}

       {/* Users */}
       {tab === 'users' && <DashUsers/>}

      {/* Comments */}
      {tab === 'comments' && <DashComments/>}

      {/* Dashboard */}
      {tab === 'dash' && <DashboardComp/>}

        {/* Dashboard */}
        {tab === 'settings' && <DashSetting/>}

    </div>
  )
}
