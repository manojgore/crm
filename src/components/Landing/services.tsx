import React from "react";
import { Link } from "react-router-dom";
import IconMonitor from "../Icon/IconMonitor";
import IconMenuInvoice from "../Icon/Menu/IconMenuInvoice";
import IconFile from "../Icon/IconFile";
import IconGlobe from "../Icon/IconGlobe";
import IconBell from "../Icon/IconBell";
import IconUser from "../Icon/IconUser";


export default function Services(){
    return(
        <section className="relative py-10 bg-slate-50 dark:bg-slate-800" id="services">
            <div className="container relative">
                <div className="grid grid-cols-1 pb-6 text-center px-4">
                    <h3 className="font-semibold text-2xl leading-normal mb-4">Our Services</h3>

                    <p className="text-slate-400 max-w-xl mx-auto">Smart Solution for Your Income Tax & GST</p>
                </div>

                <div className="flex justify-center items-center">
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-6 mt-6 w-[80%]">
                        <div className="group rounded-md shadow dark:shadow-gray-700 relative bg-white dark:bg-slate-900 p-6 overflow-hidden h-[45svh]">
                            <div className="flex items-center justify-center size-14 -rotate-45 bg-gradient-to-r from-transparent to-teal-500/10 text-primary text-center rounded-full group-hover:bg-teal-500/10 duration-500">
                                <IconUser className="size-6 rotate-45"/>
                            </div>

                            <div className="content mt-6 relative z-1">
                                <Link to="" className="title text-lg font-semibold hover:text-primary">End-to-end compilance</Link>
                                <p className="text-slate-400 mt-3">Ensure your financial activities meet legal standards with seamless, end-to-end compliance solutions for complete peace of mind.</p>
                            </div>

                            <div className="absolute bottom-0 -end-16">
                                <IconUser className="size-48 text-primary opacity-[0.04] dark:opacity-[0.04] group-hover:opacity-10 duration-500"></IconUser>
                            </div>
                        </div>
                        <div className="group rounded-md shadow dark:shadow-gray-700 relative bg-white dark:bg-slate-900 p-6 overflow-hidden h-[45svh]">
                            <div className="flex items-center justify-center size-14 -rotate-45 bg-gradient-to-r from-transparent to-teal-500/10 text-primary text-center rounded-full group-hover:bg-teal-500/10 duration-500">
                                <IconMonitor className="size-6 rotate-45"/>
                            </div>

                            <div className="content mt-6 relative z-1">
                                <Link to="" className="title text-lg font-semibold hover:text-primary">Painless reconcillation</Link>
                                <p className="text-slate-400 mt-3">Effortlessly match and verify your transactions with automated tools, ensuring your accounts are accurate and up-to-date without the hassle.</p>
                            </div>

                            <div className="absolute bottom-0 -end-16">
                                <IconMonitor className="size-48 text-primary opacity-[0.04] dark:opacity-[0.04] group-hover:opacity-10 duration-500"></IconMonitor>
                            </div>
                        </div>
                        <div className="group rounded-md shadow dark:shadow-gray-700 relative bg-white dark:bg-slate-900 p-6 overflow-hidden h-[45svh]">
                            <div className="flex items-center justify-center size-14 -rotate-45 bg-gradient-to-r from-transparent to-teal-500/10 text-primary text-center rounded-full group-hover:bg-teal-500/10 duration-500">
                                <IconMenuInvoice className="size-6 rotate-45"/>
                            </div>

                            <div className="content mt-6 relative z-1">
                                <Link to="" className="title text-lg font-semibold hover:text-primary">Secure filling on the cloud</Link>
                                <p className="text-slate-400 mt-3">Ensure your tax filings are securely stored and accessible on the cloud, providing peace of mind and easy access anytime.</p>
                            </div>

                            <div className="absolute bottom-0 -end-16">
                                <IconMenuInvoice className="size-48 text-primary opacity-[0.04] dark:opacity-[0.04] group-hover:opacity-10 duration-500"></IconMenuInvoice>
                            </div>
                        </div>
                        <div className="group rounded-md shadow dark:shadow-gray-700 relative bg-white dark:bg-slate-900 p-6 overflow-hidden h-[45svh]">
                            <div className="flex items-center justify-center size-14 -rotate-45 bg-gradient-to-r from-transparent to-teal-500/10 text-primary text-center rounded-full group-hover:bg-teal-500/10 duration-500">
                                <IconFile className="size-6 rotate-45"/>
                            </div>

                            <div className="content mt-6 relative z-1">
                                <Link to="" className="title text-lg font-semibold hover:text-primary">Detailed reports</Link>
                                <p className="text-slate-400 mt-3">Generate comprehensive reports to gain deep insights into your finances, helping you make informed decisions and maximize your savings.</p>
                            </div>

                            <div className="absolute bottom-0 -end-16">
                                <IconFile className="size-48 text-primary opacity-[0.04] dark:opacity-[0.04] group-hover:opacity-10 duration-500"></IconFile>
                            </div>
                        </div>
                        <div className="group rounded-md shadow dark:shadow-gray-700 relative bg-white dark:bg-slate-900 p-6 overflow-hidden h-[45svh]">
                            <div className="flex items-center justify-center size-14 -rotate-45 bg-gradient-to-r from-transparent to-teal-500/10 text-primary text-center rounded-full group-hover:bg-teal-500/10 duration-500">
                                <IconBell className="size-6 rotate-45"/>
                            </div>

                            <div className="content mt-6 relative z-1">
                                <Link to="" className="title text-lg font-semibold hover:text-primary">Get timely notifications</Link>
                                <p className="text-slate-400 mt-3">Stay informed with timely notifications about important tax deadlines, invoice due dates, and financial updates to avoid penalties.</p>
                            </div>

                            <div className="absolute bottom-0 -end-16">
                                <IconBell className="size-48 text-primary opacity-[0.04] dark:opacity-[0.04] group-hover:opacity-10 duration-500"></IconBell>
                            </div>
                        </div>
                        <div className="group rounded-md shadow dark:shadow-gray-700 relative bg-white dark:bg-slate-900 p-6 overflow-hidden h-[45svh]">
                            <div className="flex items-center justify-center size-14 -rotate-45 bg-gradient-to-r from-transparent to-teal-500/10 text-primary text-center rounded-full group-hover:bg-teal-500/10 duration-500">
                                <IconGlobe className="size-6 rotate-45"/>
                            </div>

                            <div className="content mt-6 relative z-1">
                                <Link to="" className="title text-lg font-semibold hover:text-primary">Collaborate online</Link>
                                <p className="text-slate-400 mt-3">Collaborate online with your team to manage tax files, invoices, and expenses seamlessly, ensuring accurate and efficient financial operations.</p>
                            </div>

                            <div className="absolute bottom-0 -end-16">
                                <IconGlobe className="size-48 text-primary opacity-[0.04] dark:opacity-[0.04] group-hover:opacity-10 duration-500"></IconGlobe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}