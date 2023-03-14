import Head from 'next/head'
import Header from '@/components/Header/header'
import Footer from '@/components/Footer/footer'
import { MapContainer, TileLayer,ZoomControl, useMap,Marker,Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { useState ,useRef,useEffect} from 'react';
import airplaneIcon from '../../public/images/aircraft/A320.svg';
import AirportData from '@/components/AirportData/airportdata';
import  'leaflet-rotatedmarker';
import FIDS from '@/components/Fids/board';
function getColor(altitude:number,onGround:boolean)
{
    let rgb;
    if (altitude === 0 || onGround === true) {
        rgb = [50, 50, 50];
      } else if (altitude > 0 && altitude <= 1000) {
        rgb = [100, 50, 0];
      } else if (altitude > 1000 && altitude <= 5000) {
        rgb = [100, 100, 0];
      } else if (altitude > 5000 && altitude <= 10000) {
        rgb = [0, 100, 0];
      } else if (altitude > 10000 && altitude <= 20000) {
        rgb = [0, 75, 100];
      } else if (altitude > 20000 && altitude <= 30000) {
        rgb = [0, 50, 100];
      } else if (altitude > 30000 && altitude <= 40000) {
        rgb = [50, 0, 100];
      } else if (altitude > 40000 && altitude <= 1000000) {
        rgb = [100, 0, 0];
      } else if (altitude > 1000000) {
        rgb = [100, 100, 100];
      } else {
        rgb = [25, 25, 25];
      }

       const r = rgb[0] * 2.55;
        const g = rgb[1] * 2.55;
        const b = rgb[2] * 2.55;
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      
}
export default function Home() {
    const markerRef = useRef(null);


    
    const [markers,setMarkers] = useState([])                  
    

   useEffect(()=>{
      async function getImage(){

        const response = await fetch('http://localhost:3000/images/aircraft/A320.svg');
        const data = await response.text();
      console.log(data)
// Parse the SVG data into an XML document
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(data, 'image/svg+xml');
const svgElement =  xmlDoc.getElementsByTagName('svg')[0]
const viewBoxElement = svgElement.getAttribute('viewBox')
svgElement.setAttribute('viewBox',"0 0 80 80")
// Access the path element and change its fill and stroke attributes
const gElement = xmlDoc.getElementsByTagName('g')[0];
const pathElement = gElement.querySelector('path');
console.log(pathElement)
const color = getColor(5200,false);
pathElement.setAttribute('style', `fill:${color};stroke:#000000;stroke-width:1px`);
//pathElement.setAttribute('stroke', 'red');

// Serialize the modified XML document back to a string
const serializer = new XMLSerializer();
const modifiedData = serializer.serializeToString(xmlDoc);

// Create a data URI from the modified SVG data
const encodedData = btoa(modifiedData);
const dataURL = `data:image/svg+xml;base64,${encodedData}`;


            let pin = []
            pin.push({
                position: [10.536421,  -61.311951],
                rotation:90,
                icon:  L.icon({
                    iconUrl:dataURL,
                    iconSize: [80, 80],
                    iconAnchor:[40,40],
                  
        
        
                    className:'custom-icon',
                   
                    
                  })
      })
            setMarkers(pin)
            console.log(pin)
    } 
    getImage()
   },[])
  return (
    <>
      <Head>
      <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css?family=Fira+Sans&display=swap" rel="stylesheet"/>   
     <title>Ads-B Web3 - Live Flight Tracking</title>
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
       <AirportData />
       <FIDS type={1}/>
       <MapContainer     zoomControl={false}
 center={[10.536421,  -61.311951]} zoom={8} scrollWheelZoom={false}>
    

  <TileLayer
      className='map-tiles'

    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

   {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          icon={marker.icon}
          rotationAngle={marker.rotation}
          ref={markerRef}
          style={{
            fill: '#00ff00;'
          }}
        >
        </Marker>
      ))}  
  <ZoomControl position='bottomright' />
</MapContainer>
     </div> 
          </section>
        
     <Footer/>
     </main>
     </>
  )
}
