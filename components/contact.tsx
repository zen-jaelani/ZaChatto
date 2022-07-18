import { doc, DocumentData, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import Moment from "react-moment";
import { auth, db } from "../firebaseconfig";

type Props = {
  data: DocumentData;
};

export default function Contact({ data }: Props) {
  const [last, setLast] = useState<DocumentData | undefined>();

  useEffect(() => {
    if (!auth.currentUser?.uid) return;
    const user1 = auth.currentUser.uid;
    const user2 = data.uid;
    const id = user1 > user2 ? `${user1}<>${user2}` : `${user2}<>${user1}`;
    onSnapshot(doc(db, "lastMsg", id), (doc) => setLast(doc.data()));
  }, []);

  return (
    <div className="grid grid-cols-4 cursor-pointer pl-5 pr-2 py-3 -ml-5 hover:bg-pink-500">
      <div className="relative flex  items-center ">
        {data?.image ? (
          <Image
            src={data.image}
            alt="profile"
            height={"64"}
            width={"64"}
            objectFit="cover"
            className={"rounded-full"}
          />
        ) : (
          <div className="bg-slate-800 w-16 h-16 text-3xl rounded-full flex flex-col justify-center items-center">
            {data?.username?.split?.(" ")[0].slice(0, 1)}
          </div>
        )}
      </div>

      <div className="col-start-2 col-end-5 -ml-5 md:ml-0 mx-2 flex flex-col justify-center ">
        <div className="flex justify-between">
          <h1>{data.username}</h1>
          <p className="text-sm w-fit">
            {last?.createdAt && (
              <Moment fromNow>{last?.createdAt.toDate()}</Moment>
            )}
          </p>
        </div>
        <p className="truncate flex">
          {auth.currentUser?.uid === last?.from && <strong>me: </strong>}
          {!last?.message && last?.media && (
            <div className="flex">
              <IoImageOutline color="white" size={25} className="" />
              Image
            </div>
          )}
          {last?.message}
        </p>
      </div>
    </div>
  );
}
