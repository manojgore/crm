import React, { useState } from 'react';
import CountUp from 'react-countup';
import IconMonitor from '../Icon/IconMonitor';
import IconTrendUp from '../Icon/IconTrendUp';
import { useNavigate } from 'react-router-dom';
import { GetContext } from '../../context/UserContextProvider';


export default function HeroThree() {
    let [isOpen, setOpen] = useState(false);

    const context = GetContext();
    const {userGetStarted, setUserGetStarted} = context;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserGetStarted({...userGetStarted, [e.target.name]: e.target.value});
    }
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate('/signup');
    }

    return (
        <section className="relative flex items-start justify-center md:h-[80svh] bg-no-repeat bg-center bg-cover" id="home" style={{ backgroundImage: `url('/assets/images/landing_bg_2.png')` }}>
            <div className="container relative w-[80%] flex justify-center items-center">
                <div className="flex justify-center items-center mt-6 gap-6 relative">
                    <div className="lg:col-span-6 md:me-6">
                        <h4 className="font-semibold lg:leading-normal leading-normal tracking-wide text-4xl lg:text-5xl mb-5">
                            Streamline Your <br />Taxes with <span className="text-primary font-bold">Taxrx</span>
                        </h4>
                        <p className="text-slate-400 text-lg max-w-xl">Our user-friendly accounting software makes filing Income Tax and GST online a breeze.</p>
                        <div className='mt-10'>
                            <form onSubmit={handleSubmit}>
                                <div className='my-4'>
                                    <input type="text" name="username" onChange={handleChange} minLength={3} placeholder='Enter Your Username' className='border-2 rounded-lg w-[70%] px-2 py-1' />
                                </div>
                                <div className='my-4'>
                                    <input type="number" name="phoneNumber" onChange={handleChange} minLength={10} placeholder='Enter Your Number' className='border-2 rounded-lg w-[70%] px-2 py-1' />
                                </div>
                                <div className="relative mt-6 space-x-1">
                                    <button type='submit' className="h-10 px-6 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-primary text-white">
                                        Get Started
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-4 md:block hidden">
                        <div className="relative">
                            <img
                                src="/assets/images/about2.jpg"
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="mx-auto rounded-[150px] rounded-br-2xl shadow dark:shadow-gray-700 w-[85%]"
                                alt=""
                            />

                            <div className="overflow-hidden after:content-[''] after:absolute after:h-10 after:w-10 after:bg-teal-500/20 after:top-0 after:start-0 after:-z-1 after:rounded-lg after:animate-[spin_10s_linear_infinite]"></div>

                            <div className="absolute flex justify-between items-center bottom-16 md:-start-10 -start-5 p-4 rounded-lg shadow-md dark:shadow-gray-800 bg-white dark:bg-slate-900 w-60 m-3">
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center h-[65px] min-w-[65px] bg-teal-500/5 text-primary text-center rounded-full me-3">
                                        <IconMonitor className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-slate-400">Visitor</span>
                                        <p className="text-xl font-bold">
                                            <CountUp className="counter-value" start={0} end={4589} />
                                        </p>
                                    </div>
                                </div>

                                <span className="text-red-600 flex items-center">
                                    <IconTrendUp className="me-1" /> 0.5%
                                </span>
                            </div>

                            <div className="absolute top-16 md:-end-10 -end-5 p-4 rounded-lg shadow-md dark:shadow-gray-800 bg-white dark:bg-slate-900 w-48 m-3">
                                <h5 className="text-lg font-semibold mb-3">Happy Customers</h5>
                                <div className="flex justify-between mt-3 mb-2">
                                    <span className="text-slate-400">Progress</span>
                                    <span className="text-slate-400">84%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-[6px]">
                                    <div className="bg-primary h-[6px] rounded-full" style={{ width: '84%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
