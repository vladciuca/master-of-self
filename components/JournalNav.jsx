import Link from "next/link";
import { LuTarget, LuAtom } from "react-icons/lu";
import { FaSun, FaMoon } from "react-icons/fa6";

const JournalNav = () => {
  return (
    <nav className="fixed bottom-0 z-50 w-full -translate-x-1/2 bg-white border-t border-gray-200 left-1/2 dark:bg-gray-700 dark:border-gray-600">
      {/* <div className="w-full">
        <div
          className="grid max-w-xs grid-cols-3 gap-1 p-1 mx-auto my-2 bg-gray-100 rounded-lg dark:bg-gray-600"
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
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
        <Link
          href="/powers"
          data-tooltip-target="tooltip-home"
          type="button"
          className="inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <LuAtom
            size={"2rem"}
            className="text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-500"
          />
          <span className="sr-only">Powers</span>
        </Link>
        <div
          id="tooltip-home"
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          Powers
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <Link
          href="/"
          data-tooltip-target="tooltip-bookmark"
          type="button"
          className="inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <FaMoon size={"2rem"} className="text-gray-500 dark:text-gray-400" />
          <span className="sr-only">Daily Log</span>
        </Link>
        <div
          id="tooltip-bookmark"
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          Daily Log
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <Link
          href="/habits"
          data-tooltip-target="tooltip-post"
          type="button"
          className="inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <LuTarget
            size={"2rem"}
            className="text-gray-500 dark:text-gray-400 group-hover:text-teal-400 dark:group-hover:text-teal-300"
          />
          <span className="sr-only">Habits</span>
        </Link>
        <div
          id="tooltip-post"
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          Habits
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>

        <div
          id="tooltip-settings"
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          Settings
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>
    </nav>
  );
};

export default JournalNav;
