import Head from 'next/head'
import Header from '@/components/Header/header'
import Footer from '@/components/Footer/footer'
import { MapContainer, TileLayer,ZoomControl,Marker,useMapEvent } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { useState ,useRef,useEffect} from 'react';
import airplaneIcon from '../../public/images/aircraft/A320.svg';
import AircraftData from '@/components/AircraftData/aircraftdata';
import  'leaflet-rotatedmarker';
import SourceButtons from '@/components/SourceButtons/sourcebuttons';
import { getAW3Data, getOpenSkyData } from '@/components/utils/utils';
import { element } from '@rainbow-me/rainbowkit/dist/css/reset.css';
function EventListner(props:any){
  const map = useMapEvent('moveend', handleMoveEnd);
  function handleMoveEnd(event:any) {

    props.handleEvent(event)

  }
  return null
}
export default function Tracking() {
    const markerRef = useRef(null);
    const mapRef = useRef(null); // create a ref for the map container
    const intervalRef = useRef()
    const [aircraftData,setAircraftData]  = useState()
    const [aircraftDataOpen,setAircraftDataOpen] = useState(false)
    const  source= useRef(2)
    const [markers,setMarkers] = useState([])                  
    const [visibleMarkers,setVisibleMarkers] = useState([])
    const handleMarkerClick = (e:any,marker:any) => {
      if (e.target.options.icon.options.className === 'marker-icon my-custom-icon') {
        // Handle marker click here
        console.log('Marker clicked!');
      }
      //alert(JSON.stringify(marker))
      setAircraftData(marker)
      setAircraftDataOpen(true)
    };
    
  
   const sourceChanged = (value:any)=>{
     source.current = value
     setMarkers([])
     setVisibleMarkers([])
     getData() 
   }

   const setOpen = (value:any)=>{
    setAircraftDataOpen(value)
   }


   async function getData(){
      
      
     

    let flights = []
     if(source.current==1)
        flights= await getOpenSkyData()
     else  
     {
       try{
       flights = await getAW3Data() 
       }catch(error)
       {
         
       } 
     }
     // console.log(flights)
     console.log(source.current)
     setMarkers(flights)
   }
   useEffect(()=>{
    
     getData()
    intervalRef.current =  setInterval(getData,10000) //Call every two minutes
      // Return a function to clean up the interval on unmount
    return () => clearInterval(intervalRef.current);
   },[])
   

  useEffect(()=>{
    if(markers && mapRef.current)
       getVisibleMarkers()
  },[markers,mapRef])
  function getVisibleMarkers()
  {
    
    const bounds =mapRef.current.getBounds();
    const _markers = markers.map(marker => {
      if(marker?.position)
      if(bounds.contains(marker.position))
      return marker

    });
    setVisibleMarkers(_markers);
    console.log("Got Markers Initially")

      
  }   
   function handleMoveEnd(event:any){
    const bounds = event.target.getBounds();
    const _markers = markers.map(marker => {
      if(marker?.position)
      if(bounds.contains(marker.position))
      return marker

    });
    setVisibleMarkers(_markers);
    console.log("Got Markers")
  }

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
           <div className="container relative mb-10">       
           <SourceButtons sourceChanged={sourceChanged}/>
           <AircraftData aircraftData={aircraftData} open={setOpen} aircraftDataOpen={aircraftDataOpen} />

       <MapContainer ref={mapRef} preferCanvas={true}    zoomControl={false}  
 center={[10.536421,  -61.311951]} zoom={8} scrollWheelZoom={false}
onMoveEnd={()=> alert("hello")}
 
 >
  <EventListner handleEvent={handleMoveEnd} />  
  <TileLayer 
      className='map-tiles'

    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

   {visibleMarkers.map((marker, index) => {
    
    if(marker && index <=5000)
    return(
        <Marker
          key={index}
          position={marker.position}
          icon={marker.icon}
          rotationAngle={marker.rotation}
          eventHandlers={{
            click: (e) => {
              handleMarkerClick(e, marker.data);
            },
          }}
          
        >
        </Marker>
      )})}  
  <ZoomControl position='bottomright' />
</MapContainer>
      </div>
          </section>
        
     <Footer/>
     </main>
     </>
  )
}
