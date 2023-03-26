import { Fragment, useRef, useEffect,useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faMoneyBill1Wave,  } from '@fortawesome/free-solid-svg-icons'
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function PurchaseOffer(props:any) {

  const purchaseInsurance = ()=>
  {
     const flight = document.getElementById("flightNumber").value
      const from = document.getElementById("from").value 
      const to = document.getElementById("to").value 
      const arrivalTime  =  document.getElementById("arrivalTime").value 
      const departureTime = document.getElementById("departureTime").value 
      props.purchaseInsurance(flight,from,to,departureTime,arrivalTime,props.id,props.cost,props.coverage)
     props.setOpen(false)
  }

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-6"  onClose={props.setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <FontAwesomeIcon icon={faMoneyBill1Wave}   className={"text-4xl text-green-600"}  />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-3xl font-bold leading-6 text-gray-900">
                      Purchase Insurance Policy
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                         Purchase a Peer 2 Peer insurance policy.
                        </p>
                    </div>
                  </div>
                  <div className="mt-4 ">
                    
                  <label
                          for="flightNumber"
                          className="mb-2 block text-base font-medium text-black"
                        >
                          Flight Number
                        </label>
                        <input
                         
                          type="text"
                          name="flightNumber"
                          id="flightNumber"
                          required
                          
                          placeholder="BW1974"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                        <div className='mt-2 sm:mt-2 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
                         <label
                          for="From"
                          className="mt-2 mb-2 block text-base font-medium text-black"
                        >
                          From
                        </label>
                        
                          <label
                          for="to"
                          className="mt-2 mb-2 block text-base font-medium text-black"
                        >
                          To
                        </label>
                        
                        </div>
                        <div className='flex flex-row space-x-4'>
                         
                        <input
                         
                          type="text"
                          name="From"
                          id="from"
                          required
                          
                          placeholder="Orgin City"
                          className="w-1/2 rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                                                <input
                         
                          type="text"
                          name="to"
                          id="to"
                          required
                          
                          placeholder="Destination City"
                          className="w-1/2 rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                        </div>

                        <div className='mt-2 sm:mt-2 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
                         
                          <label
                          for="departureTime"
                          className="mt-2 mb-2 block text-base font-medium text-black"
                        >
                          Departure Time
                        </label>
                        <label
                          for="arrivalTime"
                          className="mt-2 mb-2 block text-base font-medium text-black"
                        >
                          Arrival Time
                        </label>
                        
                        </div>
                        <div className='flex flex-row space-x-4'>
                         
                        <input
                         
                          type="datetime-local"
                          name=""
                          id="departureTime"
                          required
                          
                          
                          className="w-1/2 rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                                                <input
                         
                          type="datetime-local"
                          name="arrivalTime"
                          id="arrivalTime"
                          required
                          
                          className="w-1/2 rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                        </div>
                 </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={() => purchaseInsurance()}
                  >
                    Purchase
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => props.setOpen(false)}
                    
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
