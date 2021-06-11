import Head from 'next/head'
import Image from 'next/image'
import Video from '~/components/Video'
import DeviceSelector from '~/components/DeviceSelector'

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col items-center w-full flex-1 px-20 text-center">
                <h1 className="text-6xl font-bold">
                    Welcome to{' '}
                    <a className="text-blue-600" href="https://nextjs.org">
                        roshambo.ai
                    </a>
                </h1>

                <p className="mt-3 text-2xl">
                    <DeviceSelector />
                    <Video />
                </p>

                
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
    )
}