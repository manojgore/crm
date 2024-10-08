import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../store/themeConfigSlice';
import Dropdown from '../components/Dropdown';
import { IRootState } from '../store';
import i18next from 'i18next';
import IconCaretDown from '../components/Icon/IconCaretDown';
import IconMail from '../components/Icon/IconMail';
import IconLockDots from '../components/Icon/IconLockDots';
import IconInstagram from '../components/Icon/IconInstagram';
import IconFacebookCircle from '../components/Icon/IconFacebookCircle';
import IconTwitter from '../components/Icon/IconTwitter';
import IconGoogle from '../components/Icon/IconGoogle';
import axios from 'axios';
import { api } from '../utils/apiProvider';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import IconEyeOpen from '../components/Icon/IconEyeOpen';
import IconEyeClosed from '../components/Icon/IconEyeClosed';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Login Cover'));
    });

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

    const navigate = useNavigate();

    const [passView, setPassView] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        emailotp: '',
        newpassword: '',
        confirmnewpassword: ''
    });

    const MySwal = withReactContent(Swal);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

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

    const toggleViewPassword = () => {
        if (passView) {
            setPassView(false);
        } else {
            setPassView(true);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.newpassword !== formData.confirmnewpassword){
            setPasswordMatchError('password and confirm password must be same');
            return;
        }
        if(!otpMatched){
            return showAlert("OTP not verified");
        }
        try {
            const response = await axios.post(`${api}/api/user/resetpass`, formData);
            console.log(response.data);

            if (response.data.success) {
                showAlert('Password reset successfully');
                navigate('/login');
                return;
            }

            showAlert(response.data.error);
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const [otp, setOtp] = useState(null);
    const [otpMatched, setOtpMatched] = useState(false);

    const sendEmailOTP = async () => {
        try {
            const response = await axios.post(`${api}/api/email/sendforgotpassmail`, {
                email: formData.email,
            });
            console.log(response.data); // Log the response data

            if (response.data.success) {
                setOtp(response.data.otp);
                showAlert('OTP sent to your email!');
            } else {
                if(response.data.error === 'user with this email is not found'){
                    showAlert('Email is not registered');
                }else{
                    showAlert('OTP not sent due to some error');
                }
            }
        } catch (error) {
            console.error('Error sending email OTP:', error);
            showAlert('Failed to send OTP. Please try again.');
        }
    };

    const verifyEmail = async () => {
        if (formData.emailotp === otp) {
            setOtpMatched(true);
            showAlert('OTP Verified');
        } else {
            setOtpMatched(false);
            showAlert('OTP Not Verified');
        }
    };

    const [passwordMatchError, setPasswordMatchError] = useState('');

    useEffect(()=>{
        if(formData.newpassword !== formData.confirmnewpassword && formData.newpassword !== '' && formData.confirmnewpassword !== ''){
            setPasswordMatchError('password and confirm password must be same');
        }else{
            setPasswordMatchError('');
        }
    });

    useEffect(() => {
        if (localStorage.getItem('adminidtaxrx')) {
            navigate('/admin-dashboard');
        } else if (localStorage.getItem('customeridtaxrx')) {
            navigate('/user-dashboard');
        }
    }, []);

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <Link to="/" className="w-48 block lg:w-72 ms-10">
                                <img src="/assets/images/logo.png" alt="Logo" className="w-full" />
                            </Link>
                            <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                <img src="/assets/images/auth/login.svg" alt="Cover Image" className="w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                            <Link to="/" className="w-8 block lg:hidden">
                                <img src="/assets/images/logo.png" alt="Logo" className="mx-auto w-10" />
                            </Link>
                        </div>
                        <div className="w-full max-w-[440px] lg:mt-16">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Forgot Password</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Verify your email and change password</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Email"
                                            type="email"
                                            placeholder="Enter Email"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                    <span
                                        className="btn btn-gradient text-white cursor-pointer !mt-6 w-fit border-0 uppercase"
                                        style={{ boxShadow: '0 10px 20px -10px rgba(67, 97, 238, 0.44)', background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                        onClick={sendEmailOTP}
                                    >
                                        Send OTP
                                    </span>
                                </div>
                                {   formData.email &&
                                    <div>
                                        <label htmlFor="Email">Email OTP</label>
                                        <div className="relative text-white-dark">
                                            <input id="Email" type="text" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark" name='emailotp' value={formData.emailotp} onChange={handleChange} required/>
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconMail fill={true} />
                                            </span>
                                        </div>
                                        <span
                                            className="btn btn-gradient text-white cursor-pointer !mt-6 w-fit border-0 uppercase"
                                            style={{ boxShadow: '0 10px 20px -10px rgba(67, 97, 238, 0.44)', background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                            onClick={verifyEmail}
                                        >
                                            Verify
                                        </span>
                                    </div>
                                }
                                <div>
                                    <label htmlFor="Password">New Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            type={passView ? "text" : "password"}
                                            placeholder="Enter New Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            name="newpassword"
                                            value={formData.newpassword}
                                            onChange={handleChange}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                        <span className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={toggleViewPassword}>
                                            {!passView && <IconEyeOpen />}
                                            {passView && <IconEyeClosed />}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password">Confirm New Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            type={passView ? "text" : "password"}
                                            placeholder="Enter Confirm Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            name="confirmnewpassword"
                                            value={formData.confirmnewpassword}
                                            onChange={handleChange}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                        <span className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={toggleViewPassword}>
                                            {!passView && <IconEyeOpen />}
                                            {passView && <IconEyeClosed />}
                                        </span>
                                    </div>
                                    <p className='text-red-600 text-sm my-1'>{passwordMatchError}</p>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-gradient text-white !mt-6 w-full border-0 uppercase"
                                    style={{ boxShadow: '0 10px 20px -10px rgba(67, 97, 238, 0.44)', background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                >
                                    Reset Password
                                </button>
                            </form>

                            <div className="relative my-7 text-center md:mb-9">
                                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">or</span>
                            </div>
                            
                            <div className="text-center dark:text-white">
                                Already have an account ?&nbsp;
                                <Link to="/login" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    SIGN IN
                                </Link>
                            </div>
                            <div className='mt-10'>
                                <p className="absolute bottom-6 w-full my-4 text-center max-w-[65%] dark:text-white"><Link to='https://psyber.co/'>  © All Rights Reserved | Cooked with ❤️ by Psyber Inc</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
