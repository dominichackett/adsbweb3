export default function FleetData(){
    return(       <div className="m-4 p-4 border-2 border-dashed absolute  left-4 z-50  w-1/4 bg-white opacity-70">
       
                     <div> <label
                          for="carrierCode"
                          className="mb-2 block text-base font-medium text-black"
                        >
                          Carrier Code
                        </label>
                        <input
                         
                          type="text"
                          name="carrierCode"
                          id="carrierCode"
                          required
                          
                          placeholder="BW or BWA"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                         <label
                          for="carrierName"
                          className="mt-2 mb-2 block text-base font-medium text-black"
                        >
                          Carrier Name
                        </label>
                        <input
                         
                          type="text"
                          name="carrierName"
                          id="carrierName"
                          required
                          
                          placeholder="Caribbean Airlines"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                           <button
                      className="mt-4 mb-4 hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                      Filter
                    </button>
                    
                 
                   
                         </div>
  <div className="font-bold flex justify-between"><span>Name:</span> <span>Caribbean Airlines</span></div>

  <div className="font-bold flex justify-between"><span>Alias:</span>       <span>CAL</span> </div>
  <div className="font-bold flex justify-between"><span>IATA:</span>   <span>BW</span></div>
  <div className="font-bold flex justify-between"><span>ICAO:</span>   <span>BWA</span></div>
  <div className="font-bold flex justify-between"><span>Callsign:</span>   <span>104 FT</span></div>
  <div className="font-bold flex justify-between"><span>Country:</span>     <span>Trinidad and Tobago</span></div>
  <div className="font-bold flex justify-between"><span>Active:</span>        <span>Yes</span></div>
  
  
  
  
  </div>
    
    )
  }