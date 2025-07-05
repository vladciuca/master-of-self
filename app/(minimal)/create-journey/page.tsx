"use client";

import { useSession } from "next-auth/react";
import { RoadmapGenerator } from "@components/journeys/roadmap-generator/RoadmapGenerator";
import { Session } from "@models/types";

export default function CreateJourney() {
  const { data: session } = useSession() as { data: Session | null };

  return (
    <>
      <RoadmapGenerator userId={session?.user.id} />
    </>
  );
}
