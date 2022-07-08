import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { MdSearch } from "react-icons/md";
import { auth } from "../firebaseconfig";
import { GiExitDoor } from "react-icons/gi";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";

type Props = {};

export default function SideBar({}: Props) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  return (
    <div className="bg-pink-400 text-white h-screen w-full md:w-1/3 lg:w-1/5 p-5 pr-0 relative">
      <div className="relative h-48 -ml-5 -mt-5 ">
        <Image
          src={"/ZaLogo.svg"}
          layout="fill"
          alt="ZaChatto"
          objectFit="contain"
          className=""
        />
      </div>

      <div className="mt-5">
        <div className="pr-5">
          <h1 className="font-bold text-2xl">Messages</h1>
          <label className="relative block my-10">
            <span className="sr-only">Search</span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <MdSearch color="black" size={25} />
            </span>
            <input
              className="placeholder:italic placeholder:text-slate-400 block bg-white text-black w-full rounded-md py-2 pl-9 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              placeholder="Search for anything..."
              type="text"
              name="search"
            />
          </label>
        </div>

        <div className="flex max-w-full">
          <Image
            src={require("/public/vercel.svg")}
            alt="profile"
            height={"70"}
            width={"70"}
            objectFit="contain"
            className={"bg-white rounded-full flex-none"}
          />

          <div className="flex-initial w-2/3 mx-2 flex flex-col justify-center">
            <h1>Nano nano</h1>
            <p className="truncate">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
          <p className="text-sm mt-2">Dec 10</p>
        </div>
      </div>

      <div
        className="bg-pink-500 flex max-w-full px-15 fixed bottom-0 p-5 -ml-5 "
        style={{ width: "inherit" }}
      >
        <div>
          <Image
            src={require("/public/vercel.svg")}
            alt="profile"
            height={"70"}
            width={"70"}
            objectFit="contain"
            className={"bg-white rounded-full"}
          />
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="ml-3 flex flex-col justify-center">
            <h1>{user?.displayName}</h1>
            <p className="">{user?.email}</p>
          </div>
          <GiExitDoor
            size={35}
            className="-mr-0 cursor-pointer"
            onClick={() =>
              signOut(auth).then(() => router.replace("/auth/login"))
            }
          />
        </div>
      </div>
    </div>
  );
}
