import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlaneDeparture,faPlaneArrival,faBell } from '@fortawesome/free-solid-svg-icons'
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

export default function FIDS(props:any){
    return(       <div className="m-4 min-h-[770px] p-4 border-2 border-dashed border-white absolute  right-4 z-50  w-2/3  bg-black ">
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
                             fill="#FFFFFF"
                           />
                           <path
                             fill-rule="evenodd"
                             clip-rule="evenodd"
                             d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                             fill="#FFFFFF"
                           />
                         </svg>
                       </button>
                   
                       
                     </div>
  
                     <div >   <h1><span className='text-4xl'><FontAwesomeIcon  icon={props.type == 1? faPlaneDeparture:faPlaneArrival} /> {props.type == 1 ? "Departures":"Arrivals"}</span></h1>
                     <div class="departure-board mt-8">
                     <span class="letter letter-A"></span>
      <span class="letter letter-A"></span>
               
      <span class="letter letter-blank"></span>
                  
      <span class="letter letter-0"></span>
      <span class="letter letter-8"></span>
      <span class="letter letter-1"></span>
      <span class="letter letter-5"></span>
      <span class="letter letter-blank"></span>
      <span class="letter letter-N"></span>
      <span class="letter letter-E"></span>
      <span class="letter letter-W"></span>
      <span class="letter letter-blank"></span>
      <span class="letter letter-Y"></span>
      <span class="letter letter-O"></span>
      <span class="letter letter-R"></span>
      <span class="letter letter-K"></span>
      <span class="letter letter-blank"></span>
      <span class="letter letter-J"></span>
      <span class="letter letter-F"></span>
      <span class="letter letter-K"></span>
      <span class="letter letter-blank"></span>
      <span class="letter letter-1"></span>
      <span class="letter letter-0"></span>
      <span class="letter letter-0"></span>
      <span class="letter letter-0"></span>
      <span class="letter letter-P"></span>
      <span class="letter letter-M"></span>
      <span class="letter letter-blank"></span>
      
      <span class="letter letter-S"></span>
      <span class="letter letter-C"></span>
      <span class="letter letter-H"></span>
      <span class="letter letter-E"></span>
      <span class="letter letter-D"></span>
      <span class="letter letter-U"></span>
      <span class="letter letter-L"></span>
      <span class="letter letter-E"></span>
      <span class="letter letter-D"></span>
      <FontAwesomeIcon icon={faBell} className="cursor-pointer ml-6 text-white"/>


      </div>
      <div class="departure-board">
                     <span class="letter letter-A"></span>
      <span class="letter letter-A"></span>
               
      <span class="letter letter-blank"></span>
                  
      <span class="letter letter-0"></span>
      <span class="letter letter-8"></span>
      <span class="letter letter-1"></span>
      <span class="letter letter-5"></span>
      <span class="letter letter-blank"></span>
      <span class="letter letter-N"></span>
      <span class="letter letter-E"></span>
      <span class="letter letter-W"></span>
      <span class="letter letter-blank"></span>
      <span class="letter letter-Y"></span>
      <span class="letter letter-O"></span>
      <span class="letter letter-R"></span>
      <span class="letter letter-K"></span>
      <span class="letter letter-blank"></span>
      <span class="letter letter-J"></span>
      <span class="letter letter-F"></span>
      <span class="letter letter-K"></span>
      <span class="letter letter-blank"></span>
      <span class="letter letter-1"></span>
      <span class="letter letter-0"></span>
      <span class="letter letter-0"></span>
      <span class="letter letter-0"></span>
      <span class="letter letter-P"></span>
      <span class="letter letter-M"></span>
      <span class="letter letter-blank"></span>
      
      <span class="letter letter-S"></span>
      <span class="letter letter-C"></span>
      <span class="letter letter-H"></span>
      <span class="letter letter-E"></span>
      <span class="letter letter-D"></span>
      <span class="letter letter-U"></span>
      <span class="letter letter-L"></span>
      <span class="letter letter-E"></span>
      <span class="letter letter-D"></span>
      <FontAwesomeIcon icon={faBell} className="cursor-pointer ml-6 text-green-500"/>
      </div>
  </div>
  
  
  
  
  </div>
    
    )
  }