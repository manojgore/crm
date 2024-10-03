import React,{useState} from "react";
import { Link } from "react-router-dom";
import IconArrowForward from "../Icon/IconArrowForward";

export default function Cta(){
    let [isOpen, setOpen] = useState(false);
    return(
        <section className="relative md:py-24 py-16 md:pt-0 pt-0">
        <div className="container relative">
            <div className="w-full flex justify-center items-center">
                <div className="relative z-1">
                    <div className="flex items-center md:text-start text-center justify-center">
                        <div className="relative">
                            <img src='/assets/images/mac.png' alt=""/>
                        </div>
                    </div>
                    <div className="content md:mt-8">
                        <div className="flex items-center md:text-start text-center justify-center">
                            <div className="lg:col-start-2 lg:col-span-10 w-[80%]">
                                <div className="grid md:grid-cols-2 grid-cols-1 items-center">
                                    <div className="mt-8">
                                        <div className="section-title text-md-start">
                                            <h6 className="text-white/70 text-sm font-semibold uppercase">Get Free Trial</h6>
                                            <h3 className="font-semibold text-2xl leading-normal text-white mt-2">Get An Easy Start <br/> With Taxrx Now</h3>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <div className="section-title text-md-start">
                                            <p className="text-white/70 max-w-xl mx-auto mb-2">Purchase any paid plan or free plan to access your dashboard. Explore exclusive features to manage your business.</p>
                                            <Link to="/login" className="text-white flex items-center"><span className="mx-1 hover:mx-2 transition-all">Get Started</span> <IconArrowForward /></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="absolute bottom-0 start-0 end-0 sm:h-2/3 h-4/5 bg-gradient-to-b from-primary-light to-primary"></div>
    </section>
    )
}