import { signOut } from "next-auth/react";
import { FaHandFist, FaBrain, FaHeart } from "react-icons/fa6";
import DarkMode from "./DarkMode";
import Image from "next/image";
import Link from "next/link";

const ProfileStats = ({ session }) => {
  return (
    <header className="mb-12">
      <div className="bg-white border-b border-gray-200 left-1/2 dark:bg-gray-700 dark:border-gray-600">
        <div
          // className="bg-white rounded-lg dark:bg-gray-800"
          id="stats"
          role="tabpanel"
          aria-labelledby="stats-tab"
        >
          <dl className="p-2 grid max-w-screen-sm grid-cols-1 gap-2 mx-auto text-gray-900 sm:grid-cols-4 xl:grid-cols-6 dark:text-white">
            <div className="flex sm:flex-col items-center justify-end md:justify-center">
              <DarkMode />
              <button onClick={signOut}>Sign Out</button>
              <Link href="/profile">
                <Image
                  width={30}
                  height={30}
                  className="rounded-full"
                  src={session?.user.image}
                  alt="Profile avatar"
                />
              </Link>
            </div>
            {/* <div className="flex sm:flex-col items-center justify-end md:justify-center">
              <img
                className="w-10 h-10 rounded-full"
                src="/docs/images/people/profile-picture-5.jpg"
                alt="Rounded avatar"
              />
            </div> */}
            <div className="flex sm:flex-col items-center justify-end md:justify-center text-pink-400">
              <dt className="mb-2 text-3xl font-extrabold">73M</dt>
              <dd className="text-gray-500 dark:text-gray-400 flex items-center justify-end ml-4">
                <FaBrain className="mr-1 text-pink-400" />
                MIND
              </dd>
            </div>
            <div className="flex sm:flex-col items-center justify-end md:justify-center text-yellow-400">
              <dt className="mb-2 text-3xl font-extrabold">100M</dt>
              <dd className="text-gray-500 dark:text-gray-400 flex items-center justify-end ml-4">
                <FaHandFist className="mr-1 text-yellow-400" />
                BODY
              </dd>
            </div>
            <div className="flex sm:flex-col items-center justify-end md:justify-center text-red-400">
              <dt className="mb-2 text-3xl font-extrabold">100K</dt>
              <dd className="text-gray-500 dark:text-gray-400  flex items-center justify-end ml-4">
                <FaHeart className="mr-1 text-red-400" />
                SPIRIT
              </dd>
            </div>
          </dl>
        </div>
      </div>
      {/* <div className="w-full pt-1 border-t border-gray-200 dark:border-gray-600">
        <div
          className="grid max-w-xs grid-cols-3 gap-1 p-1 mx-auto bg-gray-100 rounded-lg dark:bg-gray-600"
          role="group"
        >
          <button
            type="button"
            className="px-5 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700 rounded-lg"
          >
            New
          </button>
          <button
            type="button"
            className="px-5 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-gray-300 dark:text-gray-900 rounded-lg"
          >
            Popular
          </button>
          <button
            type="button"
            className="px-5 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700 rounded-lg"
          >
            Following
          </button>
        </div>
      </div> */}
    </header>
  );
};

export default ProfileStats;
