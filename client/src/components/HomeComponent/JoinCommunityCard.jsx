import { Link } from "react-router-dom"

export default function JoinCommunityCard() {
  return (
    <div className="flex flex-col w-full bg-white dark:bg-transparent rounded-lg border dark:border-gray-600 justify-center items-start p-4">
      <h1 className="text-lg font-bold">Join Coder XYZ</h1>
      <p className="pt-2 text-sm">Post your learnings, grow network, earn credit.</p>
      <div className="flex flex-col w-full gap-2 text-center mt-4">
      <button className="text-sm text-center py-2 px-1 border rounded-md text-blue-500 border-blue-500 font-semibold"><Link to='/signup'>
      Create Account
      </Link></button>
       <div className="flex-row justify-center items-center">
       <span className="text-black">Already a member?</span> <button className="text-blue-500 font-semibold py-2"><Link to='/signin'>Sign in</Link></button>
       </div>
     
      </div>

    </div>
  )
}
