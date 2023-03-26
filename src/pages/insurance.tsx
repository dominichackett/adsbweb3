import Head from 'next/head'
import Header from '@/components/Header/header'
import Footer from '@/components/Footer/footer'
import { useState,useEffect } from 'react'
import Notification from '@/components/Notification/Notification'
import { useContractRead,useSigner  } from 'wagmi'
import { ethers } from 'ethers'
import { insuranceContractAbi,insuranceContractAddress,insuranceUSDCAddress,usdcContractAbi } from '@/components/Contracts/contracts'
import { Polybase } from "@polybase/client";
import * as eth from '@polybase/eth'
import { format, fromUnixTime } from 'date-fns';

import {
  useAccount 
 
} from 'wagmi'
import CreateOffer from '@/components/CreateOffer/createoffer';
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEarthAmericas,faTrain,faCar,faBus, faPlaneDeparture, faMoneyCheckDollar, faTrash } from '@fortawesome/free-solid-svg-icons'
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

const tabs = [
    { name: 'My Policies', href: '#', current: true },
    { name: 'My Offers', href: '#', current: false },
   
  ]
export default function Profile() {
    const {address} = useAccount()
   
    const { data: signer} = useSigner()
    const [selectedTab,setSelectedTab] = useState('My Policies')
    const [openCreateOffer,setOpenCreateOffer] = useState(false)
    const [offers,setOffers] = useState([])
    const [myPolicies,setMyPolicies] = useState([])
    const [refreshData,setRefreshData] = useState(new Date())

    // NOTIFICATIONS functions
      const [notificationTitle, setNotificationTitle] = useState();
      const [notificationDescription, setNotificationDescription] = useState();
      const [dialogType, setDialogType] = useState(1);
      const [show, setShow] = useState(false);
      const close = async () => {
        setShow(false);
      };
  
   
    
 
      useEffect(()=>{
        async function getOffers(){
          const db = new Polybase({
            defaultNamespace: "pk/0x86b28d5590a407110f9cac95fd554cd4fc5bd611d6d88aed5fdbeee519f5792411d128cabf54b3035c2bf3f14c50e37c3cfc98523c2243b42cd394da42ca48f8/adsbweb3",
          });
          const policyOffers = db.collection("PolicyOffer");

          const records = await policyOffers.where("owner","==",address).get()
          //console.log(records)
          let _data = []
          records.data.forEach((record)=>{
              _data.push(record.data)
          })

          setOffers(_data)
          console.log(_data)

        }


        async function getPolicies(){
          const db = new Polybase({
            defaultNamespace: "pk/0x86b28d5590a407110f9cac95fd554cd4fc5bd611d6d88aed5fdbeee519f5792411d128cabf54b3035c2bf3f14c50e37c3cfc98523c2243b42cd394da42ca48f8/adsbweb3",
          });
          const policy = db.collection("Policy");

          const records = await policy.where("owner","==",address).get()
          //console.log(records)
          let _data = []
          records.data.forEach((record)=>{
              _data.push(record.data)
          })

          setMyPolicies(_data)
          

        }
        getPolicies()
        getOffers()
    },[refreshData])
  
    const settlePolicy =  async (id)=> {
      try {
    
        const contract = new ethers.Contract(
          insuranceContractAddress,
          insuranceContractAbi,
          signer
        );
          
            let tx3 = await contract.callStatic.settlePolicy(parseInt(id),{
              gasLimit: 3000000}) 
         let transaction = await contract.settlePolicy(id,{
          gasLimit: 3000000})
          const receipt = await transaction.wait(); // wait for the transaction to be mined
          
        await transaction.wait();
            setDialogType(1) //Success
            setNotificationTitle("Settle Policy")
            setNotificationDescription("Settling policy.")
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
        setNotificationTitle("Error Settling Policy")
    
        setShow(true)
    
    
      }
    
     }
     
    const deletePolicy =  async (id)=> {

      const db = new Polybase({
        defaultNamespace: "pk/0x86b28d5590a407110f9cac95fd554cd4fc5bd611d6d88aed5fdbeee519f5792411d128cabf54b3035c2bf3f14c50e37c3cfc98523c2243b42cd394da42ca48f8/adsbweb3",
      });
  
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
     
      const policyOffer = db.collection("PolicyOffer");
  
      try {
    
        const contract = new ethers.Contract(
          insuranceContractAddress,
          insuranceContractAbi,
          signer
        );
            
            let tx3 = await contract.callStatic.deletePolicy(parseInt(id),{
              gasLimit: 3000000}) 
              
         let transaction = await contract.deletePolicy(id,{
          gasLimit: 3000000})
          const receipt = await transaction.wait(); // wait for the transaction to be mined
          const x = await policyOffer.record(id).call("del")
          
        await transaction.wait();
            setDialogType(1) //Success
            setNotificationTitle("Settle Policy")
            setNotificationDescription("Settling policy.")
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
        setNotificationTitle("Error Settling Policy")
    
        setShow(true)
    
    
      }
    
     }
     
  
 const processInsurance =  async (id)=> {
  try {
       

    const usdcContract  = new ethers.Contract(insuranceUSDCAddress,usdcContractAbi,signer)
    const contract = new ethers.Contract(
      insuranceContractAddress,
      insuranceContractAbi,
      signer
    );
  
    const bond  =  ethers.utils.parseUnits("10",6)

    let tx = await usdcContract.callStatic.approve(insuranceContractAddress ,bond,{
      gasLimit: 3000000})
      console.log(tx)
    
      let tx1 = await usdcContract.approve( insuranceContractAddress,bond,{
        gasLimit: 3000000})
     
        await  tx1.wait()
        let tx3 = await contract.callStatic.reedemPolicy(id,{
          gasLimit: 3000000}) 
     let transaction = await contract.reedemPolicy(parseInt(id),{
      gasLimit: 3000000})
      const receipt = await transaction.wait(); // wait for the transaction to be mined
      
    await transaction.wait();
        setDialogType(1) //Success
        setNotificationTitle("Process Policy")
        setNotificationDescription("Proccessing policy.")
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
    setNotificationTitle("Error Processing Policy")

    setShow(true)


  }

 }
  const createInsurance = async (coverage,premium) =>{

    const db = new Polybase({
      defaultNamespace: "pk/0x86b28d5590a407110f9cac95fd554cd4fc5bd611d6d88aed5fdbeee519f5792411d128cabf54b3035c2bf3f14c50e37c3cfc98523c2243b42cd394da42ca48f8/adsbweb3",
    });

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
   
    const policyOffer = db.collection("PolicyOffer");

     
    try {

      const usdcContract  = new ethers.Contract(insuranceUSDCAddress,usdcContractAbi,signer)
      const contract = new ethers.Contract(
        insuranceContractAddress,
        insuranceContractAbi,
        signer
      );
         const _coverage = ethers.utils.parseUnits(coverage.toString(),6)
         const _premium  =  ethers.utils.parseUnits(premium.toString(),6)
        let tx = await usdcContract.callStatic.approve(insuranceContractAddress ,_coverage,{
        gasLimit: 3000000})
        console.log(tx)
      
        let tx1 = await usdcContract.approve( insuranceContractAddress,_coverage,{
          gasLimit: 3000000})
       
          await  tx1.wait()
      
          let tx3 = await contract.callStatic.createPolicy( _coverage,_premium,{
            gasLimit: 3000000}) 
        console.log(tx)    
       let transaction = await contract.createPolicy(_coverage,_premium,{
        gasLimit: 3000000})
        const receipt = await transaction.wait(); // wait for the transaction to be mined
        console.log(receipt)
        const policyId = receipt.events[1].args[5].toString();
        const policyDate = new Date().getTime()
        const recordData = await policyOffer.create([policyId.toString(),parseInt(coverage),parseInt(premium),"Created",policyDate,address])      
      
      await transaction.wait();
          setDialogType(1) //Success
          setNotificationTitle("Create Policy")
          setNotificationDescription("You have succesfully created a policy.")
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
      setNotificationTitle("Error Creating Policy")
  
      setShow(true)
  
  
    }
  
 
  }

   const createOffer = ()=>{
    setOpenCreateOffer(true)
   } 

   const closeCreateOffer = ()=>{
    setOpenCreateOffer(false)
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
        <script src="https://kit.fontawesome.com/dd348bbd0a.js" crossOrigin="anonymous"></script>
      </Head>
      <main  className="bg-black">
             <Header/>
           
            
             <section
      id="home"
      className= " pb-12 pt-24  z-10 overflow-hidden bg-cover bg-top bg-no-repeat "
          >
          <div className="container relative  flex flex-row min-h-[500px] bg-bg-color rounded-lg border sm:px-6 lg:px-8">
          
       <div className=' m-3 w-full bg-white rounded-lg border'>
       <div className="mt-4 ml-4 sm:flex-auto">
          <h1 className="text-4xl font-bold leading-6 text-gray-900">My Flight Insurance</h1>
          <p className="mt-4 text-sm text-gray-700">
            A list of all my Insurance Policies
          </p>
        </div>
        <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
          defaultValue={tabs.find((tab) => tab.current).name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={()=> setSelectedTab(tab.name)}
                className={classNames(
                  tab.name == selectedTab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium'
                )}
                aria-current={tab.name == selectedTab ? 'page' : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
          {selectedTab == 'My Policies'&& <div className="m-6">
          <ul role="list" className="p-4 bg-gray-100 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {myPolicies.map((policy) => (
        <li
          key={policy.id}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-8">
            <h1><span className='text-4xl text-green-600 justify-items-center'><FontAwesomeIcon icon={faPlaneDeparture}  /></span></h1>

            <h3 className="mt-6 text-4xl font-bold text-gray-900">${policy.coverage}</h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Cost</dt>
              <dd className="text-sm text-gray-900">Cost: ${policy.cost}</dd>
              <dt className="sr-only">Date</dt>
              <dd className="mt-3">
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  {policy.date}
                </span>
              </dd>
              <dd className="text-sm text-gray-900">Status: {policy.status}</dd>

            </dl>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <span
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  {policy.from}
                </span>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <span
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  {policy.to}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <button
                  onClick={()=>processInsurance(policy.offerId)}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  Claim
                </button>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <button
                 onClick={()=>settlePolicy(policy.offerId)}
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  Settle
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
          </div>}

          {selectedTab == 'My Offers'&& <div className="m-6">
            <button     
                              onClick={createOffer}
           
                  className="mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
                  >Create Offer</button>
          <ul role="list" className="p-4 bg-gray-100 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {offers.map((offer) => (
        <li
          key={offer.id}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-8">
            <h1><span className='text-4xl text-green-600 justify-items-center'><FontAwesomeIcon icon={faMoneyCheckDollar}  /></span></h1>

            <h3 className="mt-6 text-4xl font-bold text-gray-900">${offer.coverage}</h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Cost</dt>
              <dd className="text-sm text-gray-900">Cost: ${offer.cost}</dd>
              <dt className="sr-only">Date</dt>
              <dd className="mt-3">
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                {format(offer.date, 'E do LLL Y hh:mm a')}

                </span>
              </dd>
              <dd className="text-sm text-gray-900">Status: {offer.status}</dd>

            </dl>
          </div>
          <div>
            <div className="-mt-px flex  divide-y divide-gray-200">
              
              <div className="-ml-px flex w-0 flex-1">
                <button
                  onClick={()=>deletePolicy(offer.id)}
                  className="cursor-pointer relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  <FontAwesomeIcon icon={faTrash}  /> DELETE
                </button>
              </div>
            </div>
            <div className="-mt-px flex divide-x  divide-gray-200">
              <div className="flex w-0 flex-1 ">
                <button
                onClick={()=>processInsurance(offer.id)}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  PROCESS
                </button>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <button
                 onClick={()=>settlePolicy(offer.id)}
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  SETTLE
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
          </div>}
        </div>
      </div>
    </div>
  
       </div>
    
      </div>
          </section>
     
  
        <CreateOffer open={openCreateOffer} setOpen={closeCreateOffer} createInsurance={createInsurance}/>
     <Footer/>
     <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
     </main>
     </>
  )
}
