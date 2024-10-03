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

const col = ['Expense_ID', 'Reference', 'Amount', 'Payment_Mode', 'Payment_Status'];;

const Expenses = () => {
    const { download } = useDownloader();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Export Table'));
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

    const [expences, setExpences] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${api}/expenses/searchExpense`, {
                headers: {
                    id: localStorage.getItem('customeridtaxrx'),
                },
            });
            console.log(response.data);
            if (response.data.success) {
                setExpences(response.data.results);
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
            return expences.filter((expense: any) => {
                return (
                    expense.Expense_ID.toLowerCase().includes(search.toLowerCase()) ||
                    expense.Reference.toLowerCase().includes(search.toLowerCase())
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
    const header = ['Expense Id', 'Reference', 'Amount', 'Payment Mode', 'Payment Date', 'Payment Status', 'Description', 'Attachment'];

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
        const payloadBody = [];
        for(let expense of recordsData){
            const tempRow = {};
            tempRow.Expense_ID = expense.Expense_ID;
            tempRow.Reference = expense.Reference;
            tempRow.Amount = expense.Amount;
            tempRow.Attachment = expense.Attachment;
            tempRow.Payment_Mode = expense.Payment_Mode;
            tempRow.Payment_Status = expense.Payment_Status;
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
        let records = expences;
        let filename = 'table';

        let newVariable: any;
        newVariable = window.navigator;

        if (type === 'csv') {
            let coldelimiter = ';';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                // eslint-disable-next-line array-callback-return
                columns.map((d: any, index: any) => {
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
                rowhtml += '<th>' + capitalize(d) + '</th>';
            });
            rowhtml += '</tr></thead>';
            rowhtml += '<tbody>';

            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                rowhtml += '<tr>';
                // eslint-disable-next-line array-callback-return
                columns.map((d: any) => {
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
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                // eslint-disable-next-line array-callback-return
                columns.map((d: any, index: any) => {
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

    const [editExpensesData, setEditExpensesData] = useState({
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

    const handleEditOnchange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'Attachment') {
            var reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = () => {
                setEditExpensesData({ ...editExpensesData, Attachment: reader.result });
            };
        }
        setEditExpensesData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleEditExpenses = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${api}/api/expenses/editexpenses`, editExpensesData);
            console.log(response.data); // Handle response data as needed
            if (response.data.success) {
                showAlert('expenses edited');
                setEditExpensesData({
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
                fetchData();
                setModal6(false);
            } else {
                showAlert('something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [deleteExpensesData, setDeleteExpensesData] = useState({
        Owner_Id: localStorage.getItem('customeridtaxrx'),
        Expense_ID: '',
    });

    const handleDeleteExpenses = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.delete(`${api}/api/expenses/deleteexpenses`, {
                headers: {
                    owner_id: deleteExpensesData.Owner_Id,
                    expense_id: deleteExpensesData.Expense_ID,
                },
            });
            console.log(response.data); // Handle response data as needed
            if (response.data.success) {
                showAlert('expenses deleted');
                setInitialRecords(initialRecords.filter((r)=>r.Expense_ID !== deleteExpensesData.Expense_ID));
                setDeleteExpensesData({
                    Owner_Id: localStorage.getItem('customeridtaxrx'),
                    Expense_ID: '',
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
                            { accessor: 'id', sortable: true },
                            { accessor: 'Expense_ID', sortable: false },
                            { accessor: 'Reference', sortable: false },
                            {
                                accessor: 'Amount',
                                sortable: true,
                                render: ({ Amount }) => <p>₹ {Amount}</p>,
                            },
                            {
                                accessor: 'Attachment',
                                render: ({ Attachment }) => (
                                    <div className="w-[20%]">
                                        <img src={Attachment} alt="" />
                                    </div>
                                ),
                            },
                            { accessor: 'Payment_Mode', sortable: false },
                            {
                                accessor: 'Payment_Status',
                                sortable: false,
                                render: ({ Payment_Status }) => (
                                    <span
                                        className={`${
                                            Payment_Status === 'Paid' ? 'bg-green-200 text-green-500' : Payment_Status === 'Pending' ? 'bg-yellow-100 text-yellow-500' : 'bg-red-200 text-red-500'
                                        } py-1 px-2 rounded-md`}
                                    >
                                        {Payment_Status}
                                    </span>
                                ),
                            },
                            {
                                accessor: 'Expenses Action',
                                render: ({ Expense_ID, Reference, Amount, Payment_Mode, Expense_Date, Payment_Status, Description, Attachment }) => (
                                    <div className="flex w-full justify-around expenses-center">
                                        <Tippy content="Delete">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDeleteExpensesData({
                                                        Owner_Id: localStorage.getItem('customeridtaxrx'),
                                                        Expense_ID: Expense_ID,
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
                                                    setEditExpensesData({
                                                        Owner_Id: localStorage.getItem('customeridtaxrx'),
                                                        Expense_ID: Expense_ID,
                                                        Reference: Reference,
                                                        Amount: Amount,
                                                        Payment_Mode: Payment_Mode,
                                                        Expense_Date: Expense_Date,
                                                        Payment_Status: Payment_Status,
                                                        Description: Description,
                                                        Attachment: Attachment,
                                                    });
                                                    setModal6(true);
                                                }}
                                            >
                                                <IconEdit className="m-auto" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Download">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    download(
                                                        Attachment,
                                                        `${Expense_ID} ${new Date(Expense_Date).getDate()}-${new Date(Expense_Date).getMonth() + 1}-${new Date(
                                                            Expense_Date
                                                        ).getFullYear()}.jpg`
                                                    )
                                                }
                                            >
                                                <IconDownload className="m-auto" />
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
                                <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex expenses-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Delete Item</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal2(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <p className="text-gray-500 text-sm px-5 py-1">Are you sure want to delete?</p>
                                    <div className="p-5">
                                        <form onSubmit={handleDeleteExpenses}>
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
                                <Dialog.Panel className="panel my-8 w-full max-w-xl overflow-hidden  rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex expenses-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Edit Expense</h5>
                                        <button onClick={() => setModal6(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-2">
                                        <form onSubmit={handleEditExpenses}>
                                            <div className="flex flex-col p-2 w-full">
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="expense_id" className="my-2 text-gray-600">
                                                            Expense Id
                                                        </label>
                                                        <input
                                                            id="expense_id"
                                                            type="text"
                                                            placeholder="Expense Id"
                                                            className="form-input w-full"
                                                            name="Expense_ID"
                                                            value={editExpensesData.Expense_ID}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="expense_reference" className="my-2 text-gray-600">
                                                            Reference
                                                        </label>
                                                        <input
                                                            id="expense_reference"
                                                            type="text"
                                                            placeholder="Reference"
                                                            className="form-input w-full"
                                                            name="Reference"
                                                            value={editExpensesData.Reference}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="expense_amount" className="my-2 text-gray-600">
                                                            Amount
                                                        </label>
                                                        <input
                                                            id="expense_amount"
                                                            type="number"
                                                            placeholder="Amount"
                                                            className="form-input w-full"
                                                            name="Amount"
                                                            value={editExpensesData.Amount}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="expense_payment_mode" className="my-2 text-gray-600">
                                                            Payment Mode
                                                        </label>
                                                        <select
                                                            id="expense_payment_mode"
                                                            className="form-select text-white-dark"
                                                            name="Payment_Mode"
                                                            value={editExpensesData.Payment_Mode}
                                                            onChange={handleEditOnchange}
                                                        >
                                                            <option>Select Payment Mode</option>
                                                            <option value="Cash">Cash</option>
                                                            <option value="Cheque">Cheque</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="expense-date" className="my-2 text-gray-600">
                                                            Expense Date
                                                        </label>
                                                        <Flatpickr
                                                            id="expense-date"
                                                            value={editExpensesData.Expense_Date}
                                                            options={{ dateFormat: 'y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                                            className="form-input"
                                                            onChange={(date) =>
                                                                setEditExpensesData({
                                                                    ...editExpensesData,
                                                                    Expense_Date: `${new Date(date).getFullYear()}-${String(new Date(date).getMonth() + 1).padStart(2, '0')}-${String(
                                                                        new Date(date).getDate()
                                                                    ).padStart(2, '0')} ${String(new Date(date).getHours()).padStart(2, '0')}:${String(new Date(date).getMinutes()).padStart(
                                                                        2,
                                                                        '0'
                                                                    )}:${String(new Date(date).getSeconds()).padStart(2, '0')}`,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="expense_payment_status" className="my-2 text-gray-600">
                                                            Payment Status
                                                        </label>
                                                        <select
                                                            id="expense_payment_status"
                                                            className="form-select text-white-dark"
                                                            name="Payment_Status"
                                                            value={editExpensesData.Payment_Status}
                                                            onChange={handleEditOnchange}
                                                        >
                                                            <option>Select Payment Status</option>
                                                            <option value="Paid">Paid</option>
                                                            <option value="Pending">Pending</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between expenses-center w-full flex-col">
                                                    <p className="my-2 text-gray-600">Attachment</p>
                                                    <label htmlFor="expense_attachment">
                                                        <div className="border-2 border-dashed text-center relative p-10 min-h-[120px] w-full flex items-center justify-between cursor-pointer mb-0">
                                                            <div>
                                                                <h6 className="items-center">
                                                                    <span className="text-info me-1">Click To Replace</span> or Drag and Drop
                                                                </h6>
                                                                <p className="text-gray-400">SVG, PNG, JPG (Max 800*400px)</p>
                                                                <input
                                                                    type="file"
                                                                    id="expense_attachment"
                                                                    accept="image/png, image/gif, image/jpeg, image/jpg"
                                                                    className="hidden"
                                                                    name="Attachment"
                                                                    onChange={handleEditOnchange}
                                                                />
                                                            </div>
                                                            <span className="border-2 border-solid border-gray-200 p-[10px] rounded-md ml-[20px] w-[40%]">
                                                                <img src={editExpensesData.Attachment ? editExpensesData.Attachment : '/assets/images/logo.png'} alt="upload" />
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

export default Expenses;
