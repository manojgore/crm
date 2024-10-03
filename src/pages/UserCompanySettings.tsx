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

const UserCompanySettings = () => {
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
        company_name: '',
        company_address: '',
        phone_number: '',
        company_email: '',
        address_line_1: '',
        address_line_2: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        site_logo: '',
        favicon: '',
        company_icon: '',
    });
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        console.log('name: ', name);
        if (name === 'site_logo') {
            let reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = () => {
                setFormData({ ...formData, site_logo: reader.result });
            };
        } else if (name === 'favicon') {
            let reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = () => {
                setFormData({ ...formData, favicon: reader.result });
            };
        } else if (name === 'company_icon') {
            let reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = () => {
                setFormData({ ...formData, company_icon: reader.result });
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
            const response = await axios.put(`${api}/api/update/updateCompanySettings`, formData);
            console.log(response.data); // Handle response data as needed
            if (response.data.result !== 0) {
                showAlert('user - comany - settings updated');
                navigate('/user-dashboard');
            } else {
                showAlert('something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const getCompanyDetails = async () => {
        try {
            const response = await axios.get(`${api}/api/get/getcompanysettiings`, {
                headers: {
                    id: localStorage.getItem('customeridtaxrx'),
                },
            });
            console.log('company setting after get', response.data); // Handle response data as needed
            if (response.data.success) {
                setFormData(response.data.results[0]);
                if (!response.data.results[0].company_name) {
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
            navigate('/login');
        } else {
            getCompanyDetails();
        }
    }, []);
    return (
        <div>
            <h1 className="text-4xl font-semibold">Company Settings</h1>
            <p>Update your company profile</p>
            <div className="add-customer-form py-4 px-2 flex justify-center items-center w-full">
                <form className="w-full flex justify-center items-center flex-col" onSubmit={handleSubmit}>
                    <div className="p-5 w-full flex flex-col">
                        <div className="flex flex-col items-center justify-start w-full">
                            <div className="flex flex-col md:flex-row w-full justify-between items-center">
                                <div className="flex flex-col w-full md:w-[50%] mx-4 my-2">
                                    <label htmlFor="item-code" className="my-2 text-gray-600">
                                        Company Name
                                    </label>
                                    <input
                                        id="item-code"
                                        type="text"
                                        placeholder="Company Name"
                                        className="form-input w-full"
                                        name="company_name"
                                        value={formData.company_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col w-full md:w-[50%] mx-4 my-2">
                                    <label htmlFor="item-code" className="my-2 text-gray-600">
                                        Company Address
                                    </label>
                                    <input
                                        id="item-code"
                                        type="text"
                                        placeholder="Company Address"
                                        className="form-input w-full"
                                        name="company_address"
                                        value={formData.company_address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row justify-between items-center">
                                <div className="flex flex-col w-full md:w-[50%] mx-4 my-2">
                                    <label htmlFor="item-code" className="my-2 text-gray-600">
                                        Phone Number
                                    </label>
                                    <input
                                        id="item-code"
                                        type="number"
                                        placeholder="Phone Number"
                                        className="form-input w-full"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col w-full md:w-[50%] mx-4 my-2">
                                    <label htmlFor="item-code" className="my-2 text-gray-600">
                                        Company Email
                                    </label>
                                    <input
                                        id="item-code"
                                        type="email"
                                        placeholder="State Code"
                                        className="form-input w-full"
                                        name="company_email"
                                        value={formData.company_email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row justify-between items-center">
                                <div className="flex flex-col w-full md:w-[50%] mx-4 my-2">
                                    <label htmlFor="item-code" className="my-2 text-gray-600">
                                        Address Line 1
                                    </label>
                                    <textarea
                                        id="item-code"
                                        rows={5}
                                        placeholder="Address Line 1"
                                        className="form-input w-full"
                                        name="address_line_1"
                                        value={formData.address_line_1}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col w-full md:w-[50%] mx-4 my-2">
                                    <label htmlFor="item-code" className="my-2 text-gray-600">
                                        Address Line 2
                                    </label>
                                    <textarea
                                        id="item-code"
                                        rows={5}
                                        placeholder="Address Line 2"
                                        className="form-input w-full"
                                        name="address_line_2"
                                        value={formData.address_line_2}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row justify-between items-center">
                                <div className="flex flex-col w-full md:w-[50%] mx-4 my-2">
                                    <label htmlFor="item-code" className="my-2 text-gray-600">
                                        Country
                                    </label>
                                    <input id="item-code" type="text" placeholder="Country" className="form-input w-full" name="country" value={formData.country} onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col w-full md:w-[50%] mx-4 my-2">
                                    <label htmlFor="item-code" className="my-2 text-gray-600">
                                        State
                                    </label>
                                    <input id="item-code" type="text" placeholder="State" className="form-input w-full" name="state" value={formData.state} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="flex w-full flex-col md:flex-row justify-between items-center">
                                <div className="flex flex-col w-full md:w-[50%] mx-4 my-2">
                                    <label htmlFor="item-code" className="my-2 text-gray-600">
                                        City
                                    </label>
                                    <input id="item-code" type="text" placeholder="City" className="form-input w-full" name="city" value={formData.city} onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col w-full md:w-[50%] mx-4 my-2">
                                    <label htmlFor="item-code" className="my-2 text-gray-600">
                                        Pincode
                                    </label>
                                    <input id="item-code" type="number" placeholder="Pincode" className="form-input w-full" name="pincode" value={formData.pincode} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="w-full flex justify-center items-center">
                                <div className="mb-3 w-[98%]">
                                    <p className="my-2 text-gray-600">Site Logo</p>
                                    <label htmlFor="site-logo-company">
                                        <div className="border-2 border-dashed text-center relative p-10 min-h-[120px] w-full flex items-center justify-between cursor-pointer mb-0">
                                            <div>
                                                <h6 className="items-center">
                                                    <span className="text-info me-1">Click To Replace</span> or Drag and Drop
                                                </h6>
                                                <p className="text-gray-400">SVG, PNG, JPG (Max 800*400px)</p>
                                                <input
                                                    type="file"
                                                    id="site-logo-company"
                                                    accept="image/png, image/gif, image/jpeg, image/jpg"
                                                    className="hidden"
                                                    name="site_logo"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <span className="border-2 border-solid border-gray-200 p-[10px] rounded-md ml-[20px] w-[20%]">
                                                <img src={formData.site_logo ? formData.site_logo : '/assets/images/logo.png'} alt="upload" />
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center w-[98%]">
                                <div className="mb-3 w-full md:w-[48%]">
                                    <p className="my-2 text-gray-600">Favicon</p>
                                    <label htmlFor="favicon-company">
                                        <div className="border-2 border-dashed text-center relative p-10 min-h-[120px] w-full flex items-center justify-between cursor-pointer mb-0">
                                            <div>
                                                <h6 className="items-center">
                                                    <span className="text-info me-1">Click To Replace</span> or Drag and Drop
                                                </h6>
                                                <p className="text-gray-400">SVG, PNG, JPG (Max 800*400px)</p>
                                                <input
                                                    type="file"
                                                    id="favicon-company"
                                                    accept="image/png, image/gif, image/jpeg, image/jpg"
                                                    className="hidden"
                                                    name="favicon"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <span className="border-2 border-solid border-gray-200 p-[10px] rounded-md ml-[20px] w-[20%]">
                                                <img src={formData.favicon ? formData.favicon : '/assets/images/logo.png'} alt="upload" />
                                            </span>
                                        </div>
                                    </label>
                                </div>
                                <div className="mb-3 w-full md:w-[48%]">
                                    <p className="my-2 text-gray-600">Company icon</p>
                                    <label htmlFor="logo-company">
                                        <div className="border-2 border-dashed text-center relative p-10 min-h-[120px] w-full flex items-center justify-between cursor-pointer mb-0">
                                            <div>
                                                <h6 className="items-center">
                                                    <span className="text-info me-1">Click To Replace</span> or Drag and Drop
                                                </h6>
                                                <p className="text-gray-400">SVG, PNG, JPG (Max 800*400px)</p>
                                                <input
                                                    type="file"
                                                    id="logo-company"
                                                    accept="image/png, image/gif, image/jpeg, image/jpg"
                                                    className="hidden"
                                                    name="company_icon"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <span className="border-2 border-solid border-gray-200 p-[10px] rounded-md ml-[20px] w-[20%]">
                                                <img src={formData.company_icon ? formData.company_icon : '/assets/images/logo.png'} alt="upload" />
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full justify-center md:justify-end items-center">
                            <button type="submit" className="btn btn-primary mt-6">
                                Save Changes
                            </button>
                            <button
                                type="reset"
                                className="btn btn-danger mt-6 ml-4"
                                onClick={() => {
                                    setFormData({
                                        id: localStorage.getItem('customeridtaxrx'),
                                        company_name: '',
                                        company_address: '',
                                        phone_number: '',
                                        company_email: '',
                                        address_line_1: '',
                                        address_line_2: '',
                                        country: '',
                                        state: '',
                                        city: '',
                                        pincode: '',
                                        site_logo: '',
                                        favicon: '',
                                        company_icon: '',
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
                <button onClick={() => setModal10(true)} type="button" className="btn btn-info hidden" ref={ref}>
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
                                        <p>Please update your profile</p>
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

export default UserCompanySettings;
