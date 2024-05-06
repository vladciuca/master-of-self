"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaHandFist, FaBrain, FaHeart } from "react-icons/fa6";

const Profile = ({ session }) => {
  const { email, name } = session.user;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/user?email=${email}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [email]);

  // Display loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle the user data
  const mindScore = user?.stats?.mind || 0;
  const bodyScore = user?.stats?.body || 0;
  const spiritScore = user?.stats?.spirit || 0;

  // Create user initials for the avatar
  const nameInitials = name
    .split(" ")
    .map((word) => word[0])
    .join("");

  return (
    <div className="flex items-center h-full">
      <div className="w-1/4 flex justify-center">
        <Link href="/settings">
          {/* <Image
            className="avatar rounded-full"
            src={user.image}
            width={52}
            height={52}
            alt="Picture of the author"
          /> */}
          <div className="avatar text-xl font-semibold bg-primary text-primary-foreground rounded-full h-12 w-12 flex justify-center items-center">
            {nameInitials}
          </div>
        </Link>
      </div>
      <div className="flex grow">
        <div className="grid w-full grid-cols-3 px-2">
          <div className="flex items-center">
            <FaBrain className="mr-2" size={"1.4rem"} />
            <span className="text-3xl uppercase font-bold">{mindScore}</span>
          </div>
          <div className="flex items-center">
            <FaHandFist className="mr-2" size={"1.4rem"} />
            <span className="text-3xl uppercase font-bold">{bodyScore}</span>
          </div>
          <div className="flex items-center">
            <FaHeart className="mr-2" size={"1.4rem"} />
            <span className="text-3xl uppercase font-bold">{spiritScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
