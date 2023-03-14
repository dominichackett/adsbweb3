export default function AircraftData(){
  return(       <div className="m-4 p-4 border-2 border-dashed absolute top-0 left-4 z-50  w-1/4 bg-white opacity-50">
       <div className="flex items-center justify-end">
                     
                     <button className="p-4">
                     
                       <svg
                         width="10"
                         height="10"
                         viewBox="0 0 10 10"
                         fill="none"
                         xmlns="http://www.w3.org/2000/svg"
                       >
                         <path
                           fill-rule="evenodd"
                           clip-rule="evenodd"
                           d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                           fill="currentColor"
                         />
                         <path
                           fill-rule="evenodd"
                           clip-rule="evenodd"
                           d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                           fill="currentColor"
                         />
                       </svg>
                     </button>
                 
                     
                   </div>
                   <div><img src={ '/images/aircraft/A320.svg'}className=" cursor-pointer relative flex h-[190px] min-h-[50px] w-full items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                />
                <span className="font-bold">Reg: NMG166</span><div className="font-bold justift-end">Type: Sling TSI Experimental</div>
</div>
<div className="font-bold justift-end">Flight: BW1020</div>
<div className="font-bold justift-end">Hex: BW1020</div>

<div className="font-bold justift-end">Squawk: 1045</div>
<div className="font-bold justift-end">Altittude: 12045</div>
<div className="font-bold justift-end">Speed: 104</div>
<div className="font-bold justift-end">Headding: 104</div>
<div className="font-bold justift-end">Latitue: 1045</div>
<div className="font-bold justift-end">Longitude: 1045</div>
<div className="font-bold justift-end">Signal: 14</div>






</div>
  
  )
}