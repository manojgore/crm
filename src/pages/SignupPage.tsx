import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { setPageTitle, toggleRTL } from '../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import Navbar from "../components/Landing/navbar";
import Dropdown from '../components/Dropdown';
import i18next from 'i18next';
import IconCaretDown from '../components/Icon/IconCaretDown';
import IconUser from '../components/Icon/IconUser';
import IconMail from '../components/Icon/IconMail';
import IconLockDots from '../components/Icon/IconLockDots';
import IconInstagram from '../components/Icon/IconInstagram';
import IconFacebookCircle from '../components/Icon/IconFacebookCircle';
import IconTwitter from '../components/Icon/IconTwitter';
import IconGoogle from '../components/Icon/IconGoogle';
import IconPhone from '../components/Icon/IconPhone';
import IconPhoneCall from '../components/Icon/IconPhoneCall';
import IconEyeOpen from '../components/Icon/IconEyeOpen';
import IconEyeClosed from '../components/Icon/IconEyeClosed';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'axios';
import { api } from '../utils/apiProvider';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { GetContext } from '../context/UserContextProvider';

const SignupPage = () => {
    const context = GetContext();
    const {userGetStarted, setUserGetStarted} = context;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Register Boxed'));
    });
    useEffect(() => {
        fetchServices();
        fetchPackages();
    },[]);
    const navigate = useNavigate();
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);
    const [packages, setPackages] = useState([]);

    const [services, setServices] = useState([]);

    const MySwal = withReactContent(Swal);
    const months = new Map([
        [1, 'January'],
        [2, 'February'],
        [3, 'March'],
        [4, 'April'],
        [5, 'May'],
        [6, 'June'],
        [7, 'July'],
        [8, 'August'],
        [9, 'September'],
        [10, 'October'],
        [11, 'November'],
        [12, 'December'],
    ]);

    const days = new Map([
        ["Monthly", 30],
        ["Weekly", 7],
        ["Half Yearly", 180],
        ["Yearly", 365],
    ]);
    const showAlert = (msg) => {
        MySwal.fire({
            title: msg,
            toast: true,
            position: isRtl ? 'bottom-start' : 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
        });
    };

    const [passView, setPassView] = useState(false);
    const toggleViewPassword = () => {
        if (passView) {
            setPassView(false);
        } else {
            setPassView(true);
        }
    };

    const [confirmPassView, setConfirmPassView] = useState(false);
    const toggleViewConfirmPassword = () => {
        if (confirmPassView) {
            setConfirmPassView(false);
        } else {
            setConfirmPassView(true);
        }
    };

    const [isAgreeChecked, setIsAgreeChecked] = useState(false);

    const [otp, setOtp] = useState(null);
    const [otpMatched, setOtpMatched] = useState(false);

    const [formData, setFormData] = useState({
        username: userGetStarted.username,
        phoneNumber: userGetStarted.phoneNumber,
        mobileOtp: '',
        email: '',
        emailOtp: '',
        password: '',
        emailverified: '',
        confirmPassword: '',
        position:'',
        companyName:'',
        city:'',
        company_address:'',
        website:'',
        county:'',
        zipcode:'',
        defaultLanguage:'',
        state:'',
        gst:'',
        panNo:'',
        serviceType:'',
        serviceName:'',
        planType:''
    });
    const [passwordMatchError, setPasswordMatchError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const sendEmailOTP = async () => {
        try {
            const response = await axios.post(`${api}/api/email/sendEmail`, {
                email: formData.email,
            });
            console.log(response.data); // Log the response data

            if (response.data.success) {
                setOtp(response.data.otp);
                showAlert('OTP sent to your email!');
            } else {
                showAlert('OTP was not sent');
            }
        } catch (error) {
            console.error('Error sending email OTP:', error);
            showAlert('Failed to send OTP. Please try again.');
        }
    };

    const [mobileOtp, setMobileOtp] = useState(null);
    const [isMobileOtpMatched, setIsMobileOtpMatched] = useState(false);

    const sendMobileOtp = async () => {
        try {
            const response = await axios.post(`${api}/api/sms/sendmobileotp`, {
                name: formData.username,
                number: formData.phoneNumber,
            });
            console.log(response.data); // Log the response data

            if (response.data.success) {
                setMobileOtp(response.data.otp);
                showAlert(response.data.message);
            } else {
                showAlert(response.data.error);
            }
        } catch (error) {
            console.error('Error sending mobile OTP:', error);
            showAlert('Failed to send OTP. Please try again.');
        }
    };

    const verifyMobile = () => {
        if (formData.mobileOtp === mobileOtp) {
            setIsMobileOtpMatched(true);
            showAlert('OTP Verified');
        } else {
            setIsMobileOtpMatched(false);
            showAlert('OTP Not Verified');
        }
    };

    const verifyEmail = async () => {
        if (formData.emailOtp === otp) {
            setOtpMatched(true);
            showAlert('OTP Verified');
        } else {
            setOtpMatched(false);
            showAlert('OTP Not Verified');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setPasswordMatchError("Passwords don't match");
            return;
        }
        // if (!otpMatched) {
        //     showAlert('Email OTP not matched');
        //     return;
        // }
        // if (!isMobileOtpMatched) {
        //     showAlert('Mobile OTP not matched');
        //     return;
        // }

        if(!isAgreeChecked){
            showAlert('Agree to the terms & conditions');
            return;
        }
        try {
            const response = await axios.post(`${api}/api/customers/register`, 
                {...formData,
                    address_line_1 :"",
                    address_line_2: "",
                    plan: formData.planType === "" ? 0 : 1,
                    registered_on: new Date(),
                    purchased_on: formData.planType === "" ? null : new Date(),
                    expiring_on:
                    formData.planType === "" ||
                    formData.planType.split(" ")[0] === "Yearly"
                        ? null
                        : new Date(
                            new Date().getTime() +
                            days.get(formData.planType.split(" ")[0]) *
                                24 *
                                60 *
                                60 *
                                1000
                        ),
                });
            console.log(response.data); // For debugging purposes
            // Handle successful registration (e.g., redirect to a success page)
            if (!response.data.success) {
                showAlert(response.data.msg);
                return;
            }
            showAlert('Registration successful!');
            console.log('customer id: ', response.data.customerId);
            localStorage.setItem('adminidtaxrx', response.data.customerId);
            localStorage.setItem('customeridtaxrx', response.data.customerId);
            localStorage.setItem('isUser', response.data.customerId)
            // Redirect to vendor-profile page
            navigate('/admin-account-settings');
            if (response.data.result !== 0) {
                showAlert('registered successfully');
            } else {
                showAlert('something went wrong');
            }
        } catch (error) {
            console.error('Error registering customer:', error);
            // Handle errors (e.g., display error message to the user)
            showAlert('Registration failed. Please try again.');
        }
    };

    const fetchServices = async () => {
        try {
          const response = await axios.get(`${api}/api/items/getallservices`);
    
          console.log("Service result: ", response.data);
          if (response.data.success) {
            setServices(response.data.results);
          }
        } catch (error) {
          console.log("failed to fetch the service");
          console.error(error);
        }
    };

    const fetchPackages = async () => {
        try {
          const response = await axios.get(`${api}/admin/getallpackages`);
    
          console.log("Packages result: ", response.data);
          if (response.data.success) {
            setPackages(response.data.results);
          }
        } catch (error) {
          console.log("failed to fetch the packages");
          console.error(error);
        }
    };
    
    const OauthOnSuccess = async (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse?.credential);
        console.log(decoded);
        try {
            const response = await axios.post(`${api}/api/customers/register`, {
                username: decoded.name,
                email: decoded.email,
                emailOtp: 0,
                phoneNumber: 0,
                password: decoded.sub,
                confirmPassword: decoded.sub,
                image: decoded.picture,
            });
            console.log(response.data); // For debugging purposes
            // Handle successful registration (e.g., redirect to a success page)
            showAlert('Registration successful!');
            console.log('customer id: ', response.data.customerId);
            localStorage.setItem('customeridtaxrx', response.data.customerId);
            // Redirect to vendor-profile page
            navigate('/update-mobile');
            if (response.data.result !== 0) {
                showAlert('registered successfully');
            } else {
                showAlert('something went wrong');
            }
        } catch (error) {
            console.error('Error registering customer:', error);
            // Handle errors (e.g., display error message to the user)
            showAlert('Registration failed. Please try again.');
        }
    };

    useEffect(()=>{
        if(formData.password !== formData.confirmPassword && formData.password !== '' && formData.confirmPassword !== ''){
            setPasswordMatchError('password and confirm password must be same');
        }else{
            setPasswordMatchError('');
        }
    })

    useEffect(() => {
        if (localStorage.getItem('adminidtaxrx')) {
            navigate('/admin-dashboard');
        } else if (localStorage.getItem('customeridtaxrx')) {
            navigate('/user-dashboard');
        }
    }, []);

    return (
        <div>
            

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[100%] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <div className="mx-auto w-full max-w-[100%]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign Up</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to register</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={handleSubmit}>
                            <p className="text-base font-bold leading-normal text-white-dark">Profile Information</p>
                            <div className="flex flex-wrap md:flex-row flex-col items-normal justify-start">
                                <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                    <label htmlFor="Name">Username</label>
                                    <div className="relative text-white-dark">
                                        <input id="Name" type="text" placeholder="Enter Name" className="form-input ps-10 placeholder:text-white-dark" name='username' value={formData.username} onChange={handleChange} required/>
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                    <label htmlFor="Email">Email</label>
                                    <div className="flex justify-between">
                                        <div className="relative text-white-dark">
                                            <input id="Email" type="email" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark" name='email' value={formData.email} onChange={handleChange} required/>
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconMail fill={true} />
                                            </span>
                                        </div>
                                        <span
                                            className="btn btn-gradient text-white cursor-pointer w-fit border-0 uppercase"
                                            style={{ boxShadow: '0 10px 20px -10px rgba(67, 97, 238, 0.44)', background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                            onClick={sendEmailOTP}
                                        >
                                            Send OTP
                                        </span>
                                    </div>
                                </div>
                                {   formData.email &&
                                    <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                        <label htmlFor="Email">Email OTP</label>
                                        <div className="flex justify-between">
                                            <div className="relative text-white-dark">
                                                <input id="Email" type="text" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark" name='emailOtp' value={formData.emailOtp} onChange={handleChange} required/>
                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <IconMail fill={true} />
                                                </span>
                                            </div>
                                            <span
                                                className="btn btn-gradient text-white cursor-pointer w-fit border-0 uppercase"
                                                style={{ boxShadow: '0 10px 20px -10px rgba(67, 97, 238, 0.44)', background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                                onClick={verifyEmail}
                                            >
                                                Verify
                                            </span>
                                        </div>
                                    </div>
                                }
                                <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                    <label htmlFor="Phone Number">Phone Number</label>
                                    <div className="flex justify-between">
                                        <div className="relative text-white-dark">
                                            <input id="Phone Number" type="number" placeholder="Enter Phone Number" className="form-input ps-10 placeholder:text-white-dark" name='phoneNumber' value={formData.phoneNumber} onChange={handleChange} required/>
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconPhoneCall fill={true} />
                                            </span>
                                        </div>
                                        <span
                                            className="btn btn-gradient text-white cursor-pointer w-fit border-0 uppercase"
                                            style={{ boxShadow: '0 10px 20px -10px rgba(67, 97, 238, 0.44)', background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                            onClick={sendMobileOtp}
                                        >
                                            Send OTP
                                        </span>
                                    </div>
                                </div>
                                {   formData.phoneNumber &&
                                    <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                        <label htmlFor="Email">Mobile OTP</label>
                                        <div className="flex justify-between">
                                            <div className="relative text-white-dark">
                                                <input id="Email" type="text" placeholder="Enter OTP" className="form-input ps-10 placeholder:text-white-dark" name='mobileOtp' value={formData.mobileOtp} onChange={handleChange} required/>
                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <IconMail fill={true} />
                                                </span>
                                            </div>
                                            <span
                                                className="btn btn-gradient text-white cursor-pointer w-fit border-0 uppercase"
                                                style={{ boxShadow: '0 10px 20px -10px rgba(67, 97, 238, 0.44)', background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                                onClick={verifyMobile}
                                            >
                                                Verify
                                            </span>
                                        </div>
                                    </div>
                                }
                                <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input id="Password" type={passView ? 'text' : 'password'} placeholder="Enter Password" className="form-input ps-10 placeholder:text-white-dark" name='password' value={formData.password} onChange={handleChange} required/>
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                        <span className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={toggleViewPassword}>
                                            {!passView && <IconEyeOpen />}
                                            {passView && <IconEyeClosed />}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                    <label htmlFor="Confirm Password">Confirm Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Confirm Password"
                                            type={confirmPassView ? 'text' : 'password'}
                                            placeholder="Enter Confirm Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            name='confirmPassword' value={formData.confirmPassword} onChange={handleChange}
                                            required
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                        <span className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={toggleViewConfirmPassword}>
                                            {!confirmPassView && <IconEyeOpen />}
                                            {confirmPassView && <IconEyeClosed />}
                                        </span>
                                    </div>
                                    <p className='text-red-600 text-sm my-1'>{passwordMatchError}</p>
                                </div>
                                <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                    <label htmlFor="Name">Position</label>
                                    <div className="relative text-white-dark">
                                        <input id="Position" type="text" placeholder="Enter Position" className="form-input ps-10 placeholder:text-white-dark" name='position' value={formData.position} onChange={handleChange} required/>
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span>
                                    </div>
                                </div>
                                
                            </div>
                            <p className="text-base font-bold leading-normal text-white-dark">Company Information</p>
                            <div className="flex flex-wrap md:flex-row flex-col items-center justify-start">
                                <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                    <label htmlFor="Name">Company Name</label>
                                    <div className="relative text-white-dark">
                                        <input id="CompanyName" type="text" placeholder="Company Name" className="form-input ps-10 placeholder:text-white-dark" name='companyName' value={formData.companyName} onChange={handleChange} required/>
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                    <label htmlFor="Name">City</label>
                                    <div className="relative text-white-dark">
                                        <input id="City" type="text" placeholder="City" className="form-input ps-10 placeholder:text-white-dark" name='city' value={formData.city} onChange={handleChange} required/>
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                    <label htmlFor="Name">Address</label>
                                    <div className="relative text-white-dark">
                                        <input id="Address" type="text" placeholder="Address" className="form-input ps-10 placeholder:text-white-dark" name='company_address' value={formData.company_address} onChange={handleChange} required/>
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                    <label htmlFor="Name">Website</label>
                                    <div className="relative text-white-dark">
                                        <input id="Website" type="text" placeholder="Website" className="form-input ps-10 placeholder:text-white-dark" name='website' value={formData.website} onChange={handleChange} required/>
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                    <label htmlFor="Name">State</label>
                                    <div className="relative text-white-dark">
                                        <input id="State" type="text" placeholder="State" className="form-input ps-10 placeholder:text-white-dark" name='state' value={formData.state} onChange={handleChange} required/>
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                    <label htmlFor="Name">County</label>
                                    <div className="relative text-white-dark">
                                        <input id="County" type="text" placeholder="County" className="form-input ps-10 placeholder:text-white-dark" name='county' value={formData.county} onChange={handleChange} required/>
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                    <label htmlFor="Name">Zipcode</label>
                                    <div className="relative text-white-dark">
                                        <input id="Zipcode" type="number" placeholder="Zipcode" className="form-input ps-10 placeholder:text-white-dark" name='zipcode' value={formData.zipcode} onChange={handleChange} required/>
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                    <label htmlFor="Name">Default Language</label>
                                    <div className="relative text-white-dark">
                                        <input id="Default Language" type="text" placeholder="Default Language" className="form-input ps-10 placeholder:text-white-dark" name='defaultLanguage' value={formData.defaultLanguage} onChange={handleChange} required/>
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                    <label htmlFor="Name">GST</label>
                                    <div className="relative text-white-dark">
                                        <input id="GST" type="text" placeholder="GST" className="form-input ps-10 placeholder:text-white-dark" name='gst' value={formData.gst} onChange={handleChange} required/>
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span>
                                    </div>
                                </div>

                            </div>
                                <div>
                                    <label className="flex cursor-pointer items-center">
                                        <input type="checkbox" className="form-checkbox bg-white dark:bg-black" checked={isAgreeChecked} onChange={() => setIsAgreeChecked(true)} />
                                        <span className="text-white-dark">Agree to terms & conditions</span>
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-gradient text-white cursor-pointer !mt-6 w-fit border-0 uppercase"
                                    style={{ boxShadow: '0 10px 20px -10px rgba(67, 97, 238, 0.44)', background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                >
                                    Sign Up
                                </button>
                            </form>
                            <div className="relative my-7 text-center md:mb-9">
                                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">or</span>
                            </div>
                            {/* <div className="mb-10 md:mb-[60px] w-full flex justify-center items-center">
                                <GoogleLogin
                                    onSuccess={(credentialResponse) => OauthOnSuccess(credentialResponse)}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                />
                            </div> */}
                            <div className="text-center dark:text-white">
                                Already have an account ?&nbsp;
                                <Link to="/login" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    SIGN IN
                                </Link>
                            </div>
                        </div>
                    </div>
                    <p className="absolute bottom-6 w-full text-center dark:text-white"><Link to='https://psyber.co/'>  © All Rights Reserved | Cooked with ❤️ by Psyber Inc</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
