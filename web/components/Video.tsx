import {
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
} from "react";

interface Props {
  device: string;
  onVideoSet(settings: MediaTrackSettings): void;
  className?: string;
}

export interface VideoRef {
  getFrame(): string | null;
}

export const Video = forwardRef<VideoRef, Props>(
  ({ device, onVideoSet, className }: Props, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(ref, () => ({
      getFrame,
    }));

    const getFrame = () => {
      if (videoRef.current) {
        const m = 256;
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(
          videoRef.current.videoWidth * (m / videoRef.current.videoHeight)
        );
        canvas.height = Math.floor(
          videoRef.current.videoHeight * (m / videoRef.current.videoHeight)
        );
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL();
        }
      }
      return null;
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
            if (videoRef.current && tracks.length >= 1) {
              onVideoSet(tracks[0].getSettings());
              videoRef.current.srcObject = stream;
              videoRef.current.play();
            }
          } catch (err) {
            console.log(err);
          }
        })();
      }
    }, [device]);

    return (
      <video
        className={className}
        ref={videoRef}
        width="320"
        height="240"
        autoPlay={true}
      ></video>
    );
  }
);
