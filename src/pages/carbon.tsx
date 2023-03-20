import Head from 'next/head'
import Header from '@/components/Header/header'
import Footer from '@/components/Footer/footer'
import { useState,useEffect } from 'react'
import { NFTStorage } from "nft.storage";
//import Notification from '@/components/Notification/Notification'
import { useContractRead,useSigner  } from 'wagmi'
import { ethers } from 'ethers'
import {
  useAccount 
 
} from 'wagmi'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEarthAmericas,faTrain,faCar,faBus, faPlaneDeparture } from '@fortawesome/free-solid-svg-icons'
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;
const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' }
,    { name: 'Lindsay Bill', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' }
,    { name: 'Lindsay Lohan-Spears', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' }

]
export default function Profile() {
    const {address} = useAccount()
    const [selectedFile, setSelectedFile] = useState()
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
  
      const contractReadProfile = null /*useContractRead({
        address:TicketManagerContractAddress,
        abi: TicketManagerContractABI,
        functionName: 'getProfile',
        enabled:false,
        args:[address]
        
      })*/
    
    const [nftstorage] = useState(
      new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_KEY })
    );
  
   //Get Profile
   useEffect(()=>{
     async function getProfile() {
        const profile = await contractReadProfile.refetch()
        console.log(profile);
        if(profile.data)
        {
          const url = profile.data.replace("ipfs://" ," https://nftstorage.link/ipfs/")
          fetch(url)
          .then((response) => response.json())
          .then(async (data) => { 
            console.log(data)
             document.getElementById("name").value = data.name
             document.getElementById("description").innerHTML = data.description 
             const imageUrl = data.image.replace("ipfs://" ," https://nftstorage.link/ipfs/")
             const image =  await fetch(imageUrl)
             if(image.ok)
             {
                
                   setSelectedFile(await image.blob())
                   // const objectUrl = URL.createObjectURL(await image.blob())
                   //setPreview(objectUrl)
             }   
  
          });
        }
  
        setIsLoading(false)
     }
    // getProfile()
   }
   ,[])
  
  
    
  
  
    // create a preview as a side effect, whenever selected file is changed
   useEffect(() => {
    if (!selectedFile) {
        setPreview(undefined)
        return
    }
  
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
  
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])
  
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile(undefined)
        return
    }
  
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
  }
    const saveProfile = async (e)=>{
       e.preventDefault()
       setIsSaving(true)
       setDialogType(3) //Information
       setNotificationTitle("Uploading Profile Picture.")
       setNotificationDescription("Saving Profile Picture.")
       setShow(true)
      
       const metadata = await nftstorage.store({
        name: document.getElementById("name").value,
         description: document.getElementById("description").value,
        image: selectedFile
        
      })
      setShow(false)
      if(!metadata){
         setDialogType(2) //Error
         setNotificationTitle("Save Profile Error.")
         setNotificationDescription("Error uploading profile picture.")
         setShow(true)
         return
      }
  
      setProfileMetadata(metadata.url)
      try {
        const contract = new ethers.Contract(
          TicketManagerContractAddress,
          TicketManagerContractABI,
          signer
        );
        //alert(JSON.stringify(myPolicy))
        let transaction = await contract.setProfile(
          metadata.url,{gasLimit:3000000}
        );
  
        await transaction.wait();
            setDialogType(1) //Success
            setNotificationTitle("Save Profile")
            setNotificationDescription("Profile save successfully.")
            setShow(true)
            setIsSaving(false)
            setProfileMetadata(undefined)
        
      } catch (_error) {
        setDialogType(2) //Error
        setNotificationTitle("Save Profile Error")
  
        setNotificationDescription(
          _error.data ? _error.data.message : _error.message
        );
        setShow(true)
        setIsSaving(false)
        setProfileMetadata(undefined)
  
   
      }
    
    } 
     
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
          <div className="p-8 sm:p-10"    onSubmit={ saveProfile}
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
                          placeholder="NYC"
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
                          id="fDate"
                          className="text-xs w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                      </div>
                      
                    </div>
                    <div className="w-full px-3 ">
                      <div className="mb-2">
                       
                      <button 
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
                      <span className='text-2xl text-white'> Distance</span><span className='mt-2 text-white'>3000 Km</span>
                      </div>
                    </div>


                   
                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-2 flex flex-col">
                      <h1><span className='text-2xl text-red justify-items-center'><FontAwesomeIcon icon={faPlaneDeparture}  /></span></h1>
                      <span className='text-2xl text-white'> Airplane</span><span className='mt-2 text-white'>287.96 Kg</span>
                      </div>
                    </div>




                   

                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-2 flex flex-col">
                      <h1><span className='text-2xl text-yellow justify-items-center'><FontAwesomeIcon icon={faTrain}  /></span></h1>
                      <span className='text-2xl text-white'> Train</span><span className='mt-2 text-white'>87.96 Kg</span>
                      </div>
                    </div>
                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-2 flex flex-col">
                      <h1><span className='text-2xl text-green justify-items-center'><FontAwesomeIcon icon={faBus}  /></span></h1>
                      <span className='text-2xl text-white'>Bus</span><span className='mt-2 text-white'>77.96 Kg</span>
                      </div>
                    </div>
                   
                  
                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-2 flex flex-col">
                      <h1><span className='text-2xl  justify-items-center text-[#00FF00]'><FontAwesomeIcon icon={faCar}  /></span></h1>
                      <span className='text-2xl text-white'>Car</span><span className='mt-2 text-white'>33.96 Kg</span>
                      </div>
                    </div>
                  
                  
                   
                    <div className="w-full px-3 ">
                      <div className="mb-2">
                       
                      <button 
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
      {people.map((person) => (
        <li
          key={person.email}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-8">
  <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" src={'/images/co2green.png'} alt="" />
  <h3 className="text-lg font-bold text-gray-900">Estimate</h3>
  <h3 className="mt-6 text-sm font-medium text-gray-900">Passengers: 3</h3>

            <h3 className="mt-6 text-sm font-medium text-gray-900">Distance: 3000 Km</h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Airplane</dt>
              <dd className="text-sm text-gray-500"><FontAwesomeIcon icon={faPlaneDeparture}  /> Airplane:  287.96 Kg</dd>
              <dt className="sr-only">Train</dt>
              <dd className="mt-2 text-sm text-gray-500"><FontAwesomeIcon icon={faTrain}  /> Train:  87.96 Kg</dd>
              <dt className="sr-only">Bus</dt>
              <dd className="mt-2 text-sm text-gray-500"><FontAwesomeIcon icon={faBus}  /> Bus:  77.96 Kg</dd>
              <dt className="sr-only">Car</dt>
              <dd className="mt-2 text-sm text-gray-500"><FontAwesomeIcon icon={faCar}  /> Car:  37.96 Kg</dd>
              <dt className="sr-only">Role</dt>
              <dd className="mt-3">
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  12/12/2023
                </span>
              </dd>
            </dl>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <a
                  href={`mailto:${person.email}`}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                 NYC
                </a>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <a
                  href={`tel:${person.telephone}`}
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  POS
                </a>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  
        
     <Footer/>
     </main>
     </>
  )
}
