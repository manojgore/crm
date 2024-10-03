import { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../utils/apiProvider';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useSelector } from 'react-redux';
import { IRootState } from '../store';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';

const AddExpenses = () => {
    const navigate = useNavigate();

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

    const [formData, setFormData] = useState({
        Owner_Id: localStorage.getItem('customeridtaxrx'),
        Expense_ID: '',
        Reference: '',
        Amount: '',
        Payment_Mode: '',
        Expense_Date: '',
        Payment_Status: '',
        Description: '',
        Attachment: '',
    });

    const handleCancelForm = () => {
        setFormData({
            Owner_Id: localStorage.getItem('customeridtaxrx'),
            Expense_ID: '',
            Reference: '',
            Amount: '',
            Payment_Mode: '',
            Expense_Date: '',
            Payment_Status: '',
            Description: '',
            Attachment: '',
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target;
        if (name === 'Attachment') {
            var reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = () => {
                if(typeof reader.result === 'string'){
                    setFormData({ ...formData, Attachment: reader.result });
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
            const response = await axios.post(`${api}/api/expenses/addExpenses`, formData);
            console.log(response.data); // Handle response data as needed
            if (response.data.result !== 0) {
                showAlert('expenses added');
                setFormData({
                    Owner_Id: localStorage.getItem('customeridtaxrx'),
                    Expense_ID: '',
                    Reference: '',
                    Amount: '',
                    Payment_Mode: '',
                    Expense_Date: '',
                    Payment_Status: '',
                    Description: '',
                    Attachment: '',
                });
            } else {
                showAlert('something went wrong');
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
            <h1 className="text-4xl font-semibold">Add Expense</h1>
            <p>Add a new expense</p>
            <div className="add-customer-form py-4 px-2 flex justify-center items-center w-full">
                <form className="w-full flex justify-center items-center flex-col" onSubmit={handleSubmit}>
                    <div className="flex md:flex-row flex-col justify-between items-center w-full">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col w-[90%] mx-4 my-2">
                                <label htmlFor="item-code" className="my-2 text-gray-600">
                                    Expense ID
                                </label>
                                <input
                                    id="item-code"
                                    type="text"
                                    placeholder="Expense ID"
                                    className="form-input w-full"
                                    name="Expense_ID"
                                    value={formData.Expense_ID}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-[90%] mx-4 my-2">
                                <label htmlFor="item-code" className="my-2 text-gray-600">
                                    Amount
                                </label>
                                <input
                                    id="item-code"
                                    type="number"
                                    placeholder="Amount"
                                    className="form-input w-full"
                                    name="Amount"
                                    value={formData.Amount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-[90%] mx-4 my-2">
                                <label htmlFor="expense-date" className="my-2 text-gray-600">
                                    Expense Date
                                </label>
                                <Flatpickr
                                    id="expense-date"
                                    value={formData.Expense_Date}
                                    options={{ dateFormat: 'y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                    className="form-input"
                                    onChange={(date: any) =>
                                        setFormData({
                                            ...formData,
                                            Expense_Date: `${new Date(date).getFullYear()}-${String(new Date(date).getMonth() + 1).padStart(2, '0')}-${String(new Date(date).getDate()).padStart(
                                                2,
                                                '0'
                                            )} ${String(new Date(date).getHours()).padStart(2, '0')}:${String(new Date(date).getMinutes()).padStart(2, '0')}:${String(
                                                new Date(date).getSeconds()
                                            ).padStart(2, '0')}`,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <div className="flex flex-col w-[90%] mx-4 my-2">
                                <label htmlFor="item-code" className="my-2 text-gray-600">
                                    Reference
                                </label>
                                <input
                                    id="item-code"
                                    type="text"
                                    placeholder="Reference"
                                    className="form-input w-full"
                                    name="Reference"
                                    value={formData.Reference}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-[90%] mx-4 my-2">
                                <label htmlFor="item-code" className="my-2 text-gray-600">
                                    Payment Mode
                                </label>
                                <select className="form-select text-white-dark" name="Payment_Mode" value={formData.Payment_Mode} onChange={handleChange}>
                                    <option>Select Payment Mode</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>
                            <div className="flex flex-col w-[90%] mx-4 my-2">
                                <label htmlFor="payment-spay" className="my-2 text-gray-600">
                                    Payment Status
                                </label>
                                <select className="form-select text-white-dark" name="Payment_Status" value={formData.Payment_Status} onChange={handleChange}>
                                    <option>Select Payment Status</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="flex flex-col mx-4 my-2">
                            <label htmlFor="item-code" className="my-2 text-gray-600">
                                Description
                            </label>
                            <textarea
                                id="item-code"
                                rows={5}
                                placeholder="Type your description"
                                className="form-input w-full"
                                name="Description"
                                value={formData.Description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="w-full my-2 ml-3">
                        <label htmlFor="attachment">Attachment</label>
                        <div className="custom-file flex">
                            <input type="file" accept="image/png, image/jpg, image/jpeg" className="custom-file-input" id="attachment" name="Attachment" onChange={handleChange} hidden />
                            <label className="custom-file-label btn btn-outline-dark cursor-pointer mt-6 w-fit" htmlFor="attachment">
                                Choose file
                            </label>
                        </div>
                        <small className="form-text text-muted">Maximum size: 50MB</small>
                        <img className="w-[20%] my-4" src={formData.Attachment} alt="" />
                    </div>

                    <div className="flex w-full justify-center items-center">
                        <button type="submit" className="btn btn-primary mt-6 mr-4">
                            Add Expense
                        </button>
                        <button
                            type="reset"
                            className="btn btn-danger mt-6 ml-4"
                            onClick={() =>
                                setFormData({
                                    Owner_Id: localStorage.getItem('customeridtaxrx'),
                                    Expense_ID: '',
                                    Reference: '',
                                    Amount: '',
                                    Payment_Mode: '',
                                    Expense_Date: '',
                                    Payment_Status: '',
                                    Description: '',
                                    Attachment: '',
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

export default AddExpenses;
