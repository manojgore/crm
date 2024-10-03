import { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../utils/apiProvider';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useSelector } from 'react-redux';
import { IRootState } from '../store';

const AddItem = () => {
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

    const [itemMode, setItemMode] = useState('Product');
    const handleChangeItemMode = () => {
        if (itemMode === 'Product') {
            setItemMode('Service');
        } else {
            setItemMode('Product');
        }
    };

    const [formData, setFormData] = useState({
        ownerid: localStorage.getItem('customeridtaxrx'),
        product_code: '',
        name: '',
        price: 0,
        hsn_sac: '',
        item_in_stock: 0,
        uqc: '',
        duration: '',
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
            const response = await axios.post(`${api}/api/items/addItems`, formData);
            console.log(response.data); // Handle response data as needed
            if (response.data.success) {
                showAlert('Item Added Successfully');
                setFormData({
                    ownerid: localStorage.getItem('customeridtaxrx'),
                    product_code: '',
                    name: '',
                    price: 0,
                    hsn_sac: '',
                    item_in_stock: 0,
                    uqc: '',
                    duration: '',
                });
            } else {
                showAlert(response.data.error ? response.data.error : response.data.msg);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {
        if (!localStorage.getItem('customeridtaxrx')) {
            navigate('/');
        }
    }, []);
    return (
        <div>
            <h1 className="text-4xl font-semibold">Add Item</h1>
            <p>Add a new item</p>
            <div className="add-customer-form py-4 px-2 flex justify-center items-center w-full">
                <form className="w-full flex justify-center items-center flex-col" onSubmit={handleSubmit}>
                    <div className="mb-5 w-full md:w-[60%] flex justify-start items-center">
                        <p className="mr-2 font-semibold text-lg">Switch to {itemMode === 'Product' ? 'Service' : 'Product'}</p>
                        <label className="w-12 h-6 relative">
                            <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" onChange={handleChangeItemMode} />
                            <span className="outline_checkbox bg-icon border-2 border-[#b8b8b8] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#b8b8b8] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
                        </label>
                    </div>

                    <div className="flex md:flex-row flex-col w-full md:w-[60%]">
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="item-code" className="my-2 text-gray-600">
                                Item Code
                            </label>
                            <input id="item-code" type="text" placeholder="Item Code" className="form-input w-full" name="product_code" value={formData.product_code} onChange={handleChange} required />
                        </div>
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="item-code" className="my-2 text-gray-600">
                                Item Name
                            </label>
                            <input id="item-code" type="text" placeholder="Item Name" className="form-input w-full" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="flex md:flex-row flex-col w-full md:w-[60%]">
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="item-price" className="my-2 text-gray-600">
                                Price
                            </label>
                            <input id="item-price" type="number" placeholder="Price" className="form-input w-full" name="price" value={formData.price} onChange={handleChange} required />
                        </div>
                        <div className="flex flex-col w-[50%] mx-4 my-2">
                            <label htmlFor="item-hsnsac" className="my-2 text-gray-600">
                                HSN/SAC
                            </label>
                            <input id="item-hsnsac" type="text" placeholder="HSN/SAC" className="form-input w-full" name="hsn_sac" value={formData.hsn_sac} onChange={handleChange} required />
                        </div>
                    </div>

                    {itemMode === 'Product' && (
                        <div className="flex md:flex-row flex-col w-full md:w-[60%]">
                            <div className="flex flex-col w-[50%] mx-4 my-2">
                                <label htmlFor="item-in-stock" className="my-2 text-gray-600">
                                    No. of Items In Stock
                                </label>
                                <input
                                    id="item-in-stock"
                                    type="number"
                                    placeholder="No. of Items In Stock"
                                    className="form-input w-full"
                                    name="item_in_stock"
                                    value={formData.item_in_stock}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-[50%] mx-4 my-2">
                                <label htmlFor="item-uqc" className="my-2 text-gray-600">
                                    UQC (Unit Quantity Code)
                                </label>
                                <select className="form-select text-white-dark" name='uqc' value={formData.uqc} onChange={handleChange}>
                                    <option>Open this select menu</option>
                                    <option value="NO OF PCS">NO OF PCS</option>
                                    <option value="KG">KG</option>
                                    <option value="METER">METER</option>
                                    <option value="DOZEN">DOZEN</option>
                                    <option value="LITER">LITER</option>
                                    <option value="ETC">ETC</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {itemMode === 'Service' && (
                        <div className="flex md:flex-row flex-col w-full md:w-[60%]">
                            <div className="flex flex-col w-[50%] mx-4 my-2">
                                <label htmlFor="item-duration" className="my-2 text-gray-600">
                                    Duration
                                </label>
                                <input id="item-duration" type="text" placeholder="Duration" className="form-input w-full" name="duration" value={formData.duration} onChange={handleChange} required />
                            </div>
                        </div>
                    )}

                    <div className="flex w-full justify-center items-center">
                        <button type="submit" className="btn btn-primary mt-6 mr-4">
                            Add Item
                        </button>
                        <button
                            type="reset"
                            className="btn btn-danger mt-6 ml-4"
                            onClick={() =>
                                setFormData({
                                    ownerid: localStorage.getItem('customeridtaxrx'),
                                    product_code: '',
                                    name: '',
                                    price: 0,
                                    hsn_sac: '',
                                    item_in_stock: 0,
                                    uqc: '',
                                    duration: '',
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

export default AddItem;
