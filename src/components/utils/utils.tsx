import { element } from '@rainbow-me/rainbowkit/dist/css/reset.css';
//import 'leaflet-rotatedmarker';
import { Polybase } from "@polybase/client";
import wagmiCore from '@wagmi/core'
import wagmiAlchemy from "@wagmi/core/providers/alchemy"
import wagmiChains from '@wagmi/core/chains'
import { ethers } from 'ethers';
import {attestationsContract, attestationsContractAbi} from "@/components/Contracts/contracts"
export const getAW3Data = async (verified:boolean,feeders:any)=> {
    if(!L)
     return
    const db = new Polybase({
        defaultNamespace: "pk/0x86b28d5590a407110f9cac95fd554cd4fc5bd611d6d88aed5fdbeee519f5792411d128cabf54b3035c2bf3f14c50e37c3cfc98523c2243b42cd394da42ca48f8/adsbweb3",
    });
      const flightDataCollection= db.collection("FlightData");
      const time = new Date()
      time.setSeconds(time.getSeconds() - 5);

      const flightData= await flightDataCollection.where("time",">=",time.getTime()).get()//where("name","==","Dominic Hackett").get();
      const response = await fetch('http://localhost:3000/images/aircraft/A320.svg');
      const data = await response.text();
      // Parse the SVG data into an XML document
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, 'image/svg+xml');
      const svgElement =  xmlDoc.getElementsByTagName('svg')[0]
      const viewBoxElement = svgElement.getAttribute('viewBox')
      svgElement.setAttribute('viewBox',"0 0 80 80")
      // Access the path element and change its fill and stroke attributes
      const gElement = xmlDoc.getElementsByTagName('g')[0];
      const pathElement = gElement.querySelector('path');
      console.log(flightData)
      const flights = flightData.data.map((_data:any)=>{
      
     const element = _data.data;  
    const color = getColor(element.altitude,false);
    pathElement.setAttribute('style', `fill:${color};stroke:#000000;stroke-width:1px`);
    //pathElement.setAttribute('stroke', 'red');
    
    // Serialize the modified XML document back to a string
    const serializer = new XMLSerializer();
    const modifiedData = serializer.serializeToString(xmlDoc);
    
    // Create a data URI from the modified SVG data
    const encodedData = btoa(modifiedData);
    const dataURL = `data:image/svg+xml;base64,${encodedData}`;  
    
       const  _address  = ethers.utils.computeAddress(element.publicKey)
   //    if(verified== false || (verified == true && feeders[_address]== true))
        return {
          position: [element.lattitude,  element.longitude],
          rotation:element.heading,
          altitude:element.altitude,
          onground:false,
          data:element,
          icon:  L.icon({
              iconUrl:dataURL,
              iconSize: [80, 80],
              iconAnchor:[40,40],
            
    
    
             
              
            })
      }
     })
     console.log(flights)
    return flights;
         
}

export const getOpenSkyData = async ()=>{
  if(!L)
    return
  const result = await fetch("http://localhost:3000/api/opensky")
console.log(result)
 const flightData = await result.json()
 const response = await fetch('http://localhost:3000/images/aircraft/A320.svg');
 const data = await response.text();
 // Parse the SVG data into an XML document
 const parser = new DOMParser();
 const xmlDoc = parser.parseFromString(data, 'image/svg+xml');
 const svgElement =  xmlDoc.getElementsByTagName('svg')[0]
 const viewBoxElement = svgElement.getAttribute('viewBox')
 svgElement.setAttribute('viewBox',"0 0 80 80")
 // Access the path element and change its fill and stroke attributes
 const gElement = xmlDoc.getElementsByTagName('g')[0];
 const pathElement = gElement.querySelector('path');
 
 const flights = flightData.states.map((element:any)=>{
    if(element[5] != undefined && element[6] !=undefined)
    {

   
const color = getColor(element[7],element[8]);
pathElement.setAttribute('style', `fill:${color};stroke:#000000;stroke-width:1px`);
//pathElement.setAttribute('stroke', 'red');

// Serialize the modified XML document back to a string
const serializer = new XMLSerializer();
const modifiedData = serializer.serializeToString(xmlDoc);

// Create a data URI from the modified SVG data
const encodedData = btoa(modifiedData);
const dataURL = `data:image/svg+xml;base64,${encodedData}`;  


const fdata = {reg:element[1],flight:element[1],hex:element[0],squawk:element[14]
    ,altitude:element[7],heading:element[10],verticalRate:element[11]
    ,latitude:element[6],longitude:element[5],speed:element[9]}
    return {
      position: [element[6],  element[5]],
      rotation:element[10],
      altitude:element[7],
      onground:element[8],
      data:fdata,
      icon:  L.icon({
          iconUrl:dataURL,
          iconSize: [80, 80],
          iconAnchor:[40,40],
        


         
          
        })
  }
 }  })

 return flights
}



//Get Color from altitude
export function getColor(altitude:number,onGround:boolean)
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


export const getVerified = async ()=>{

  const wallet =  new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY);

const provider = new ethers.providers.AlchemyProvider("optimism-goerli",process.env.NEXT_PUBLIC_ALCHEMY_API_KEY)
const connectedWallet = wallet.connect(provider);
  const contract = new ethers.Contract(
    attestationsContract,
    attestationsContractAbi,
    connectedWallet)
    const filter = contract.filters.AttestationCreated("0x5858769800844ab75397775Ca2Fa87B270F7FbBe",null,ethers.utils.formatBytes32String("adsbweb3.verified.feeder:bool"), null)
   
   const results = await contract?.queryFilter(filter,0,'latest');
 
      return results

}



export async function getDistance(from,to) {

  const db = new Polybase({
    defaultNamespace: "pk/0x86b28d5590a407110f9cac95fd554cd4fc5bd611d6d88aed5fdbeee519f5792411d128cabf54b3035c2bf3f14c50e37c3cfc98523c2243b42cd394da42ca48f8/adsbweb3",
});

const airportDataCollection= db.collection("Airport");
const time = new Date()
time.setSeconds(time.getSeconds() - 5);

const _from= await airportDataCollection.where("iata_code","==",from).get()//where("name","==","Dominic Hackett").get();
const _to= await airportDataCollection.where("iata_code","==",to).get()//where("name","==","Dominic Hackett").get();
 const lat1 = _from.data[0].data.lattitude
 const lon1 = _from.data[0].data.longitude
 const lat2 = _to.data[0].data.lattitude
 const lon2 = _to.data[0].data.longitude
  
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
}

export function deg2rad(deg) {
  return deg * (Math.PI/180)
}