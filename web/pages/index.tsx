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
      //const msg = await fetch("/api/message");
      //const json: ApiResponise = await msg.json();
      setMessage("we don't need this");
    })();
  }, []);

  const setFrame = (frame: ImageData) => {
    (async () => {
      const options: RequestInit = {
        method: 'POST',
        body: JSON.stringify({ 
          "data": frame.data,
          "width": frame.width,
          "height": frame.height
        }),
        headers: {
            'Content-Type': 'application/json'
        }
      }
      const response = await fetch("/api/predict", options)
      console.log(response);
    })();
  }

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
        </div>
        <div className="mt-5">
          <Video device={videoId} onVideoSet={setSettings} onFrameset={setFrame} />
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
