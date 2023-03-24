export default function FleetData(props){
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
                          <div className="font-bold flex justify-between ">

                           <button
                           onClick={()=> props.filterFleet(document.getElementById("carrierCode").value)}
                      className="mt-4 mb-4 hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                      Filter
                    </button>
                    
                    <button
                                               onClick={()=> props.clearFleetFilter()}

                      className="mt-4 mb-4 ml-2 hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                      Clear Filter
                    </button>
                 </div>
                   
                         </div>
  
  
  
  </div>
    
    )
  }