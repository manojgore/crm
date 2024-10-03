import { useEffect, useState } from 'react';
import IconArrowLeft from '../components/Icon/IconArrowLeft';
import axios from 'axios';
import { api } from '../utils/apiProvider';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useSelector } from 'react-redux';
import { IRootState } from '../store';

interface formDataInterface{
        owner_id: string | null,
        number: string,
        name: string,
        email: string,
        phone: string,
        gstNumber: string,
        panNo: string,
        addressLine1: string,
        addressLine2: string,
        country: string,
        city: string,
        state: string,
        pincode: string,
        bankName: string,
        branch: string,
        accountHolderName: string,
        accountNumber: string,
        ifsc: string,
        profileimg: string
}

const AddCustomer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<formDataInterface>({
        owner_id: localStorage.getItem('customeridtaxrx'),
        number: '',
        name: '',
        email: '',
        phone: '',
        gstNumber: '',
        panNo: '',
        addressLine1: '',
        addressLine2: '',
        country: '',
        city: '',
        state: '',
        pincode: '',
        bankName: '',
        branch: '',
        accountHolderName: '',
        accountNumber: '',
        ifsc: '',
        profileimg: '',
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target;
        if (name === 'profileimg') {
            console.log(files[0]);
            var reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = () => {
                if(typeof reader.result === 'string'){
                    setFormData({ ...formData, profileimg: reader.result });
                }
            };
        }
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${api}/api/customer/addCustomer`, formData);
            console.log(response.data); // Handle response data as needed
            if (response.data.success) {
                showAlert('Customer added');
                setFormData({
                    owner_id: localStorage.getItem('customeridtaxrx'),
                    number: '',
                    name: '',
                    email: '',
                    phone: '',
                    gstNumber: '',
                    panNo: '',
                    addressLine1: '',
                    addressLine2: '',
                    country: '',
                    city: '',
                    state: '',
                    pincode: '',
                    bankName: '',
                    branch: '',
                    accountHolderName: '',
                    accountNumber: '',
                    ifsc: '',
                    profileimg: '',
                });
            } else {
                showAlert(response.data.msg ? response.data.msg : response.data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const MySwal = withReactContent(Swal);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const showAlert = (msg: string) => {
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
            <h1 className="text-4xl font-semibold">Add Customers</h1>
            <p>Add a new customer</p>
            <div className="add-customer-form py-4 px-2">
                <div className="mb-5">
                    <form onSubmit={handleSubmit}>
                        {/* {Basic Details} */}
                        <h2 className="text-lg font-semibold my-2">Basic Details</h2>
                        <div className="my-4 flex md:flex-row flex-col items-center w-[90%] md:w-[50%]">
                            <img
                                className="w-20 h-20 rounded-full overflow-hidden object-cover"
                                src={formData.profileimg !== '' ? formData.profileimg : '/assets/images/user-profile.jpeg'}
                                alt="img"
                            />
                            <span className="flex flex-col mx-4">
                                <h4 className="font-semibold text-lg">Upload a New Photo</h4>
                                <p>profile picture</p>
                            </span>
                            <input id="customer-image" type="file" accept="image/png, image/gif, image/jpeg, image/jpg" name="profileimg" onChange={handleChange} hidden />
                            <div className='flex justify-center items-center'>
                                <label className="btn btn-primary mt-6 ml-4 mb-[-1.5px]" htmlFor="customer-image">
                                    Upload
                                </label>
                                <span className="btn btn-outline-danger mt-6 ml-4" onClick={() => setFormData({ ...formData, profileimg: '' })}>
                                    Remove
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap md:flex-row flex-col items-center justify-start">
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-number" className="my-2 text-gray-600">
                                    Number
                                </label>
                                <input id="customer-number" type="number" placeholder="Number" className="form-input w-full" name="number" value={formData.number} onChange={handleChange} required />
                            </div>
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

                        {/* {Address} */}
                        <h2 className="text-lg font-semibold my-2">Address</h2>
                        <div className="flex flex-wrap md:flex-row flex-col items-center justify-start">
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-address-line-1" className="my-2 text-gray-600 ">
                                    Address Line 1
                                </label>
                                <input
                                    id="customer-address-line-1"
                                    type="text"
                                    placeholder="Address Line 1"
                                    className="form-input w-full"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-address-line-2" className="my-2 text-gray-600 ">
                                    Address Line 2
                                </label>
                                <input
                                    id="customer-address-line-2"
                                    type="text"
                                    placeholder="Address Line 2"
                                    className="form-input w-full"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-country" className="my-2 text-gray-600 ">
                                    Country
                                </label>
                                <input id="customer-country" type="text" placeholder="Country" className="form-input w-full" name="country" value={formData.country} onChange={handleChange} required />
                            </div>
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-city" className="my-2 text-gray-600 ">
                                    City
                                </label>
                                <input id="customer-city" type="text" placeholder="City" className="form-input w-full" name="city" value={formData.city} onChange={handleChange} required />
                            </div>
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-state" className="my-2 text-gray-600 ">
                                    State
                                </label>
                                <input id="customer-state" type="text" placeholder="State" className="form-input w-full" name="state" value={formData.state} onChange={handleChange} required />
                            </div>
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-pincode" className="my-2 text-gray-600 ">
                                    Pincode
                                </label>
                                <input
                                    id="customer-pincode"
                                    type="number"
                                    placeholder="Pincode"
                                    className="form-input w-full"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* {Bank Details} */}
                        <h2 className="text-lg font-semibold my-2">Bank Details</h2>
                        <div className="flex flex-wrap md:flex-row flex-col items-center justify-start">
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-bank-name" className="my-2 text-gray-600">
                                    Bank Name
                                </label>
                                <input
                                    id="customer-bank-name"
                                    type="text"
                                    placeholder="Bank Name"
                                    className="form-input w-full"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-bank-branch" className="my-2 text-gray-600">
                                    Branch
                                </label>
                                <input
                                    id="customer-bank-branch"
                                    type="text"
                                    placeholder="Branch"
                                    className="form-input w-full"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-bank-holder-name" className="my-2 text-gray-600">
                                    Account Holder Name
                                </label>
                                <input
                                    id="customer-bank-holder-name"
                                    type="text"
                                    placeholder="Account Holder Name"
                                    className="form-input w-full"
                                    name="accountHolderName"
                                    value={formData.accountHolderName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-bank-acc-number" className="my-2 text-gray-600">
                                    Account Number
                                </label>
                                <input
                                    id="customer-bank-acc-number"
                                    type="number"
                                    placeholder="Account Number"
                                    className="form-input w-full"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-full md:w-[30%] mx-4 my-2">
                                <label htmlFor="customer-bank-ifsc" className="my-2 text-gray-600">
                                    IFSC
                                </label>
                                <input id="customer-bank-ifsc" type="text" placeholder="IFSC" className="form-input w-full" name="ifsc" value={formData.ifsc} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="flex w-full justify-center md:justify-end items-center">
                            <button type="submit" className="btn btn-primary mt-6">
                                Add Customer
                            </button>
                            <button type="reset" className="btn btn-danger mt-6 ml-4" onClick={()=>{
                                setFormData({
                                    owner_id: localStorage.getItem('customeridtaxrx'),
                                    number: '',
                                    name: '',
                                    email: '',
                                    phone: '',
                                    gstNumber: '',
                                    panNo: '',
                                    addressLine1: '',
                                    addressLine2: '',
                                    country: '',
                                    city: '',
                                    state: '',
                                    pincode: '',
                                    bankName: '',
                                    branch: '',
                                    accountHolderName: '',
                                    accountNumber: '',
                                    ifsc: '',
                                    profileimg: ''
                                })
                            }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCustomer;
