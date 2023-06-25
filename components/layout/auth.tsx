import Head from "next/head";
import Link from "next/link";
import React from "react";

type Props = {
  children?: JSX.Element | JSX.Element[];
  title: string;
};

export default function Auth({ children, title }: Props) {
  return (
    <div className="flex bg-slate-800 h-screen">
      <Head>
        <title>ZaChatto</title>
        <link rel="icon" href="/ZaLogo.svg" />
      </Head>

      <div className="bg-slate-900 h-full md:h-fit w-full md:w-1/2 m-auto text-white py-5 rounded-md">
        <h1 className="text-center text-3xl font-bold mb-5">{title}</h1>
        <hr className="border-pink-400 border-b-2" />

        {children}

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t-2 border-pink-400"></div>
          <span className="flex-shrink mx-4 mb-1 text-white text-2xl">or</span>
          <div className="flex-grow border-t-2 border-pink-400"></div>
        </div>
        <div className="text-center my-3">
          {title === "Login" ? (
            <p>
              Need an account?{" "}
              <Link href={"/auth/register"}>
                <span className="text-pink-400 cursor-pointer">Register</span>
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link href={"/auth/login"}>
                <span className="text-pink-400 cursor-pointer">Login</span>
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
