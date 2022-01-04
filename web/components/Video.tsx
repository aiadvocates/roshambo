import { useEffect, useRef } from "react";

interface Props {
  device: string;
  onVideoSet(settings: MediaTrackSettings): void;
  onFrameset(frame: string): void;
}

export const Video = ({ device, onVideoSet, onFrameset }: Props) => {
  const video = useRef<HTMLVideoElement>(null);

  const handleSubmit = () => {
    if (video.current) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 320, 240);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video.current, 0, 0, 320, 240);
        onFrameset(canvas.toDataURL());
      }
    }
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      (async () => {
        try {
          let stream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: {
                exact: device,
              },
            },
          });
          const tracks = stream.getVideoTracks();
          if (video && tracks.length >= 1) {
            onVideoSet(tracks[0].getSettings());
            video.current.srcObject = stream;
            video.current.play();
          }
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [device]);

  return (
    <>
      <button
        className="hidden px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Submit
      </button>
      <video
        onClick={handleSubmit}
        className="mt-3"
        ref={video}
        width="320"
        height="240"
        autoPlay={true}
      ></video>
    </>
  );
};

export default Video;
