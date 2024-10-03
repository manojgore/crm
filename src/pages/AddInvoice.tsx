import { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../utils/apiProvider';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useSelector } from 'react-redux';
import { IRootState } from '../store';
import Fuse, { FuseResult } from 'fuse.js';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconTrashLines from '../components/Icon/IconTrashLines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface selectedCustomerInterface{
    account_holder_name: string,
    account_number: string,
    address_line_1: string,
    address_line_2: string,
    bank_name: string,
    branch: string,
    city: string,
    country: string,
    email: string,
    gst_number: string,
    id: number,
    ifsc: string,
    image: string,
    name: string,
    number: string,
    owner_id: number,
    panNo: number,
    phone: number,
    pincode: number,
    registration_date: number,
    state: number
}

const AddInvoice = () => {
    const navigate = useNavigate();

    const [date1, setDate1] = useState<any>('2022-07-05');

    const [product, setProduct] = useState({
        item: '',
        quantity: 0,
        price: '',
        uqc: '',
    });
    const [formData, setFormData] = useState<any>({
        id: localStorage.getItem('customeridtaxrx'),
        seller_trade_name: '',
        seller_office_address: '',
        seller_shipping_address: '',
        seller_gstin: '',
        invoice_type: '',
        buyer_gstin: '',
        buyer_name: '',
        bill_to_address: '',
        ship_to_address: '',
        place_of_supply: '',
        invoice_number: '',
        invoice_date: new Date(),
        hsn_sac: '',
        products: [],
        taxable_value: 0,
        final_amount: 0,
        reverse_charge: '',
        no_of_pcs: 0,
        gst_rate: 0,
        igst: 0,
        cgst: 0,
        sgst_utgst: 0,
        supply_type: '',
        seller_phone: '',
        buyer_phone: '',
        seller_email: '',
        buyer_email: '',
    });

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

    const calculateTaxableValue = (products: any) => {
        let taxableValue = 0;
        for (let product of products) {
            let itemTotal = parseFloat(product.price) * parseFloat(product.quantity);
            taxableValue = taxableValue + itemTotal;
        }

        setFormData({ ...formData, taxable_value: taxableValue });
        return parseFloat(taxableValue.toString());
    };

    const calculateFinalAmount = (taxableValue: any) => {
        return parseFloat(taxableValue) + (formData.gst_rate / 100) * taxableValue;
    };

    const handleAddProduct = (product: any) => {
        if (product.item === '') {
            return;
        }
        let productList = formData.products;
        productList.push(product);

        setFormData({ ...formData, products: productList });
        setProduct({ item: '', quantity: 0, price: '', uqc: '' });

        let taxableValue = calculateTaxableValue(productList);

        let finalAmount = calculateFinalAmount(taxableValue);
        setFormData({ ...formData, final_amount: finalAmount });
        setFormData({ ...formData, taxable_value: taxableValue });
    };

    const handleDeleteProduct = (product: any) => {
        let productList = formData.products;
        if (productList.indexOf(product) > -1) {
            productList.splice(productList.indexOf(product), 1);
        }

        setFormData({ ...formData, products: productList });

        let taxableValue = calculateTaxableValue(productList);

        let finalAmount = calculateFinalAmount(taxableValue);
        setFormData({ ...formData, final_amount: finalAmount });
        setFormData({ ...formData, taxable_value: taxableValue });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        formData.final_amount = calculateFinalAmount(formData.taxable_value);
        try {
            const response = await axios.post(`${api}/api/invoices/addInvoice`, formData);
            console.log(response.data); // Handle response data as needed
            if (response.data.result !== 0) {
                showAlert('Inovice added');
                setFormData({
                    id: localStorage.getItem('customeridtaxrx'),
                    seller_trade_name: '',
                    seller_office_address: '',
                    seller_shipping_address: '',
                    seller_gstin: '',
                    invoice_type: '',
                    buyer_gstin: '',
                    buyer_name: '',
                    bill_to_address: '',
                    ship_to_address: '',
                    place_of_supply: '',
                    invoice_number: '',
                    invoice_date: new Date(),
                    hsn_sac: '',
                    products: [],
                    taxable_value: 0,
                    final_amount: 0,
                    reverse_charge: '',
                    no_of_pcs: 0,
                    gst_rate: 0,
                    igst: 0,
                    cgst: 0,
                    sgst_utgst: 0,
                    supply_type: '',
                    seller_phone: '',
                    buyer_phone: '',
                    seller_email: '',
                    buyer_email: '',
                });
            } else {
                showAlert('something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // const uploadCsv = async (e) => {
    //     const formData = new FormData();
    //     formData.append('csvfile', e.target.files[0]);
    //     formData.append('userid', localStorage.getItem('customeridtaxrx'));
    //     try {
    //         const response = await axios.post(`${api}/api/invoices/importinvoicefromcsv`, formData);
    //         console.log(response.data);
    //         if (response.data.success) {
    //             showAlert('All Invoices are inserted successfully');
    //             e.target.value = '';
    //         } else {
    //             showAlert(response.data.error);
    //             e.target.value = '';
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         showAlert('something went wrong');
    //         e.target.value = '';
    //     }
    // };

    const [customerQuerry, setCustomerQuerry] = useState('');
    const [customerSearchResult, setCustomerSearchResult] = useState<FuseResult<never>[]>([]);

    const options = {
        includeScore: true,
        keys: ['phone'],
    };

    const [customers, setCustomers] = useState([]);

    const fetchAllCustomers = async () => {
        try {
            const response = await axios.get(`${api}/api/customers/getallcustomers`, {
                headers: {
                    id: localStorage.getItem('customeridtaxrx'),
                },
            });

            console.log('All Customers: ', response.data);
            if (response.data.success) {
                setCustomers(response.data.results);
            } else {
                console.log(response.data.msg);
                setCustomers([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearchOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fuse = new Fuse(customers, options);
        setCustomerQuerry(e.target.value);
        const result = fuse.search(e.target.value);
        console.log('customer search result: ', result);
        setCustomerSearchResult(result);
    };

    const [selectedCustomer, setSelectedCustomer] = useState<selectedCustomerInterface | null>(null);

    const handleSelectCustomer = (customer: any) => {
        setFormData({
            ...formData,
            buyer_name: customer.name,
            buyer_email: customer.email,
            buyer_phone: customer.phone,
            buyer_gstin: customer.gst_number,
            bill_to_address: customer.address_line_1 + ', ' + customer.address_line_2 + ', ' + customer.city + ', ' + customer.state + '. PIN - ' + customer.pincode,
        });
        setSelectedCustomer(customer);
        console.log(customer);
    };

    const [items, setItems] = useState([]);

    const fetchAllItems = async () => {
        try {
            const response = await axios.get(`${api}/api/items/getallitems`, {
                headers: {
                    id: localStorage.getItem('customeridtaxrx'),
                },
            });
            console.log(response.data);
            if (response.data.success) {
                setItems(response.data.results);
            }
        } catch (error) {
            // if (error.response) {
            //     // The request was made and the server responded with a status code
            //     console.log('Server responded with status code:', error.response.status);
            //     console.log('Response data:', error.response.data);
            // } else if (error.request) {
            //     // The request was made but no response was received
            //     console.log('No response received from server:', error.request);
            // } else {
            //     // Something happened in setting up the request that triggered an error
            //     console.log('Error setting up request:', error.message);
            // }
        }
    };

    const [itemSearchResult, setItemSearchResult] = useState<FuseResult<never>[]>([]);

    const itemOptions = {
        includeScore: true,
        keys: ['name'],
    };

    const handleSearchOnchangeItem = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fuse = new Fuse(items, itemOptions);
        setProduct({ ...product, item: e.target.value });
        const result = fuse.search(e.target.value);
        console.log('item search result: ', result);
        setItemSearchResult(result);
    };

    const [selectedItem, setSelectedItem] = useState(null);

    const handleSelectItem = (item: any) => {
        setProduct({
            ...product,
            item: item.name,
            price: item.price,
            uqc: item.uqc,
            quantity: 0,
        });
        setSelectedItem(item);
    };

    useEffect(() => {
        if (!localStorage.getItem('customeridtaxrx')) {
            navigate('/login');
        }

        fetchAllCustomers();
        fetchAllItems();
    }, []);
    return (
        <div>
            <h1 className="text-4xl font-semibold">Add Invoice</h1>
            <p>Add a new invoice</p>
            <div className="add-customer-form py-4 px-2 flex justify-center items-center w-full">
                <form className="w-full flex justify-center items-center flex-col" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row justify-between items-start w-full py-4">
                        {/* {Seller Details} */}
                        <div className="flex justify-center flex-col items-start md:w-1/2 w-full">
                            <h2 className="font-semibold text-2xl">Seller Details</h2>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="seller-trade-name" className="my-2 text-gray-600">
                                    Trade Name
                                </label>
                                <input
                                    id="seller-trade-name"
                                    type="text"
                                    placeholder="Trade Name"
                                    className="form-input w-full"
                                    name="seller_trade_name"
                                    value={formData.seller_trade_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="seller-phone-num" className="my-2 text-gray-600">
                                    Seller Phone Number
                                </label>
                                <input
                                    id="seller-phone-num"
                                    type="number"
                                    placeholder="Seller Phone Number"
                                    className="form-input w-full"
                                    name="seller_phone"
                                    value={formData.seller_phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="seller-email" className="my-2 text-gray-600">
                                    Seller Email
                                </label>
                                <input
                                    id="seller-email"
                                    type="email"
                                    placeholder="Seller Email"
                                    className="form-input w-full"
                                    name="seller_email"
                                    value={formData.seller_email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="seller-office-address" className="my-2 text-gray-600">
                                    Office / Shop Address
                                </label>
                                <textarea
                                    id="seller-office-address"
                                    rows={5}
                                    placeholder="Office / Shop Address"
                                    className="form-input w-full"
                                    name="seller_office_address"
                                    value={formData.seller_office_address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="seller-shipping-address" className="my-2 text-gray-600">
                                    Shipping Address
                                </label>
                                <textarea
                                    id="seller-shipping-address"
                                    rows={5}
                                    placeholder="Shipping Address"
                                    className="form-input w-full"
                                    name="seller_shipping_address"
                                    value={formData.seller_shipping_address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="seller-gstin" className="my-2 text-gray-600">
                                    Seller's GSTIN
                                </label>
                                <input
                                    id="seller-gstin"
                                    type="text"
                                    placeholder="Seller's GSTIN"
                                    className="form-input w-full"
                                    name="seller_gstin"
                                    value={formData.seller_gstin}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* {Buyer Details} */}
                        <div className="flex justify-center flex-col items-start md:w-1/2 w-full">
                            <h2 className="font-semibold text-2xl">Buyer Details</h2>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="invoice-type" className="my-2 text-gray-600">
                                    Type of Invoice
                                </label>
                                <select id="invoice-type" className="form-select text-white-dark" name="invoice_type" value={formData.invoice_type} onChange={handleChange}>
                                    <option>Choose Type of Invoice</option>
                                    <option value="Tax Invoice">Tax Invoice</option>
                                    <option value="Proforma Invoice">Proforma Invoice</option>
                                    <option value="Commercial Invoice">Commercial Invoice</option>
                                </select>
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                {!selectedCustomer && (
                                    <>
                                        <label htmlFor="seller-phone-num" className="my-2 text-gray-600">
                                            Search Customer
                                        </label>
                                        <input
                                            id="customer_search"
                                            type="number"
                                            placeholder="Seller Phone Number"
                                            className="form-input w-full"
                                            name="product_code"
                                            value={customerQuerry}
                                            onChange={handleSearchOnchange}
                                            required
                                        />
                                    </>
                                )}
                                {selectedCustomer && (
                                    <>
                                        <p className="mt-[5px]">Selected Customer</p>
                                        <div
                                            className="flex justify-between items-center rounded-md py-[10px] px-[20px] my-[20px] w-full"
                                            style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px' }}
                                        >
                                            <div className="flex justify-start">
                                                <div className="w-fit rounded-full mr-[1rem] flex justify-center items-center">
                                                    <img className="rounded-full w-[40px] h-[40px]" src={selectedCustomer.image ? selectedCustomer.image : '/assets/images/user-profile.jpeg'} alt="" />
                                                </div>
                                                <span>
                                                    <p>{selectedCustomer.name}</p>
                                                    <p className="text-sm">{selectedCustomer.phone}</p>
                                                </span>
                                            </div>
                                            <div className="cursor-pointer scale-125">
                                                <i className="fa fa-times" aria-hidden="true" onClick={() => setSelectedCustomer(null)}></i>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {customerQuerry !== '' && !selectedCustomer && (
                                    <div className="rounded-full h-[40px] w-full">
                                        {(customerSearchResult.length === 0 || customerSearchResult[0].score > 0.2) && (
                                            <div
                                                className="flex justify-start items-center py-[10px] px-[20px] rounded-md hover:cursor-pointer hover:bg-gray-300"
                                                onClick={() => navigate('/add-customer')}
                                            >
                                                <div className="w-fit rounded-full mr-[1rem] flex justify-center items-center">
                                                    <img className="rounded-full w-[40px] h-[40px]" src="/assets/images/user-profile.jpeg" alt="" />
                                                </div>
                                                <span>
                                                    <p>Add new customer</p>
                                                </span>
                                            </div>
                                        )}
                                        {customerSearchResult.map((result) => {
                                            return (
                                                <div
                                                    className="flex justify-start items-center py-[10px] px-[20px] rounded-md hover:cursor-pointer hover:bg-gray-300"
                                                    onClick={() => handleSelectCustomer(result.item)}
                                                >
                                                    <div className="w-fit rounded-full mr-[1rem] flex justify-center items-center">
                                                        <img className="rounded-full w-[40px] h-[40px]" src={result.item.image ? result.item.image : 'assets/img/profiles/avatar-14.jpg'} alt="" />
                                                    </div>
                                                    <span>
                                                        <p>{result.item.name}</p>
                                                        <p className="text-sm">{result.item.phone}</p>
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                <br />
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <span
                                        style={{
                                            backgroundColor: '#DDDBDA',
                                            height: '2px',
                                            width: '100%',
                                            marginRight: '20px',
                                        }}
                                    ></span>
                                    <p>OR</p>
                                    <span
                                        style={{
                                            backgroundColor: '#DDDBDA',
                                            height: '2px',
                                            width: '100%',
                                            marginLeft: '20px',
                                        }}
                                    ></span>
                                </div>
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="buyer-name" className="my-2 text-gray-600">
                                    Name of Party
                                </label>
                                <input
                                    id="buyer-name"
                                    type="text"
                                    placeholder="Name of Party"
                                    className="form-input w-full"
                                    name="buyer_name"
                                    value={formData.buyer_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="buyer-number" className="my-2 text-gray-600">
                                    Buyer Number
                                </label>
                                <input
                                    id="buyer-number"
                                    type="number"
                                    placeholder="Buyer Number"
                                    className="form-input w-full"
                                    name="buyer_phone"
                                    value={formData.buyer_phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="buyer-gstin" className="my-2 text-gray-600">
                                    Buyer GSTIN
                                </label>
                                <input
                                    id="buyer-gstin"
                                    type="text"
                                    placeholder="Buyer GSTIN"
                                    className="form-input w-full"
                                    name="buyer_gstin"
                                    value={formData.buyer_gstin}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="buyer-email" className="my-2 text-gray-600">
                                    Buyer Email
                                </label>
                                <input
                                    id="buyer-email"
                                    type="email"
                                    placeholder="Buyer Email"
                                    className="form-input w-full"
                                    name="buyer_email"
                                    value={formData.buyer_email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="buyer-bill-to-address" className="my-2 text-gray-600">
                                    Bill To Address
                                </label>
                                <textarea
                                    id="buyer-bill-to-address"
                                    rows={5}
                                    placeholder="Bill To Address"
                                    className="form-input w-full"
                                    name="bill_to_address"
                                    value={formData.bill_to_address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="buyer-ship-to-address" className="my-2 text-gray-600">
                                    Ship To Address
                                </label>
                                <textarea
                                    id="buyer-ship-to-address"
                                    rows={5}
                                    placeholder="Ship To Address"
                                    className="form-input w-full"
                                    name="ship_to_address"
                                    value={formData.ship_to_address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="buyer-place-of-supply" className="my-2 text-gray-600">
                                    Place of Supply
                                </label>
                                <input
                                    id="buyer-place-of-supply"
                                    type="text"
                                    placeholder="Place of Supply"
                                    className="form-input w-full"
                                    name="place_of_supply"
                                    value={formData.place_of_supply}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex md:flex-row flex-col justify-between items-start w-full py-4">
                        {/* {Invoice Details} */}
                        <div className="flex justify-center flex-col items-start md:w-1/2 w-full">
                            <h2 className="font-semibold text-2xl">Invoice Details</h2>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="invoice-number" className="my-2 text-gray-600">
                                    Invoice Number
                                </label>
                                <input
                                    id="invoice-number"
                                    type="text"
                                    placeholder="Invoice Number"
                                    className="form-input w-full"
                                    name="invoice_number"
                                    value={formData.invoice_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="invoice-date" className="my-2 text-gray-600">
                                    Invoice Date
                                </label>
                                <Flatpickr
                                    id="invoice-date"
                                    value={formData.invoice_date}
                                    options={{ dateFormat: 'd-m-y', position: isRtl ? 'auto right' : 'auto left' }}
                                    className="form-input"
                                    onChange={(date) => setFormData({...formData, invoice_date: `${new Date(date).getFullYear()}-${String(new Date(date).getMonth() + 1).padStart(2, '0')}-${String(new Date(date).getDate()).padStart(2, '0')} ${String(new Date(date).getHours()).padStart(2, '0')}:${String(new Date(date).getMinutes()).padStart(2, '0')}:${String(new Date(date).getSeconds()).padStart(2, '0')}`})}
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="invoice-hsnsac" className="my-2 text-gray-600">
                                    HSN/SAC
                                </label>
                                <input
                                    id="invoice-hsnsac"
                                    type="text"
                                    placeholder="HSN/SAC"
                                    className="form-input w-full"
                                    name="hsn_sac"
                                    value={formData.hsn_sac}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="invoice-reverse-charge" className="my-2 text-gray-600">
                                    Reverse Charge
                                </label>
                                <select id="invoice-reverse-charge" className="form-select text-white-dark" name="reverse_charge" value={formData.reverse_charge} onChange={handleChange}>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>

                        {/* {GST Details} */}
                        <div className="flex justify-center flex-col items-start md:w-1/2 w-full">
                            <h2 className="font-semibold text-2xl">GST Details</h2>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="invoice-gst-rate" className="my-2 text-gray-600">
                                    GST Rate
                                </label>
                                <input
                                    id="invoice-gst-rate"
                                    type="number"
                                    placeholder="GST Rate"
                                    className="form-input w-full"
                                    name="gst_rate"
                                    value={formData.gst_rate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="invoice-igst" className="my-2 text-gray-600">
                                    IGST
                                </label>
                                <input
                                    id="invoice-igst"
                                    type="number"
                                    placeholder="IGST"
                                    className="form-input w-full"
                                    name="igst"
                                    value={formData.igst}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="invoice-cgst" className="my-2 text-gray-600">
                                    CGST
                                </label>
                                <input
                                    id="invoice-cgst"
                                    type="number"
                                    placeholder="CGST"
                                    className="form-input w-full"
                                    name="cgst"
                                    value={formData.cgst}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="invoice-sgst-ugst" className="my-2 text-gray-600">
                                    SGST / UTGST
                                </label>
                                <input
                                    id="invoice-sgst-ugst"
                                    type="number"
                                    placeholder="SGST / UTGST"
                                    className="form-input w-full"
                                    name="sgst_utgst" 
                                    value={formData.sgst_utgst} 
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                <label htmlFor="invoice-supply-type" className="my-2 text-gray-600">
                                    Supply Type
                                </label>
                                <select id="invoice-supply-type" className="form-select text-white-dark" name="supply_type" value={formData.supply_type} onChange={handleChange}>
                                    <option>Choose Supply Type</option>
                                    <option value="NON-GST">NON-GST</option>
                                    <option value="EXPORT">EXPORT</option>
                                    <option value="DEEMED EXPORT">DEEMED EXPORT</option>
                                    <option value="SEZ">SEZ</option>
                                    <option value="NIL RATED">NIL RATED</option>
                                    <option value="EXEMPT">EXEMPT</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between items-start w-full py-4">
                        {/* {Items} */}
                        <h2 className="font-semibold text-2xl">Items</h2>
                        <div className="table-responsive my-5 w-full">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Goods / Services</th>
                                        <th>Quantity</th>
                                        <th>UQC</th>
                                        <th>Item rate</th>
                                        <th>Item total</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.products.map((product, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>
                                                    <div className="whitespace-nowrap">{product.item}</div>
                                                </td>
                                                <td>{product.quantity}</td>
                                                <td>{product.uqc}</td>
                                                <td>₹{product.price}</td>
                                                <td>₹{(parseFloat(product.quantity) * parseFloat(product.price)).toFixed(2)}</td>
                                                <td className="text-center">
                                                    <Tippy content="Delete">
                                                        <button type="button" onClick={() => handleDeleteProduct(product)}>
                                                            <IconTrashLines className="m-auto" />
                                                        </button>
                                                    </Tippy>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="flex flex-col my-4">
                                <h3 className="text-lg font-semibold">Subtotal: {formData.taxable_value.toFixed(2)}</h3>
                                <h3 className="text-lg font-semibold">Total Amount: {calculateFinalAmount(formData.taxable_value).toFixed(2)}</h3>
                            </div>
                            <div>
                                <h5 className="text-lg">Item {formData.products.length + 1}</h5>
                                <div className="flex md:flex-row flex-col justify-between items-center w-full">
                                    <div className="flex flex-col mx-4 my-2 w-full">
                                        <label htmlFor="invoice-item-name" className="my-2 text-gray-600">
                                            Goods / Services
                                        </label>
                                        <input
                                            id="invoice-item-name"
                                            type="text"
                                            placeholder="Goods / Services"
                                            className="form-input w-full"
                                            name="product_code"
                                            value={product.item}
                                            onChange={handleSearchOnchangeItem}
                                        />
                                        <div className="rounded-md" style={{ boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px' }}>
                                            {!selectedItem &&
                                                itemSearchResult.map((result, i) => {
                                                    return (
                                                        <div className="py-[5px] px-[10px] cursor-pointer" key={i} onClick={() => handleSelectItem(result.item)}>
                                                            <p>{result.item.name}</p>
                                                            <p>{result.item.product_code}</p>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                    <div className="flex flex-col mx-4 my-2 w-full">
                                        <label htmlFor="invoice-item-quantity" className="my-2 text-gray-600">
                                            Quantity
                                        </label>
                                        <input
                                            id="invoice-item-quantity"
                                            type="number"
                                            placeholder="Quantity"
                                            className="form-input w-full"
                                            value={product.quantity}
                                            onChange={(e) =>
                                                setProduct({
                                                    ...product,
                                                    quantity: parseFloat(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col mx-4 my-2 w-full">
                                        <label htmlFor="invoice-item-uqc" className="my-2 text-gray-600">
                                            UQC (Unit Quantity Code)
                                        </label>
                                        <select
                                            className="form-select text-white-dark"
                                            value={product.uqc}
                                            onChange={(e) =>
                                                setProduct({
                                                    ...product,
                                                    uqc: e.target.value,
                                                })
                                            }
                                        >
                                            <option>Open this select menu</option>
                                            <option value="NO OF PCS">NO OF PCS</option>
                                            <option value="KG">KG</option>
                                            <option value="METER">METER</option>
                                            <option value="DOZEN">DOZEN</option>
                                            <option value="LITER">LITER</option>
                                            <option value="ETC">ETC</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col mx-4 my-2 w-full">
                                        <label htmlFor="invoice-item-uqc" className="my-2 text-gray-600">
                                            Item rate
                                        </label>
                                        <input
                                            id="invoice-item-uqc"
                                            type="number"
                                            placeholder="Item rate"
                                            className="form-input w-full"
                                            value={product.price}
                                            onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <span className="btn btn-outline-primary mt-6 mr-4 cursor-pointer" onClick={() => handleAddProduct(product)}>
                                        Add Item
                                    </span>
                                    <span
                                        className="btn btn-outline-danger mt-6 mr-4 cursor-pointer"
                                        onClick={() =>
                                            setProduct({
                                                item: '',
                                                quantity: 0,
                                                price: '',
                                                uqc: '',
                                            })
                                        }
                                    >
                                        Cancel
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary mt-6 mr-4">
                            Add Invoice
                        </button>
                        <button type="reset" className="btn btn-danger mt-6 mr-4">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddInvoice;
