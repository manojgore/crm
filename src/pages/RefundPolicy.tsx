import React, { useEffect } from 'react';
import Navbar from '../components/Landing/navbar';
import Footer from '../components/Landing/footer';
import { useLocation } from 'react-router-dom';
export default function RefundPloicy() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
      }, [pathname]);
    return (
        <div className={`font-libre_franklin text-base text-black dark:text-white bg-white dark:bg-slate-900`}>
            <Navbar />
            <div className="w-full flex justify-center items-center">
                <div className="w-[75%] my-10">
                    <h2 className='text-2xl font-bold my-4'>Refund Policy</h2>

                    <p className='text-gray-500 my-4'>
                        Refund Policy for TaxRx.in At TaxRx.in, we are committed to ensuring your complete satisfaction with our services. If you are not entirely satisfied with your purchase, we're
                        here to help. Our refund policy is designed to provide a fair and transparent process for all our clients.
                    </p>

                    <h3 className='text-lg font-semibold my-4'>Eligibility for Refund:</h3>
                    <p className='text-gray-500 my-4'>Refund requests must be made within 30 days from the date of purchase. The refund applies only to the fees paid for the specific service or product purchased. Non-refundable Services:</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>Customized services that have already commenced or been delivered. Services where work has already been completed and delivered to the client. Refund Process:</h3>
                    <p className='text-gray-500 my-4 px-2'>To request a refund, please contact our customer support team at support@taxrx.in with your order details and the reason for the refund request. Our team will review your request and notify you of the approval or rejection of your refund within 5 business days. If approved, the refund will be processed, and a credit will automatically be applied to your original method of payment within 10-15 business days.</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>Partial Refunds:</h3>
                    <p className='text-gray-500 my-4 px-2'>In certain situations, partial refunds may be granted (if applicable), where a portion of the service has been utilized.</p>

                    <h3 className='text-lg font-semibold my-4 px-2'>Refund Exceptions:</h3>
                    <p className='text-gray-500 my-4 px-2'>Refunds are not applicable for any promotional or discounted services. Refunds are not applicable for subscription-based services after the initial 30-day period.</p>
                    
                    <h3 className='text-lg font-semibold my-4 px-2'>Changes to This Refund Policy:</h3>
                    <p className='text-gray-500 my-4 px-2'>TaxRx.in reserves the right to update or change this refund policy at any time. Any changes will be posted on this page, and the effective date will be updated accordingly. Thank you for choosing TaxRx.in. We value your business and are committed to providing exceptional service.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
