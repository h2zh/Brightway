import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import MapData from './MapData'

export default function Home() {
  return (
    <div>
      <MapData />
    </div>
  )
}
