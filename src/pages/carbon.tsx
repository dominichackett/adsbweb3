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

                    <div className="w-full px-3 ">
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
                    <div className="w-full px-3 ">
                      <div className="mb-5">
                       
                      <button 
                      className="hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
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
          <div className="mt-8 flow-root">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
                      Name
                    </th>
                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-white">
                      Title
                    </th>
                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-white">
                      Email
                    </th>
                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-white">
                      Role
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {people.map((person) => (
                    <tr key={person.email}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                        {person.name}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-300">{person.title}</td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-300">{person.email}</td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-300">{person.role}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <a href="#" className="text-indigo-400 hover:text-indigo-300">
                          Edit<span className="sr-only">, {person.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
