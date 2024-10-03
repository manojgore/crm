import React, { useEffect } from 'react';
import Navbar from '../components/Landing/navbar';
import Footer from '../components/Landing/footer';
import { useLocation } from 'react-router-dom';
export default function TermsAndConditions() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
      }, [pathname]);
    return (
        <div className={`font-libre_franklin text-base text-black dark:text-white bg-white dark:bg-slate-900`}>
            <Navbar />
            <div className="w-full flex justify-center items-center">
                <div className="w-[75%] my-10">
                    <h2 className='text-2xl font-bold my-4'>Terms & Conditions</h2>


                    <h3 className='text-lg font-semibold my-4 px-2'>1. Introduction</h3>
                    <p className='text-gray-500 my-4 px-2'>These Terms and Conditions ("Terms") govern your use of the Taxrx.in online payment gateway service ("Service"). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, then you may not access or use the Service.</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>2. Use of the Service</h3>
                    <div className='flex flex-col items-start justify-start px-6'>
                        <li className='text-gray-500 my-2'>You must be at least 18 years old and have the legal capacity to enter into contracts to use the Service.</li>
                        <li className='text-gray-500 my-2'>You are responsible for maintaining the confidentiality of your account information, including your login credentials.</li>
                        <li className='text-gray-500 my-2'>You are solely responsible for all activity that occurs under your account.</li>
                        <li className='text-gray-500 my-2'>You agree to use the Service only for lawful purposes and in accordance with these Terms.</li>
                        <li className='text-gray-500 my-2'>You agree not to use the Service to process payments for illegal goods or services.</li>
                    </div>
                    
                    <h3 className='text-lg font-semibold my-4 px-2'>3. Fees and Payment</h3>
                    <div className='flex flex-col items-start justify-start px-6'>
                        <li className='text-gray-500 my-2'>Taxrx.in may charge fees for using the Service.</li>
                        <li className='text-gray-500 my-2'>The specific fees will be displayed before you initiate a payment transaction.</li>
                        <li className='text-gray-500 my-2'>You agree to pay all applicable fees for your use of the Service.</li>
                        <li className='text-gray-500 my-2'>You are responsible for any taxes associated with your use of the Service.</li>
                    </div>

                    <h3 className='text-lg font-semibold my-4 px-2'>4. Disclaimers</h3>
                    <div className='flex flex-col items-start justify-start px-6'>
                        <li className='text-gray-500 my-2'>Taxrx.in makes no warranties, express or implied, regarding the operation of the Service or the information, content, materials, or products offered through the Service.</li>
                        <li className='text-gray-500 my-2'>Taxrx.in is not liable for any damages arising from the use of the Service, including but not limited to, direct, indirect, incidental, consequential, or punitive damages.</li>
                    </div>

                    <h3 className='text-lg font-semibold my-4 px-2'>5. Limitation of Liability</h3>
                    <p className='text-gray-500 my-4 px-2'>Taxrx.in's liability to you for any loss or damage arising under or in connection with these Terms shall be limited to the amount of the fees paid by you for the Service.</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>6. Termination</h3>
                    <div className='flex flex-col items-start justify-start px-6'>
                        <li className='text-gray-500 my-2'>Taxrx.in may terminate your access to the Service for any reason, at any time, without notice.</li>
                        <li className='text-gray-500 my-2'>You may terminate your use of the Service at any time.</li>
                    </div>

                    <h3 className='text-lg font-semibold my-4 px-2'>7. Governing Lawy</h3>
                    <p className='text-gray-500 my-4 px-2'>These Terms shall be governed by and construed in accordance with the laws of India.</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>8. Dispute Resolution</h3>
                    <p className='text-gray-500 my-4 px-2'>Any dispute arising out of or relating to these Terms shall be settled by binding arbitration in accordance with the Arbitration and Conciliation Act, 1996. The arbitration shall be conducted in [City, State] India.</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>9. Entire Agreement</h3>
                    <p className='text-gray-500 my-4 px-2'>These Terms constitute the entire agreement between you and Taxrx.in regarding your use of the Service.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
