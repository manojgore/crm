import { Fragment, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { api } from '../utils/apiProvider';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useSelector } from 'react-redux';
import { IRootState } from '../store';
import 'flatpickr/dist/flatpickr.css';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../components/Icon/IconX';
import IconLockDots from '../components/Icon/IconLockDots';
import IconEyeOpen from '../components/Icon/IconEyeOpen';
import IconEyeClosed from '../components/Icon/IconEyeClosed';
import IconUser from '../components/Icon/IconUser';
import IconMail from '../components/Icon/IconMail';

const UserAccountSettings = () => {
    const navigate = useNavigate();

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

    const [modal10, setModal10] = useState(false);

    const [formData, setFormData] = useState({
        id: localStorage.getItem('customeridtaxrx'),
        TradeName: '',
        GSTNo: '',
        OfficeAddress: '',
        State: '',
        StateCode: '',
        PhoneNumber: '',
        EmailID: '',
        PANNo: '',
        AuthorisedSignatoryName: '',
        image: '',
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            var reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
        }
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${api}/api/update/updateaccountsettiings`, formData);
            console.log(response.data); // Handle response data as needed
            if (response.data.result !== 0) {
                showAlert('user-account-settings updated');
                navigate('/user-company-settings');
            } else {
                showAlert('something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const [passwordMatchError, setPasswordMatchError] = useState('');
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
    const getAccountDetails = async () => {
        try {
            const response = await axios.get(`${api}/api/get/getaccountsettiings`, {
                headers: {
                    id: localStorage.getItem('customeridtaxrx'),
                },
            });
            console.log('account setting after get', response.data); // Handle response data as needed
            if (response.data.success) {
                setFormData(response.data.results[0]);
                if (!response.data.results[0].TradeName) {
                    ref.current.click();
                }
            } else {
                showAlert('something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const ref = useRef(null);
    useEffect(() => {
        if (!localStorage.getItem('customeridtaxrx')) {
            navigate('/');
        } else {
            getAccountDetails();
        }
    }, []);

    useEffect(()=>{
        if(formData.password !== formData.confirmPassword && formData.password !== '' && formData.confirmPassword !== ''){
            setPasswordMatchError('password and confirm password must be same');
        }else{
            setPasswordMatchError('');
        }
    })
    return (
        <div>
            <h1 className="text-4xl font-semibold">Account Settings</h1>
            <p>Update your profile</p>
            <div className="add-customer-form py-4 px-2 flex justify-center items-center w-full">
                <form className="w-full flex justify-center items-center flex-col" onSubmit={handleSubmit}>
                    <div className="p-5 w-full flex flex-col">
                        {/* {General Information} */}
                        <h2 className="font-semibold text-2xl my-4">General Information</h2>
                        <div className="my-4 flex flex-col md:flex-row justify-center items-center w-full md:w-[50%]">
                            <img className="w-20 h-20 rounded-full overflow-hidden object-cover" src={formData.image ? formData.image : '/assets/images/user-profile.jpeg'} alt="img" />
                            <span className="flex flex-col justify-center md:items-start items-center mx-4">
                                <h4 className="font-semibold text-lg">Upload a New Photo</h4>
                                <p>profile picture</p>
                            </span>
                            <input id="customer-image" type="file" accept="image/png, image/gif, image/jpeg, image/jpg" name="image" onChange={handleChange} hidden />
                            <div className='flex my-4'>
                                <label className="btn btn-primary ml-4 cursor-pointer mb-[-1.5px]" htmlFor="customer-image">
                                    Upload
                                </label>
                                <span className="btn btn-outline-danger ml-4 cursor-pointer" onClick={() => setFormData({ ...formData, image: '' })}>
                                    Remove
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap md:flex-row flex-col items-center justify-start">
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-name" className="my-2 text-gray-600 ">
                                    Name
                                </label>
                                <input id="customer-name" type="text" placeholder="Name" className="form-input w-full" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-email" className="my-2 text-gray-600 ">
                                    Email
                                </label>
                                <input id="customer-email" type="email" placeholder="Email" className="form-input w-full" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-phone" className="my-2 text-gray-600 ">
                                    Phone
                                </label>
                                <input id="customer-phone" type="number" placeholder="Phone" className="form-input w-full" name="phone" value={formData.phone} onChange={handleChange} required />
                            </div>
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
                                <label htmlFor="customer-gst" className="my-2 text-gray-600 ">
                                    GST Number (if available)
                                </label>
                                <input
                                    id="customer-gst"
                                    type="text"
                                    placeholder="GST Number"
                                    className="form-input w-full"
                                    name="gstNumber"
                                    value={formData.gstNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-pan" className="my-2 text-gray-600 ">
                                    PAN No
                                </label>
                                <input id="customer-pan" type="text" placeholder="PAN No" className="form-input w-full" name="panNo" value={formData.panNo} onChange={handleChange} required />
                            </div>
                        </div>
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
                                    <label htmlFor="Name">Position</label>
                                    <div className="relative text-white-dark">
                                        <input id="Position" type="text" placeholder="Enter Position" className="form-input ps-10 placeholder:text-white-dark" name='position' value={formData.position} onChange={handleChange} required/>
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
                                    <label htmlFor="Name">Country</label>
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
                            </div>
                        <div className="flex w-full justify-center my-4 md:justify-end items-center">
                            <button type="submit" className="btn btn-primary mt-6">
                                Save Changes
                            </button>
                            <button
                                type="reset"
                                className="btn btn-danger mt-6 ml-4"
                                onClick={() => {
                                    setFormData({
                                        id: localStorage.getItem('customeridtaxrx'),
                                        TradeName: '',
                                        GSTNo: '',
                                        OfficeAddress: '',
                                        State: '',
                                        StateCode: '',
                                        PhoneNumber: '',
                                        EmailID: '',
                                        PANNo: '',
                                        AuthorisedSignatoryName: '',
                                        image: '',
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div>
                <button onClick={() => setModal10(true)} type="button" className="btn btn-info hidden" ref={ref} >
                    SlideIn Down
                </button>
                <Transition appear show={modal10} as={Fragment}>
                    <Dialog as="div" open={modal10} onClose={() => setModal10(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div id="slideIn_down_modal" className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-start justify-center px-4">
                                <Dialog.Panel className="panel animate__animated animate__slideInDown my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Update Profile</h5>
                                        <button onClick={() => setModal10(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <p>
                                            Please update your profile
                                        </p>
                                        <div className="mt-8 flex items-center justify-end">
                                            <button onClick={() => setModal10(false)} type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                Ok
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
};

export default UserAccountSettings;
