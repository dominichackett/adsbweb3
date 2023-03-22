import Head from 'next/head'
import Header from '@/components/Header/header'
import Footer from '@/components/Footer/footer'
import { useState,useEffect } from 'react'
import { NFTStorage } from "nft.storage";
import Notification from '@/components/Notification/Notification'
import { useContractRead,useSigner  } from 'wagmi'

import Papa from "papaparse"
import { ethers } from "ethers";
import { Polybase } from "@polybase/client";
import {ethPersonalSign} from '@polybase/eth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faPlaneDeparture } from '@fortawesome/free-solid-svg-icons'
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";


export default function UploadData() {


  
  const db = new Polybase({
      defaultNamespace: "pk/0x86b28d5590a407110f9cac95fd554cd4fc5bd611d6d88aed5fdbeee519f5792411d128cabf54b3035c2bf3f14c50e37c3cfc98523c2243b42cd394da42ca48f8/adsbweb3",
  });
  
  
    db.signer(async (data) => {
          
      
      return { h: 'eth-personal-sign', sig: ethPersonalSign(process.env.NEXT_PUBLIC_PRIVATE_KEY, data) }
    })

    useEffect(()=>{
      console.log(process.env.NEXT_PUBLIC_PRIVATE_KEY)
    },[])
  
  
    const [selectedFile, setSelectedFile] = useState(undefined)
    const [preview, setPreview] = useState()
    const [isSaving,setIsSaving] = useState(false)
    const [isLoading,setIsLoading]  = useState(true)
    const [profileMetada,setProfileMetadata] = useState()
    const { data: signer} = useSigner()
  
  
    
   
    // NOTIFICATIONS functions
      const [notificationTitle, setNotificationTitle] = useState();
      const [notificationDescription, setNotificationDescription] = useState();
      const [dialogType, setDialogType] = useState(1);
      const [show, setShow] = useState(false);
      const close = async () => {
        setShow(false);
      };
  
   
  const saveSchedule = async (data:any) =>{
    const arrivalData = db.collection("Arrival");
    const departureData = db.collection("Departure"); 
    for(const index in data)
    {
        if(data[index].airline== "null" )//Data is not valid
          continue

        try {
              const arrivalTime = new Date(data[index].arr_time).getTime() 
              const departureTime = new Date(data[index].dep_time).getTime()           
          
            const aid = data[index].airline_iata+data[index].flight_number+arrivalTime.toString()
            const did = data[index].airline_iata+data[index].flight_number+departureTime.toString()
            const departureRecord = [did,data[index].airline_iata
            ,data[index].flight_iata,data[index].flight_number,data[index].dep_iata
           ,data[index].arr_iata,( data[index].duration != "null" ? parseInt(data[index].duration):0),(data[index].dep_delayed != "null" ? parseInt(data[index].dep_delayed) : 0),
           (data[index].arr_delayed != "null" ? parseInt(data[index].arr_delayed) : 0),data[index].status,
            arrivalTime,0,0,departureTime,0]
            console.log(departureRecord)
            
            const arrivalRecord = [aid,data[index].airline_iata
            ,data[index].flight_iata,data[index].flight_number,data[index].dep_iata
           ,data[index].arr_iata,( data[index].duration != "null" ? parseInt(data[index].duration):0),(data[index].dep_delayed != "null" ? parseInt(data[index].dep_delayed) : 0),
           (data[index].arr_delayed != "null" ? parseInt(data[index].arr_delayed) : 0),data[index].status,
            arrivalTime,0,0,departureTime,0]
            console.log(departureRecord)
            
           // const recordDataArrival = await arrivalData.create(arrivalRecord)
            const recordDataDeparture = await departureData.create(departureRecord)


       }catch(error){
         console.log(error)   
       }
    }

      setDialogType(1)
      setNotificationTitle("Upload Schedule")
      setNotificationDescription("Successfully uploaded schedule.") 
       setShow(true)

  }


  const uploadSchedule = async (e) => {
    
    if(selectedFile==undefined)
    {
      setDialogType(2)
      setNotificationTitle("Upload Schedule")
      setNotificationDescription("No schedule file selected.") 
       setShow(true)
       return
    }

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results.data)
        saveSchedule(results.data)
      },
    });

  }
    
  const onSelectFile = (e) => {

    if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile(undefined)
        return
    }
  
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
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
      className= " pb-24 pt-24 relative z-10 overflow-hidden bg-cover bg-top bg-no-repeat "
          >
          <div className="container ">
        <div
          className="relative  overflow-hidden rounded-xl bg-bg-color"
        >
          <form className="p-8 sm:p-10"   
>
            <div className="-mx-5 flex flex-wrap xl:-mx-8  flex justify-center items-center">
              <div className="w-full px-5 lg:w-5/12 xl:px-8  ">
                <div className="mb-12 lg:mb-0">
                <div class="mb-8">
                    <input
                      onChange={onSelectFile}
                      type="file"
                      name="file"
                      id="file"
                      class="sr-only"
                    />
                    <label
                      for="file"
                      class="relative flex h-[480px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                    >
                      <div>
                        <div class="mb-4 text-center">
                          <FontAwesomeIcon className= 'text-gray-400 text-6xl' icon={faPlaneDeparture}  width={80} height={80}/>
                         
                        </div>
                        <span
                          class="mb-2 block text-xl font-semibold text-white"
                        >
Upload Flight Schedule Information                        </span>
                        
                        <span
                          class="mb-3 block text-base font-medium text-body-color"
                        >
                          Choose a file
                        </span>
                        <span
                          class="inline-flex rounded bg-white py-2 px-5 text-base font-semibold text-black"
                        >
                          Browse
                        </span>
                      </div>
                    </label>
                  </div>

            

                  <div className="rounded-md bg-[#4E4C64] py-4 px-8">
                   
                  <div className="pt-2">
                     <button
                     type="button"
                     onClick={()=>uploadSchedule()}
                     disabled={isSaving}
                     
                      className="hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                        Upload
                    </button>

                   
                  </div>                    
                   
                  </div>
                </div>
              </div>
              
            </div>
          </form>
        </div>
      </div>
          </section>
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
