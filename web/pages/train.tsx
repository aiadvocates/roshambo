import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Video, VideoRef } from "~/components/Video";
import DeviceSelector from "~/components/DeviceSelector";
import Theme from "~/components/layout/theme";

interface TrainingImage {
  key: number
  image: string;
  label: string;
}

export default function Train() {
  const [videoId, setVideoId] = useState<string>("");
  const [settings, setSettings] = useState<MediaTrackSettings>({});
  const [currentLabel, setCurrentLabel] = useState<string>("none");
  const videoRef = useRef<VideoRef>(null);
  const [images, setImages] = useState<TrainingImage[]>([]);

  const gestures = ["rock", "paper", "scissors", "none"];

  const addImage = () => {
    if (videoRef.current) {
      const frame = videoRef.current?.getFrame();
      if (frame) {
        setImages([...images, { key: images.length, image: frame, label: currentLabel }]);
      }
    }
  };

  const removeImage = (key: number) => {
    setImages(images.splice(key, 1));
  }

  return (
    <Theme title="roshambo.ai | training">
      <div className="px-6 text-gray-600 bg-white py6 lg:px-8">
        <div className="grid max-w-screen-xl gap-6 mx-auto md:grid-cols-2 lg:gap-x-8">
          Welcome to roshambo.ai - training
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
                className="mt-3"
                height={320}
                width={240}
                device={videoId}
                onVideoSet={setSettings}
                ref={videoRef}
              />
            </div>
            <div>
              {gestures &&
                gestures.map((g) => (
                  <span className="px-2 py-2" key={g}>
                    <label>
                      <input
                        type="radio"
                        name="gesture"
                        value={g}
                        checked={g === currentLabel}
                        onChange={(e) => setCurrentLabel(e.target.value)}
                      />
                      {" " + g}
                    </label>
                  </span>
                ))}
            </div>
            <div className="my-6">
              <button
                onClick={addImage}
                className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              >
                Capture
              </button>
            </div>
          </div>
          <div className="px-6 pt-6 pb-6 bg-gray-200 rounded">
            {images &&
              images.map((g) => (
                <div className="px-2 py-2" key={g.key} onClick={() => removeImage(g.key)}>
                  <img src={g.image} alt={g.label} width={100} />
                  <span>Key: {g.key} Label:{g.label}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Theme>
  );
}
