import React, { useEffect } from "react";
import Navbar from "../components/Landing/navbar";
import HeroThree from "../components/Landing/herothree";
import About from "../components/Landing/about";
import Services from "../components/Landing/services";
import Pricing from "../components/Landing/pricing";
import Footer from "../components/Landing/footer";
import Cta from "../components/Landing/cta";
import { useLocation, useNavigate } from "react-router-dom";
export default function LandingPage(){
    const navigate = useNavigate();
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    useEffect(() => {
        if (localStorage.getItem('adminidtaxrx')) {
            navigate('/admin-dashboard');
        } else if (localStorage.getItem('customeridtaxrx')) {
            navigate('/user-dashboard');
        }
    }, []);
    return(
        <div className={`font-libre_franklin text-base text-black dark:text-white bg-white dark:bg-slate-900`}>
            <Navbar/>
            <HeroThree/>
            <About/>
            <Services/>
            <Cta/>
            <Pricing/>
            <Footer/>
        </div>
    )
}