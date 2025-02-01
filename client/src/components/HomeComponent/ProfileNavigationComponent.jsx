import { FcLike } from "react-icons/fc";
import { FaBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function ProfileNavigationComponent() {
  return (
    <div className="flex flex-row w-full justify-start items-center">
      <div className="flex flex-col w-full bg-white rounded-lg border">
        <div className="flex flex-col w-full">

          <div className="mt-4 ml-4 flex flex-row gap-1 items-center">
            <Link to={'/dashboard?tab=savedpost'} className="flex flex-row gap-1 items-center">
            <FaBookmark />
            <p className="text-xs text-gray-800 font-semibold"> Saved Post</p>
            </Link>
          </div>
          <div className="my-4 ml-4 flex flex-row gap-1 items-center">
            <FcLike />
            <p className="text-gray-800 text-xs font-semibold">Liked Post</p>
          </div>
        </div>
      </div>
    </div>
  );
}
