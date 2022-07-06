import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { MdSearch } from "react-icons/md";
import { GiBigGear, GiCommercialAirplane } from "react-icons/gi";

const Home: NextPage = () => {
  return (
    <div className="flex">
      <div className="bg-pink-400 text-white h-screen w-full md:w-1/3 lg:w-1/5 p-5 pr-0 relative">
        <div className="relative h-48 -ml-5 -mt-5 ">
          <Image
            src={"/ZaLogo.png"}
            layout="fill"
            alt="ZaChatto"
            objectFit="contain"
            className=""
          />
        </div>
        {/* <h1 className="text-3xl font-bold subpixel-antialiased logo ">
          ザChatto
        </h1> */}

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
          className="bg-pink-500 flex max-w-full px-15 fixed bottom-0 p-5 -ml-5"
          style={{ width: "inherit" }}
        >
          <Image
            src={require("/public/vercel.svg")}
            alt="profile"
            height={"70"}
            width={"70"}
            objectFit="contain"
            className={"bg-white rounded-full flex-none"}
          />

          <div className="flex items-center justify-between w-full">
            <div className="ml-3 flex flex-col justify-center">
              <h1>Nano mano</h1>
              <p className="">nano@mano.com</p>
            </div>
            <GiBigGear size={35} className="-ml-0" />
          </div>
        </div>
      </div>

      <main className="bg-zinc-900 h-screen md:w-2/3 lg:w-4/5 relative">
        <div
          className="text-white border-b border-pink-400 flex fixed top-0 p-5"
          style={{ width: "inherit" }}
        >
          <Image
            src={require("/public/vercel.svg")}
            alt="profile"
            height={"70"}
            width={"70"}
            objectFit="contain"
            className={"bg-white rounded-full flex-none"}
          />

          <div className="flex items-center justify-between w-full">
            <div className="ml-3 flex flex-col justify-center">
              <h1>Nano mano</h1>
              <p className="">nano@mano.com</p>
            </div>
          </div>
        </div>

        <div
          className="border-t border-pink-400 flex  max-w-full px-15 fixed bottom-0 py-4 px-7"
          style={{ width: "inherit" }}
        >
          <input type="text" className="rounded-lg p-3 w-full" />

          <GiCommercialAirplane color="white" size={35} className="my-3 mx-8" />
        </div>
      </main>
    </div>
  );
};

export default Home;
