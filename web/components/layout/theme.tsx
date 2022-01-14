import React, { ReactNode } from 'react'
import Head from 'next/head'
import Navigation from './navigation'
import Footer from './footer'
import { useRouter } from 'next/router'

type Props = {
  title: string
  children?: ReactNode
  
}

const Theme = ({ title, children }: Props) => {

  return (
    <>
      <Head>
        <title>{ title }</title>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="Accept-CH" content="DPR,Width,Viewport-Width" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
      </Head>
      <article className="flex flex-col justify-between min-h-screen bg-white">
        <Navigation />
        <div id="content" className="flex-grow">
          {children}
        </div>
        <div className="flex-none">
          <Footer />
        </div>
      </article>
    </>
  )
}

export default Theme