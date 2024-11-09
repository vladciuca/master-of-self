// "use client";

// import { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import {
//   signIn,
//   useSession,
//   getProviders,
//   ClientSafeProvider,
// } from "next-auth/react";
// import { BottomNav } from "@components/BottomNav";
// import { Button } from "@components/ui/button";
// import Link from "next/link";

// type Providers = {
//   [key: string]: ClientSafeProvider;
// };

// export function Footer() {
//   const [providers, setProviders] = useState<Providers | null>(null);
//   const { data: session, status } = useSession();
//   const pathname = usePathname();

//   useEffect(() => {
//     const setUpProviders = async () => {
//       const response: any = await getProviders();
//       setProviders(response as Providers);
//     };

//     setUpProviders();
//   }, []);

//   const createSignInHandler = (providerId: string) => () =>
//     signIn(providerId, { callbackUrl: "/journal" });

//   if (status === "loading" || !providers) {
//     return (
//       <div className="w-full h-full flex justify-center items-center">
//         <div className="loader" />
//       </div>
//     );
//   }

//   const renderFooterComponent = () => {
//     if (pathname === "/") {
//       return (
//         <Button className="w-1/2">
//           <Link href="/sign-in">Sign in</Link>
//         </Button>
//       );
//     } else {
//       return (
//         <Button className="w-1/2" variant="secondary">
//           <Link href="/">Cancel</Link>
//         </Button>
//       );
//     }
//   };

//   return (
//     <div className="w-full h-full flex justify-center items-center">
//       {session?.user ? (
//         <BottomNav />
//       ) : (
//         // (
//         //   providers &&
//         //   Object.values(providers).map((provider: ClientSafeProvider) => (
//         //     <Button
//         //       className="w-1/2"
//         //       type="button"
//         //       key={provider.name}
//         //       onClick={createSignInHandler(provider.id)}
//         //       // onClick={() => signIn("google")}
//         //       // disabled={status === "loading"}
//         //     >
//         //       Sign In via Google
//         //     </Button>
//         //   ))
//         // )

//         renderFooterComponent()
//       )}
//     </div>
//   );
// }
"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { BottomNav } from "@components/BottomNav";
import { Button } from "@components/ui/button";
import Link from "next/link";

export function Footer() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const renderFooterComponent = () => {
    if (pathname === "/") {
      return (
        <Button className="w-1/2">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      );
    } else {
      if (status === "loading") {
        return (
          <div className="w-full h-full flex justify-center items-center">
            <div className="loader" />
          </div>
        );
      } else {
        return (
          <Button className="w-1/2" variant="secondary">
            <Link href="/">Cancel</Link>
          </Button>
        );
      }
    }
  };

  //   if (status === "loading" || !providers) {
  //     return (
  //       <div className="w-full h-full flex justify-center items-center">
  //         <div className="loader" />
  //       </div>
  //     );
  //   }

  return (
    <div className="w-full h-full flex justify-center items-center">
      {session?.user ? <BottomNav /> : renderFooterComponent()}
    </div>
  );
}
