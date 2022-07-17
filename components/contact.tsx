import { doc, DocumentData, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
      <div className="">
        <Image
          src={require("/public/vercel.svg")}
          alt="profile"
          height={"70"}
          width={"70"}
          objectFit="contain"
          className={"bg-white rounded-full"}
        />
      </div>

      <div className="col-start-2 col-end-6 mx-2 flex flex-col justify-center ">
        <div className="flex justify-between">
          <h1>{data.username}</h1>
          <p className="text-sm w-fit">
            <Moment fromNow>{last?.createdAt.toDate()}</Moment>
          </p>
        </div>
        <p className="truncate">
          {auth.currentUser?.uid === last?.from && <strong>me: </strong>}
          {last?.message}
        </p>
      </div>
    </div>
  );
}
