import React from "react";
import { GiCharacter } from "react-icons/gi";

type ProfileInfoProps = {
  name: string;
  email: string;
  image: string;
};

export function ProfileInfo({ name, email, image }: ProfileInfoProps) {
  return (
    <div className="px-2">
      <div className="flex items-center gap-4 mb-4">
        {/* {image ? (
          <img
            src={image}
            alt={`${name}'s profile`}
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full flex items-center justify-center">
            <span className="text-2xl text-muted-foreground">
              {name?.charAt(0)}
            </span>
          </div>
        )} */}
        <div className="overflow-hidden avatar text-xl font-semibold bg-muted text-primary rounded-full h-14 w-14 flex justify-center items-center">
          <GiCharacter size={60} className="mt-2" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-muted-foreground">
            <span>Level</span>
            <span className="ml-1 text-2xl text-primary font-bold">10</span>
          </p>
        </div>
      </div>

      {/* Add more user details here based on your User type */}
      {/* {email && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Bio</h2>
          <p className="text-muted-foreground">{email}</p>
        </div>
      )} */}
    </div>
  );
}
