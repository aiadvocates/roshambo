import Head from "next/head";
import Image from "next/image";
import Video from "~/components/Video";
import DeviceSelector from "~/components/DeviceSelector";

export default function Home() {
  const selectDevice = (id: any) => {
    console.log(id);
  };

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
          <DeviceSelector onSelect={selectDevice} />
        </div>
        <div>
          <video id="video" width="320" height="240" autoPlay={true} />
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
