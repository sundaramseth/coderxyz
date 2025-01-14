
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import UserPostPreviewCard from "../CustomComponent/UserPostPreviewCard";
export default function DashPosts() {

    const {currentUser} = useSelector((state)=> state.user)


    return (
      <div className="flex flex-col w-full items-center">
      <div className="flex md:flex-row w-full md:w-3/5 flex-col-reverse justify-center gap-4">
       
       <UserPostPreviewCard/>
    
      {/* right section */}

      <div className="w-auto">
    <div className="w-full justify-center md:mt-2 md:sticky md:top-20">
    <div className="flex flex-col md:w-60 bg-white dark:bg-transparent md:m-0 m-5 mt-2 rounded-lg border dark:border-gray-600 ">
    <div className="flex flex-col w-full rounded-lg ">
      <div className="flex flex-col">
      <img 
      className="w-full max-h-24 rounded-tr-lg rounded-tl-lg" 
        alt='background'
        src="https://t4.ftcdn.net/jpg/05/49/86/39/360_F_549863991_6yPKI08MG7JiZX83tMHlhDtd6XLFAMce.jpg"
        />
      <Link to='/dashboard?tab=profile'>
      <img 
    className="border rounded-full w-14 relative bottom-6 left-3"
      alt='user'
      src={currentUser.rest?.profilePicture}
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


