import { useEffect,useState } from "react"
export default function AircraftData(props:any){
const [photo,setPhoto] = useState()
const [photographer,setPhotographer] = useState()
const [link,setLink] = useState()
useEffect(()=>{
   async function getPhoto() {
    console.log(props.aircraftData.hex)
    const result = await fetch(`http://localhost:3000/api/photo?hex=${props.aircraftData.hex}`)
    const data = await result.json()
    setPhoto(data.photos[0]?.thumbnail_large.src)
    setPhotographer(data.photos[0]?.photographer)
    setLink(data.photos[0]?.link)
    console.log(data.photos[0]?.photographer)
   }  
   if(props.aircraftDataOpen==true) 
   getPhoto()
},[props.aircraftData])
  return(      props.aircraftDataOpen==true ?  <div className="m-4 p-4 border-2 border-dashed absolute top-0 left-4 z-50  w-1/4 bg-white opacity-80">
       <div className="flex items-center justify-end">
                     
                     <button className="p-4"
                       onClick={()=>props.open(false)}  >                   
                       <svg
                         width="10"
                         height="10"
                         viewBox="0 0 10 10"
                         fill="none"
                         xmlns="http://www.w3.org/2000/svg"
                       >
                         <path
                           fill-rule="evenodd"
                           clip-rule="evenodd"
                           d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                           fill="currentColor"
                         />
                         <path
                           fill-rule="evenodd"
                           clip-rule="evenodd"
                           d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                           fill="currentColor"
                         />
                       </svg>
                     </button>
                 
                     
                   </div>
                   <div>
                    <img src={ `${photo ? photo :"/images/airplane.jpg"} `}className=" relative flex max-h-[200px] min-h-[200px]  w-full items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-2 text-center"
                />
                <span className={`${(!photo ? "invisible": "")} mt-2 font-bold flex justify-between text-sm`}><span>Credit:</span> {photographer}</span>
                <span  className={`${(!photo ? "invisible": "")}  font-bold flex justify-between mb-5`}><a className="text-primary text-sm "  target="_blank" href={`${link}`}>View on Planespotters.net</a></span>
              
                <span className="font-bold flex justify-between"><span>Reg:</span> {props?.aircraftData[1]}</span>
                <div className="font-bold flex  justify-between"><span>Type:</span> Sling TSI Experimental</div>
</div>
<div className="font-bold flex  justify-between"><span>Flight:</span> {props.aircraftData.flight}</div>
<div className="font-bold flex  justify-between"><span>Hex:</span> {props.aircraftData.hex}</div>

<div className="font-bold flex  justify-between"><span>Squawk:</span> {props?.aircraftData.squawk} </div>
<div className="font-bold flex  justify-between"><span>Altitude:</span> {props?.aircraftData.altitude}</div>
<div className="font-bold flex  justify-between"><span>Virtical Speed:</span> {props?.aircraftData.verticalRate}</div>
<div className="font-bold flex  justify-between"><span>Speed:</span> {props?.aircraftData.speed}</div>
<div className="font-bold flex  justify-between"><span>Headding:</span> {props?.aircraftData.heading}</div>
<div className="font-bold flex  justify-between"><span>Latitude:</span> {props?.aircraftData.latitude}</div>
<div className="font-bold flex  justify-between"><span>Longitude:</span> {props?.aircraftData.longitude}</div>






</div>
 : "" 
  )
}