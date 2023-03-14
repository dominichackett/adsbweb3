export default function AirportData(){
    return(       <div className="m-4 p-4 border-2 border-dashed absolute  left-4 z-50  w-1/4 bg-white opacity-70">
       
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
                      className="mt-4 mb-4 hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                      Find
                    </button>
                    <input
                           required
                          type="datetime-local"
                          name="endDate"
                          id="endDate"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                    <div  className="flex flex-row space-x-4"> <button
                      className="mt-4 mb-4 hover:shadow-form w-1/2 rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                      Departures
                    </button>
                    <button
                      className="mt-4 mb-4 hover:shadow-form w-1/2  rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                      Arrivals
                    </button></div>
                   
                         </div>
                         <div className="font-bold flex justify-between"><span>Code:</span> <span>TTPP</span></div>
  <div className="font-bold flex justify-between"><span>Name:</span> <span>Piarco International Airport</span></div>

  <div className="font-bold flex justify-between"><span>Type:</span>       <span>Medium Airport</span> </div>
  <div className="font-bold flex justify-between"><span>Latittude:</span>   <span>12045</span></div>
  <div className="font-bold flex justify-between"><span>Longitude:</span>   <span>104</span></div>
  <div className="font-bold flex justify-between"><span>Elevation:</span>   <span>104 FT</span></div>
  <div className="font-bold flex justify-between"><span>Continent:</span>   <span>NA</span></div>
  <div className="font-bold flex justify-between"><span>Country:</span>     <span>TT</span></div>
  <div className="font-bold flex justify-between"><span>City:</span>        <span>Port ofSpain</span></div>
  <div className="font-bold flex justify-between"><span>Scheduled:</span>  <span> Yes</span></div>
  <div className="font-bold flex justify-between"><span>GPS Code:</span>    <span>POS</span></div>
  <div className="font-bold flex justify-between"><span>Local Code:</span>  <span>POS</span></div>
  <div className="font-bold flex justify-between"><span>GPS Code:</span>   <span>POS</span></div>
  <div className="font-bold flex justify-between"><span>Link:</span>       <span><a href="#" className="text-gray-500">View</a></span></div>
  <div className="font-bold flex justify-between"><span>Wikipedia:</span>      <span> <a href="#" className="text-gray-500">View</a></span></div>
  
  
  
  
  </div>
    
    )
  }