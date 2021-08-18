import { useEffect, useRef } from "react";

interface Props {
  device: string;
  onVideoSet(settings: MediaTrackSettings): void;
  onFrameset(frame: ImageData): void;
}

export const Video = ({ device, onVideoSet, onFrameset }: Props) => {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  const handleSubmit = () => {
    if(video.current && canvas.current) {
      const ctx = canvas.current.getContext('2d');
      ctx.drawImage(video.current, 0, 0, 320, 240);
      onFrameset(ctx.getImageData(0, 0, 320, 240));
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
      <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700" onClick={handleSubmit}>
        Submit
      </button>
      <video
        className="mt-3"
        ref={video}
        width="320"
        height="240"
        autoPlay={true}
      ></video>
      <canvas className="mt-3" ref={canvas} width="320" height="240"></canvas>
    </>
  );
};

export default Video;
