// app/(minimal)/community/user/[id]/page.tsx
"use client";

import { useUserData } from "@/hooks/user/useUserData";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { ProfileDisciplines } from "@components/profile/profile-disciplines/ProfileDisciplines";

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { user, loading, error } = useUserData(userId);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading user profile...</div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 font-semibold text-xl">Error: {error}</div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Handle case where user is not found
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-xl">User not found</div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-8 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        ← Back to Community
      </button>

      <div className="px-2">
        <div className="flex items-center gap-4 mb-6">
          {user.image ? (
            <img
              src={user.image}
              alt={`${user.name}'s profile`}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center">
              <span className="text-2xl text-muted-foreground">
                {user.name?.charAt(0)}
              </span>
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Add more user details here based on your User type */}
        {user.email && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Bio</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        )}

        {/* You can add more sections here as needed */}
      </div>
      <ProfileDisciplines userId={userId} />
    </div>
  );
}
