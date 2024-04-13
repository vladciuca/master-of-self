// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/router";
// import { useSession } from "next-auth/react";
import { FaHandFist, FaBrain, FaHeart } from "react-icons/fa6";
import { LuTarget } from "react-icons/lu";
import Link from "next/link";

const HabitForm = ({ type, habit, setHabit, submitting, handleSubmit }) => {
  //   const router = useRouter();
  const StatInputGroup = () => {
    const stats = ["mind", "body", "spirit"];

    return (
      <div className="flex justify-center items-center w-full">
        {stats.map((stat) => (
          <div key={stat} className="flex flex-col items-center">
            <div className="mx-6 flex items-center">
              <input
                id={stat}
                type="radio"
                value={stat}
                name="stat-group"
                className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={(e) =>
                  setHabit({
                    ...habit,
                    categories: [e.target.value],
                  })
                }
                checked={habit.categories.includes(stat)}
              />
              <label
                for={stat}
                className="text-sm ml-2 flex uppercase text-gray-500 dark:text-gray-400"
              >
                {stat}
              </label>
            </div>
            <div className="mt-6 text-gray-500 dark:text-gray-400">
              {stat === "mind" && (
                <FaBrain
                  size={"2rem"}
                  className={`${
                    habit.categories.includes(stat) ? "text-pink-400" : ""
                  } `}
                />
              )}
              {stat === "body" && (
                <FaHandFist
                  size={"2rem"}
                  className={`${
                    habit.categories.includes(stat) ? "text-yellow-400" : ""
                  } `}
                />
              )}
              {stat === "spirit" && (
                <FaHeart
                  size={"2rem"}
                  className={`${
                    habit.categories.includes(stat) ? "text-red-400" : ""
                  } `}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>{type} Habit</h1>
      <form className="p-4 md:p-5 w-full max-w-lg">
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="col-span-2">
            <label
              for="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name
            </label>
            <input
              value={habit.name}
              onChange={(e) => setHabit({ ...habit, name: e.target.value })}
              type="text"
              placeholder="What habit will help you in your journey?"
              name="name"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
              required=""
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Category
            </label>
            <StatInputGroup />
          </div>
          <div className="col-span-2">
            <label
              for="description"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <textarea
              value={habit.description}
              onChange={(e) =>
                setHabit({ ...habit, description: e.target.value })
              }
              id="description"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
              placeholder="Describe how this habit will aid you in your journey. What do you want
          to achieve by using it?"
            ></textarea>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleSubmit}
            type="submit"
            className="text-white inline-flex items-center bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
          >
            <svg
              className="me-1 -ms-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            {type} Habit
          </button>
          <Link
            href="/habits"
            data-modal-hide="default-modal"
            type="button"
            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Back
          </Link>
        </div>
      </form>
    </div>
  );
};

export default HabitForm;
