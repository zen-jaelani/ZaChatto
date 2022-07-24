import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { GiSpinningBlades } from "react-icons/gi";
import Layout from "../../components/layout/auth";
import { auth } from "../../firebaseconfig";

type Props = {};

export default function Login({}: Props) {
  const router = useRouter();
  type form = {
    email: string;
    password: string;
  };

  const [form, setForm] = useState<form>({} as form);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    signInWithEmailAndPassword(auth, form.email, form.password)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        alert(errorCode);
      });

    setIsLoading(false);
  }
  return (
    <Layout title="Login">
      <form className="px-5 my-10" onSubmit={(e) => handleLogin(e)}>
        <input
          type="email"
          className="bg-slate-800 border-b-2 border-pink-400 w-full text-white mb-10 p-3"
          placeholder="Email"
          name="email"
          onChange={(e) => handleChange(e)}
          autoFocus
          required
        />
        <input
          type="password"
          className="bg-slate-800 border-b-2 border-pink-400 w-full text-white mb-10 p-3"
          placeholder="Password"
          name="password"
          onChange={(e) => handleChange(e)}
          autoFocus
          required
        />
        <button className="w-full bg-pink-400 p-4 rounded-xl">
          {isLoading ? (
            <GiSpinningBlades className="animate-spin mx-auto" size={30} />
          ) : (
            "Login"
          )}
        </button>
      </form>
    </Layout>
  );
}
