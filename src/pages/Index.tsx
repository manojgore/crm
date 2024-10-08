import React, { useEffect } from "react";
import Navbar from "../components/Landing/navbar";
import SignupPage from "../pages/SignupPage"
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
        <div>
            <Navbar/>
            <SignupPage />
        </div>
    )
}