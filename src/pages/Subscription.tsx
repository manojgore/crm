import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { downloadExcel } from 'react-export-table-to-excel';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import IconFile from '../components/Icon/IconFile';
import IconPrinter from '../components/Icon/IconPrinter';
import axios from 'axios';
import { api } from '../utils/apiProvider';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconTrashLines from '../components/Icon/IconTrashLines';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../components/Icon/IconX';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useSelector } from 'react-redux';
import IconEdit from '../components/Icon/IconEdit';
import { useNavigate } from 'react-router-dom';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import useDownloader from 'react-use-downloader';
import IconDownload from '../components/Icon/IconDownload';
import IconCancel from '../components/Icon/IconCancel';
import IconLogin2 from '../components/Icon/IconLogin2';
import IconChangePlan from '../components/Icon/IconChangePlan';
import IconTrash from '../components/Icon/IconTrash';

const col = ['id', 'company_name', 'company_address', 'phone_number', 'company_email', 'address_line_1', 'address_line_2', 'country', 'state', 'city', 'pincode', 'site_logo', 'favicon', 'company_icon', 'plan', 'plan_type', 'payment_gateway', 'registered_on', 'purchased_on', 'expiring_on', 'company_password', 'company_website'];

const Subscriptions = () => {
    const { download } = useDownloader();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Subscription'));
    });
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [modal2, setModal2] = useState(false);
    const [modal6, setModal6] = useState(false);
    const [modal7, setModal7] = useState(false);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState([]);
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'Id', direction: 'asc' });

    const months = new Map([
        [1, 'January'],
        [2, 'February'],
        [3, 'March'],
        [4, 'April'],
        [5, 'May'],
        [6, 'June'],
        [7, 'July'],
        [8, 'August'],
        [9, 'September'],
        [10, 'October'],
        [11, 'November'],
        [12, 'December'],
    ]);

    const days = new Map([
        ["Monthly", 30],
        ["Weekly", 7],
        ["Half Yearly", 180],
        ["Yearly", 365],
    ]);

    const [Projects, setProjects] = useState([]);

    const [planValue, setPlanValue] = useState(new Map([]));
    const [packages, setPackages] = useState([]);

    const fetchProjects = async () => {
        try {
          const response = await axios.get(`${api}/admin/getallProjects`);
    
          console.log("Projects result: ", response.data);
          if (response.data.success) {
            setProjects(response.data.results);
            setInitialRecords(response.data.results);
          }
        } catch (error) {
          console.log("failed to fetch the Projects");
          console.error(error);
        }
    };

    const fetchPackeges = async () => {
        try {
          const response = await axios.get(`${api}/admin/getallpackages`);
    
          console.log("packeges result: ", response.data);
          if (response.data.success) {
            setPackages(response.data.results);
            response.data.results.forEach((pkg) => {
              planValue.set(`${pkg.Type} ${pkg.Duration}`, pkg.Price);
            });
          }
        } catch (error) {
          console.log("failed to fetch the packages");
          console.error(error);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem('adminidtaxrx')) {
            navigate('/');
        }
        fetchProjects();
        fetchPackeges();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return Projects.filter((company: any) => {
                return (
                    company.company_name.toLowerCase().includes(search.toLowerCase()) ||
                    company.plan_type.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortStatus]);
    const header = ['id', 'company_name', 'company_address', 'phone_number', 'company_email', 'address_line_1', 'address_line_2', 'country', 'state', 'city', 'pincode', 'site_logo', 'favicon', 'company_icon', 'plan', 'plan_type', 'payment_gateway', 'registered_on', 'purchased_on', 'expiring_on', 'company_password', 'company_website'];

    const formatDate = (date: any) => {
        if (date) {
            const dt = new Date(date);
            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
            const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            return day + '/' + month + '/' + dt.getFullYear();
        }
        return '';
    };

    function handleDownloadExcel() {
        console.log('expenses: ', recordsData);
        downloadExcel({
            fileName: 'table',
            sheet: 'react-export-table-to-excel',
            tablePayload: {
                header,
                body: Projects,
            },
        });
    }

    const capitalize = (text: any) => {
        return text
            .replace('_', ' ')
            .replace('-', ' ')
            .toLowerCase()
            .split(' ')
            .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
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

    const [editCompanyData, setEditCompanyData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        website: "",
        password: "",
        confirmPassword: "",
        address: "",
        planType: "",
        plan: 0,
        purchased_on: "",
        expiring_on: "",
    });

    const handleChangeEdit = (e) => {
        if (e.target.name === "planType" && e.target.value !== "All Plans") {
          setEditCompanyData({ ...editCompanyData, plan: 1 });
        } else if (e.target.name === "planType" && e.target.value === "All Plans") {
          setEditCompanyData({ ...editCompanyData, plan: 0 });
        }
        setEditCompanyData({ ...editCompanyData, [e.target.name]: e.target.value });
    };

    const handleEditCompany = async (e, companyEmail) => {
        e.preventDefault();
        // console.log(new Date(new Date(editCompanyData.purchased_on).getTime() + days.get(formdata.plan_type.split(" ")[0]) * 24 * 60 * 60 * 1000))
        try {
          const response = await axios.put(`${api}/admin/editCompany`, {
            name: editCompanyData.name,
            email: companyEmail,
            phoneNumber: editCompanyData.phoneNumber,
            website: editCompanyData.website,
            password: editCompanyData.purchased_on,
            confirmPassword: editCompanyData.confirmPassword,
            address: editCompanyData.address,
            planType: editCompanyData.planType,
            plan: editCompanyData.planType === "" ? 0 : 1,
            purchased_on:
              editCompanyData.planType === ""
                ? null
                : editCompanyData.purchased_on === ""
                ? new Date()
                : editCompanyData.purchased_on,
            expiring_on:
              editCompanyData.planType === "" ||
              editCompanyData.planType.split(" ")[0] === "Lifetime"
                ? null
                : new Date(
                    new Date(editCompanyData.purchased_on).getTime() +
                      days.get(editCompanyData.planType.split(" ")[editCompanyData.planType.split(" ").length - 1]) *
                        24 *
                        60 *
                        60 *
                        1000
                    ),
          });
          if (response.data.success) {
            showAlert("Company Edited Successfully");
            setModal6(false);
            setModal7(false);
            fetchProjects();
          } else {
            showAlert("Company Can not be Edited");
          }
          setEditCompanyData({
            name: "",
            email: "",
            phoneNumber: "",
            website: "",
            password: "",
            confirmPassword: "",
            address: "",
            planType: "",
            plan: 0,
            purchased_on: "",
            expiring_on: "",
          });
        } catch (error) {
          console.log("failed to edit company");
          console.error(error);
        }
    };

    const [companyId, setCompanyId] = useState('');

    const handleDeleteCompany = async (e, id) => {
        e.preventDefault();
        console.log(id);
        try {
          const response = await axios.delete(`${api}/admin/deleteCompany`, {
            headers: {
              id: id,
            },
          });
          console.log("response: ", response.data);
          if (response.data.success) {
            showAlert("Company Deleted Successfully");
            fetchProjects();
          } else {
            showAlert("Company Can not be Deleted");
          }
        } catch (error) {
          console.log("failed to delete company");
          console.error(error);
        }
    };

    const cancellSubscription = async (id) => {
        console.log("id: ", id);
        try {
          const response = await axios.put(`${api}/admin/cancellsubscription`, {
            id,
          });
    
          console.log("user result: ", response.data);
          if (response.data.success) {
            fetchProjects();
            showAlert("Subscription Cancelled Successfully");
          }
        } catch (error) {
          console.log("failed to fetch the user");
          console.error(error);
        }
    };

    const [emailCannotChangeMsg, setEmailCannotChangeMsg] = useState('');

    return (
        <div>
            <h1 className='text-4xl font-semibold'>All Subscriptions</h1>
            <p>All purchased subscriptions</p>
            <div className="panel mt-6">
                <div className="flex md:expenses-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            { accessor: 'company_name', title: 'Subscriber', sortable: false },
                            { accessor: 'plan_type', title: 'Plan Type', sortable: false },
                            {
                                accessor: 'plan_type',
                                title: 'Billing Cycle',
                                render: ({ plan_type }) => <p>{plan_type ? plan_type.split(" ")[plan_type.split(" ").length - 1] : 'N/A'}</p>
                            },
                            {
                                accessor: 'plan_type',
                                title: 'Amount',
                                sortable: true,
                                render: ({ plan_type }) => <p>₹ {plan_type ? planValue.get(plan_type) : 0}</p>
                            },
                            {
                                accessor: 'purchased_on',
                                title: 'Purchased on',
                                sortable: true,
                                render: ({ purchased_on }) => <p>{`${new Date(purchased_on).getDate()} ${months.get(new Date(purchased_on).getMonth() + 1)} ${new Date(purchased_on).getFullYear()}`}</p>
                            },
                            {
                                accessor: 'expiring_on',
                                title: 'Expiring on',
                                sortable: true,
                                render: ({ expiring_on }) => <p>{expiring_on ? `${new Date(expiring_on).getDate()} ${months.get(new Date(expiring_on).getMonth() + 1)} ${new Date(expiring_on).getFullYear()}` : 'N/A'}</p>
                            },
                            {
                                accessor: 'plan',
                                title: 'Status',
                                render: ({ plan }) => (
                                    <span
                                        className={`${
                                            plan === 1 ? 'bg-green-200 text-green-500' : 'bg-red-200 text-red-500'
                                        } py-1 px-2 rounded-md`}
                                    >
                                        {plan === 1 ? 'Active' : 'Not Active'}
                                    </span>
                                ),
                            },
                            {
                                accessor: 'Subscription Action',
                                render: ({ id, company_name, company_email, phone_number, company_website, password, company_address, plan_type, plan, purchased_on, expiring_on }) => (
                                    <div className="flex w-full justify-around expenses-center">
                                        <Tippy content="Edit Subscription">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditCompanyData({
                                                        name: company_name,
                                                        email: company_email,
                                                        phoneNumber: phone_number,
                                                        website: company_website,
                                                        password: password,
                                                        confirmPassword: password,
                                                        address: company_address,
                                                        planType: plan_type,
                                                        plan: plan,
                                                        purchased_on: purchased_on,
                                                        expiring_on: expiring_on
                                                    });
                                                    setModal7(true);
                                                }}
                                            >
                                                <IconEdit className="m-auto" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Cancel Subscription">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    cancellSubscription(id)
                                                }
                                            >
                                                <IconTrash className="m-auto" />
                                            </button>
                                        </Tippy>
                                    </div>
                                ),
                            },
                        ]}
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>

            {/* {Delete Item Modal} */}
            <Transition appear show={modal2} as={Fragment}>
                <Dialog as="div" open={modal2} onClose={() => setModal2(false)}>
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
                                <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark h-[25svh]">
                                    <div className="flex expenses-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Delete Company</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal2(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <p className="text-gray-500 text-sm px-5 py-1">Are you sure want to delete?</p>
                                    <div className="p-5">
                                        <form onSubmit={(e) => handleDeleteCompany(e, companyId)}>
                                            <div className="flex expenses-center justify-center">
                                                <button type="submit" className="btn btn-outline-danger w-full">
                                                    Delete
                                                </button>
                                                <button type="reset" className="btn btn-primary ltr:ml-4 rtl:mr-4 w-full" onClick={() => setModal2(false)}>
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

            {/* {Edit Expenses Modal} */}
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
                                <Dialog.Panel className="panel my-8 w-full max-w-xl overflow-hidden  rounded-lg border-0 p-0 text-black dark:text-white-dark h-[75svh]">
                                    <div className="flex expenses-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Edit Company</h5>
                                        <button onClick={() => setModal6(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-2">
                                        <form onSubmit={(e) => handleEditCompany(e, editCompanyData.email)}>
                                            <div className="flex flex-col p-2 w-full">
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="company_name" className="my-2 text-gray-600">
                                                            Name
                                                        </label>
                                                        <input
                                                            id="company_name"
                                                            type="text"
                                                            placeholder="Project Name"
                                                            className="form-input w-full"
                                                            name="name"
                                                            value={editCompanyData.name}
                                                            onChange={handleChangeEdit}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="company_email" className="my-2 text-gray-600">
                                                            Email
                                                        </label>
                                                        <input
                                                            id="company_email"
                                                            type="email"
                                                            placeholder="Company Email"
                                                            className="form-input w-full"
                                                            name="email"
                                                            value={editCompanyData.email}
                                                            onChange={() => {
                                                                setEmailCannotChangeMsg('can not edit email');
                                                            }}
                                                            required
                                                        />
                                                        <p className='text-red-500 text-sm my-1'>{emailCannotChangeMsg}</p>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="company_phone_number" className="my-2 text-gray-600">
                                                            Phone Number
                                                        </label>
                                                        <input
                                                            id="company_phone_number"
                                                            type="number"
                                                            placeholder="Company Phone Number"
                                                            className="form-input w-full"
                                                            name="phoneNumber"
                                                            value={editCompanyData.phoneNumber}
                                                            onChange={handleChangeEdit}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-full">
                                                        <label htmlFor="company_address" className="my-2 text-gray-600">
                                                            Company Address
                                                        </label>
                                                        <textarea
                                                            id="company_address"
                                                            rows={5}
                                                            placeholder="Company Confirm Password"
                                                            className="form-input w-full"
                                                            name="address"
                                                            value={editCompanyData.address}
                                                            onChange={handleChangeEdit}
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

            {/* { Change Plan Modal } */}
            <Transition appear show={modal7} as={Fragment}>
                <Dialog as="div" open={modal7} onClose={() => setModal7(false)}>
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
                                <Dialog.Panel className="panel my-8 w-full max-w-xl overflow-hidden  rounded-lg border-0 p-0 text-black dark:text-white-dark h-[80svh]">
                                    <div className="flex expenses-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Edit Company</h5>
                                        <button onClick={() => setModal7(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-2">
                                        <div className='flex flex-col p-4 w-full'>
                                            <h2 className='font-semibold text-lg'>Current Plan Details</h2>
                                            <div className='flex justify-between w-full'>
                                                <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                    <p className="my-2 text-gray-600 font-semibold">
                                                        Name
                                                    </p>
                                                    <p className="w-full">{editCompanyData.name}</p>
                                                </div>
                                                <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                    <p className="my-2 text-gray-600 font-semibold">
                                                        Email
                                                    </p>
                                                    <p className="w-full">{editCompanyData.email}</p>
                                                </div>
                                            </div>
                                            <div className='flex justify-between w-full'>
                                                <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                    <p className="my-2 text-gray-600 font-semibold">
                                                        Plan Type
                                                    </p>
                                                    <p className="w-full">{editCompanyData.planType ? editCompanyData.planType : 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className='flex justify-between w-full'>
                                                <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                    <p className="my-2 text-gray-600 font-semibold">
                                                        Purchased On
                                                    </p>
                                                    <p className="w-full">{editCompanyData.purchased_on ? `${new Date(editCompanyData.purchased_on).getDate()}-${months.get(new Date(editCompanyData.purchased_on).getMonth() + 1)}-${new Date(editCompanyData.purchased_on).getFullYear()}` : 'N/A'}</p>
                                                </div>
                                                <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                    <p className="my-2 text-gray-600 font-semibold">
                                                        Expiring On
                                                    </p>
                                                    <p className="w-full">{editCompanyData.expiring_on ? `${new Date(editCompanyData.expiring_on).getDate()}-${months.get(new Date(editCompanyData.expiring_on).getMonth() + 1)}-${new Date(editCompanyData.expiring_on).getFullYear()}` : 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <form onSubmit={(e)=>handleEditCompany(e, editCompanyData.email)}>
                                            <div className="flex flex-col p-2 w-full">
                                                <h2 className='font-semibold text-lg'>Change Plan Details</h2>
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="company_choose_plan" className="my-2 text-gray-600">
                                                            Choose Plan
                                                        </label>
                                                        <select
                                                            id="company_choose_plan"
                                                            className="form-select text-white-dark"
                                                            name="planType"
                                                            value={editCompanyData.planType}
                                                            onChange={handleChangeEdit}
                                                        >
                                                            <option>Select Plan</option>
                                                            {packages.map((pkg, i) => {
                                                                return (
                                                                <option key={i} value={`${pkg.Type} ${pkg.Duration}`}>
                                                                    {pkg.Type} {pkg.Duration}
                                                                </option>
                                                                );
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="company_email" className="my-2 text-gray-600">
                                                            Purchasing Date
                                                        </label>
                                                        <Flatpickr
                                                            id="expense-date"
                                                            value={editCompanyData.purchased_on}
                                                            options={{ dateFormat: 'y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                                            className="form-input"
                                                            onChange={(date) =>
                                                                setEditCompanyData({
                                                                    ...editCompanyData,
                                                                    purchased_on: `${new Date(date).getFullYear()}-${String(new Date(date).getMonth() + 1).padStart(2, '0')}-${String(
                                                                        new Date(date).getDate()
                                                                    ).padStart(2, '0')} ${String(new Date(date).getHours()).padStart(2, '0')}:${String(new Date(date).getMinutes()).padStart(
                                                                        2,
                                                                        '0'
                                                                    )}:${String(new Date(date).getSeconds()).padStart(2, '0')}`,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="m-4 flex expenses-center justify-end">
                                                <button onClick={() => setModal7(false)} type="reset" className="btn btn-outline-danger">
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
        </div>
    );
};

export default Subscriptions;
