import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProfileComponent() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="flex flex-col w-full bg-white rounded-lg border justify-center dark:bg-transparent dark:border-gray-600">
      {/* Profile Section */}
      <div className="flex flex-col">
        <img
          className="w-full max-h-24 rounded-tr-lg rounded-tl-lg"
          alt="background"
          src={currentUser?.rest.profileBgPicture}
        />
        <Link to="/dashboard?tab=profile">
          <img
            className="border rounded-full w-14 relative bottom-6 left-3"
            alt="user"
            src={currentUser?.rest.profilePicture}
          />
        </Link>
      </div>

      <div className="p-4 pt-0">
        <h1 className="text-lg font-semibold">{currentUser?.rest.channelName}</h1>
        <p className="text-sm text-gray-800 dark:text-gray-300 pt-1">{currentUser?.rest.about}</p>
        <p className="text-gray-500 dark:text-gray-300 text-xs pt-1 pb-2">
          {currentUser?.rest.location}
        </p>
      </div>

      <div className="flex flex-row w-full px-2">
            <div className="h-px bg-gray-300 dark:bg-gray-300 w-full"></div>
          </div>

      <div className="p-4">
            <p className="text-xs text-gray-800 dark:text-gray-300 font-bold pt-px flex justify-between">
              Profile Viwers <span className="text-xs font-semibold">{currentUser?.rest.views}</span>
            </p>
            <p className="text-xs text-gray-800 dark:text-gray-300 font-bold pt-2 flex justify-between">
              Post Impression <span className="text-xs font-semibold">{currentUser?.rest.postImpressions}</span>
            </p>
          </div>

    </div>
  );
}
