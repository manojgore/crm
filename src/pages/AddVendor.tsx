import { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../utils/apiProvider';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useSelector } from 'react-redux';
import { IRootState } from '../store';

const AddVendor = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        gst_number: '',
        pan_number: '',
        address_line_1: '',
        address_line_2: '',
        country: '',
        city: '',
        state: '',
        pincode: '',
        bank_name: '',
        branch: '',
        account_holder_name: '',
        account_number: '',
        ifsc_code: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${api}/api/vendors/addVendors`, formData);
            console.log(response.data); // Handle response data as needed
            if (response.data.success) {
                showAlert('Vendor Added Successfully');
                setFormData({
                    name: '',
                    email: '',
                    phone_number: '',
                    gst_number: '',
                    pan_number: '',
                    address_line_1: '',
                    address_line_2: '',
                    country: '',
                    city: '',
                    state: '',
                    pincode: '',
                    bank_name: '',
                    branch: '',
                    account_holder_name: '',
                    account_number: '',
                    ifsc_code: '',
                });
            } else {
                showAlert(response.data.error ? response.data.error : response.data.msg);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

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

    useEffect(() => {
        if (!localStorage.getItem('customeridtaxrx')) {
            navigate('/');
        }
    }, []);
    return (
        <div>
            <h1 className="text-4xl font-semibold">Add Vendor</h1>
            <p>Add a new vendor</p>
            <div className="add-customer-form py-4 px-2 flex justify-center items-center w-full">
                <form className="w-full flex justify-center items-center flex-col" onSubmit={handleSubmit}>
                    <div className="flex md:flex-row flex-col w-full md:w-[60%]">
                        <div className="flex flex-row md:flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-name" className="my-2 text-gray-600">
                                Name
                            </label>
                            <input id="vendor-name" type="text" placeholder="Name" className="form-input w-full" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-email" className="my-2 text-gray-600">
                                Email
                            </label>
                            <input id="vendor-email" type="email" placeholder="Email" className="form-input w-full" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="flex md:flex-row flex-col w-full md:w-[60%]">
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-phone" className="my-2 text-gray-600">
                                Phone Number
                            </label>
                            <input
                                id="vendor-phone"
                                type="number"
                                placeholder="Phone Number"
                                className="form-input w-full"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-gst" className="my-2 text-gray-600">
                                GST Number (if available)
                            </label>
                            <input id="vendor-gst" type="text" placeholder="GST Number" className="form-input w-full" name="gst_number" value={formData.gst_number} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="flex md:flex-row flex-col w-full md:w-[60%]">
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-pan" className="my-2 text-gray-600">
                                PAN Number
                            </label>
                            <input id="vendor-pan" type="text" placeholder="PAN Number" className="form-input w-full" name="pan_number" value={formData.pan_number} onChange={handleChange} required />
                        </div>
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-address-1" className="my-2 text-gray-600">
                                Address Line 1
                            </label>
                            <input
                                id="vendor-address-1"
                                type="text"
                                placeholder="Address Line 1"
                                className="form-input w-full"
                                name="address_line_1"
                                value={formData.address_line_1}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex md:flex-row flex-col w-full md:w-[60%]">
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-address-2" className="my-2 text-gray-600">
                                Address Line 2
                            </label>
                            <input
                                id="vendor-address-2"
                                type="text"
                                placeholder="Address Line 2"
                                className="form-input w-full"
                                name="address_line_2"
                                value={formData.address_line_2}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-country" className="my-2 text-gray-600">
                                Country
                            </label>
                            <input id="vendor-country" type="text" placeholder="Country" className="form-input w-full" name="country" value={formData.country} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="flex md:flex-row flex-col w-full md:w-[60%]">
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-city" className="my-2 text-gray-600">
                                City
                            </label>
                            <input id="vendor-city" type="text" placeholder="City" className="form-input w-full" name="city" value={formData.city} onChange={handleChange} required />
                        </div>
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-state" className="my-2 text-gray-600">
                                State
                            </label>
                            <input id="vendor-state" type="text" placeholder="State" className="form-input w-full" name="state" value={formData.state} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="flex md:flex-row flex-col w-full md:w-[60%]">
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-pincode" className="my-2 text-gray-600">
                                Pincode
                            </label>
                            <input id="vendor-pincode" type="number" placeholder="Pincode" className="form-input w-full" name="pincode" value={formData.pincode} onChange={handleChange} required />
                        </div>
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-bank-name" className="my-2 text-gray-600">
                                Bank Name
                            </label>
                            <input
                                id="vendor-bank-name"
                                type="text"
                                placeholder="Bank Name"
                                className="form-input w-full"
                                name="bank_name"
                                value={formData.bank_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex md:flex-row flex-col w-full md:w-[60%]">
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-bank-branch" className="my-2 text-gray-600">
                                Branch
                            </label>
                            <input id="vendor-bank-branch" type="text" placeholder="Branch" className="form-input w-full" name="branch" value={formData.branch} onChange={handleChange} required />
                        </div>
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-holder-name" className="my-2 text-gray-600">
                                Account Holder Name
                            </label>
                            <input
                                id="vendor-holder-name"
                                type="text"
                                placeholder="Account Holder Name"
                                className="form-input w-full"
                                name="account_holder_name"
                                value={formData.account_holder_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex md:flex-row flex-col w-full md:w-[60%]">
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-acc-number" className="my-2 text-gray-600">
                                Account Number
                            </label>
                            <input
                                id="vendor-acc-number"
                                type="number"
                                placeholder="Account Number"
                                className="form-input w-full"
                                name="account_number"
                                value={formData.account_number}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="vendor-ifsc" className="my-2 text-gray-600">
                                IFSC Code
                            </label>
                            <input id="vendor-ifsc" type="text" placeholder="IFSC Code" className="form-input w-full" name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="flex w-full justify-center items-center">
                        <button type="submit" className="btn btn-primary mt-6 mr-4">
                            Add Vendor
                        </button>
                        <button
                            type="reset"
                            className="btn btn-danger mt-6 ml-4"
                            onClick={() =>
                                setFormData({
                                    name: '',
                                    email: '',
                                    phone_number: '',
                                    gst_number: '',
                                    pan_number: '',
                                    address_line_1: '',
                                    address_line_2: '',
                                    country: '',
                                    city: '',
                                    state: '',
                                    pincode: '',
                                    bank_name: '',
                                    branch: '',
                                    account_holder_name: '',
                                    account_number: '',
                                    ifsc_code: '',
                                })
                            }
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVendor;
