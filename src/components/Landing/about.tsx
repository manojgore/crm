import React from "react";

import CountUp from 'react-countup';
import { Link } from "react-router-dom";

export default function About(){
    return(
        <section className="relative md:py-24 py-16" id="about">
            <div className="container relative">
                <div className="flex flex-col px-10 md:flex-row items-center justify-center gap-6">
                    <div className="md:col-span-4">
                        <div className="lg:me-8">
                            <div className="relative">
                                <img src='/assets/images/about.jpg' width={0} height={0} sizes="100vw" style={{width:'100%', height:'auto'}} className="rounded-full shadow dark:shadow-gray-700" alt=""/>

                                <div className="absolute top-1/2 -translate-y-1/2 start-0 end-0 mx-auto size-56 flex justify-center items-center bg-white dark:bg-slate-900 rounded-full shadow dark:shadow-gray-700">
                                    <div className="text-center">
                                        <span className="text-primary text-2xl font-semibold mb-0 block"><CountUp className="counter-value text-6xl font-semibold" start={0} end={15}/>+</span>
                                        <span className="font-semibold block mt-2">Years <br/> Experience</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-6">
                        <div className="lg:ms-8">
                            <h6 className="text-primary text-sm font-semibold uppercase mb-2">What we do ?</h6> 
                            <h3 className="font-semibold text-2xl leading-normal mb-4">We help you file your <br /> GST returns quickly. <br /> Stay GST compliant and leave your <br /> tax filing burden to our experts.</h3>

                            <p className="text-slate-400 max-w-xl mb-6">Simplify your GST filing with TaxRX. Our user-friendly platform guides you through each step of the GST filing process, ensuring accuracy and compliance. Easily upload your documents, calculate your GST liability, and submit your returns with confidence. With TaxRX, managing your GST has never been easier.</p>

                            {/* <Link to="" className="h-10 px-6 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-primary text-white">Read More <i className="mdi mdi-chevron-right align-middle ms-0.5"></i></Link> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}