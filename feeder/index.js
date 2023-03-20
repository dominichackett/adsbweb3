import { ethers } from "ethers";
import * as dotenv from "dotenv"
import { Polybase } from "@polybase/client";
import {ethPersonalSign} from '@polybase/eth'

import axios from "axios";
dotenv.config()
const apiUrl = 'http://127.0.0.1:8080/aircraft/data.json'; // Replace with your API URL
const intervalTime = 30000; // 1 second interval



const wallet =  new ethers.Wallet(process.env.PRIVATE_KEY);

const provider = new ethers.providers.InfuraProvider("goerli",process.env.INFURA_API_KEY)
const connectedWallet = wallet.connect(provider);

const db = new Polybase({
    defaultNamespace: "pk/0x86b28d5590a407110f9cac95fd554cd4fc5bd611d6d88aed5fdbeee519f5792411d128cabf54b3035c2bf3f14c50e37c3cfc98523c2243b42cd394da42ca48f8/adsbweb3",
});


  db.signer(async (data) => {
        
    
    return { h: 'eth-personal-sign', sig: ethPersonalSign(process.env.PRIVATE_KEY, data) }
  })


async function getADSBData(){
    let response
    try {
         response = await axios.get(apiUrl);
        // Process the response data here
        //console.log(response.data);
      } catch (error) {
        // Handle errors here
        console.error(error);
      }
  
  return response.data
}


//Save ADS-B data to polybase collection
async function saveADSBData(data){
    const flightData = db.collection("FlightData");
    const time = new Date().getTime()     //Time Stamp for flight data

    for(const index in data)
    {
        if(data[index].validposition==0 ||  data[index].seen > 50)//Data is not valid
          continue

        try {
            console.log(`Save ${JSON.stringify(data[index])}`

            )
           const id = data[index].hex+time.toString()
           const flight = (data[index].flight == "" ? "----" :data[index].flight)
           const recordData = await flightData.create([id,data[index].hex,data[index].squawk,data[index].flight,data[index].lat
            ,data[index].lon,data[index].altitude,data[index].vert_rate,data[index].speed,data[index].track,time]);

       }catch(error){
         console.log(error)   
       }
    }

}

async function run() {
    while (true) {
      const data = await getADSBData();
      if(data.length > 0 )
        await saveADSBData(data)
      console.log(data)
      await delay(intervalTime);
    }
  }
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  run();  

