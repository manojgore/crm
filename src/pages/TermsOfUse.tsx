import React, { useEffect } from 'react';
import Navbar from '../components/Landing/navbar';
import Footer from '../components/Landing/footer';
import { useLocation } from 'react-router-dom';
export default function TermsOfUse() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
      }, [pathname]);
    return (
        <div className={`font-libre_franklin text-base text-black dark:text-white bg-white dark:bg-slate-900`}>
            <Navbar />
            <div className="w-full flex justify-center items-center">
                <div className="w-[75%] my-10">
                    <h2 className='text-2xl font-bold my-4'>Terms of Use</h2>


                    <h3 className='text-lg font-semibold my-4 px-2'>1. Introduction</h3>
                    <p className='text-gray-500 my-4 px-2'>These Terms of Use ("Terms") govern your access to and use of the Taxrx.in online payment gateway service ("Service"). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, then you may not access or use the Service.</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>2. Use of the Service</h3>
                    <div className='flex flex-col items-start justify-start px-6'>
                        <li className='text-gray-500 my-2'>You must be at least 18 years old and have the legal capacity to enter into contracts to use the Service.</li>
                        <li className='text-gray-500 my-2'>You are responsible for maintaining the confidentiality of your account information, including your login credentials.</li>
                        <li className='text-gray-500 my-2'>You are solely responsible for all activity that occurs under your account.</li>
                        <li className='text-gray-500 my-2'>You agree to use the Service only for lawful purposes and in accordance with these Terms.</li>
                        <li className='text-gray-500 my-2'>You agree not to use the Service to process payments for illegal goods or services.</li>
                    </div>
                    
                    <h3 className='text-lg font-semibold my-4 px-2'>3. Acceptable Use</h3>
                    <p className='text-gray-500 my-4 px-2'>In addition to the general terms above, you agree to use the Taxrx.in service in a way that:</p>
                    <div className='flex flex-col items-start justify-start px-6'>
                        <li className='text-gray-500 my-2'>Complies with all applicable laws and regulations, including tax laws.</li>
                        <li className='text-gray-500 my-2'>Does not violate the rights of any third party, including intellectual property rights.</li>
                        <li className='text-gray-500 my-2'>Does not transmit any viruses, malware, or other harmful code.</li>
                        <li className='text-gray-500 my-2'>Does not interfere with the operation of the Service or any other user's use of the Service.</li>
                        <li className='text-gray-500 my-2'>Does not provide false or misleading information.</li>
                    </div>

                    <h3 className='text-lg font-semibold my-4 px-2'>4. Fees and Payment</h3>
                    <div className='flex flex-col items-start justify-start px-6'>
                        <li className='text-gray-500 my-2'>Taxrx.in may charge fees for using the Service.</li>
                        <li className='text-gray-500 my-2'>The specific fees will be displayed before you initiate a payment transaction.</li>
                        <li className='text-gray-500 my-2'>You agree to pay all applicable fees for your use of the Service.</li>
                        <li className='text-gray-500 my-2'>You are responsible for any taxes associated with your use of the Service.</li>
                    </div>

                    <h3 className='text-lg font-semibold my-4 px-2'>5. Disclaimers</h3>
                    <div className='flex flex-col items-start justify-start px-6'>
                        <li className='text-gray-500 my-2'>Taxrx.in makes no warranties, express or implied, regarding the operation of the Service or the information, content, materials, or products offered through the Service.</li>
                        <li className='text-gray-500 my-2'>Taxrx.in is not liable for any damages arising from the use of the Service, including but not limited to, direct, indirect, incidental, consequential, or punitive damages.</li>
                    </div>

                    <h3 className='text-lg font-semibold my-4 px-2'>6. Limitation of Liability</h3>
                    <p className='text-gray-500 my-4 px-2'>Taxrx.in's liability to you for any loss or damage arising under or in connection with these Terms shall be limited to the amount of the fees paid by you for the Service.</p>
                    

                    <h3 className='text-lg font-semibold my-4 px-2'>7. Termination</h3>
                    <div className='flex flex-col items-start justify-start px-6'>
                        <li className='text-gray-500 my-2'>Taxrx.in may terminate your access to the Service for any reason, at any time, without notice.</li>
                        <li className='text-gray-500 my-2'>You may terminate your use of the Service at any time.</li>
                    </div>

                    <h3 className='text-lg font-semibold my-4 px-2'>8. Intellectual Property</h3>
                    <p className='text-gray-500 my-4 px-2'>The Service and all content and materials associated with it are protected by intellectual property rights, including copyrights and trademarks. You agree not to reproduce, modify, distribute, or create derivative works of any of this material without the express written consent of Taxrx.in.</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>9. Governing Law</h3>
                    <p className='text-gray-500 my-4 px-2'>These Terms shall be governed by and construed in accordance with the laws of India.</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>10. Dispute Resolution</h3>
                    <p className='text-gray-500 my-4 px-2'>Any dispute arising out of or relating to these Terms shall be settled by binding arbitration in accordance with the Arbitration and Conciliation Act, 1996. The arbitration shall be conducted in Mumbai, Maharashtra India.</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>11. Entire Agreement</h3>
                    <p className='text-gray-500 my-4 px-2'>These Terms constitute the entire agreement between you and Taxrx.in regarding your use of the Service.</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>12. Changes to these Terms</h3>
                    <p className='text-gray-500 my-4 px-2'>We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on our website. Your continued use of the Service after the posting of any revised Terms constitutes your acceptance of the revised Terms.</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>13. Contact Us</h3>
                    <p className='text-gray-500 my-4 px-2'>If you have any questions about these Terms, please contact us at info@taxrx.com</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
