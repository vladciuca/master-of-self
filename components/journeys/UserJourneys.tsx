import React from "react";
import { useRouter } from "next/navigation";
import { JourneysList } from "./JourneysList";
import { useUserJourneys } from "@hooks/journeys/useUserJourneys";
import { Journey } from "@models/mongodb";
import { Skeleton } from "@components/ui/skeleton";

export function UserJourneys({ onboarding }: { onboarding?: boolean }) {
  const router = useRouter();
  const { journeys, journeysLoading, journeysError } = useUserJourneys();

  const handleEdit = (journey: Journey) => {
    // router.push(`/update-journey/${journey._id}`);
  };

  const handleView = (journey: Journey) => {
    // router.push(`/journey/${journey._id}`);
  };

  // Render the loading skeletons
  const renderSkeletons = () => (
    <div className="space-y-8 mt-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={`skeleton-${i}`} className="flex items-center mb-3">
          <Skeleton className="h-8 w-8 rounded-full mr-2" />
          <div className="flex-1">
            <Skeleton className="h-8 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );

  // Check if any data is loading
  const isLoading = journeysLoading;

  // Check for any errors
  const hasError = journeysError;

  return (
    <>
      {isLoading ? (
        <div className={onboarding ? "space-y-4 mt-8 sm:mt-16" : "space-y-4"}>
          {renderSkeletons()}
        </div>
      ) : hasError ? (
        <div>
          <span>Error:</span>
          <div>
            {journeysError ||
              "There was an error loading your journeys. Please try again later."}
          </div>
        </div>
      ) : (
        <div className="w-full">
          <JourneysList
            journeyList={journeys}
            handleEdit={handleEdit}
            handleView={handleView}
            // onboarding={onboarding}
          />
        </div>
      )}
    </>
  );
}
