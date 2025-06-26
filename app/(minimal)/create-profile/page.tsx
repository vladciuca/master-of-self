"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, User, Target, Calendar } from "lucide-react";
import { useUserProfile } from "@context/UserProfileContext";
import { Session } from "@models/types";

export default function CreateProfilePage() {
  const { data: session } = useSession() as { data: Session | null };
  const { userProfile } = useUserProfile();
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompleteOnboarding = async () => {
    if (!session?.user?.id) {
      setError("No user session found");
      return;
    }

    setIsCompleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${session.user.id}/onboarding`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: true }),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Force a page refresh to update the user profile context
        window.location.href = "/journal";
      } else {
        console.error("Failed to complete onboarding:", responseData);
        setError(responseData.error || "Failed to complete onboarding");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setError("Network error occurred");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
    //   <Card className="w-full max-w-2xl">
    //     <CardHeader className="text-center">
    //       <div className="mx-auto mb-4 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
    //         <User className="w-8 h-8 text-indigo-600" />
    //       </div>
    //       <CardTitle className="text-3xl font-bold text-gray-900">
    //         Welcome to Master of Self!
    //       </CardTitle>
    //       <CardDescription className="text-lg text-gray-600">
    //         Let's set up your profile to get you started on your journey
    //       </CardDescription>
    //     </CardHeader>

    //     <CardContent className="space-y-6">
    //       <div className="grid gap-4">
    //         <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
    //           <CheckCircle className="w-6 h-6 text-green-600" />
    //           <div>
    //             <h3 className="font-semibold text-green-900">
    //               Account Created
    //             </h3>
    //             <p className="text-sm text-green-700">
    //               Your account has been successfully set up
    //             </p>
    //           </div>
    //         </div>

    //         <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
    //           <Target className="w-6 h-6 text-blue-600" />
    //           <div>
    //             <h3 className="font-semibold text-blue-900">
    //               Initial Settings Applied
    //             </h3>
    //             <p className="text-sm text-blue-700">
    //               Willpower multiplier: {userProfile?.willpowerMultiplier}x
    //             </p>
    //           </div>
    //         </div>

    //         <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
    //           <Calendar className="w-6 h-6 text-purple-600" />
    //           <div>
    //             <h3 className="font-semibold text-purple-900">
    //               Journal Times Set
    //             </h3>
    //             <p className="text-sm text-purple-700">
    //               Morning: {userProfile?.journalStartTime?.morning} | Evening:{" "}
    //               {userProfile?.journalStartTime?.evening}
    //             </p>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="bg-gray-50 p-6 rounded-lg">
    //         <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
    //         <ul className="space-y-2 text-sm text-gray-700">
    //           <li className="flex items-center space-x-2">
    //             <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
    //             <span>Start your daily journaling practice</span>
    //           </li>
    //           <li className="flex items-center space-x-2">
    //             <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
    //             <span>Track your disciplines and build habits</span>
    //           </li>
    //           <li className="flex items-center space-x-2">
    //             <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
    //             <span>Monitor your progress over time</span>
    //           </li>
    //         </ul>
    //       </div>

    //       {error && (
    //         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    //           <p className="text-red-700 text-sm">{error}</p>
    //         </div>
    //       )}

    //       <Button
    //         onClick={handleCompleteOnboarding}
    //         disabled={isCompleting}
    //         className="w-full h-12 text-lg font-semibold"
    //         size="lg"
    //       >
    //         {isCompleting ? "Completing..." : "Complete Setup"}
    //       </Button>
    //     </CardContent>
    //   </Card>
    // </div>
    <div className="h-full flex items-center">
      <CardHeader className="text-center space-y-20">
        <CardTitle className="text-3xl font-bold">
          Welcome to Master of Self!
        </CardTitle>
        <CardDescription className="text-lg">
          Let's set up your profile to get you started on your journey!
        </CardDescription>
      </CardHeader>
    </div>
  );
}
