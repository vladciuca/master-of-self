"use client";

import HabitCard from "./HabitCard";

const Profile = ({ name, desc, habits, handleEdit, handleDelete }) => {
  return (
    <div className="w-full">
      <h1>{name} Profile</h1>
      <p>{desc}</p>
      <div className="w-1/2">
        {habits?.map((habit) => {
          return (
            <HabitCard
              key={habit._id}
              habit={habit}
              handleEdit={() => handleEdit && handleEdit(habit)}
              handleDelete={() => handleDelete && handleDelete(habit)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
