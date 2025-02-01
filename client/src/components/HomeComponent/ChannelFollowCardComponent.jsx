
import {  useState, useEffect } from 'react';
import axios from 'axios'; 
import { useSelector } from 'react-redux';
import UserFollowCard from '../CustomComponent/UserFollowCard';
export default function ChannelFollowCardComponent() {
     const API_URL = import.meta.env.VITE_API_URL;
    const [showMoreUser, setShowMoreUser] = useState(true);
    const [users, setAllUsers] = useState([]);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
  
        try {
          const fetchUsers = async () =>{
            const res = await axios.get(`${API_URL}/api/user/getusers?limit=6`);
            const data = res.data;
            if(res.status === 200){
               
                for(let i=0; i<data.users.length; i++ ){
                  if(currentUser){
                    if(data.users[i]._id === currentUser.rest._id){
                      const index = data.users[i];
                      data.users.splice(index, 1);
                    }
                  }
                } 
  
                setAllUsers(data.users);
                if(data.users.length <4){
                  setShowMoreUser(false);
                }
            }
        } 
        fetchUsers(); 
    }
        catch (error) {
          console.log(error);
      }
  
    }, [API_URL, currentUser]);

    
  const handleShowMore =  async () =>{
    const startIndex = users.length;
    try {
      const res = await axios.get(`${API_URL}/api/user/getusers?startIndex=${startIndex}`); 
      const data = res.data;
      if(res.status === 200){
        for(let i=0; i<data.users.length; i++ ){
          if(currentUser){
            if(data.users[i]._id === currentUser.rest._id){
              const index = data.users[i];
              data.users.splice(index, 1);
            }
          }
        } 
        setAllUsers((prev)=>[...prev, ...data.users]);
        if(data.users.length <5){
          setShowMoreUser(false);
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (

     <div className="flex flex-col w-full min-h-96 bg-white dark:bg-transparent rounded-lg border dark:border-gray-600">
      <div className="p-2">
      <h1 className="text-md font-semibold text-gray-800 dark:text-gray-300 pt-px">Follow Channel</h1>
      </div> 

      {/* Divider */}
      <div className="flex flex-row w-full px-2">
        <div className="h-px bg-gray-300 dark:bg-gray-600  w-full">
        </div>
      </div>

      <div className="flex flex-col min-h-72 gap-2 justify-center p-2">
      {
       users.map((user, index)=>(
        <div key={index} className="flex flex-col gap-2 min-h-10">
       <UserFollowCard user={user} />  
       </div>
       ))
      }

      </div>
        {showMoreUser && (
           <div className="flex flex-col w-full min-h-7">
        <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm pb-2">
        Show more
        </button>
        </div>
      )}
     </div>
  )
}
