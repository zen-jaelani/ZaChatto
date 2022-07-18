import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { auth, db, storage } from "../firebaseconfig";
import { GiExitDoor, GiPhotoCamera } from "react-icons/gi";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import * as firebase from "firebase/app";
import {
  arrayUnion,
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Contact from "./contact";

export default function SideBar({
  setChat,
}: {
  setChat: Dispatch<SetStateAction<DocumentData>>;
}) {
  const router = useRouter();
  const [img, setImg] = useState<File | null | undefined>(null);
  const [showModal, setShowModal] = useState(false);
  const [snapshot, loading] = useCollection(collection(db, "users"));
  const allUsers = snapshot?.docs
    .map((doc) => doc.data())
    .filter((data) => data.uid !== auth.currentUser?.uid);

  const [data] = useDocumentData(doc(db, "users", auth.currentUser?.uid || ""));
  const contacts = allUsers?.filter((v) => data?.contacts.includes(v.uid));

  useEffect(() => {
    async function changeImage() {
      try {
        if (img && auth.currentUser?.uid) {
          console.log("change image start....");
          const imgRef = ref(
            storage,
            `profile/${new Date().toISOString()}_${img?.name}`
          );
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, "users", auth.currentUser?.uid), {
            image: url,
            imagePath: snap.ref.fullPath,
          });
          setImg(null);
          if (data?.imagePath) await deleteObject(ref(storage, data.imagePath));
          console.log("change image done!");
        }
      } catch (error) {
        setImg(null);
        console.log(error);
      }
    }
    changeImage();
  }, [img]);

  return (
    <div className="bg-pink-400 text-white h-screen w-full md:w-1/3 lg:w-1/5 p-5 pr-0 relative">
      <div className="relative h-44 -ml-5 -mt-5 ">
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
          {/* <label className="relative block mt-10">
            <span className="sr-only">Search</span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <MdSearch color="white" size={25} />
            </span>
            <input
              className="placeholder:italic placeholder:text-pink-400 block bg-slate-800 text-black w-full rounded-md py-3 pl-10 pr-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              placeholder="Search for anything..."
              type="text"
              name="search"
            />
          </label> */}

          <button
            className="bg-slate-800 text-pink-400 w-full p-3 my-5 rounded-md"
            onClick={() => setShowModal(true)}
          >
            Add new contact
          </button>
        </div>

        {contacts?.length ? (
          contacts?.map((v) => {
            return (
              <div key={v.uid} onClick={() => setChat(v)}>
                <Contact data={v} />
              </div>
            );
          })
        ) : (
          <div className="text-white text-2xl text-center py-10 w-full">
            No Contact
          </div>
        )}
      </div>

      <div
        className="bg-pink-500 flex max-w-full px-15 fixed bottom-0 p-5 -ml-5 "
        style={{ width: "inherit" }}
      >
        <label htmlFor="imageInput">
          <div className={`w-16 h-16 relative ${img ? "animate-spin" : ""}`}>
            {data?.image ? (
              <Image
                src={data.image}
                alt="profile"
                layout="fill"
                objectFit="cover"
                className={"rounded-full"}
              />
            ) : (
              <div className="bg-slate-800 w-full h-full text-3xl rounded-full flex flex-col justify-center items-center">
                {data?.username?.split?.(" ")[0].slice(0, 1)}
              </div>
            )}
            <div className="opacity-0 bg-slate-800 rounded-full hover:opacity-100 duration-300 absolute inset-0 z-10 flex justify-center items-center text-white font-semibold">
              <GiPhotoCamera size={35} />
            </div>
          </div>
        </label>

        <input
          type="file"
          name="image"
          id="imageInput"
          className="hidden"
          accept="image/*"
          onChange={(e) => setImg(e.target.files?.[0])}
        />

        <div className="flex items-center justify-between w-full">
          <div className="ml-3 flex flex-col justify-center">
            <h1>{data?.username}</h1>
            <p className="">{data?.email}</p>
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
      {showModal ? (
        <Modal
          closeModal={setShowModal}
          users={allUsers?.filter((v) => !contacts?.includes(v))}
        />
      ) : (
        ""
      )}
    </div>
  );
}

function Modal({
  closeModal,
  users,
}: {
  closeModal: Dispatch<SetStateAction<boolean>>;
  users: DocumentData[] | undefined;
}) {
  async function addContact(data: string) {
    try {
      const uid = auth.currentUser?.uid;
      if (uid) {
        console.log("add contact start...");
        console.log(uid, data);
        await updateDoc(doc(db, "users", uid), {
          contacts: arrayUnion(data),
        });

        await updateDoc(doc(db, "users", data), {
          contacts: arrayUnion(uid),
        });
        console.log("add contact finish!");
      }
    } catch (error) {
      alert(error);
    }
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-2xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-800 outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-pink-400 rounded-t">
              <h3 className="text-3xl font-semibold">Add to contact</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => closeModal(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            <div className="relative p-6 flex-auto overflow-y-auto">
              {users?.length ? (
                users.map((v) => (
                  <div className="flex max-w-full my-3" key={v.uid}>
                    <div className={`w-16 h-16 relative`}>
                      {v?.image ? (
                        <Image
                          src={v.image}
                          alt="profile"
                          layout="fill"
                          objectFit="cover"
                          className={"rounded-full"}
                        />
                      ) : (
                        <div className="bg-pink-400 w-full h-full text-3xl rounded-full flex flex-col justify-center items-center">
                          {v?.username?.split?.(" ")[0].slice(0, 1)}
                        </div>
                      )}
                      <div className="opacity-0 bg-slate-800 rounded-full hover:opacity-100 duration-300 absolute inset-0 z-10 flex justify-center items-center text-white font-semibold">
                        <GiPhotoCamera size={35} />
                      </div>
                    </div>

                    <div className="flex mx-2 flex-auto flex-col justify-center">
                      <h1>{v.username}</h1>
                      <p className="truncate">{v.email}</p>
                    </div>

                    <button
                      className="bg-pink-400 w-20 h-10 mt-5 rounded-md"
                      onClick={() => addContact(v.uid)}
                    >
                      Add
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-pink-400 text-2xl text-center py-10 w-full">
                  No Contact Available
                </div>
              )}
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-pink-400 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => closeModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
