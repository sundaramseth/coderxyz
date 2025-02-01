
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import UserPostPreviewCard from "../CustomComponent/UserPostPreviewCard";
export default function DashPosts() {

    const {currentUser} = useSelector((state)=> state.user)


    return (
      <div className="flex flex-col w-full items-center">
      <div className="flex md:flex-row w-full md:w-4/5 lg:w-3/4 flex-col-reverse justify-center gap-4">
       
       <UserPostPreviewCard/>
    
      {/* right section */}

      <div className="w-auto md:block hidden">
    <div className="w-full justify-center md:mt-2 md:sticky md:top-20">
    <div className="flex flex-col md:w-60 bg-white dark:bg-transparent mt-2 md:rounded-lg rounded-none border dark:border-gray-600 ">
    <div className="flex flex-col w-full md:rounded-lg rouded-none">
      <div className="flex flex-col">
      <img 
      className="w-full max-h-24 md:rounded-tr-lg md:rounded-tl-lg rouded-none" 
        alt='background'
        src={currentUser.rest?.profileBgPicture}
        loading="lazy" 
        />
      <Link to='/dashboard?tab=profile'>
      <img 
    className="border rounded-full w-14 relative bottom-6 left-3"
      alt='user'
      src={currentUser.rest?.profilePicture}
      loading="lazy" 
      /></Link>
      </div>

      <div className="pl-2">
      <h1 className="text-lg font-semibold">{currentUser.rest.username}</h1>
      <p className="text-sm text-gray-800 dark:text-gray-300 pt-px">{currentUser.rest.about}</p>
      <p className="text-gray-500 text-xs pt-px pb-2">
      {currentUser.rest.location}
      </p>
      </div>

     </div>
     </div>

     </div>




    </div>

    </div>
    </div>
  )
}


