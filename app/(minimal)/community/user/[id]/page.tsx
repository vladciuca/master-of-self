"use client";

import { useParams } from "next/navigation";
import { UserProfileOverview } from "@components/profile/UserProfileOverview";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  return <UserProfileOverview userId={userId} notCurrentUser={true} />;
}
