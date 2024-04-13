"use client";

import Link from "next/link";
import Image from "next/image";
import ProfileStats from "@components/ProfileStats";
import { useState, useEffect } from "react";
import { signIn, useSession, getProviders } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    };

    setUpProviders();
  }, []);

  return (
    <div className="sticky top-0 w-full z-50">
      {session?.user ? (
        <ProfileStats session={session} />
      ) : (
        <>
          <nav className="bg-primary text-white py-3 px-20">
            <div className="mx-auto">
              <div className="flex justify-between">
                <Link href="/">
                  <div className="flex items-center">
                    <Image
                      src={"/mos_icon.png"}
                      width={50}
                      height={50}
                      className={"mr-4"}
                      alt="maybe mention icon site"
                    />
                    <h1 className="font-bold uppercase text-xl tracking-wide">
                      <span className="text-2xl">M</span>aster of{" "}
                      <span className="text-2xl">S</span>elf
                    </h1>
                  </div>
                </Link>
                <ul className="flex justify-end items-center font-bold tracking-wide space-x-2">
                  {/* <li className="ml-2">
                    <Link href="/">
                      <button className="btn btn-ghost text-white">
                        Sign up
                      </button>
                    </Link>
                  </li> */}
                  <li>
                    {providers &&
                      Object.values(providers).map((provider) => (
                        <button
                          className="btn text-white"
                          type="button"
                          key={provider.name}
                          onClick={() => signIn(provider.id)}
                        >
                          Sign in
                        </button>
                      ))}
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  );
};

export default Header;
