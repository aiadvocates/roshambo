import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Video from "~/components/Video";
import DeviceSelector from "~/components/DeviceSelector";

interface ApiResponise {
  message: string;
}

export default function Home() {
  const [message, setMessage] = useState(null);
  const [videoId, setVideoId] = useState<string>(null);
  const [settings, setSettings] = useState<MediaTrackSettings>(null);

  useEffect(() => {
    (async () => {
      const msg = await fetch("/api/message");
      const json: ApiResponise = await msg.json();
      setMessage(json.message);
    })();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center flex-1 w-full px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="https://nextjs.org">
            roshambo.ai
          </a>
        </h1>

        <div className="mt-3 text-2xl">
          <div>
            <DeviceSelector onSelect={setVideoId} />
          </div>
          <div className="mt-2">
            <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
              FREEZE
            </button>
          </div>
        </div>
        <div className="mt-5">
          <Video device={videoId} onVideoSet={setSettings} />
        </div>
        <div className="text-3xl">{message}</div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://github.com/aiadvocates/roshambo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by US - #AIShow FL (For Lyfe)
        </a>
      </footer>
    </div>
  );
}
