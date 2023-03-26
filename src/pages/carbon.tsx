import Head from 'next/head'
import Header from '@/components/Header/header'
import Footer from '@/components/Footer/footer'
import { useState,useEffect } from 'react'
import { ethers } from 'ethers'
import { adbsweb3ContractAddress,adsbweb3ContractAbi } from '@/components/Contracts/contracts'
import { useSigner ,useChainId } from 'wagmi'
import Notification from '@/components/Notification/Notification'
import { Polybase } from "@polybase/client";
import * as eth from '@polybase/eth'
import { format, fromUnixTime } from 'date-fns';

import {
  useAccount 
 
} from 'wagmi'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEarthAmericas,faTrain,faCar,faBus, faPlaneDeparture } from '@fortawesome/free-solid-svg-icons'
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { getDistance } from '@/components/utils/utils';

config.autoAddCss = false;
const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' }
,    { name: 'Lindsay Bill', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' }
,    { name: 'Lindsay Lohan-Spears', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' }

]
export default function Carbon() {

 
  const chain = useChainId()
    const [refreshData,setRefreshData] = useState(new Date())
    const [emissions,setEmissions] = useState([])
    const {address} = useAccount()
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()
    const [isSaving,setIsSaving] = useState(false)
    const [isLoading,setIsLoading]  = useState(true)
    const [profileMetada,setProfileMetadata] = useState()
    const { data: signer} = useSigner()
    const [distance,setDistance] = useState()
    const [flight,setFlight] = useState()
    const [train,setTrain] = useState()
    const [bus,setBus] = useState()
    const [car,setCar] = useState()
    const [flightDate,setFlightDate] = useState()
   const [passengers,setPassengers] = useState()
   const [_from,setFrom] = useState()
   const [_to,setTo] = useState()
    // NOTIFICATIONS functions
      const [notificationTitle, setNotificationTitle] = useState();
      const [notificationDescription, setNotificationDescription] = useState();
      const [dialogType, setDialogType] = useState(1);
      const [show, setShow] = useState(false);
      const close = async () => {
        setShow(false);
      };
  
      const contractReadProfile = null /*useContractRead({
        address:TicketManagerContractAddress,
        abi: TicketManagerContractABI,
        functionName: 'getProfile',
        enabled:false,
        args:[address]
        
      })*/
    
   const estimateCarbon = async ()=>{
       const flightdate = document.getElementById("flightDate").value;
       setFlightDate(new Date(flightdate))
      
       const to = document.getElementById("to").value 
       const from = document.getElementById("from").value 
       const _passengers = document.getElementById("passengers").value
       const _class = document.getElementById("flightClass").value
       const d = await getDistance(to,from)
       const _distance =Math.floor(d) 
       setDistance(Math.floor(d))
       const response = await fetch(`http://localhost:3000/api/carbon?from=${from}&to=${to}&passengers=${_passengers}&_class=${_class}`);
       const data = await response.json();
       setFlight(Math.floor(data.co2e))

       const responseTrain = await fetch(`http://localhost:3000/api/train?distance=${_distance}`);
       const dataTrain = await responseTrain.json();
       setTrain(Math.floor(dataTrain.co2e))

       const responseBus = await fetch(`http://localhost:3000/api/bus?distance=${_distance}`);
       const dataBus = await responseBus.json();
       setBus(Math.floor(dataBus.co2e))

       const responseCar = await fetch(`http://localhost:3000/api/car?distance=${_distance}`);
       const dataCar = await responseCar.json();
       setCar(Math.floor(dataCar.co2e))
       

       setPassengers(_passengers)
       setTo(to)
       setFrom(from)
       
     
      }
    
  
  
      const saveCarbonTracker = async ()=>
      {
         
         const db = new Polybase({
          defaultNamespace: "pk/0x86b28d5590a407110f9cac95fd554cd4fc5bd611d6d88aed5fdbeee519f5792411d128cabf54b3035c2bf3f14c50e37c3cfc98523c2243b42cd394da42ca48f8/adsbweb3",
        });
       console.log(chain)
       console.log(distance,flight,train,bus,car,flightDate.getTime())
     
        db.signer(async (data: string) => {
          // A permission dialog will be presented to the user
          const accounts = await eth.requestAccounts();
        
          // If there is more than one account, you may wish to ask the user which
          // account they would like to use
          const account = accounts[0];
          const sig = await eth.sign(data, account);
          console.log(account)
        
          return { h: "eth-personal-sign", sig };
        })
       
        const cTracker = db.collection("CarbonTracker");

         
        try {
      
            const contract = new ethers.Contract(
            adbsweb3ContractAddress.get(chain),
            adsbweb3ContractAbi,
            signer
          );
          
            let tx = await contract.callStatic.trackCarbonEmissons( distance,flight,train,bus,car,flightDate.getTime(),{
                gasLimit: 3000000})   
        
                let transaction = await contract.trackCarbonEmissons( distance,flight,train,bus,car,flightDate.getTime(),{
            gasLimit: 3000000})   
          
            const receipt = await transaction.wait();
            alert("test")
            console.log(receipt)  
          const recordData = await cTracker.create([ receipt.transactionHash,distance.toString()
            ,flight.toString(),train.toString(),bus.toString(),car.toString(),flightDate.getTime(),_from,_to
            ,address,parseInt(passengers)]);
 
              setDialogType(1) //Success
              setNotificationTitle("Carbon Tracker")
              setNotificationDescription("Carbon Emissions Saved.")
              setShow(true)
              
              setRefreshData(new Date())
              
          
        } catch (error) {
      
          
          if (error.code === 'TRANSACTION_REVERTED') {
            console.log('Transaction reverted');
            let revertReason = ethers.utils.parseRevertReason(error.data);
            setNotificationDescription(revertReason);
          }  else if (error.code === 'ACTION_REJECTED') {
          setNotificationDescription('Transaction rejected by user');
        }else {
         console.log(error)
         //const errorMessage = ethers.utils.revert(error.reason);
          setNotificationDescription(`Transaction failed with error: ${error.reason}`);
        
      }
          setDialogType(2) //Error
          setNotificationTitle("Error Saving Emissions")
      
          setShow(true)
      
      
        }
      
      
      }
      
    useEffect(()=>{
        async function getEmissions(){
          const db = new Polybase({
            defaultNamespace: "pk/0x86b28d5590a407110f9cac95fd554cd4fc5bd611d6d88aed5fdbeee519f5792411d128cabf54b3035c2bf3f14c50e37c3cfc98523c2243b42cd394da42ca48f8/adsbweb3",
          });
          const cTracker = db.collection("CarbonTracker");

          const records = await cTracker.get()
          //console.log(records)
          let _data = []
          records.data.forEach((record)=>{
              _data.push(record.data)
          })

          setEmissions(_data)
          console.log(_data)

        }

        getEmissions()
    },[refreshData])
  
  return (
    <>
      <Head>
      <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css?family=Fira+Sans&display=swap" rel="stylesheet"/>   
     <title>Ads-B Web3 - My Alerts</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://kit.fontawesome.com/dd348bbd0a.js" crossorigin="anonymous"></script>
      </Head>
      <main 
       className="bg-black"
     >
             <Header/>
           
            
             <section
      id="home"
      className= " pb-12 pt-24 relative z-10 overflow-hidden bg-cover bg-top bg-no-repeat "
          >
          <div className="container">
        <div
          className="relative  overflow-hidden rounded-xl bg-white"
        >
          <div className="p-8 sm:p-10"  
>
<div className="px-4 flex flex-row sm:px-6 lg:px-8">
     
<div className="mt-4 w-full px-4 lg:w-1/2 ">
            <div
              className="p-6 relative max-h-[500px] min-h-[500px] mb-12  flex flex-col  w-full  rounded-xl border border-dashed bg-white "
            >
       
          <h1 className="text-4xl font-bold leading-6 text-gray-900">Carbon Emissions Calculator</h1>
          <div className='mt-6 mb-5'>
                  <div
                    className="mb-5 rounded-md bg-[#4E4C64] py-4 px-8"
                  >
                   
              
                  <div className="-mx-3 flex flex-wrap">
                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-5">
                        <label
                          for="from"
                          
                          className="mb-2 block text-base font-medium text-white"
                        >
                          From
                        </label>
                        <input
                          required
                          
                          name="from"
                          id="from"
                          placeholder="JFK"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                      </div>
                    </div>
                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-5">
                        <label
                          for="to"
                          className="mb-2 block text-base font-medium text-white"
                        >
                        Destination
                        </label>
                        <input
                          name="to"
                          id="to"
                          required
                          
                          placeholder="POS"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                      </div>
                      
                    </div>
                    <div className="w-full px-3 ">
                      <div className="mb-5">
                        <label
                          for="passengers"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Passengers
                        </label>
                        <input
                          name="passengers"
                          id="passengers"
                          required
                          type="number"
                          min={1}
                          placeholder="1"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                      </div>
                      
                    </div>

                    <div className="w-full px-3 md:w-1/2 ">
                      <div className="mb-5">
                        <label
                          for="passengers"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Flight Class
                        </label>
                        <select
                          name="flightClass"
                          id="flightClass"
                          required
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        >
                            <option value="unknown">Unknown</option>
                            <option value="economy">Economy</option>
                            <option value="business">Business</option>
                            <option value="firts">First</option>



                            </select>
                      </div>
                      
                    </div>

                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-5">
                        <label
                          for="flightDate"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Date
                        </label>
                        <input
                        disabled={isSaving }
                         required
                          type="datetime-local"
                          name="flightDate"
                          id="flightDate"
                          className="text-xs w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                      </div>
                      
                    </div>
                    <div className="w-full px-3 ">
                      <div className="mb-2">
                       
                      <button 
                      onClick={()=>estimateCarbon()}
                      className="mt-5 hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                        Estimate Footprint
                    </button>
                      </div>
                      
                    </div>
                  </div>
                
                 {/* Place Upload Button Here */}
                  </div>
                  
                  </div>
         </div>
                </div>
                <div className="mt-4 w-full px-4 lg:w-1/2 ">
            <div
              className="p-6 relative max-h-[500px] min-h-[500px] mb-12  flex flex-col  w-full  rounded-xl border border-dashed bg-white "
            >
       
          <h1 className="text-4xl font-bold leading-6 text-gray-900">Carbon Emissions Estimate</h1>
          <div className='mt-6 mb-5'>
                  <div
                    className=" mb-2 rounded-md bg-[#4E4C64] py-4 px-8"
                  >
                   
              
                  <div className="-mx-3 flex flex-wrap">
                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-2 flex flex-col">
                      <h1><span className='text-2xl text-white justify-items-center'><FontAwesomeIcon icon={faEarthAmericas}  /></span></h1>
                      <span className='text-2xl text-white'> Distance</span><span className='mt-2 text-white'>{distance} Km</span>
                      </div>
                    </div>


                   
                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-2 flex flex-col">
                      <h1><span className='text-2xl text-red justify-items-center'><FontAwesomeIcon icon={faPlaneDeparture}  /></span></h1>
                      <span className='text-2xl text-white'> Airplane</span><span className='mt-2 text-white'>{flight} Kg</span>
                      </div>
                    </div>




                   

                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-2 flex flex-col">
                      <h1><span className='text-2xl text-yellow justify-items-center'><FontAwesomeIcon icon={faTrain}  /></span></h1>
                      <span className='text-2xl text-white'> Train</span><span className='mt-2 text-white'>{train} Kg</span>
                      </div>
                    </div>
                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-2 flex flex-col">
                      <h1><span className='text-2xl text-green justify-items-center'><FontAwesomeIcon icon={faBus}  /></span></h1>
                      <span className='text-2xl text-white'>Bus</span><span className='mt-2 text-white'>{bus} Kg</span>
                      </div>
                    </div>
                   
                  
                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-2 flex flex-col">
                      <h1><span className='text-2xl  justify-items-center text-[#00FF00]'><FontAwesomeIcon icon={faCar}  /></span></h1>
                      <span className='text-2xl text-white'>Car</span><span className='mt-2 text-white'>{car} Kg</span>
                      </div>
                    </div>
                  
                  
                   
                    <div className="w-full px-3 ">
                      <div className="mb-2">
                       
                      <button 
                      onClick={()=>saveCarbonTracker()}
                      className=" mt-4 hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                        Save Estimate
                    </button>
                      </div>
                      
                    </div>
                  </div>
                
                 {/* Place Upload Button Here */}
                  </div>
                  
                  </div>
         </div>
                </div>
    </div>
           
          </div>
        </div>
      </div>
          </section>
          <ul role="list" className="container p-8 mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {emissions.map((emission) => (
        <li
          key={emission.id}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-8">
  <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" src={'/images/co2green.png'} alt="" />
  <h3 className="text-lg font-bold text-gray-900">Estimate</h3>
  <h3 className="mt-6 text-sm font-medium text-gray-900">Passengers: {emission.passengers}</h3>

            <h3 className="mt-6 text-sm font-medium text-gray-900">Distance: {emission.distance} Km</h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Airplane</dt>
              <dd className="text-sm text-gray-500"><FontAwesomeIcon icon={faPlaneDeparture}  /> Airplane:  {emission.flight} Kg</dd>
              <dt className="sr-only">Train</dt>
              <dd className="mt-2 text-sm text-gray-500"><FontAwesomeIcon icon={faTrain}  /> Train:  {emission.train} Kg</dd>
              <dt className="sr-only">Bus</dt>
              <dd className="mt-2 text-sm text-gray-500"><FontAwesomeIcon icon={faBus}  /> Bus: {emission.bus} Kg</dd>
              <dt className="sr-only">Car</dt>
              <dd className="mt-2 text-sm text-gray-500"><FontAwesomeIcon icon={faCar}  /> Car: {emission.car}  Kg</dd>
              <dt className="sr-only">Role</dt>
              <dd className="mt-3">
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
         {format(emission.date, 'E do LLL Y hh:mm a')}
                </span>
              </dd>
            </dl>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <span
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                 {emission?.from}
                </span>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <span
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  {emission?.to}
                </span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  
    <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
     <Footer/>
     </main>
     </>
  )
}
