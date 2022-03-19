import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {
  useEffect,
  useState,
} from 'react'
// import Hls from "hls.js"
// "https://tailwindcss.com/img/card-top.jpg"
import useSWR from 'swr'
import { PlayIcon, PauseIcon } from '@heroicons/react/solid'
import Player from '../components/Player'
import Shows from '../components/Calendar'



const Home = () => {

  const url = "http://s7.viastreaming.net:8310/;?_=0.494499115526442"
  const defaultImage = "https://spinitron.com/static/pictures/placeholders/loudspeaker.svg"
  const djImage = "https://spinitron.com/images/Persona/10/37/103773-img_profile.225x225.jpg?v=1570052037"
  const djImage2 = "https://spinitron.com/images/Persona/10/36/103680-img_profile.225x225.jpg?v=1645300548"
  const showImage = "https://farm4.staticflickr.com/3853/14570100710_5eba461d02_m.jpg"
  return (
    <div className="flex flex-col items-center bg-[#0d1118]">
      <Head>
        <title>Spinitron Clone</title>
        <meta name="description" content="A better way to spin." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col p-0 max-w-4xl">
        <div className="bg-[#161c22]">
          <Player />
        </div>

      <br/>
      <br/>
        <div className="h-[50vh] overflow-auto">
          <Shows />
        </div>

      </main>

      <footer className={styles.footer}>
        <a href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app" target="_blank"
          rel="noopener noreferrer" >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>

    </div>
  )
}

export default Home

  // useEffect(() => {
  //   const audio = player;
  //   const hls = new Hls();
  //   // const url = 'https://ark3.spinitron.com/ark2/WXOX-20220220T190000Z/index.m3u8'
  //   const url = 'https://ark3.spinitron.com/ark2/WXOX-20220221T120000Z/index.m3u8'

  //   hls.loadSource(url);
  //   hls.attachMedia(audio);
  //   hls.on(Hls.Events.MANIFEST_PARSED, function() { audio.play(); });

  // }, [player]);
