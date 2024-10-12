import { useEffect, useState } from 'react';
import IconArrowLeft from '../components/Icon/IconArrowLeft';
import IconUser from '../components/Icon/IconUser';
import IconMail from '../components/Icon/IconMail';
import IconLockDots from '../components/Icon/IconLockDots';
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
        position:string,
        companyName:string,
        company_address:string,
        city:string,
        website:string,
        county:string,
        zipcode:string,
        state: string,
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
        position:'',
        companyName:'',
        city:'',
        company_address:'',
        website:'',
        county:'',
        zipcode:'',
        state: '',
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
                    email: '',
                    name: '',
                    gstNumber: '',
                    phone: '',
                    position:'',
                    panNo: '',
                    city:'',
                    companyName:'',
                    website:'',
                    company_address:'',
                    zipcode:'',
                    county:'',
                    state: '',
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
                        <div className="flex w-full justify-center md:justify-end items-center">
                            <button type="submit" className="btn btn-primary mt-6">
                                Add Customer
                            </button>
                            <button type="reset" className="btn btn-danger mt-6 ml-4" onClick={()=>{
                                setFormData({
                                    owner_id: localStorage.getItem('customeridtaxrx'),
                                    number: '',
                                    email: '',
                                    name: '',
                                    gstNumber: '',
                                    phone: '',
                                    position:'',
                                    panNo: '',
                                    city:'',
                                    companyName:'',
                                    website:'',
                                    company_address:'',
                                    zipcode:'',
                                    county:'',
                                    state: '',
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
