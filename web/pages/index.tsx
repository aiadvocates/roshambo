import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Video from "~/components/Video";
import DeviceSelector from "~/components/DeviceSelector";

interface Scores {
  none: number;
  paper: number;
  rock: number;
  scissors: number;
}

interface Prediction {
  time: number;
  prediction: string;
  scores: Scores;
  timestamp: string;
  model_update: string;
  message: string;
}

export default function Home() {
  const [message, setMessage] = useState(null);
  const [videoId, setVideoId] = useState<string>(null);
  const [settings, setSettings] = useState<MediaTrackSettings>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    (async () => {
      //const msg = await fetch("/api/message");
      //const json: ApiResponise = await msg.json();
      setMessage("we don't need this");
    })();
  }, []);


  const setFrame = (frame: string) => {
    (async () => {
      const options: RequestInit = {
        method: "POST",
        body: JSON.stringify({ image: frame }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch("/api/predict", options);
      const pred: Prediction = await response.json();
      console.log(pred);
      setPrediction(pred);
    })();
  };
  const handleSubmit = () => {};

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
        <div className="flex-row max-w-screen-lg mx-auto mt-5 flex-nowrap">
          <div className="flex mb-12">
            <Video
              device={videoId}
              onVideoSet={setSettings}
              onFrameset={setFrame}
            />
          </div>
          <div className="flex">
            <canvas
              ref={canvas}
              className="mt-3 border border-gray-500 border-solid"
              width="320"
              height="240"
            ></canvas>
          </div>
        </div>
        <div>
          <button
            className="invisible px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          ></button>
        </div>
        <div className="text-3xl">
          <div>{prediction?.prediction}</div>
          <ul>
            <li>none: {prediction?.scores.none}</li>
            <li>paper: {prediction?.scores.paper}</li>
            <li>rock: {prediction?.scores.rock}</li>
            <li>scissors: {prediction?.scores.scissors}</li>
          </ul>
        </div>
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
