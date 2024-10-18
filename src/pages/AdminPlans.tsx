import { useEffect, useState, Fragment } from 'react';
import IconArrowLeft from '../components/Icon/IconArrowLeft';
import axios from 'axios';
import { api } from '../utils/apiProvider';
import { useNavigate } from 'react-router-dom';
import IconEdit from '../components/Icon/IconEdit';
import IconTrashLines from '../components/Icon/IconTrashLines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../components/Icon/IconX';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useSelector } from 'react-redux';
import IconPlus from '../components/Icon/IconPlus';
import IconPlusCircle from '../components/Icon/IconPlusCircle';


interface packageInterface {
    Type: string,
    Description: string,
    Number_of_invoices: string,
    Number_of_products: string,
    Number_of_suppliers: string,
    Number_of_users: string,
    Price: string,
    Duration: string   
}


const AdminPlans = () => {
    const days = new Map([
        ["Monthly", 30],
        ["Weekly", 7],
        ["6 Months", 180],
        ["Yearly", 365],
    ]);
    
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
    

    const [packages, setPackages] = useState<packageInterface[]>([]);
    const fetchPackages = async () => {
        try {
            const response = await axios.get(`${api}/admin/getallpackages`);

            console.log('Packages result: ', response.data);
            if (response.data.success) {
                setPackages(response.data.results);
            }
        } catch (error) {
            console.log('failed to fetch the packages');
            console.error(error);
        }
    };

    const [modal6, setModal6] = useState(false);
    const [modal17, setModal17] = useState(false);
    const [modal18, setModal18] = useState(false);


    const [editPackageDetails, setEditPackageDetails] = useState({
        type: "",
        duration: "",
        price: "",
        discount: 0,
        numberOfUsers: "", 
        numberOfSuppliers: "", 
        numberOfProducts: "", 
        numberOfInvoices: "", 
        description: "",
        status: true,
        id:null
    });

    const editChange = (e) => {
        setEditPackageDetails({...editPackageDetails, [e.target.name]: e.target.value})
    }

    const handleEditPackage = async(e) => {
        e.preventDefault();
    
        console.log("edit pkg: ", editPackageDetails);
        try {
          const response = await axios.put(
            `${api}/admin/editpackage`,
            editPackageDetails
          );
    
          console.log("packege edit result: ", response.data);
          if (response.data.success) {
            fetchPackages();
            showAlert("package edited succesfully");
            setModal6(false);
          }else{
            showAlert(response.data.msg);
          }
        } catch (error) {
          console.log("failed to edit the packages");
          console.error(error);
        }
    }

    const [packageDeleteDetails, setPackageDeleteDetails] = useState({
        type: "",
        duration: ""
    });

    const handleDeletePackage = async(e) => {
        e.preventDefault();
        try {
          const response = await axios.delete(
            `${api}/admin/deletepackage`,
            {
              headers: packageDeleteDetails
            }
          );
    
          console.log("packege add result: ", response.data);
          if (response.data.success) {
            fetchPackages();
            showAlert("package deleted succesfully");
            setModal17(false);
          }else{
            showAlert(response.data.msg);
          }
        } catch (error) {
          console.log("failed to delete the packages");
          console.error(error);
        }
    }


    const [addPackageDetails, setAddPackageDetails] = useState({
        type: "", 
        duration: "", 
        price: "", 
        discount: 0,
        numberOfUsers: "", 
        numberOfSuppliers: "", 
        numberOfProducts: "", 
        numberOfInvoices: "", 
        description: "",
        status: true,
    });
      const addPlanOnchange = (e) => {
        setAddPackageDetails({...addPackageDetails, [e.target.name]: e.target.value})
    }
    const handleAddPlan = async(e) => {
        e.preventDefault();
        console.log('pkg details: ', addPackageDetails);
        try {
          const response = await axios.post(
            `${api}/admin/addpackage`,
            addPackageDetails
          );
    
          console.log("packege add result: ", response.data);
          if (response.data.success) {
            fetchPackages();
            showAlert("package added succesfully");
            setModal18(false);
          }else{
            showAlert(response.data.msg)
          }
        } catch (error) {
          console.log("failed to add the packages");
          console.error(error);
        }
    }

    useEffect(() => {
        fetchPackages();
    }, []);
    return (
        <div>
            <h1 className='text-4xl font-semibold'>All Services</h1>
            <p>All existing Services</p>
            <div className='flex items-center justify-end'>
                <button className='btn btn-primary' onClick={() => setModal18(true)}><IconPlusCircle className='mx-2'/> Add Service</button>
            </div>
            <div className="flex justify-center flex-wrap py-8">
                {packages.map((pkg, i) => {
                    return (
                        <div key={i} className={`p-3 lg:p-5 border border-black dark:border-[#1b2e4b] text-center rounded group hover:border-primary w-[25%] my-2 mx-4`}>
                            <h3 className="text-xl lg:text-2xl">{pkg.Type}</h3>
                            <div className="border-t border-black dark:border-white-dark w-1/5 mx-auto my-6 group-hover:border-primary"></div>
                            <p className="text-[15px]">{pkg.Description}</p>
                            <div className={`my-7 p-2.5 text-center text-lg group-hover:text-primary`}>
                                <strong className={`text-[#3b3f5c] dark:text-white-dark text-3xl lg:text-5xl group-hover:text-primary`}>₹{pkg.Price}</strong> / {pkg.Duration}
                            </div>
                            <ul className={`space-y-2.5 mb-5 font-semibold group-hover:text-primary`}>
                                <li className="flex justify-center items-center">
                                    <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                                    {pkg.Number_of_invoices} Invoices
                                </li>
                                <li className="flex justify-center items-center">
                                    <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                                    {pkg.Number_of_products} Products
                                </li>
                                <li className="flex justify-center items-center">
                                    <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                                    {pkg.Number_of_suppliers} Suppliers
                                </li>
                                <li className="flex justify-center items-center">
                                    <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                                    {pkg.Number_of_users} Users
                                </li>
                            </ul>
                            {/* To Place all actions */}
                            <div className='flex w-full items-center justify-center'>
                                <Tippy content="Delete">
                                    <button
                                        type="button"
                                        className='mx-2'
                                        onClick={() => {
                                            setPackageDeleteDetails({
                                                type: pkg.Type,
                                                duration: pkg.Duration
                                            });
                                            setModal17(true);
                                        }}
                                    >
                                        <IconTrashLines className="m-auto" />
                                    </button>
                                </Tippy>
                                <Tippy content="Edit">
                                    <button
                                        type="button"
                                        className='mx-2'
                                        onClick={() => {
                                            setEditPackageDetails({
                                                type: pkg.Type,
                                                duration: pkg.Duration,
                                                price: pkg.Price, 
                                                discount: pkg.Discount,
                                                numberOfUsers: pkg.Number_of_users, 
                                                numberOfSuppliers: pkg.Number_of_suppliers, 
                                                numberOfProducts: pkg.Number_of_products, 
                                                numberOfInvoices: pkg.Number_of_invoices, 
                                                description: pkg.Description,
                                                status: pkg.Status === 1 ? true : false,
                                                id:pkg.id
                                            });
                                            setModal6(true);
                                        }}
                                    >
                                        <IconEdit className="m-auto" />
                                    </button>
                                </Tippy>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* {Add Package Modal} */}
            <Transition appear show={modal18} as={Fragment}>
                <Dialog as="div" open={modal18} onClose={() => setModal18(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] bg-[black]/60">
                        <div className="flex min-h-screen expenses-start justify-center px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel my-8 w-full max-w-xl overflow-hidden  rounded-lg border-0 p-0 text-black dark:text-white-dark h-[93svh] overflow-y-scroll overflow-x-hidden">
                                    <div className="flex expenses-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Add Service</h5>
                                        <button onClick={() => setModal18(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-2">
                                        <form onSubmit={handleAddPlan}>
                                            <div className="flex flex-col p-2 w-full">
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="plan_name" className="my-2 text-gray-600">
                                                            Name
                                                        </label>
                                                        <input
                                                            id="plan_name"
                                                            type="text"
                                                            placeholder="Service Name"
                                                            className="form-input w-full"
                                                            name="type"
                                                            value={addPackageDetails.type}
                                                            onChange={addPlanOnchange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="plan_duration" className="my-2 text-gray-600">
                                                            Service Duration
                                                        </label>
                                                        <select name="duration" className="form-select text-white-dark" id="plan_duration" value={addPackageDetails.duration} onChange={addPlanOnchange} >
                                                            <option>Choose Duration</option>
                                                            <option value="Monthly">Monthly</option>
                                                            <option value="Half Yearly">Half Yearly</option>
                                                            <option value="Yearly">Yearly</option>
                                                            <option value="Lifetime">Lifetime</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[100%]">
                                                        <label htmlFor="plan_price" className="my-2 text-gray-600">
                                                            Price
                                                        </label>
                                                        <input
                                                            id="plan_price"
                                                            type="number"
                                                            placeholder="Service Price"
                                                            className="form-input w-full"
                                                            name="price"
                                                            value={addPackageDetails.price}
                                                            onChange={addPlanOnchange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-between expenses-center w-full px-4 mt-2">
                                                    <p className="my-2 text-gray-600">Status</p>
                                                    <label className="w-12 h-6 relative">
                                                        <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" checked={addPackageDetails.status} onChange={(e)=>setAddPackageDetails({...addPackageDetails, status: e.target.checked})} />
                                                        <span className="outline_checkbox bg-icon border-2 border-[#b8b8b8] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#b8b8b8] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
                                                    </label>
                                                </div>
                                                </div>
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[100%]">
                                                        <label htmlFor="plan_max_users" className="my-2 text-gray-600">
                                                            Feature 1
                                                        </label>
                                                        <input
                                                            id="plan_max_users"
                                                            type="text"
                                                            placeholder="Add Feature"
                                                            className="form-input w-full"
                                                            name="numberOfUsers"
                                                            value={addPackageDetails.numberOfUsers}
                                                            onChange={addPlanOnchange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[100%]">
                                                        <label htmlFor="plan_max_suppliers" className="my-2 text-gray-600">
                                                        Feature 2
                                                        </label>
                                                        <input
                                                            id="plan_max_suppliers"
                                                            type="text"
                                                            placeholder="Add Feature"
                                                            className="form-input w-full"
                                                            name="numberOfSuppliers"
                                                            value={addPackageDetails.numberOfSuppliers}
                                                            onChange={addPlanOnchange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[100%]">
                                                        <label htmlFor="plan_max_products" className="my-2 text-gray-600">
                                                        Feature 3
                                                        </label>
                                                        <input
                                                            id="plan_max_products"
                                                            type="text"
                                                            placeholder="Add Feature"
                                                            className="form-input w-full"
                                                            name="numberOfProducts"
                                                            value={addPackageDetails.numberOfProducts}
                                                            onChange={addPlanOnchange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[100%]">
                                                        <label htmlFor="plan_max_invoices" className="my-2 text-gray-600">
                                                        Feature 4
                                                        </label>
                                                        <input
                                                            id="plan_max_invoices"
                                                            type="text"
                                                            placeholder="Add Feature"
                                                            className="form-input w-full"
                                                            name="numberOfInvoices"
                                                            value={addPackageDetails.numberOfInvoices}
                                                            onChange={addPlanOnchange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-full">
                                                        <label htmlFor="plan_description" className="my-2 text-gray-600">
                                                            Description
                                                        </label>
                                                        <textarea
                                                            id="plan_description"
                                                            rows={5}
                                                            placeholder="Service Description"
                                                            className="form-input w-full"
                                                            name="description"
                                                            value={addPackageDetails.description}
                                                            onChange={addPlanOnchange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="m-4 flex expenses-center justify-end">
                                                <button onClick={() => setModal18(false)} type="reset" className="btn btn-outline-danger">
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* {Edit Package Modal} */}
            <Transition appear show={modal6} as={Fragment}>
                <Dialog as="div" open={modal6} onClose={() => setModal6(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] bg-[black]/60">
                        <div className="flex min-h-screen expenses-start justify-center px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel my-8 w-full max-w-xl overflow-hidden  rounded-lg border-0 p-0 text-black dark:text-white-dark h-[85svh]">
                                    <div className="flex expenses-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Edit Package</h5>
                                        <button onClick={() => setModal6(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-2">
                                        <form onSubmit={handleEditPackage}>
                                            <div className="flex flex-col p-2 w-full">
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="plan_name" className="my-2 text-gray-600">
                                                            Plan Name
                                                        </label>
                                                        <input
                                                            id="plan_name"
                                                            type="text"
                                                            placeholder="Plan Name"
                                                            className="form-input w-full"
                                                            name="type"
                                                            value={editPackageDetails.type}
                                                            onChange={editChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="plan_duration" className="my-2 text-gray-600">
                                                            Plan Duration
                                                        </label>
                                                        <select name="duration" className="form-select text-white-dark" id="plan_duration" value={editPackageDetails.duration} onChange={editChange} >
                                                            <option>Choose Duration</option>
                                                            <option value="Monthly">Monthly</option>
                                                            <option value="Half Yearly">Half Yearly</option>
                                                            <option value="Yearly">Yearly</option>
                                                            <option value="Lifetime">Lifetime</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="plan_price" className="my-2 text-gray-600">
                                                            Price
                                                        </label>
                                                        <input
                                                            id="plan_price"
                                                            type="number"
                                                            placeholder="Plan Price"
                                                            className="form-input w-full"
                                                            name="price"
                                                            value={editPackageDetails.price}
                                                            onChange={editChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="plan_max_users" className="my-2 text-gray-600">
                                                            Max Users
                                                        </label>
                                                        <input
                                                            id="plan_max_users"
                                                            type="text"
                                                            placeholder="Max Users"
                                                            className="form-input w-full"
                                                            name="numberOfUsers"
                                                            value={editPackageDetails.numberOfUsers}
                                                            onChange={editChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="plan_max_suppliers" className="my-2 text-gray-600">
                                                            Max Suppliers
                                                        </label>
                                                        <input
                                                            id="plan_max_suppliers"
                                                            type="text"
                                                            placeholder="Max Suppliers"
                                                            className="form-input w-full"
                                                            name="numberOfSuppliers"
                                                            value={editPackageDetails.numberOfSuppliers}
                                                            onChange={editChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="plan_max_products" className="my-2 text-gray-600">
                                                            Max Products
                                                        </label>
                                                        <input
                                                            id="plan_max_products"
                                                            type="text"
                                                            placeholder="Max Products"
                                                            className="form-input w-full"
                                                            name="numberOfProducts"
                                                            value={editPackageDetails.numberOfProducts}
                                                            onChange={editChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="plan_max_invoices" className="my-2 text-gray-600">
                                                            Max Invoices
                                                        </label>
                                                        <input
                                                            id="plan_max_invoices"
                                                            type="text"
                                                            placeholder="Max Invoices"
                                                            className="form-input w-full"
                                                            name="numberOfInvoices"
                                                            value={editPackageDetails.numberOfInvoices}
                                                            onChange={editChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-full">
                                                        <label htmlFor="plan_description" className="my-2 text-gray-600">
                                                            Description
                                                        </label>
                                                        <textarea
                                                            id="plan_description"
                                                            rows={5}
                                                            placeholder="Company Confirm Password"
                                                            className="form-input w-full"
                                                            name="description"
                                                            value={editPackageDetails.description}
                                                            onChange={editChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="m-4 flex expenses-center justify-end">
                                                <button onClick={() => setModal6(false)} type="reset" className="btn btn-outline-danger">
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                    Update
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* {Delete Package Modal} */}
            <Transition appear show={modal17} as={Fragment}>
                <Dialog as="div" open={modal17} onClose={() => setModal17(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen expenses-center justify-center px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark h-[22svh]">
                                    <div className="flex expenses-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Delete Package</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal17(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <p className="text-gray-500 text-sm px-5 py-1">Are you sure want to delete?</p>
                                    <div className="p-5">
                                        <form onSubmit={handleDeletePackage}>
                                            <div className="flex expenses-center justify-center">
                                                <button type="submit" className="btn btn-outline-danger w-full">
                                                    Delete
                                                </button>
                                                <button type="reset" className="btn btn-primary ltr:ml-4 rtl:mr-4 w-full" onClick={() => setModal17(false)}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default AdminPlans;
