import Head from 'next/head'
import Header from '@/components/Header/header'
import Footer from '@/components/Footer/footer'
import { useState,useEffect } from 'react'
import Notification from '@/components/Notification/Notification'
import { useContractRead,useSigner  } from 'wagmi'
import { ethers } from 'ethers'
import { insuranceContractAbi,insuranceContractAddress,insuranceUSDCAddress,usdcContractAbi } from '@/components/Contracts/contracts'

import {
  useAccount 
 
} from 'wagmi'
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  import { Polybase } from "@polybase/client";
  import * as eth from '@polybase/eth'
  import { format, fromUnixTime } from 'date-fns';
import PurchaseOffer from '@/components/CreateOffer/purchaseoffer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyCheckDollar,faMoneyBill1Wave } from '@fortawesome/free-solid-svg-icons'
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

export default function Profile() {
    const {address} = useAccount()
   
    const { data: signer} = useSigner()
    const [openPurchaseOffer,setOpenPurchaseOffer] = useState(false)
    const [offers,setOffers] = useState([])
    const [refreshData,setRefreshData] = useState(new Date())
    const [offerId,setOfferId]  = useState()
    const [cost,setCost] = useState()
    const [coverage,setCoverage] = useState()

  
    useEffect(()=>{
      async function getOffers(){
        const db = new Polybase({
          defaultNamespace: "pk/0x86b28d5590a407110f9cac95fd554cd4fc5bd611d6d88aed5fdbeee519f5792411d128cabf54b3035c2bf3f14c50e37c3cfc98523c2243b42cd394da42ca48f8/adsbweb3",
        });
        const policyOffers = db.collection("PolicyOffer");

        const records = await policyOffers.get()
        //console.log(records)
        let _data = []
        records.data.forEach((record)=>{
            _data.push(record.data)
        })

        setOffers(_data)
        console.log(_data)

      }

      getOffers()
  },[refreshData])

   
    // NOTIFICATIONS functions
      const [notificationTitle, setNotificationTitle] = useState();
      const [notificationDescription, setNotificationDescription] = useState();
      const [dialogType, setDialogType] = useState(1);
      const [show, setShow] = useState(false);
      const close = async () => {
        setShow(false);
      };
  
     
   
    
  
  
  
 
    const purchaseInsurance = async (flight,from,to,departureTime,arrivalTime,offerId,_cost,_coverage)=> {
      const insuredEvent = flight+" From: "+from+" To: "+to+" Departs: "+departureTime+" Arrives: "+arrivalTime
     
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
      const policy = db.collection ("Policy")
      try {
       

        const usdcContract  = new ethers.Contract(insuranceUSDCAddress,usdcContractAbi,signer)
        const contract = new ethers.Contract(
          insuranceContractAddress,
          insuranceContractAbi,
          signer
        );
      
        const premium  =  ethers.utils.parseUnits(_cost.toString(),6)
        const insuredEventBytes = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(insuredEvent));

        let tx = await usdcContract.callStatic.approve(insuranceContractAddress ,premium,{
          gasLimit: 3000000})
          
        
          let tx1 = await usdcContract.approve( insuranceContractAddress,premium,{
            gasLimit: 3000000})
         
            await  tx1.wait()
            let tx3 = await contract.callStatic.purchasePolicy(parseInt(offerId),insuredEventBytes,{
              gasLimit: 3000000}) 

         let transaction = await contract.purchasePolicy(parseInt(offerId),insuredEventBytes,{
          gasLimit: 3000000})
          const receipt = await transaction.wait(); // wait for the transaction to be mined
          const y = await policy.create([receipt.transactionHash,flight,from,to,new Date(arrivalTime).getTime()
            ,new Date(departureTime).getTime(),parseInt(_coverage),parseInt(_cost)
            ,"Active",new Date().toString(),address,parseInt(offerId)])
          const x = await policyOffer.record(offerId).call("setStatus",["Active"])

          await transaction.wait();
            setDialogType(1) //Success
            setNotificationTitle("Purchase Policy")
            setNotificationDescription("Sucessfully purchased policy.")
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
        setNotificationTitle("Error Purchasing Policy")
    
        setShow(true)
    
    
      }
    }


    const purchaseOffer = (_id,_cost,_coverage)=>{
         setOfferId(_id)
         setCost(_cost)
         setCoverage(_coverage)

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
            <div className="-mt-px flex divide-x divide-gray-200">
              
              <div className="-ml-px flex w-0 flex-1">
                <span
                                onClick={()=>purchaseOffer(offer.id,offer.cost,offer.coverage)}

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
     
          <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
          <PurchaseOffer open={openPurchaseOffer} id={offerId} cost={cost} coverage={coverage} setOpen={closePurchaseOffer} purchaseInsurance={purchaseInsurance}/>

     <Footer/>
     </main>
     </>
  )
}
