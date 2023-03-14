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
      className= " pb-24 pt-24 relative z-10 overflow-hidden bg-cover bg-top bg-no-repeat "
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
              className="p-4 relative max-h-[480px] min-h-[480px] mb-12  flex flex-col  w-full  rounded-xl border border-dashed bg-white "
            >
       
          <h1 className="text-4xl font-bold leading-6 text-gray-900">Carbon Emissions Calculator</h1>
          
         </div>
                </div>
                <div className="mt-4 w-full px-4 lg:w-1/2 ">
            <div
              className="p-4 relative max-h-[480px] min-h-[480px] mb-12  flex flex-col  w-full  rounded-xl border border-dashed bg-white "
            >
       
          <h1 className="text-4xl font-bold leading-6 text-gray-900">Carbon Emissions Estimate</h1>
          
         </div>
                </div>
    </div>
           
          </div>
        </div>
      </div>
          </section>
        
     <Footer/>
     </main>
     </>
  )
}
