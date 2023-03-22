import { Polybase } from "@polybase/client";
import { useState } from "react";
import Notification from "../Notification/Notification";
export default function AirportData(props:any){
    // NOTIFICATIONS functions
const [notificationTitle, setNotificationTitle] = useState();
const [notificationDescription, setNotificationDescription] = useState();
const [dialogType, setDialogType] = useState(1);
const [show, setShow] = useState(false);
const close = async () => {
  setShow(false);
};

  const db = new Polybase({
    defaultNamespace: "pk/0x86b28d5590a407110f9cac95fd554cd4fc5bd611d6d88aed5fdbeee519f5792411d128cabf54b3035c2bf3f14c50e37c3cfc98523c2243b42cd394da42ca48f8/adsbweb3",
   });    
   const [airportData,setAirportData] = useState()
   const showFIDS = (displayType:number)=>{
    const scheduleDate = document.getElementById("scheduleDate").value;
 
    if(airportData ==null || airportData == undefined)
    {
      setDialogType(2) //Error
      setNotificationTitle("Select Airport")
      setNotificationDescription("Please select an airport.")
      setShow(true)
      return
    }
    if(scheduleDate == undefined || scheduleDate== "" || airportData == null)
      {
        setDialogType(2) //Error
        setNotificationTitle("Schedule Date")
        setNotificationDescription("Please enter a date.")
        setShow(true)
        return
      }
    props.showFIDS(displayType,scheduleDate) 
   }

   const  findAirport = async()=>{
      const airportCode = document.getElementById("airportCode").value;
      const airportName = document.getElementById("airportName").value;
      if(airportCode == "" && airportName=="")
      {
        setDialogType(2) //Error
        setNotificationTitle("Select Airport")
        setNotificationDescription("Please select an airport.")
        setShow(true)
        return
      }
       let _airportData 
       const airportCollection= db.collection("Airport");
       if(airportCode !="")
          _airportData= await airportCollection.where("ident","==",airportCode.toUpperCase()).get()
       else
       _airportData= await airportCollection.where("name","==",airportName).get()
       
       
        console.log(_airportData)
       if(_airportData.data.length > 0 ){
        setAirportData(_airportData.data[0].data)

           props.find(_airportData.data[0].data)
        
       }else
       setAirportData(null)
         

     }
    return(       <div className="m-4 p-4 border-2 border-dashed absolute  left-4 z-50  w-1/4 bg-white opacity-80">
       
                     <div> <label
                          for="airportCode"
                          className="mb-2 block text-base font-medium text-black"
                        >
                          Airport Code
                        </label>
                        <input
                        
                          type="text"
                          name="airportCode"
                          id="airportCode"
                          required
                          
                          placeholder="TTPP"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                         <label
                          for="airportName"
                          className="mt-2 mb-2 block text-base font-medium text-black"
                        >
                          Airport Name
                        </label>
                        <input
                         
                          type="text"
                          name="airportName"
                          id="airportName"
                          required
                          
                          placeholder="Piarco International Airport"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                           <button
                           onClick={()=>findAirport()}
                      className="mt-4 mb-4 hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                      Find
                    </button>
                    <input
                           required
                          type="date"
                          name="scheduleDate"
                          id="scheduleDate"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                    <div  className="flex flex-row space-x-4"> <button
                      className="mt-4 mb-4 hover:shadow-form w-1/2 rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    onClick={()=> showFIDS(1)}
                    >
                      Departures
                    </button>
                    <button
                      className="mt-4 mb-4 hover:shadow-form w-1/2  rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                      onClick={()=> showFIDS(2)}
                    >
                      Arrivals
                    </button></div>
                   
                         </div>
                         <div className="font-bold flex justify-between"><span>Ident:</span> <span>{airportData?.ident}</span></div>
  <div className="font-bold flex justify-between"><span>Name:</span> <span>{airportData?.name}</span></div>

  <div className="font-bold flex justify-between"><span>Type:</span>       <span>{airportData?.type}</span> </div>
  <div className="font-bold flex justify-between"><span>Latitude:</span>   <span>{airportData?.lattitude}</span></div>
  <div className="font-bold flex justify-between"><span>Longitude:</span>   <span>{airportData?.longitude}</span></div>
  <div className="font-bold flex justify-between"><span>Elevation:</span>   <span>{airportData?.elevation} FT</span></div>
  <div className="font-bold flex justify-between"><span>Continent:</span>   <span>{airportData?.continent}</span></div>
  <div className="font-bold flex justify-between"><span>Country:</span>     <span>{airportData?.iso_country}</span></div>
  <div className="font-bold flex justify-between"><span>City:</span>        <span>{airportData?.municipality}</span></div>
  <div className="font-bold flex justify-between"><span>Scheduled:</span>  <span> {airportData?.scheduled ? "Yes":"No"}</span></div>
  <div className="font-bold flex justify-between"><span>GPS Code:</span>    <span>{airportData?.gps_code}</span></div>
  <div className="font-bold flex justify-between"><span>Local Code:</span>  <span>{airportData?.local_code}</span></div>
  <div className="font-bold flex justify-between"><span>Region:</span>   <span>{airportData?.iso_region}</span></div>
  <div className="font-bold flex justify-between"><span>Link:</span>       <span><a href={airportData?.link ? airportData.link :"#"} target="_blank" className="text-gray-500">View</a></span></div>
  <div className="font-bold flex justify-between"><span>Wikipedia:</span>      <span> <a href={airportData?.wikipedia ? airportData.wikipedia :"#"} target="_blank" className="text-gray-500">View</a></span></div>
  
  
  <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
  
  </div>
    
    )
  }