import React from "react";

type ProfileInfoProps = {
  name: string;
  email: string;
  image: string;
};

export function ProfileInfo({ name, email, image }: ProfileInfoProps) {
  return (
    <div className="px-2">
      <div className="flex items-center gap-4 mb-6">
        {image ? (
          <img
            src={image}
            alt={`${name}'s profile`}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full flex items-center justify-center">
            <span className="text-2xl text-muted-foreground">
              {name?.charAt(0)}
            </span>
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-muted-foreground">{"Level 10"}</p>
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
