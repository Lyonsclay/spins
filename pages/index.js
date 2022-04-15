import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {
  useEffect,
  useState,
} from 'react'
import useSWR from 'swr'
import { PlayIcon, PauseIcon } from '@heroicons/react/solid'
import Player from '../components/Player'
import Shows from '../components/Calendar'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#0d1118]">
      <Head>
        <title>Now Spinning</title>
        <meta name="description" content="A better way to spin." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col p-0 mt-8 max-w-4xl">
        <div className="bg-[#161c22]">
          <Player />
        </div>
        <br />
        <br />
        <div className="h-[50vh] overflow-auto">
          <Shows />
        </div>
      </main>
    </div>
  )
}

export default Home
