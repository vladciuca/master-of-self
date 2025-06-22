"use client";

import { useState, useEffect } from "react";
import { signIn, getProviders, ClientSafeProvider } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { GiAllSeeingEye } from "react-icons/gi";

type Providers = {
  [key: string]: ClientSafeProvider;
};

type ProviderStyles = {
  [key: string]: {
    icon: React.ReactNode;
    className: string;
    label: string;
  };
};

const providerStyles: ProviderStyles = {
  google: {
    icon: (
      <svg viewBox="0 0 24 24" className="mr-3 h-6 w-6">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
    className:
      "bg-white hover:bg-gray-50 text-black border border-gray-300 shadow-sm",
    label: "Continue with Google",
  },
  //   instagram: {
  //     icon: (
  //       <svg viewBox="0 0 24 24" className="mr-3 h-8 w-8">
  //         <defs>
  //           <radialGradient id="instagram-gradient" r="150%" cx="30%" cy="107%">
  //             <stop stopColor="#fdf497" offset="0" />
  //             <stop stopColor="#fdf497" offset="0.05" />
  //             <stop stopColor="#fd5949" offset="0.45" />
  //             <stop stopColor="#d6249f" offset="0.6" />
  //             <stop stopColor="#285AEB" offset="0.9" />
  //           </radialGradient>
  //         </defs>
  //         <path
  //           fill="url(#instagram-gradient)"
  //           d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
  //         />
  //       </svg>
  //     ),
  //     className:
  //       "bg-white hover:bg-gray-50 text-black border border-gray-300 shadow-sm",
  //     label: "Continue with Instagram",
  //   },
  github: {
    icon: (
      <svg viewBox="0 0 24 24" className="mr-3 h-6 w-6">
        <path
          fill="#24292F"
          d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
        />
      </svg>
    ),
    className:
      "bg-white hover:bg-gray-50 text-black border border-gray-300 shadow-sm",
    label: "Continue with GitHub",
  },
  //   facebook: {
  //     icon: (
  //       <svg viewBox="0 0 24 24" className="mr-3 h-6 w-6">
  //         <path
  //           fill="#1877F2"
  //           d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
  //         />
  //       </svg>
  //     ),
  //     className:
  //       "bg-white hover:bg-gray-50 text-black border border-gray-300 shadow-sm",
  //     label: "Continue with Facebook",
  //   },
  //   twitter: {
  //     icon: (
  //       <svg viewBox="0 0 24 24" className="mr-3 h-6 w-6">
  //         <path
  //           fill="#1DA1F2"
  //           d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"
  //         />
  //       </svg>
  //     ),
  //     className:
  //       "bg-white hover:bg-gray-50 text-black border border-gray-300 shadow-sm",
  //     label: "Continue with X (Twitter)",
  //   },
  //   linkedin: {
  //     icon: (
  //       <svg viewBox="0 0 24 24" className="mr-3 h-6 w-6">
  //         <path
  //           fill="#0A66C2"
  //           d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
  //         />
  //       </svg>
  //     ),
  //     className:
  //       "bg-white hover:bg-gray-50 text-black border border-gray-300 shadow-sm",
  //     label: "Continue with LinkedIn",
  //   },
};

export function ProviderSignIn() {
  const [providers, setProviders] = useState<Providers | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setUpProviders = async () => {
      try {
        const response = await getProviders();
        setProviders(response as Providers);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setUpProviders();
  }, []);

  const createSignInHandler = (providerId: string) => () =>
    signIn(providerId, { callbackUrl: "/journal" });

  return (
    <div className="w-full h-full flex flex-col justify-around p-6 space-y-4">
      <div className="w-full flex flex-col items-center justify-center">
        <GiAllSeeingEye size={200} />
      </div>
      <div>
        <div className="space-y-6">
          {Object.entries(providerStyles).map(([providerId, style]) => (
            <Button
              key={providerId}
              onClick={createSignInHandler(providerId)}
              disabled={isLoading || !providers?.[providerId]}
              variant="default"
              className={`w-full h-12 text-base font-medium justify-between items-center ${style.className}`}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                style.icon
              )}
              <span className="w-full flex justify-center">{style.label}</span>
            </Button>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          Access your account using one of the providers above.
        </p>
      </div>
    </div>
  );
}
