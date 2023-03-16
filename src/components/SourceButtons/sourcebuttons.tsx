import { useState } from "react"
export default function SourceButtons(props:any){
   const [source,setSource] = useState(1)    
   const sourceButtonClicked = (value:any)=>{
      if(value == source)
         return
      setSource(value)
      props.sourceChanged(value)
   }
return(<div className=" m-4 absolute  right-4 z-50 opacity-80">
     <span className="isolate inline-flex rounded-md shadow-sm">
      <button
        onClick={()=>sourceButtonClicked(1)}
        type="button"
        className={`${source != 1 ? "hover:border-primary hover:bg-primary hover:text-white bg-white cursor-pointer": "cursor-default text-white"}  
        relative inline-flex items-center rounded-l-md 
         px-3 py-2 text-sm font-semibold text-gray-900 
        ring-1 ring-inset ring-gray-300  focus:z-10`}
      >
        OpenSky 
      </button>
      <button
      onClick={()=>sourceButtonClicked(2)}
        type="button"
        className={`${source != 2 ? "hover:border-primary hover:bg-primary hover:text-white bg-white cursor-pointer": "cursor-default text-white"}  
        relative inline-flex items-center rounded-l-md 
         px-3 py-2 text-sm font-semibold text-gray-900 
        ring-1 ring-inset ring-gray-300  focus:z-10`}   >
        AW3
      </button>
      <button
        onClick={()=>sourceButtonClicked(3)}
        type="button"
        className={`${source != 3 ? "hover:border-primary hover:bg-primary hover:text-white bg-white cursor-pointer": "cursor-default text-white"}  
        relative inline-flex items-center rounded-l-md 
         px-3 py-2 text-sm font-semibold text-gray-900 
        ring-1 ring-inset ring-gray-300  focus:z-10`}   >
        AW3 Verified
      </button>
    </span>
</div>)
}