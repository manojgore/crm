import { Fragment, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { api } from '../utils/apiProvider';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import IconLockDots from '../components/Icon/IconLockDots';
import IconEyeOpen from '../components/Icon/IconEyeOpen';
import IconEyeClosed from '../components/Icon/IconEyeClosed';
import { useSelector } from 'react-redux';
import { IRootState } from '../store';
import 'flatpickr/dist/flatpickr.css';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../components/Icon/IconX';

const AdminAccountSettings = () => {
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
        Password:'',
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
          const response = await axios.put(
            `${api}/api/update/updateaccountsettiings`,
            formData
          );
          console.log(response.data); // Handle response data as needed
          if (response.data.result !== 0) {
            showAlert("user-account-settings updated", "green");
            navigate("/admin-dashboard");
          } else {
            showAlert("something went wrong", "red");
          }
        } catch (error) {
          console.error("Error:", error);
        }
    };

    const getAccountDetails = async() => {
        try {
          const response = await axios.get(
            `${api}/api/get/getaccountsettiings`,
            {
              headers: {
                id: localStorage.getItem("adminidtaxrx")
              }
            }
          );
          console.log("account setting after get", response.data); // Handle response data as needed
          if (response.data.success) {
            setFormData(response.data.results[0]);
          } else {
            showAlert("something went wrong");
          }
        } catch (error) {
          console.error("Error:", error);
        }
    };

    const [passView, setPassView] = useState(false);

    const toggleViewPassword = () => {
        if (passView) {
            setPassView(false);
        } else {
            setPassView(true);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem('adminidtaxrx')) {
            navigate('/');
        } else {
            getAccountDetails();
        }
    }, []);
    return (
        <div>
            <h1 className="text-4xl font-semibold">Account Settings</h1>
            <p>Update your profile</p>
            <div className="add-customer-form py-4 px-2 flex justify-center items-center w-full">
                <form className="w-full flex justify-center items-center flex-col" onSubmit={handleSubmit}>
                    <div className="p-5 w-full flex flex-col">
                        {/* {General Information} */}
                        <h2 className="font-semibold text-2xl my-4">General Information</h2>
                        <div className="my-4 flex flex-col md:flex-row items-center w-full md:w-[50%]">
                            <img className="w-20 h-20 rounded-full overflow-hidden object-cover" src={formData.image ? formData.image : '/assets/images/user-profile.jpeg'} alt="img" />
                            <span className="flex items-center md:items-start flex-col mx-4">
                                <h4 className="font-semibold text-lg">Upload a New Photo</h4>
                                <p>profile picture</p>
                            </span>
                            <input id="customer-image" type="file" accept="image/png, image/gif, image/jpeg, image/jpg" name="image" onChange={handleChange} hidden />
                            <div className='flex justify-center items-center my-6'>
                                <label className="btn btn-primary ml-4 cursor-pointer mb-[-1.5px]" htmlFor="customer-image">
                                    Upload
                                </label>
                                <span className="btn btn-outline-danger ml-4 cursor-pointer" onClick={() => setFormData({ ...formData, image: '' })}>
                                    Remove
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-start w-full">
                            <div className="flex flex-col md:flex-row w-full justify-between items-center">
                                <div className="flex flex-col w-full md:w-[50%] mx-4 my-2">
                                    <label htmlFor="item-code" className="my-2 text-gray-600">
                                        Email ID
                                    </label>
                                    <input id="item-code" type="email" placeholder="Email ID" className="form-input w-full" name="EmailID" value={formData.EmailID} onChange={handleChange} required />
                                </div>
                                    <div className="flex flex-col w-full md:w-[50%] mx-4 my-2">
                                        <label htmlFor="item-code" className="my-2 text-gray-600">
                                            Password
                                        </label>
                                        <input
                                            id="Password"
                                            type={passView ? "text" : "password"}
                                            placeholder="Enter Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            name="Password"
                                            value={formData.Password}
                                            onChange={handleChange}
                                        />
                                    </div>
                            </div>
                        </div>
                        <div className="flex w-full justify-center md:justify-end items-center my-4">
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
                                        Password:'',
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
                <button onClick={() => setModal10(true)} type="button" className="btn btn-info hidden">
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

export default AdminAccountSettings;
