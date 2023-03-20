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
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

import PurchaseOffer from '@/components/CreateOffer/purchaseoffer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyCheckDollar,faMoneyBill1Wave } from '@fortawesome/free-solid-svg-icons'
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;
const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' }
,    { name: 'Lindsay Bill', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' }
,    { name: 'Lindsay Lohan-Spears', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' }

]
const tabs = [
    { name: 'My Account', href: '#', current: false },
    { name: 'Company', href: '#', current: false },
    { name: 'Team Members', href: '#', current: true },
    { name: 'Billing', href: '#', current: false },
  ]
export default function Profile() {
    const {address} = useAccount()
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()
    const [isSaving,setIsSaving] = useState(false)
    const [isLoading,setIsLoading]  = useState(true)
    const [profileMetada,setProfileMetadata] = useState()
    const { data: signer} = useSigner()
    const [openPurchaseOffer,setOpenPurchaseOffer] = useState(false)

  
    
   
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
    const purchaseOffer = ()=>{
        setOpenPurchaseOffer(true)
       } 
    
       const closePurchaseOffer = ()=>{
        setOpenPurchaseOffer(false)
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
      className= " pb-12 pt-24  z-10 overflow-hidden bg-cover bg-top bg-no-repeat "
          >
          <div className="container relative  flex flex-row min-h-[500px] bg-bg-color rounded-lg border sm:px-6 lg:px-8">
          
       <div className='m-3 w-full bg-white rounded-lg border'>
       <div className="mt-4 ml-4 sm:flex-auto">
          <h1 className="text-4xl font-bold leading-6 text-gray-900">Flight Insurance</h1>
          <p className="mt-4 text-sm text-gray-700">
            A list of Insurance Policies on Offer
          </p>
        </div>
         <div className="m-6">
           
          <ul role="list" className="p-4 bg-gray-100 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {people.map((person) => (
        <li
          key={person.email}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-8">
            <h1><span className='text-4xl text-green-600 justify-items-center'><FontAwesomeIcon icon={faMoneyCheckDollar}  /></span></h1>

            <h3 className="mt-6 text-4xl font-bold text-gray-900">$3000</h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Cost</dt>
              <dd className="text-sm text-gray-900">Cost: $15</dd>
              <dt className="sr-only">Date</dt>
              <dd className="mt-3">
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  12/12/2022
                </span>
              </dd>
              <dd className="text-sm text-gray-900">Status: Offered</dd>

            </dl>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              
              <div className="-ml-px flex w-0 flex-1">
                <span
                                onClick={purchaseOffer}

                  className="cursor-pointer relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  <FontAwesomeIcon icon={faMoneyBill1Wave}  /> PURCHASE
                </span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
          </div>
       </div>
      
      </div>
          </section>
     
  
          <PurchaseOffer open={openPurchaseOffer} setOpen={closePurchaseOffer}/>

     <Footer/>
     </main>
     </>
  )
}
