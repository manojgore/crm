import React, { useEffect } from 'react';
import Navbar from '../components/Landing/navbar';
import Footer from '../components/Landing/footer';
import { useLocation } from 'react-router-dom';
export default function PrivacyPolicy() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
      }, [pathname]);
    return (
        <div className={`font-libre_franklin text-base text-black dark:text-white bg-white dark:bg-slate-900`}>
            <Navbar />
            <div className="w-full flex justify-center items-center">
                <div className="w-[75%] my-10">
                    <h2 className='text-2xl font-bold my-4'>Privacy Policy</h2>


                    <h3 className='text-lg font-semibold my-4 px-2'>1. Introduction</h3>
                    <p className='text-gray-500 my-4 px-2'>This Privacy Policy describes how Taxrx.in ("we", "us", or "our") collects, uses, and discloses your personal information when you use the Taxrx.in online payment gateway service ("Service").</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>2. Information We Collect</h3>
                    <p className='text-gray-500 my-4 px-2'>We collect information to provide a secure and efficient service for your online tax filing and payment needs. Here's what information we may collect:</p>
                    <div className='flex flex-col items-start justify-start px-6'>
                        <li className='text-gray-500 my-2'><b>Account Information:</b> Name, email address, phone number, username, and password (hashed and securely stored) used to access your Taxrx.in account.</li>
                        <li className='text-gray-500 my-2'><b>Financial Information:</b> Payment card details (credit/debit card number, expiration date, CVV) used for processing tax payments. This information is collected securely by our third-party payment processor and not directly stored by Taxrx.in.</li>
                        <li className='text-gray-500 my-2'><b>Transaction Information:</b> Details of your tax filing and payment transactions, including amount, date, description, and tax identification number (TIN).</li>
                        <li className='text-gray-500 my-2'><b>Usage Information:</b> IP address, device information, browser type, operating system, and usage data related to your interaction with the Service. This helps us improve the platform and troubleshoot any issues.</li>
                    </div>
                    
                    <h3 className='text-lg font-semibold my-4 px-2'>3. How We Use Your Information:</h3>
                    <p className='text-gray-500 my-4 px-2'>We use your information for the following purposes:</p>
                    <div className='flex flex-col items-start justify-start px-6'>
                        <li className='text-gray-500 my-2'><b>Provide and Operate the Service:</b> To process your tax filings, facilitate secure payments, and offer customer support.</li>
                        <li className='text-gray-500 my-2'><b>Enhance Your Experience:</b> To personalize your experience and offer features relevant to your tax filing needs.</li>
                        <li className='text-gray-500 my-2'><b>Fraud Prevention and Security:</b> To detect and prevent fraudulent activity and ensure the security of your data.</li>
                        <li className='text-gray-500 my-2'><b>Compliance with Law:</b> To comply with legal and regulatory requirements, including tax regulations and reporting obligations.</li>
                        <li className='text-gray-500 my-2'><b>Communication:</b> To send you important information about the Service, including account updates, security alerts, and support communications. We may also send marketing communications with your consent (which can be withdrawn anytime).</li>
                    </div>

                    <h3 className='text-lg font-semibold my-4 px-2'>4. Sharing Your Information:</h3>
                    <p className='text-gray-500 my-4 px-2'>We understand the importance of data privacy and share your information only under limited circumstances:</p>
                    <div className='flex flex-col items-start justify-start px-6'>
                        <li className='text-gray-500 my-2'><b>Third-Party Service Providers:</b> We may share your information with trusted third-party service providers who help us operate the Service, such as payment processors, data security firms, and customer support providers. These providers are contractually obligated to protect your information and use it only for the purpose of providing services to Taxrx.in.</li>
                        <li className='text-gray-500 my-2'><b>Financial Institutions and Payment Processors:</b> We share your payment card details with our partnered financial institutions and payment processors to facilitate secure transactions. These entities have their own strict security measures in place to protect your financial data.</li>
                        <li className='text-gray-500 my-2'><b>Legal Requirements:</b> We may disclose your information if required by law, subpoena, or court order, or to cooperate with law enforcement investigations.</li>
                    </div>

                    <h3 className='text-lg font-semibold my-4 px-2'>5. Data Security:</h3>
                    <p className='text-gray-500 my-4 px-2'>We take data security seriously and implement industry-standard security measures to protect your information, including:</p>
                    <div className='flex flex-col items-start justify-start px-6'>
                        <li className='text-gray-500 my-2'>Secure data encryption protocols</li>
                        <li className='text-gray-500 my-2'>Access controls and user authentication</li>
                        <li className='text-gray-500 my-2'>Regular security audits and penetration testing</li>
                    </div>
                    <p className='text-gray-500 my-4 px-2'>However, no internet transmission is completely secure. While we strive to protect your information, we cannot guarantee its absolute security.</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>6. Your Choices:</h3>
                    <p className='text-gray-500 my-4 px-2'>You have control over your information:</p>
                    <div className='flex flex-col items-start justify-start px-6'>
                        <li className='text-gray-500 my-2'><b>Access and Update:</b> You can access and update your personal information through your Taxrx.in account settings.</li>
                        <li className='text-gray-500 my-2'><b>Marketing Communications:</b> You can opt out of receiving marketing communications by following the unsubscribe instructions in our emails or by contacting us.</li>
                        <li className='text-gray-500 my-2'><b>Data Deletion:</b> You can request deletion of your information by contacting us. However, please note that we may need to retain certain information for legal and compliance purposes.</li>
                    </div>

                    <h3 className='text-lg font-semibold my-4 px-2'>7. Children's Privacy</h3>
                    <p className='text-gray-500 my-4 px-2'>Taxrx.in does not knowingly collect information from children under the age of 13. If you are a parent or guardian and believe your child has provided us with information, please contact us and we will take steps to delete such information.</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>8. Changes to this Privacy Policy</h3>
                    <p className='text-gray-500 my-4 px-2'>We may update this Privacy Policy from time to time to reflect changes in our practices or comply with legal requirements. We will notify you of any changes by posting the new Privacy Policy on our website.</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>9. Contact Us</h3>
                    <p className='text-gray-500 my-4 px-2'>If you have any questions about this Privacy Policy, please contact us at info@taxrx.com</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
