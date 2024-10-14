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

const col = ['account_holder_name', 'account_number', 'company_address' , 'bank_name', 'branch', 'city', 'country', 'email', 'gst_number', 'ifsc', 'name', 'number', 'panNo', 'phone', 'pincode', 'registration_date', 'state'];

const Customers = () => {
    const { download } = useDownloader();
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
    useEffect(() => {
        dispatch(setPageTitle('Customers'));
    });
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [modal2, setModal2] = useState(false);
    const [modal6, setModal6] = useState(false);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState([]);
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'Id', direction: 'asc' });

    const [customers, setCustomers] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${api}/api/customers/getallcustomers`, {
                headers: {
                    id: localStorage.getItem('customeridtaxrx'),
                },
            });
            console.log('customers data: ', response.data);
            if (response.data.success) {
                setCustomers(response.data.results);
                setInitialRecords(response.data.results);
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                console.log('Server responded with status code:', error.response.status);
                console.log('Response data:', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.log('No response received from server:', error.request);
            } else {
                // Something happened in setting up the request that triggered an error
                console.log('Error setting up request:', error.message);
            }
        }
    };

    useEffect(() => {
        if (!localStorage.getItem('customeridtaxrx')) {
            navigate('/');
        }
        fetchData();
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
            return customers.filter((customer: any) => {
                return (
                    customer.name.toLowerCase().includes(search.toLowerCase()) ||
                    customer.number.toLowerCase().includes(search.toLowerCase()) ||
                    customer.email.toLowerCase().includes(search.toLowerCase()) ||
                    customer.name.toLowerCase().includes(search.toLowerCase()) ||
                    customer.phone.toLowerCase().includes(search.toLowerCase()) ||
                    customer.email.toLowerCase().includes(search.toLowerCase()) ||
                    customer.gst_number.toLowerCase().includes(search.toLowerCase()) ||
                    customer.company_address.toLowerCase().includes(search.toLowerCase()) || 
                    customer.city.toLowerCase().includes(search.toLowerCase()) ||
                    customer.state.toLowerCase().includes(search.toLowerCase()) ||
                    customer.panNo.toLowerCase().includes(search.toLowerCase())
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
    const header = ['account_holder_name', 'account_number', 'company_address', 'bank_name', 'branch', 'city', 'country', 'email', 'gst_number', 'ifsc', 'name', 'number', 'panNo', 'phone', 'pincode', 'registration_date', 'state'];

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
        console.log('customers: ', recordsData);
        const payloadBody = [];
        for(let customer of recordsData){
            const tempRow = {};
            tempRow.account_holder_name = customer.account_holder_name;
            tempRow.account_number = customer.account_number;
            tempRow.company_address = customer.company_address;
            tempRow.bank_name = customer.bank_name;
            tempRow.branch = customer.branch;
            tempRow.city = customer.city;
            tempRow.country = customer.country;
            tempRow.email = customer.email;
            tempRow.gst_number = customer.gst_number;
            tempRow.ifsc = customer.ifsc;
            tempRow.name = customer.name;
            tempRow.number = customer.number;
            tempRow.panNo = customer.panNo;
            tempRow.phone = customer.phone;
            tempRow.pincode = customer.pincode;
            tempRow.registration_date = customer.registration_date;
            tempRow.state = customer.state;
            payloadBody.push(tempRow);
        }
        downloadExcel({
            fileName: 'table',
            sheet: 'react-export-table-to-excel',
            tablePayload: {
                header,
                body: payloadBody,
            },
        });
    }

    const exportTable = (type: any) => {
        let columns: any = col;
        let records = customers;
        let filename = 'table';

        let newVariable: any;
        newVariable = window.navigator;

        if (type === 'csv') {
            let coldelimiter = ';';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    if(d === 'image') return;
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                // eslint-disable-next-line array-callback-return
                columns.map((d: any, index: any) => {
                    if(d === 'image') return;
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/csv/i) && !newVariable.msSaveOrOpenBlob) {
                var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(result);
                var link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename + '.csv');
                link.click();
            } else {
                var blob = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob, filename + '.csv');
                }
            }
        } else if (type === 'print') {
            var rowhtml = '<p>' + filename + '</p>';
            rowhtml +=
                '<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> ';
            // eslint-disable-next-line array-callback-return
            columns.map((d: any) => {
                if(d === 'image') return;
                rowhtml += '<th>' + capitalize(d) + '</th>';
            });
            rowhtml += '</tr></thead>';
            rowhtml += '<tbody>';

            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                rowhtml += '<tr>';
                // eslint-disable-next-line array-callback-return
                columns.map((d: any) => {
                    if(d === 'image') return;
                    let val = item[d] ? item[d] : '';
                    rowhtml += '<td>' + val + '</td>';
                });
                rowhtml += '</tr>';
            });
            rowhtml +=
                '<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>';
            rowhtml += '</tbody></table>';
            var winPrint: any = window.open('', '', 'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0');
            winPrint.document.write('<title>Print</title>' + rowhtml);
            winPrint.document.close();
            winPrint.focus();
            winPrint.print();
        } else if (type === 'txt') {
            let coldelimiter = ',';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    if(d === 'image') return;
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                // eslint-disable-next-line array-callback-return
                columns.map((d: any, index: any) => {
                    if(d === 'image') return;
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/txt/i) && !newVariable.msSaveOrOpenBlob) {
                var data1 = 'data:application/txt;charset=utf-8,' + encodeURIComponent(result);
                var link1 = document.createElement('a');
                link1.setAttribute('href', data1);
                link1.setAttribute('download', filename + '.txt');
                link1.click();
            } else {
                var blob1 = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob1, filename + '.txt');
                }
            }
        }
    };

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

    const [editCustomerData, setEditCustomerData] = useState({
        owner_id: localStorage.getItem('customeridtaxrx'),
        id: '',
        name: '',
        phone: '',
        email: '',
        panNo: '',
        gst_number: '',
        company_address:'',
        city: '',
        state: '',
        pincode: '',
        country: '',
        account_holder_name: '',
        account_number: '',
        bank_name: '',
        ifsc: '',
        branch: '',
        image: ''
    });

    const handleEditOnchange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            var reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = () => {
                setEditCustomerData({ ...editCustomerData, image: reader.result });
            };
        }
        setEditCustomerData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleEditCustomer = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${api}/api/customers/editCustomer`,editCustomerData);
            console.log(response.data); // Handle response data as needed
            if (response.data.success) {
                showAlert('Customer edited');
                setEditCustomerData({
                    owner_id: localStorage.getItem('customeridtaxrx'),
                    id: '',
                    name: '',
                    phone: '',
                    email: '',
                    panNo: '',
                    gst_number: '',
                    company_address:'',
                    city: '',
                    state: '',
                    pincode: '',
                    country: '',
                    account_holder_name: '',
                    account_number: '',
                    bank_name: '',
                    ifsc: '',
                    branch: '',
                    image: ''
                });
                fetchData();
                setModal6(false);
            } else {
                showAlert('something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [deleteCustomerData, setDeleteCustomerData] = useState({
        owner_id: localStorage.getItem('customeridtaxrx'),
        id: '',
    });

    const handleDeleteCustomer = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.delete(`${api}/api/customers/deletecustomer`, {
                headers: {
                    owner_id: deleteCustomerData.owner_id,
                    id: deleteCustomerData.id,
                },
            });
            console.log(response.data); // Handle response data as needed
            if (response.data.success) {
                showAlert('Customer deleted');
                setInitialRecords(initialRecords.filter((r)=>r.id !== deleteCustomerData.id));
                setDeleteCustomerData({
                    owner_id: localStorage.getItem('customeridtaxrx'),
                    id: '',
                });
                fetchData();
                setModal2(false);
            } else {
                showAlert('something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:expenses-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex expenses-center flex-wrap">
                        <button type="button" onClick={() => exportTable('csv')} className="btn btn-primary btn-sm m-1 ">
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            CSV
                        </button>
                        <button type="button" onClick={() => exportTable('txt')} className="btn btn-primary btn-sm m-1">
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            TXT
                        </button>

                        <button type="button" className="btn btn-primary btn-sm m-1" onClick={handleDownloadExcel}>
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            EXCEL
                        </button>

                        <button type="button" onClick={() => exportTable('print')} className="btn btn-primary btn-sm m-1">
                            <IconPrinter className="ltr:mr-2 rtl:ml-2" />
                            PRINT
                        </button>
                    </div>

                    <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            { accessor: 'name', title: 'Name' },
                            { accessor: 'email', title: 'Email' },
                            { accessor: 'phone', title: 'Phone No.' },
                            { 
                                accessor: 'registration_date', 
                                title: 'Registered On', 
                                sortable: true,
                                render: ({ registration_date }) => (
                                    <p>{`${new Date(registration_date).getDate()} ${months.get(new Date(registration_date).getMonth() + 1)} ${new Date(registration_date).getFullYear()}`}</p>
                                )
                            },
                            { accessor: 'panNo', title: 'PAN No.' },
                            { accessor: 'gst_number', title: 'GST No.' },
                            {
                                accessor: 'Address',
                                render: ({ company_address }) => <p>{company_address}</p>,
                            },
                            {
                                accessor: 'city',
                                title: 'City'
                            },
                            { accessor: 'state', title: 'State' },
                            { accessor: 'country', title: 'Country' },
                            {
                                accessor: 'Customers Action',
                                render: ({ id, name, phone, email, panNo, gst_number, company_address, city, state, pincode, country, bank_name, account_holder_name, branch, ifsc, account_number, image }) => (
                                    <div className="flex w-full justify-around expenses-center">
                                        <Tippy content="Delete">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDeleteCustomerData({
                                                        owner_id: localStorage.getItem('customeridtaxrx'),
                                                        id: id,
                                                    });
                                                    setModal2(true);
                                                }}
                                            >
                                                <IconTrashLines className="m-auto" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Edit">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditCustomerData({
                                                        owner_id: localStorage.getItem('customeridtaxrx'),
                                                        id: id,
                                                        name: name,
                                                        phone: phone,
                                                        email: email,
                                                        panNo: panNo,
                                                        gst_number: gst_number,
                                                        company_address:company_address,
                                                        city: city,
                                                        state: state,
                                                        pincode: pincode,
                                                        country: country,
                                                        account_holder_name: account_holder_name,
                                                        account_number: account_number,
                                                        bank_name: bank_name,
                                                        ifsc: ifsc,
                                                        branch: branch,
                                                        image: image
                                                    });
                                                    setModal6(true);
                                                }}
                                            >
                                                <IconEdit className="m-auto" />
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

            {/* {Delete Customer Modal} */}
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
                                <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark h-[22svh]">
                                    <div className="flex expenses-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Delete Customer</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal2(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <p className="text-gray-500 text-sm px-5 py-1">Are you sure want to delete?</p>
                                    <div className="p-5">
                                        <form onSubmit={handleDeleteCustomer}>
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
                                <Dialog.Panel className="panel my-8 w-full max-w-xl overflow-hidden  rounded-lg border-0 p-0 text-black dark:text-white-dark h-[90svh] overflow-y-scroll overflow-x-hidden">
                                    <div className="flex expenses-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Edit Customer</h5>
                                        <button onClick={() => setModal6(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-2">
                                        <form onSubmit={handleEditCustomer}>
                                            <div className="flex flex-col p-2 w-full">
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="customer_name" className="my-2 text-gray-600">
                                                            Customer Name
                                                        </label>
                                                        <input
                                                            id="customer_name"
                                                            type="text"
                                                            placeholder="Customer Name"
                                                            className="form-input w-full"
                                                            name="name"
                                                            value={editCustomerData.name}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="customer_email" className="my-2 text-gray-600">
                                                            Customer Email
                                                        </label>
                                                        <input
                                                            id="customer_email"
                                                            type="email"
                                                            placeholder="Customer Email"
                                                            className="form-input w-full"
                                                            name="email"
                                                            value={editCustomerData.email}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="customer_phone" className="my-2 text-gray-600">
                                                            Customer Phone
                                                        </label>
                                                        <input
                                                            id="customer_phone"
                                                            type="number"
                                                            placeholder="Customer Phone"
                                                            className="form-input w-full"
                                                            name="phone"
                                                            value={editCustomerData.phone}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="customer_pan" className="my-2 text-gray-600">
                                                            PAN No.
                                                        </label>
                                                        <input
                                                            id="customer_pan"
                                                            type="text"
                                                            placeholder="PAN No."
                                                            className="form-input w-full"
                                                            name="panNo"
                                                            value={editCustomerData.panNo}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="customer_company_address" className="my-2 text-gray-600">
                                                            Address
                                                        </label>
                                                        <input
                                                            id="customer_company_address"
                                                            type="text"
                                                            placeholder="Address"
                                                            className="form-input w-full"
                                                            name="company_address"
                                                            value={editCustomerData.company_address}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="customer_city" className="my-2 text-gray-600">
                                                            City
                                                        </label>
                                                        <input
                                                            id="customer_city"
                                                            type="text"
                                                            placeholder="City"
                                                            className="form-input w-full"
                                                            name="city"
                                                            value={editCustomerData.city}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="customer_state" className="my-2 text-gray-600">
                                                            State
                                                        </label>
                                                        <input
                                                            id="customer_state"
                                                            type="text"
                                                            placeholder="State"
                                                            className="form-input w-full"
                                                            name="state"
                                                            value={editCustomerData.state}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="customer_country" className="my-2 text-gray-600">
                                                            Country
                                                        </label>
                                                        <input
                                                            id="customer_country"
                                                            type="text"
                                                            placeholder="Country"
                                                            className="form-input w-full"
                                                            name="country"
                                                            value={editCustomerData.country}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <h2>Company Information</h2>
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="customer_bank_name" className="my-2 text-gray-600">
                                                            Company Name
                                                        </label>
                                                        <input
                                                            id="customer_bank_name"
                                                            type="text"
                                                            placeholder="Company Name"
                                                            className="form-input w-full"
                                                            name="bank_name"
                                                            value={editCustomerData.bank_name}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="customer_bank_branch" className="my-2 text-gray-600">
                                                            Website
                                                        </label>
                                                        <input
                                                            id="customer_bank_branch"
                                                            type="text"
                                                            placeholder="Website"
                                                            className="form-input w-full"
                                                            name="branch"
                                                            value={editCustomerData.branch}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="customer_gst" className="my-2 text-gray-600">
                                                            GST No.
                                                        </label>
                                                        <input
                                                            id="customer_gst"
                                                            type="text"
                                                            placeholder="GST No."
                                                            className="form-input w-full"
                                                            name="gst_number"
                                                            value={editCustomerData.gst_number}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="customer_bank_account_holder_name" className="my-2 text-gray-600">
                                                            Account Holder Name
                                                        </label>
                                                        <input
                                                            id="customer_bank_account_holder_name"
                                                            type="text"
                                                            placeholder="Account Holder Name"
                                                            className="form-input w-full"
                                                            name="account_holder_name"
                                                            value={editCustomerData.account_holder_name}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="customer_bank_account_number" className="my-2 text-gray-600">
                                                            Account Number
                                                        </label>
                                                        <input
                                                            id="customer_bank_account_number"
                                                            type="number"
                                                            placeholder="Account Number"
                                                            className="form-input w-full"
                                                            name="account_number"
                                                            value={editCustomerData.account_number}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-between expenses-center w-full flex-col">
                                                    <p className="my-2 text-gray-600">Profile Image</p>
                                                    <label htmlFor="customer_image">
                                                        <div className="border-2 border-dashed text-center relative p-10 min-h-[120px] w-full flex items-center justify-between cursor-pointer mb-0">
                                                            <div>
                                                                <h6 className="items-center">
                                                                    <span className="text-info me-1">Click To Replace</span> or Drag and Drop
                                                                </h6>
                                                                <p className="text-gray-400">SVG, PNG, JPG (Max 800*400px)</p>
                                                                <input
                                                                    type="file"
                                                                    id="customer_image"
                                                                    accept="image/png, image/gif, image/jpeg, image/jpg"
                                                                    className="hidden"
                                                                    name="image"
                                                                    onChange={handleEditOnchange}
                                                                />
                                                            </div>
                                                            <span className="border-2 border-solid border-gray-200 p-[10px] rounded-md ml-[20px] w-[40%]">
                                                                <img src={editCustomerData.image ?editCustomerData.image : '/assets/images/logo.png'} alt="upload" />
                                                            </span>
                                                        </div>
                                                    </label>
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
        </div>
    );
};

export default Customers;
