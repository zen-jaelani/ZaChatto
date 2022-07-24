import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SiApacheairflow } from "react-icons/si";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth } from "../firebaseconfig";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [user, userLoading, error] = useAuthState(auth);

  if (userLoading) {
    return (
      <div className="w-full h-screen bg-slate-800 flex items-center">
        <SiApacheairflow className="text-9xl text-pink-400 mx-auto animate-spin" />
      </div>
    );
  }

  if (!user && router.pathname == "/") {
    router.push("auth/login");
    return;
  }

  if (user && router.pathname !== "/") {
    router.push("/");
    return;
  }

  return <Component {...pageProps} />;
}

export default MyApp;
