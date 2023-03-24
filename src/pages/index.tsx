import Head from 'next/head'
import Header from '@/components/Header/header'
import Footer from '@/components/Footer/footer'
import Link from 'next/link'
import Pricing from '@/components/Pricing/pricing'
export default function Home() {
  return (
    <>
      <Head>
      <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css?family=Fira+Sans&display=swap" rel="stylesheet"/>   
     <title>Ads-B Web3 - Open Source Real Time Flight Data</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://kit.fontawesome.com/dd348bbd0a.js" crossorigin="anonymous"></script>
      </Head>
      <main className="bg-black"
       
     >
    
     <Header/>
     <section
      id="home"
      className= " bg-[url('/images/airport.jpg')] relative z-10 overflow-hidden bg-cover bg-top bg-no-repeat pt-[150px] pb-24"
          >
      <div
        className="grade absolute left-0 top-0 -z-10 h-full w-full"
       
        
      ></div>      
      <div
        className="absolute left-0 top-0 -z-10 h-full w-full"
      
      ></div>
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div className="mb-12 max-w-[570px] lg:mb-0">
              <h1
                className="mb-4 text-[40px] font-bold leading-tight text-white md:text-[50px] lg:text-[40px] xl:text-[46px] 2xl:text-[50px] sm:text-[46px]"
              >
                Open Source Real Time Worldwide Flight Traffic and Airport Information
              </h1>
              <p
                className="mb-8 text-lg font-medium leading-relaxed text-body-color md:pr-14"
              >
                Ads-B Web3 is a decentralized flight tracking and airport information system that operates on the Web3 blockchain. It enables users to track flights and access real-time information about airports without relying on a centralized authority. This system leverages the benefits of blockchain technology such as transparency, immutability, and security, to ensure the accuracy and reliability of the data being shared. 
                </p>
         <div className="flex flex-wrap items-center">
                <Link
                  href="/tracking"
                  className="mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
                >
                  Flight Tracking
                </Link>
                <Link
                  href="create-item.html"
                  className="mb-5 inline-flex items-center justify-center rounded-md border-2 border-white py-3 px-7 text-base font-semibold text-white transition-all hover:border-primary hover:bg-primary"
                >
                  About
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full px-4 lg:w-1/2">
            <div className="text-center">
            <div id="circle">
      <div id="sector"></div>
      <div id="dot"></div>

    </div>
    <div id="logo" className='mt-4'>Ads-b Web3 <div id="flight"><svg xmlns="http://www.w3.org/2000/svg"
     
     viewBox="0 0 160 80">
  <path id="Imported Path"
        fill="green" stroke="green" stroke-width="2"
        d="M 82.33,12.84
           C 82.39,17.96 82.36,20.00 82.20,22.61
             82.10,24.42 81.99,25.93 81.98,25.94
             81.95,25.95 77.30,26.16 71.62,26.43
             57.24,27.06 34.23,28.10 31.76,28.21
             31.76,28.21 29.73,28.31 29.73,28.31
             29.73,28.31 27.64,26.65 27.64,26.65
             26.50,25.72 25.51,24.94 25.45,24.88
             25.40,24.82 25.23,23.89 25.08,22.79
             25.08,22.79 24.80,20.81 24.80,20.81
             24.80,20.81 23.43,20.66 23.43,20.66
             22.68,20.59 21.83,20.51 21.54,20.51
             21.04,20.50 21.00,20.53 21.00,20.82
             21.00,21.06 20.95,21.14 20.81,21.07
             20.71,21.04 17.66,18.62 14.03,15.71
             14.03,15.71 7.44,10.41 7.44,10.41
             7.44,10.41 4.34,10.72 4.34,10.72
             2.64,10.91 1.25,11.09 1.25,11.14
             1.25,11.19 3.75,15.40 6.81,20.50
             9.88,25.60 12.38,29.79 12.38,29.81
             12.38,29.84 12.05,29.89 11.65,29.94
             9.62,30.15 8.10,30.57 7.88,31.00
             7.80,31.12 7.75,31.61 7.75,32.09
             7.76,33.52 8.30,34.31 9.73,34.96
             10.08,35.14 10.38,35.29 10.38,35.30
             10.38,35.32 8.08,36.80 5.25,38.57
             2.43,40.35 0.12,41.88 0.12,41.96
             0.12,42.18 -0.05,42.18 3.33,41.81
             3.33,41.81 6.21,41.50 6.21,41.50
             6.21,41.50 11.56,39.38 11.56,39.38
             11.56,39.38 16.93,37.24 16.93,37.24
             16.93,37.24 18.62,37.68 18.62,37.68
             21.41,38.40 32.85,40.96 34.62,41.26
             35.54,41.41 39.69,41.70 44.31,41.94
             60.99,42.79 64.89,43.04 67.50,43.38
             68.50,43.51 69.54,43.64 69.80,43.65
             69.80,43.65 70.29,43.69 70.29,43.69
             70.29,43.69 69.08,45.25 69.08,45.25
             65.88,49.36 67.61,47.90 50.69,60.65
             42.38,66.91 35.46,72.12 35.34,72.25
             35.12,72.45 35.12,72.46 35.39,72.80
             35.96,73.54 37.41,73.84 38.69,73.49
             40.03,73.12 47.68,68.84 64.69,58.94
             64.69,58.94 71.19,55.15 71.19,55.15
             71.19,55.15 74.88,55.83 74.88,55.83
             80.14,56.79 82.49,57.05 87.51,57.20
             89.06,57.25 90.54,57.25 90.79,57.20
             91.74,57.03 92.36,56.01 92.75,54.04
             93.23,51.61 92.54,49.36 91.09,48.61
             90.09,48.09 87.65,48.18 83.33,48.89
             82.10,49.09 81.06,49.24 81.05,49.21
             81.03,49.19 82.81,47.95 85.04,46.48
             85.04,46.48 89.06,43.79 89.06,43.79
             89.06,43.79 90.88,43.71 90.88,43.71
             93.31,43.62 96.46,42.99 101.60,41.56
             102.68,41.28 109.60,40.99 125.44,40.56
             141.86,40.14 144.30,40.04 145.88,39.74
             150.14,38.91 155.98,37.22 157.90,36.25
             158.90,35.74 159.58,35.20 159.83,34.71
             160.04,34.31 160.01,33.51 159.74,32.43
             159.45,31.28 158.21,30.35 155.69,29.36
             154.88,29.04 153.90,28.54 153.31,28.14
             150.46,26.19 149.75,25.78 148.16,25.21
             146.36,24.56 143.05,24.12 137.44,23.80
             137.44,23.80 133.81,23.59 133.81,23.59
             133.81,23.59 119.69,24.24 119.69,24.24
             111.93,24.59 103.12,25.00 100.14,25.14
             97.15,25.28 94.70,25.36 94.69,25.35
             94.68,25.32 94.39,24.55 94.04,23.62
             93.69,22.70 92.15,18.64 90.62,14.61
             90.62,14.61 87.85,7.29 87.85,7.29
             87.85,7.29 85.21,6.83 85.21,6.83
             83.75,6.58 82.50,6.38 82.41,6.38
             82.29,6.38 82.28,7.83 82.33,12.84 Z" />
</svg>Flight Data</div></div>

            </div>
          </div>
        </div>
      </div>

      
    </section>
    <Pricing />
     <Footer/>
     </main>
     </>
  )
}
