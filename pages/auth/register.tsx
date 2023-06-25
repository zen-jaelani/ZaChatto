import {
  createUserWithEmailAndPassword,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { GiSpinningBlades } from "react-icons/gi";
import Layout from "../../components/layout/auth";
import { auth, db } from "../../firebaseconfig";
import { setDoc, doc, Timestamp } from "firebase/firestore";

type Props = {};

export default function Login({}: Props) {
  type form = {
    username: string;
    email: string;
    password: string;
  };
  const router = useRouter();
  const [form, setForm] = useState<form>({} as form);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  console.log(form);
  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result: UserCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        username: form.username,
        email: form.email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });

      setIsLoading(false);
      router.push("/");
    } catch (error) {
      setIsLoading(false);
      alert(error);
    }
  }
  return (
    <Layout title="Register">
      <form className="px-5 my-10" onSubmit={(e) => handleRegister(e)}>
        <input
          type="text"
          className="bg-slate-900 border-b-2 border-pink-400 w-full text-white mb-10 p-3"
          placeholder="Username"
          name="username"
          onChange={(e) => handleChange(e)}
          autoComplete="off"
          autoFocus
          required
        />

        <input
          type="email"
          className="bg-slate-900 border-b-2 border-pink-400 w-full text-white mb-10 p-3"
          placeholder="Email"
          autoComplete="off"
          name="email"
          onChange={(e) => handleChange(e)}
          required
        />
        <input
          type="password"
          className="bg-slate-900 border-b-2 border-pink-400 w-full text-white mb-10 p-3"
          placeholder="Password"
          name="password"
          onChange={(e) => handleChange(e)}
          autoComplete="off"
          required
        />
        <button className="w-full bg-pink-400 p-4 rounded-xl">
          {isLoading ? (
            <GiSpinningBlades className="animate-spin mx-auto" size={30} />
          ) : (
            "Register"
          )}
        </button>
      </form>
    </Layout>
  );
}
