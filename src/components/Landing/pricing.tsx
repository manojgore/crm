import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/apiProvider";
import IconCircleCheck from "../Icon/IconCircleCheck";

interface packageInterface {
    Type: string,
    Description: string,
    Number_of_invoices: string,
    Number_of_products: string,
    Number_of_suppliers: string,
    Number_of_users: string,
    Price: string,
    Duration: string   
}

export default function Pricing(){
    const [packages, setPackages] = useState<packageInterface[]>([]);
    const fetchPackages = async () => {
        try {
            const response = await axios.get(`${api}/admin/getallpackages`);

            console.log('Packages result: ', response.data);
            if (response.data.success) {
                setPackages(response.data.results);
            }
        } catch (error) {
            console.log('failed to fetch the packages');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);
    return(
        <section className="relative py-10 bg-slate-50 dark:bg-slate-800" id="landing-pricing">
        <div className="container relative">
            <div className="grid grid-cols-1 pb-6 px-4 text-center">
                <h3 className="font-semibold text-2xl leading-normal mb-4">Our Pricing</h3>
                <p className="text-slate-400 max-w-xl mx-auto">We offer varities range of plans. All plans are given bellow.</p>
            </div>

            <div className="flex justify-center items-center">
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mt-6 gap-6 w-[80%]">
                    {
                        packages.map((pkg, i)=>{
                            return  <div key={i} className="group relative overflow-hidden shadow dark:shadow-gray-700 bg-white dark:bg-slate-900 rounded-md ">
                                        <div className="p-6 h-full flex flex-col justify-between">
                                            <h6 className="font-semibold mb-5 text-xl">{pkg.Type}</h6>

                                            <div className="flex mb-5">
                                                <span className="text-lg font-medium">₹</span>
                                                <span className="price text-5xl h6 font-semibold mb-0">{pkg.Price}</span>
                                                <span className="text-lg font-medium self-end mb-1">/{pkg.Duration}</span>
                                            </div>

                                            <ul className="list-none text-slate-400">
                                                <li className="mb-1 flex justify-center"><IconCircleCheck className="text-primary-light size-5 mr-2"/> <span>Number of Customers {pkg.Number_of_users}</span></li>
                                                <li className="mb-1 flex justify-center"><IconCircleCheck className="text-primary-light size-5 mr-2"/> <span>Number of Invoices {pkg.Number_of_invoices}</span></li>
                                                <li className="mb-1 flex justify-center"><IconCircleCheck className="text-primary-light size-5 mr-2"/> <span>Number of Products {pkg.Number_of_products}</span></li>
                                                <li className="mb-1 flex justify-center"><IconCircleCheck className="text-primary-light size-5 mr-2"/> <span>Number of Suppliers {pkg.Number_of_suppliers}</span></li>
                                            </ul>
                                            <Link to={
                                                localStorage.getItem('customeridtaxrx') || localStorage.getItem('adminidtaxrx') ? "/purchase-plan" : "/login"
                                            } className="h-10 px-6 tracking-wide inline-flex items-center justify-center font-medium rounded-md text-primary bg-gray-100 hover:bg-primary hover:text-white w-full mt-5">Buy Now</Link>

                                            <p className="text-sm text-slate-400 mt-1.5"><span className="text-red-600">*</span><Link to='/terms-and-condition'>T&C Apply</Link></p>
                                        </div>
                                    </div>
                        })
                    }
                </div>
            </div>
        </div>
    </section>
    )
}