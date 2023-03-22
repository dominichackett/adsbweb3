import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneDeparture,faPlaneArrival,faBell } from '@fortawesome/free-solid-svg-icons'
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useState,useEffect } from 'react';
import { Polybase } from "@polybase/client";
import { format, fromUnixTime } from 'date-fns';

config.autoAddCss = false;
function FlightData(props:any){
 const [airline,setAirline]  = useState([]) 
 const [flightNumber,setFlightNumber] = useState([]) 
 const [airport,setAirport] = useState([])
 const [airportIATA,setAirportIATA] = useState([])
 const [time,setTime] = useState([]) 
 const [status,setStatus] = useState([])
 useEffect(()=>{
   setAirline(Array.from(props.airline))
   setFlightNumber(Array.from(props.flightNumber))  
   setAirport(Array.from(props.airport))
   setAirportIATA(Array.from(props.airport_iata))
   setTime(Array.from(props.time))
   setStatus(Array.from(props.status))
 },[])
return(
        <div class="departure-board ">
                <FontAwesomeIcon icon={faBell} className={`cursor-pointer mr-2 ${props.alert == true ? "text-green": "text-white"}`}/>

        {airline.map(letter=> <span class={`letter letter-${letter}`}></span>)}
        <span class="letter letter-blank"></span>
        {flightNumber.length < 4 && <span class="letter letter-0"></span> }       
        {flightNumber.map(letter=> <span class={`letter letter-${letter}`}></span>)}
        <span class="letter letter-blank"></span>
        {airportIATA.map(letter=> <span class={`letter letter-${letter != " " ? letter:"blank"  }`}></span>)}
        <span class="letter letter-blank"></span>
        {time.map(letter=> <span class={`letter letter-${letter != " " ? letter:"blank"  }`}></span>)}
        <span class="letter letter-blank"></span>
        {status.map(letter=> <span class={`letter letter-${letter != " " ? letter:"blank"  }`}></span>)}
        <span class="letter letter-blank"></span>

        {airport.map(letter=> <span class={`letter letter-${letter != " " ? letter:"blank"  }`}></span>)}
       
</div>)    
} 

const schedule = [{airline:"AA",flightNumber:"0815",airport:"NEW YORK", airport_iata:"JFK",time:"1000PM",status:"SCHEDULED",alert:true }]
export default function FIDS(props:any){
   const [flights,setFlights] = useState([])
   const db = new Polybase({
    defaultNamespace: "pk/0x86b28d5590a407110f9cac95fd554cd4fc5bd611d6d88aed5fdbeee519f5792411d128cabf54b3035c2bf3f14c50e37c3cfc98523c2243b42cd394da42ca48f8/adsbweb3",
});

   useEffect(()=>{
    async function getSchedule(){
       const fidsType = props.type == 1 ? "Departure": "Arrival"
       const fType  =props.type == 1 ? "dep": "arr"
       const flightData = db.collection(fidsType);
       const records= await flightData.where(`${fType}_iata`,"==",props.airportIATACode).where(`${fType}_time_ts`,">",new Date(props.scheduleDate).getTime()).get()//where("name","==","Dominic Hackett").get();
       console.log(records)
       console.log(props.airportIATACode)
       const cityData = db.collection("Airport")
       let _flights = []
       for(const index in records.data){
         const data = records.data[index].data
         const city = await cityData.where("iata_code","==",`${props.type ==  2 ? data.dep_iata: data.arr_iata}`).get()  
         let cityName = "       "
         console.log(city)
         if(city.data.length > 0)
         {
           cityName = city.data[0].data.municipality.toUpperCase()
         }
         const date = fromUnixTime(props.type ==  2 ? data.arr_time_ts: data.dep_time_ts);
         const formattedTime = format(date, 'hhmma');
         const status = data.status.slice(0,4).toUpperCase()
         _flights.push({airline:data.airline_iata,flightNumber:data.flight_number,airport:cityName, airport_iata:`${props.type ==  2 ? data.dep_iata: data.arr_iata}`,time:formattedTime,status:status,alert:false })
       }

       setFlights(_flights)

    }
   if ( props.fidsDataOpen==true)
    getSchedule()
   },[ props.fidsDataOpen,props.type]) 
    return(    
      props.fidsDataOpen==true ?    <div className="m-4 min-h-[770px] p-4 border-2 border-dashed border-white absolute  right-4 z-50  w-2/3  bg-primary ">
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
                             fill="#FFFFFF"
                           />
                           <path
                             fill-rule="evenodd"
                             clip-rule="evenodd"
                             d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                             fill="#FFFFFF"
                           />
                         </svg>
                       </button>
                   
                       
                     </div>
  
     <div className="mb-4" ><h1><span className="text-4xl" ><FontAwesomeIcon  icon={props.type == 1? faPlaneDeparture:faPlaneArrival} /> {props.type == 1 ? "Departures":"Arrivals"}</span></h1>
     </div>

     {flights.map( _flight => (<FlightData airline={_flight.airline} flightNumber={_flight.flightNumber} airport={_flight.airport} airport_iata={_flight.airport_iata} time={_flight.time} status={_flight.status} alert={_flight.alert}/>))}
                  


     
 
  
  
  
  
  </div> : ""
    
    )
  }