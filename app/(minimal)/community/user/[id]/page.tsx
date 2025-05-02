"use client";

import { useParams, useRouter } from "next/navigation";
import { ProfileInfo } from "@components/profile/profile-info/ProfileInfo";
import { ProfileDisciplines } from "@components/profile/profile-disciplines/ProfileDisciplines";
import { useUserData } from "@/hooks/user/useUserData";

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
      <ProfileInfo
        name={user.name || ""}
        email={user.email || ""}
        image={user.image || ""}
      />
      <ProfileDisciplines disciplines={user.profile.disciplines || {}} />
    </div>
  );
}
