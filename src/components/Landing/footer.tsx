import React from "react";
import { Link } from "react-router-dom";
import IconFacebook from "../Icon/IconFacebook";
import IconInstagram from "../Icon/IconInstagram";
import IconTwitter from "../Icon/IconTwitter";
import IconLinkedin from "../Icon/IconLinkedin";
import IconMail from "../Icon/IconMail";
import { HashLink } from "react-router-hash-link";

export default function Footer(){
    return(
        <footer className="footer bg-dark-footer relative text-gray-200 dark:text-gray-200 flex flex-col justify-center items-center" id="landing-footer">
            <div className="flex w-full md:w-[90%] flex-col md:flex-row justify-around items-center md:items-start py-8">
                <div className="flex justify-between items-start md:w-[50%] w-[90%] my-2">
                    <div className="flex flex-col items-start justify-center mx-4 w-[60%]">
                        <HashLink to='#landing-navbar'><img src='/assets/images/logo.png' width={150} height={40} className="mx-auto md:me-auto md:ms-0 cursor-pointer" alt=""/></HashLink>
                        <p className="text-gray-500">Taxrx simplifies tax filing, invoicing, and expense tracking with user-friendly tools, exceptional support, and robust security, making financial management easy.</p>
                    </div>
                    <div className="flex flex-col items-start justify-center mx-6">
                        <h5 className="text-xl my-2 text-gray-600 font-semibold">Important Links</h5>
                        <span className="w-[100%] h-[3px] bg-primary"></span>
                        <Link className="my-2 text-gray-600" to='/'>Home</Link>
                        <Link className="my-2 text-gray-600" to='/refund-policy'>Refund Policy</Link>
                        <Link className="my-2 text-gray-600" to='/privacy-policy'>Privacy Policy</Link>
                        <Link className="my-2 text-gray-600" to='/terms-and-condition'>Terms & Conditions</Link>
                        <Link className="my-2 text-gray-600" to='/terms-of-use'>Terms of Use</Link>
                        <Link className="my-2 text-gray-600" to='/faq'>FAQ</Link>
                    </div>
                </div>

                <div className="flex justify-around items-start md:w-[50%] w-[90%] my-2">
                    <div className="flex flex-col items-start justify-center mx-6">
                        <h5 className="text-xl my-2 text-gray-600 font-semibold">Get in Touch</h5>
                        <span className="w-[100%] h-[3px] bg-primary"></span>
                        <Link to='mailto:info@taxrx.com' className="my-2 text-gray-600">Email: info@taxrx.com</Link>
                        <Link to='tel:+919699179276' className="my-2 text-gray-600">Phone: +91 96991 79276</Link>
                        <Link className="my-2 text-gray-600" to='https://api.whatsapp.com/send?phone=919699179276&text='>Support</Link>
                    </div>
                    <div className="flex flex-col items-start justify-center mx-6">
                        <h5 className="text-xl my-2 text-gray-600 font-semibold">Admin</h5>
                        <span className="w-[100%] h-[3px] bg-primary"></span>
                        <Link className="my-2 text-gray-600" to='/admin-login'>Admin Login</Link>
                    </div>
                </div>
            </div>

            <div className="py-[30px] px-0 w-[80%]">
                <div className="container relative text-center">
                    <div className="grid lg:grid-cols-12 md:grid-cols-3 grid-cols-1 items-center">
                        <div className="lg:col-span-3 md:text-start text-center">
                            <HashLink to="#landing-navbar" className="text-[22px] focus:outline-none">
                                <img src='/assets/images/logo.png' width={111} height={22} className="mx-auto md:me-auto md:ms-0" alt=""/>
                            </HashLink>
                        </div>

                        <div className="lg:col-span-5 text-center text-gray-500 mt-6 md:mt-0">
                            <p className="mb-0"><Link to='https://psyber.co/'>  © All Rights Reserved | Cooked with ❤️ by Psyber Inc</Link>.</p>
                        </div>

                        <ul className="lg:col-span-4 list-none md:text-end text-center mt-6 md:mt-0 space-x-1">
                            <li className="inline"><Link to="http://linkedin.com/company/shreethemes" target="_blank" className="size-8 inline-flex justify-center items-center rounded-md text-gray-600 hover:text-white hover:border-primary dark:hover:border-primary hover:bg-primary dark:hover:bg-primary"><IconLinkedin className="size-4 align-middle"/></Link></li>
                            <li className="inline"><Link to="https://www.facebook.com/shreethemes" target="_blank" className="size-8 inline-flex justify-center items-center rounded-md text-gray-600 hover:text-white hover:border-primary dark:hover:border-primary hover:bg-primary dark:hover:bg-primary"><IconFacebook className="size-4 align-middle" /></Link></li>
                            <li className="inline"><Link to="https://www.instagram.com/shreethemes/" target="_blank" className="size-8 inline-flex justify-center items-center rounded-md text-gray-600 hover:text-white hover:border-primary dark:hover:border-primary hover:bg-primary dark:hover:bg-primary"><IconInstagram className="size-4 align-middle" /></Link></li>
                            <li className="inline"><Link to="https://twitter.com/shreethemes" target="_blank" className="size-8 inline-flex justify-center items-center rounded-md text-gray-600 hover:text-white hover:border-primary dark:hover:border-primary hover:bg-primary dark:hover:bg-primary"><IconTwitter className="size-4 align-middle" /></Link></li>
                            <li className="inline"><Link to="mailto:support@shreethemes.in" className="size-8 inline-flex justify-center items-center rounded-md text-gray-600 hover:text-white hover:border-primary dark:hover:border-primary hover:bg-primary dark:hover:bg-primary"><IconMail className="size-4 align-middle" /></Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}