import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AnimateHeight from 'react-animate-height';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import { IRootState } from '../store';
import IconArrowWaveLeftUp from '../components/Icon/IconArrowWaveLeftUp';
import IconDesktop from '../components/Icon/IconDesktop';
import IconUser from '../components/Icon/IconUser';
import IconBox from '../components/Icon/IconBox';
import IconDollarSignCircle from '../components/Icon/IconDollarSignCircle';
import IconRouter from '../components/Icon/IconRouter';
import IconPlusCircle from '../components/Icon/IconPlusCircle';
import IconMinusCircle from '../components/Icon/IconMinusCircle';
import Footer from '../components/Landing/footer';
import Navbar from '../components/Landing/navbar';

const Faq = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('FAQ'));
    });
    const [active, setActive] = useState<Number>();
    const togglePara = (value: Number) => {
        setActive((oldValue) => {
            return oldValue === value ? 0 : value;
        });
    };
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const [activeTab, setActiveTab] = useState<String>('general');
    const [active1, setActive1] = useState<any>(1);
    const [active2, setActive2] = useState<any>(1);

    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <div>
                <Navbar />
                <div className="h-[120svh] flex flex-col justify-center items-center">
                    <h3 className="mb-8 text-center text-xl font-semibold md:text-2xl">
                        Frequently asked <span className="text-primary">questions</span>
                    </h3>
                    <div className="flex w-full justify-center items-center">
                        <div className="rounded-md bg-white dark:bg-black w-[80%]">
                            <div className="border-b border-white-light p-6 text-[22px] font-bold dark:border-dark dark:text-white">General topics?</div>
                            <div className="divide-y divide-white-light px-6 py-4.5 dark:divide-dark">
                                <div>
                                    <div
                                        className={`flex cursor-pointer items-center justify-between gap-10 px-2.5 py-2 text-base font-semibold hover:bg-primary-light hover:text-primary dark:text-white dark:hover:bg-[#1B2E4B] dark:hover:text-primary
                            ${active1 === 1 ? 'bg-primary-light dark:bg-[#1B2E4B] !text-primary' : ''}`}
                                        onClick={() => setActive1(active1 === 1 ? null : 1)}
                                    >
                                        <span>How do I create an account on TaxRX?</span>
                                        {active1 !== 1 ? (
                                            <span className="shrink-0">
                                                <IconPlusCircle duotone={false} />
                                            </span>
                                        ) : (
                                            <span className="shrink-0">
                                                <IconMinusCircle fill={true} />
                                            </span>
                                        )}
                                    </div>
                                    <AnimateHeight duration={300} height={active1 === 1 ? 'auto' : 0}>
                                        <div className="px-1 py-3 font-semibold text-white-dark">
                                            <p>Click on the "Sign Up" button and follow the prompts to register.</p>
                                        </div>
                                    </AnimateHeight>
                                </div>
                                <div>
                                    <div
                                        className={`flex cursor-pointer items-center justify-between gap-10 px-2.5 py-2 text-base font-semibold hover:bg-primary-light hover:text-primary dark:text-white dark:hover:bg-[#1B2E4B] dark:hover:text-primary
                            ${active1 === 2 ? 'bg-primary-light dark:bg-[#1B2E4B] !text-primary' : ''}`}
                                        onClick={() => setActive1(active1 === 2 ? null : 2)}
                                    >
                                        <span>Is my data secure on TaxRX?</span>
                                        {active1 !== 2 ? (
                                            <span className="shrink-0">
                                                <IconPlusCircle duotone={false} />
                                            </span>
                                        ) : (
                                            <span className="shrink-0">
                                                <IconMinusCircle fill={true} />
                                            </span>
                                        )}
                                    </div>
                                    <AnimateHeight duration={300} height={active1 === 2 ? 'auto' : 0}>
                                        <div className="px-1 py-3 font-semibold text-white-dark">
                                            <p>Yes, we use top-notch encryption and security measures to protect your data.</p>
                                        </div>
                                    </AnimateHeight>
                                </div>
                                <div>
                                    <div
                                        className={`flex cursor-pointer items-center justify-between gap-10 px-2.5 py-2 text-base font-semibold hover:bg-primary-light hover:text-primary dark:text-white dark:hover:bg-[#1B2E4B] dark:hover:text-primary
                            ${active1 === 3 ? 'bg-primary-light dark:bg-[#1B2E4B] !text-primary' : ''}`}
                                        onClick={() => setActive1(active1 === 3 ? null : 3)}
                                    >
                                        <span>How can I file my taxes using TaxRX?</span>
                                        {active1 !== 3 ? (
                                            <span className="shrink-0">
                                                <IconPlusCircle duotone={false} />
                                            </span>
                                        ) : (
                                            <span className="shrink-0">
                                                <IconMinusCircle fill={true} />
                                            </span>
                                        )}
                                    </div>
                                    <AnimateHeight duration={300} height={active1 === 3 ? 'auto' : 0}>
                                        <div className="px-1 py-3 font-semibold text-white-dark">
                                            <p>Simply input your tax details and documents, and our system will guide you through the filing process</p>
                                        </div>
                                    </AnimateHeight>
                                </div>
                                <div>
                                    <div
                                        className={`flex cursor-pointer items-center justify-between gap-10 px-2.5 py-2 text-base font-semibold hover:bg-primary-light hover:text-primary dark:text-white dark:hover:bg-[#1B2E4B] dark:hover:text-primary
                            ${active1 === 5 ? 'bg-primary-light dark:bg-[#1B2E4B] !text-primary' : ''}`}
                                        onClick={() => setActive1(active1 === 5 ? null : 5)}
                                    >
                                        <span>Can I track my expenses with TaxRX?</span>
                                        {active1 !== 5 ? (
                                            <span className="shrink-0">
                                                <IconPlusCircle duotone={false} />
                                            </span>
                                        ) : (
                                            <span className="shrink-0">
                                                <IconMinusCircle fill={true} />
                                            </span>
                                        )}
                                    </div>
                                    <AnimateHeight duration={300} height={active1 === 5 ? 'auto' : 0}>
                                        <div className="px-1 py-3 font-semibold text-white-dark">
                                            <p>Absolutely! You can easily add, categorize, and track your expenses.</p>
                                        </div>
                                    </AnimateHeight>
                                </div>
                                <div>
                                    <div
                                        className={`flex cursor-pointer items-center justify-between gap-10 px-2.5 py-2 text-base font-semibold hover:bg-primary-light hover:text-primary dark:text-white dark:hover:bg-[#1B2E4B] dark:hover:text-primary
                            ${active1 === 6 ? 'bg-primary-light dark:bg-[#1B2E4B] !text-primary' : ''}`}
                                        onClick={() => setActive1(active1 === 6 ? null : 6)}
                                    >
                                        <span>How do I generate an invoice?</span>
                                        {active1 !== 6 ? (
                                            <span className="shrink-0">
                                                <IconPlusCircle duotone={false} />
                                            </span>
                                        ) : (
                                            <span className="shrink-0">
                                                <IconMinusCircle fill={true} />
                                            </span>
                                        )}
                                    </div>
                                    <AnimateHeight duration={300} height={active1 === 6 ? 'auto' : 0}>
                                        <div className="px-1 py-3 font-semibold text-white-dark">
                                            <p>Go to the "Invoices" section, fill in the necessary details, and click "Generate."</p>
                                        </div>
                                    </AnimateHeight>
                                </div>
                                <div>
                                    <div
                                        className={`flex cursor-pointer items-center justify-between gap-10 px-2.5 py-2 text-base font-semibold hover:bg-primary-light hover:text-primary dark:text-white dark:hover:bg-[#1B2E4B] dark:hover:text-primary
                            ${active1 === 7 ? 'bg-primary-light dark:bg-[#1B2E4B] !text-primary' : ''}`}
                                        onClick={() => setActive1(active1 === 7 ? null : 7)}
                                    >
                                        <span>What if I need help with my account?</span>
                                        {active1 !== 7 ? (
                                            <span className="shrink-0">
                                                <IconPlusCircle duotone={false} />
                                            </span>
                                        ) : (
                                            <span className="shrink-0">
                                                <IconMinusCircle fill={true} />
                                            </span>
                                        )}
                                    </div>
                                    <AnimateHeight duration={300} height={active1 === 7 ? 'auto' : 0}>
                                        <div className="px-1 py-3 font-semibold text-white-dark">
                                            <p>Our dedicated support team is available 24/7 to assist you with any issues.</p>
                                        </div>
                                    </AnimateHeight>
                                </div>
                                <div>
                                    <div
                                        className={`flex cursor-pointer items-center justify-between gap-10 px-2.5 py-2 text-base font-semibold hover:bg-primary-light hover:text-primary dark:text-white dark:hover:bg-[#1B2E4B] dark:hover:text-primary
                            ${active1 === 8 ? 'bg-primary-light dark:bg-[#1B2E4B] !text-primary' : ''}`}
                                        onClick={() => setActive1(active1 === 8 ? null : 8)}
                                    >
                                        <span>Can multiple users access the same account?</span>
                                        {active1 !== 8 ? (
                                            <span className="shrink-0">
                                                <IconPlusCircle duotone={false} />
                                            </span>
                                        ) : (
                                            <span className="shrink-0">
                                                <IconMinusCircle fill={true} />
                                            </span>
                                        )}
                                    </div>
                                    <AnimateHeight duration={300} height={active1 === 8 ? 'auto' : 0}>
                                        <div className="px-1 py-3 font-semibold text-white-dark">
                                            <p>Yes, TaxRX allows for multi-user access so you can collaborate with your team.</p>
                                        </div>
                                    </AnimateHeight>
                                </div>
                                <div>
                                    <div
                                        className={`flex cursor-pointer items-center justify-between gap-10 px-2.5 py-2 text-base font-semibold hover:bg-primary-light hover:text-primary dark:text-white dark:hover:bg-[#1B2E4B] dark:hover:text-primary
                            ${active1 === 9 ? 'bg-primary-light dark:bg-[#1B2E4B] !text-primary' : ''}`}
                                        onClick={() => setActive1(active1 === 9 ? null : 9)}
                                    >
                                        <span>What happens if I miss a tax deadline?</span>
                                        {active1 !== 9 ? (
                                            <span className="shrink-0">
                                                <IconPlusCircle duotone={false} />
                                            </span>
                                        ) : (
                                            <span className="shrink-0">
                                                <IconMinusCircle fill={true} />
                                            </span>
                                        )}
                                    </div>
                                    <AnimateHeight duration={300} height={active1 === 9 ? 'auto' : 0}>
                                        <div className="px-1 py-3 font-semibold text-white-dark">
                                            <p>TaxRX sends timely notifications to help you stay on top of important deadlines.</p>
                                        </div>
                                    </AnimateHeight>
                                </div>
                                <div>
                                    <div
                                        className={`flex cursor-pointer items-center justify-between gap-10 px-2.5 py-2 text-base font-semibold hover:bg-primary-light hover:text-primary dark:text-white dark:hover:bg-[#1B2E4B] dark:hover:text-primary
                            ${active1 === 10 ? 'bg-primary-light dark:bg-[#1B2E4B] !text-primary' : ''}`}
                                        onClick={() => setActive1(active1 === 10 ? null : 10)}
                                    >
                                        <span>How do I update incorrect details in my tax filing?</span>
                                        {active1 !== 10 ? (
                                            <span className="shrink-0">
                                                <IconPlusCircle duotone={false} />
                                            </span>
                                        ) : (
                                            <span className="shrink-0">
                                                <IconMinusCircle fill={true} />
                                            </span>
                                        )}
                                    </div>
                                    <AnimateHeight duration={300} height={active1 === 10 ? 'auto' : 0}>
                                        <div className="px-1 py-3 font-semibold text-white-dark">
                                            <p>Log in to your account, go to the tax filing section, and update the necessary information.</p>
                                        </div>
                                    </AnimateHeight>
                                </div>
                                <div>
                                    <div
                                        className={`flex cursor-pointer items-center justify-between gap-10 px-2.5 py-2 text-base font-semibold hover:bg-primary-light hover:text-primary dark:text-white dark:hover:bg-[#1B2E4B] dark:hover:text-primary
                            ${active1 === 11 ? 'bg-primary-light dark:bg-[#1B2E4B] !text-primary' : ''}`}
                                        onClick={() => setActive1(active1 === 11 ? null : 11)}
                                    >
                                        <span>Is there a mobile app for TaxRX?</span>
                                        {active1 !== 11 ? (
                                            <span className="shrink-0">
                                                <IconPlusCircle duotone={false} />
                                            </span>
                                        ) : (
                                            <span className="shrink-0">
                                                <IconMinusCircle fill={true} />
                                            </span>
                                        )}
                                    </div>
                                    <AnimateHeight duration={300} height={active1 === 11 ? 'auto' : 0}>
                                        <div className="px-1 py-3 font-semibold text-white-dark">
                                            <p>Yes, TaxRX is available on both iOS and Android platforms for easy access on the go.</p>
                                        </div>
                                    </AnimateHeight>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Faq;
