import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { IoImageOutline } from "react-icons/io5";
import { GiBigGear, GiCommercialAirplane } from "react-icons/gi";
import { SiApacheairflow } from "react-icons/si";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebaseconfig";
import SideBar from "../components/sidebar";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import {
  KeyboardEvent,
  MouseEvent,
  MutableRefObject,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Moment from "react-moment";

const Home: NextPage = () => {
  const router = useRouter();
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<null | HTMLInputElement>(null);
  const [activeUser, setActiveUser] = useState<DocumentData | null>(null);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<DocumentData[]>([]);
  const [imgInput, setImgInput] = useState<File | null | undefined>(null);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-slate-800 flex items-center">
        <SiApacheairflow className="text-9xl text-pink-400 mx-auto animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("auth/login");
  }

  const setChat = (data: DocumentData) => {
    try {
      console.log("get chat data start.....");
      setActiveUser(data);
      if (!user?.uid) return;
      const user1 = user?.uid;
      const user2 = data?.uid;
      const id = user1 > user2 ? `${user1}<>${user2}` : `${user2}<>${user1}`;
      const msgRef = collection(db, "messages", id, "chat");
      const q = query(msgRef, orderBy("createdAt", "asc"));
      onSnapshot(q, (querSnapshot) => {
        let msgs: DocumentData[] = [];
        querSnapshot.forEach((doc) => {
          msgs.push(doc.data());
        });
        setConversation(msgs);
      });
      console.log("get chat data finish");
    } catch (error) {
      console.log(error);
    }
  };
  console.log(conversation);

  const handleSubmit = async (e: KeyboardEvent | MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (auth.currentUser?.uid && (message || imgInput)) {
      console.log("send message start....");

      let url: string | undefined;
      if (imgInput) {
        const imgRef = ref(
          storage,
          `images/${new Date().getTime()} - ${imgInput.name}`
        );
        const snap = await uploadBytes(imgRef, imgInput);
        const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
        url = dlUrl;
      }
      const user1 = auth.currentUser?.uid;
      const user2 = activeUser?.uid;
      const id = user1 > user2 ? `${user1}<>${user2}` : `${user2}<>${user1}`;
      await addDoc(collection(db, "messages", id, "chat"), {
        message: message || null,
        from: user1,
        to: user2,
        createdAt: Timestamp.fromDate(new Date()),
        media: url || null,
      });

      await setDoc(doc(db, "lastMsg", id), {
        message: message || null,
        from: user1,
        to: user2,
        createdAt: Timestamp.fromDate(new Date()),
        media: url || null,
        unread: true,
      });

      setMessage("");
      setImgInput(null);
      let fileRef: HTMLInputElement | null = fileInputRef.current;
      if (fileRef) fileRef.value = "";
      console.log("send message finish!");
    }
  };

  return (
    <div className="flex">
      <SideBar setChat={setChat} />

      <main className="bg-zinc-900 max-h-screen hidden overflow-hidden  md:flex md:w-2/3 lg:w-4/5 relative">
        {activeUser ? (
          <>
            <div
              className="text-white border-b border-pink-400 flex fixed top-0 p-5 bg-zinc-900 z-50"
              style={{ width: "inherit" }}
            >
              <div className={`w-16 h-14 relative `}>
                {activeUser?.image ? (
                  <Image
                    src={activeUser.image}
                    alt="profile"
                    layout="fill"
                    objectFit="cover"
                    className={"rounded-full"}
                  />
                ) : (
                  <div className="bg-pink-400 w-full h-full text-3xl rounded-full flex flex-col justify-center items-center">
                    {activeUser?.username?.split?.(" ")[0].slice(0, 1)}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="ml-3 flex flex-col justify-center">
                  <h1>{activeUser.username}</h1>
                  <p className="">{activeUser.email}</p>
                </div>
              </div>
            </div>

            <div className="py-24 px-5 overflow-auto w-full">
              {conversation.length ? (
                conversation.map((msg, i) => {
                  return (
                    <div
                      key={i}
                      className={`relative flex flex-col ${
                        msg.from === user?.uid ? "items-end " : ""
                      }`}
                      ref={scrollRef}
                    >
                      <div
                        className={`w-fit h-fit py-2 px-5 flex flex-col mt-3 break-words  ${
                          msg.from === user?.uid
                            ? "bg-pink-400 mr-3 rounded-l-lg rounded-t-lg text-white"
                            : "bg-white rounded-r-lg rounded-t-lg ml-3"
                        } `}
                        style={{ maxWidth: "50%" }}
                      >
                        {msg.media ? (
                          <div className="my-2">
                            <Image
                              src={msg.media}
                              width={100}
                              height={100}
                              objectFit="cover"
                              alt=""
                              className="rounded-lg "
                            />
                          </div>
                        ) : null}
                        {msg.message}
                      </div>
                      <small className="text-white mx-3">
                        <Moment trim fromNow>
                          {msg.createdAt.toDate()}
                        </Moment>
                      </small>
                    </div>
                  );
                })
              ) : (
                <div className="text-pink-400 text-2xl text-center pt-10 w-full">
                  Say Hi!
                </div>
              )}
            </div>

            <div
              className="border-t border-pink-400 flex bg-zinc-900 max-w-full px-15 fixed bottom-0 py-4 px-7"
              style={{ width: "inherit" }}
            >
              <label htmlFor="imageMessage">
                <IoImageOutline color="white" size={40} className="mr-5 mt-3" />
              </label>
              <input
                type="file"
                ref={fileInputRef}
                id="imageMessage"
                className="hidden"
                accept="image/*"
                onChange={(e) => setImgInput(e.target.files?.[0])}
              />
              <input
                type="text"
                className="rounded-lg p-3 w-full"
                value={message}
                placeholder={`Message ${activeUser.username}`}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => (e.key === "Enter" ? handleSubmit(e) : null)}
              />

              <GiCommercialAirplane
                color="white"
                size={35}
                className="my-3 mx-8 cursor-pointer"
                onClick={(e) => handleSubmit(e)}
              />
            </div>
          </>
        ) : (
          <div className="text-pink-400 text-2xl text-center pt-10 w-full">
            Select a user to start conversation
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
