import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Video from "~/components/Video";
import DeviceSelector from "~/components/DeviceSelector";
import Theme from "~/components/layout/theme";

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
  const [message, setMessage] = useState<string>('');
  const [videoId, setVideoId] = useState<string>('');
  const [settings, setSettings] = useState<MediaTrackSettings>({});
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

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

      if (canvas.current) {
        const ctx = canvas.current.getContext("2d");
        const theFrame = document.createElement("img");
        theFrame.src = frame;
        ctx && ctx.drawImage(theFrame, 0, 0);
      }

      const response = await fetch("/api/analyze", options);
      const pred: Prediction = await response.json();
      console.log(pred);
      setPrediction(pred);
    })();
  };

  const handleSubmit = () => {};

  return (
    <Theme title="roshambo.ai">
      <div className="px-6 text-gray-600 bg-white py6 lg:px-8">
        <div className="grid max-w-screen-xl gap-6 mx-auto md:grid-cols-2 lg:gap-x-8">
          Welcome to roshambo.ai
        </div>
      </div>
      <div className="px-6 py-6 text-gray-600 bg-white lg:px-8">
        <div className="grid max-w-screen-xl gap-6 mx-auto md:grid-cols-2 lg:gap-x-8">
          <div className="px-6 pt-6 pb-6 bg-gray-200 rounded">
            <div>
              <DeviceSelector onSelect={setVideoId} />
            </div>
            <div>
              <Video
                device={videoId}
                onVideoSet={setSettings}
                onFrameset={setFrame}
              />
            </div>
          </div>
          <div className="px-6 pt-6 pb-6 bg-gray-200 rounded xl:pt-48">
            <div>
              <canvas
                ref={canvas}
                className="mt-3 border border-gray-500 border-solid"
                width="320"
                height="240"
              ></canvas>
            </div>

            <div>{prediction?.prediction}</div>
            <ul>
              <li>none: {prediction?.scores?.none}</li>
              <li>paper: {prediction?.scores?.paper}</li>
              <li>rock: {prediction?.scores?.rock}</li>
              <li>scissors: {prediction?.scores?.scissors}</li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <button
          className="hidden px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >Test</button>
      </div>
    </Theme>
  );
}
