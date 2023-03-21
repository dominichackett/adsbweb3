import Head from 'next/head'
import Header from '@/components/Header/header'
import Footer from '@/components/Footer/footer'
import { MapContainer, TileLayer,ZoomControl, useMap,Marker,Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { useState ,useRef,useEffect} from 'react';
import AirportData from '@/components/AirportData/airportdata';
import  'leaflet-rotatedmarker';
import FIDS from '@/components/Fids/board';

function ChangeLocation(props:any){
  useEffect(()=>{
    map.setView(props.location,props.zoomLevel)
  },)
  const map = useMap()
}
export default function Airports() {
    const [fidsDataOpen,setFidsDataOpen] = useState(false)
    const [location,setLocation] = useState([10.536421,  -61.311951])
    const [zoomLevel,setZoomLevel] = useState(8)
    const [scheduleDate,setScheduleDate] = useState()
    const [fidsType,setFidsType] = useState()
    const setOpen = (value:any)=>{
      setFidsDataOpen(value)
     }
  

  const findAirport = async(airport:any) => {
    //alert(`${airport.lattitude} ${airport.longitude} `)
    setLocation([airport.lattitude,airport.longitude])
    setZoomLevel(15)
  }
  const showFIDS = (displayType:number,_scheduleDate:any)=>{
     setFidsDataOpen(true)
     setFidsType(displayType)
  }
  return (
    <>
      <Head>
      <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css?family=Fira+Sans&display=swap" rel="stylesheet"/>   
     <title>Ads-B Web3 - Airports</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://kit.fontawesome.com/dd348bbd0a.js" crossorigin="anonymous"></script>
      </Head>
      <main 
       className="bg-black"
     >
             <Header/>
           
            
             <section
      id="home"
      className= "  relative z-10 overflow-hidden bg-cover bg-top bg-no-repeat "
          >

<div className="container relative">     
       <AirportData find={findAirport} showFIDS={showFIDS} />
       <FIDS type={fidsType} open={setOpen} fidsDataOpen={fidsDataOpen} scheduleDate={scheduleDate} />
       <MapContainer     zoomControl={false}
 center={location} zoom={zoomLevel} scrollWheelZoom={false}>
    
  <ChangeLocation zoomLevel={zoomLevel} location={location} />
  <TileLayer
      className='map-tiles'

    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

   
  <ZoomControl position='bottomright' />
</MapContainer>
     </div> 
          </section>
        
     <Footer/>
     </main>
     </>
  )
}
