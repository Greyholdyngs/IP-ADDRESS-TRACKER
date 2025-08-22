import { useEffect, useState } from 'react'
import arrow from "../src/assets/images/icon-arrow.svg"
import locationIcon from "../src/assets/images/icon-location.svg"



function App() {

  const [ip, setIP] = useState('');

  const [error, setError] = useState('');

  const [ipData, setIPData] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(
    () => {
    
      //const apiKey = import.meta.env.VITE_APP_MY_KEY
      //const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=8.8.8.8`
      

      const fecthInitial = async () => {
        const url1 = `https://ipwho.is/json/`
        try {
          const res = await fetch(url1);
          const data = await res.json();
          setIPData(data.success === false ? null : data)
        } catch (e) {
          console.error(e)
        }
      };
      fecthInitial()
    }, []
  )

  const handleChange = (e) => {
    setIP(e.target.value)
    setError('')
  }
  const handleSubmit = async () => {
    if (!ip.trim()) {
        setError('Please type in an IP address or a domain');
        return;
    }

    setError('')
    setLoading(true)
    
    const target = ip.trim().split(/[\sl]+/)[0]

    try {
      const res = await fetch(`https://ipwho.is/${encodeURIComponent(target)}`);
      const data = await res.json();

      if (data.success === false) {
        setError(data.message || "Look up failed");
        setIPData(null)
      } else {
        setIPData(data)
      }
    }
    catch (e) {
      console.error(e);
      setError('failed to fecth ip data');
      setIPData(null)
    } finally {
      setLoading(false)
      setIP('')
  }
}

  //This variable below are created to safely navigate fallback to "-" 
  const ipText = ipData?.ip || "--";

  const locationText = [ipData?.city, ipData?.region, ipData?.country].filter(Boolean).join(', ') || "--";

  const timeZoneText = ipData?.timezone?.utc || ipData?.timezone || "--";

  const ispText = ipData?.connection?.isp || ipData?.isp || "--";
  return (
    <div className='h-screen'>
      <header className="bg-[url('/src/assets/images/pattern-bg-mobile.png')]
                          md:bg-[url('/src/assets/images/pattern-bg-desktop.png')] 
                         bg-cover
                        bg-no-repeat bg-center h-65 text-center pt-10">
        <h1 className='font-bold text-3xl text-white mb-5'>IP Address Tracker</h1>
        <div className='flex items-center justify-center'>
          <label htmlFor="">
            <input type="text"
                  placeholder='Search for any IP address or domain'
                  className={`bg-white rounded-l-lg md:w-80 w-75
                              md:py-2 py-4 md:pl-5 pl-3 text-md focus:outline-none
                            ${error ? "ring-1 ring-red-500 text-red-500" : ""}`}
                  onChange={handleChange}
                  value={ip}
            />
            <small className='text-red-500 font-semibold absolute block'>{error}</small>
          </label>
          <button className={`bg-black md:py-2 py-4 md:h-10 h-14 px-5 cursor-pointer
                              hover:bg-gray-400 duration-500 rounded-r-lg
                              ${error ? "bg-red-500 hover:bg-red-500" : ""}`}
                  onClick={handleSubmit}>
            <img src={arrow} alt="" />
          </button>
        </div>
      </header>
        <section className={`bg-[url("/src/assets/images/locations.jpg")]
                            bg-cover bg-no-repeat bg-center h-screen`}>
              <main className={`md:flex bg-white lg:w-3/4 md:w-170 w-80 shadow-xl justify-center
                                absolute md:top-55 top-50 lg:left-35 lg:right-35 md:left-10 md:right-10 
                                left-7 right-7   m-auto rounded-xl md:py-6 py-10 px-3`}>
                <div className={`md:border-r-1 px-15 font-semibold md:text-left text-center md:py-0 pb-2
                                border-gray-400`}>
                  <small className={`uppercase font-bold text-md text-gray-400`}>IP Address</small>
                  <h1>
                    <strong>{ipText}</strong>
                  </h1>
                </div>
                <div className={`md:border-r-1 px-15 font-semibold 
                                md:text-left text-center md:py-0 pb-2 border-gray-400`}>
                  <small className={`uppercase font-bold text-md text-gray-400`}>Location</small>
                  <h1>
                    <strong>{locationText}</strong>
                  </h1>
                </div>
                <div className={`md:border-r-1 px-15 font-semibold 
                                  md:text-left text-center md:py-0 pb-2 border-gray-400`}>
                  <small className={`uppercase font-bold text-md text-gray-400`}> Timezone</small>
                  <h1>
                    <strong>UTC {timeZoneText} </strong>
                  </h1>
                </div>
                <div className={`px-15 font-semibold md:text-left text-center md:py-0 pb-2`}>
                  <small className={`uppercase font-bold text-md text-gray-400`}>ISP</small>
                  <h1>
                    <strong>{ispText}</strong>
                  </h1>
                </div>
              </main>
                           {
                loading && (
                  <p className='absolute md:top-100 top-150 md:left-35 left-6'>
                    <strong>Loading....</strong>
                  </p>
                  )
              }
              <div className='absolute lg:top-130 md:top-230 top-170 lg:left-145 md:left-110 md:right-90 lg:right-14 left-40 right-40 '>
                <img className='w-30' src={locationIcon} alt="icon" />
              </div>
        </section>
    </div>)
}
export default App
