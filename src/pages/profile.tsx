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
          <div className="container">
        <div
          className="relative  overflow-hidden rounded-xl bg-bg-color"
        >
          <form className="p-8 sm:p-10"    onSubmit={ saveProfile}
>
            <div className="-mx-5 flex flex-wrap xl:-mx-8">
              <div className="w-full px-5 lg:w-5/12 xl:px-8">
                <div className="mb-12 lg:mb-0">
                  <div className="mb-8">
                    <input
                    
                       required={!selectedFile ? true: false}
                      type="file"
                      name="file"
                      id="file"
                      className="sr-only"
                      onChange={onSelectFile}
                    />
                    <label
                      for="file"
                      className="cursor-pointer relative flex h-[480px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                    >
                     <img src={preview ? preview: '/images/profile.jpg'}/>
                    </label>
                  </div>

            

                  <div className="rounded-md bg-[#4E4C64] py-4 px-8">
                   
                  <div className="pt-2">
                     <button
                     disabled={isLoading || isSaving || !signer}
                     
                      className="hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                        Save Profile
                    </button>

                   
                  </div>                    
                   
                  </div>
                </div>
              </div>
              <div className="w-full px-5 lg:w-7/12 xl:px-8">
                <div>
                  <div className="mb-5">
                    <label
                      for="name"
                      className="mb-2 block text-base font-medium text-white"
                    >
                      Profile Name
                    </label>
                    <input
                     required
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Enter profile name"
                      className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                    />
                  </div>
                 
                  <div className="mb-5">
                    <label
                      for="description"
                      className="mb-2 block text-base font-medium text-white"
                    >
                      Description
                    </label>
                    <textarea
                    required
                      rows="13"
                      name="description"
                      id="description"
                      placeholder="Type profile description"
                      className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                    ></textarea>
                  </div>
                 

                 
                 

                 
                 
                 
                 
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
          </section>
        
     <Footer/>
     </main>
     </>
  )
}
