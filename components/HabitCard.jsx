"use client";

// import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
// import { FaHandFist, FaBrain, FaHeart } from "react-icons/fa6";
import { LuTarget } from "react-icons/lu";

const HabitCard = ({ habit, handleEdit, handleDelete }) => {
  const { name, description, categories } = habit;
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  return (
    <div className="block mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <h5 className="mb-1 flex items-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <LuTarget className="mr-2" />
        {name}
      </h5>
      {categories?.map((cat) => {
        if (cat === "mind")
          return (
            <span className="bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-pink-400 border border-pink-400">
              {cat}
            </span>
          );
        if (cat === "body")
          return (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
              {cat}
            </span>
          );
        if (cat === "spirit")
          return (
            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
              {cat}
            </span>
          );
      })}
      <p className="mt-6 font-normal text-gray-700 dark:text-gray-400">
        {description}
      </p>
      {session?.user.id === habit.creator._id && pathName === "/profile" && (
        <div>
          <p onClick={handleEdit} className="font-inter text-sm">
            Edit
          </p>
          <p onClick={handleDelete} className="font-inter text-sm">
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default HabitCard;
