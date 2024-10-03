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

const col = ['id', 'product_code', 'name', 'price', 'hsn_sac', 'item_in_stock', 'uqc', 'duration'];

const Items = () => {
    const [items, setItems] = useState([]);
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

    const fetchData = async () => {
        try {
            const response = await axios.get(`${api}/api/items/getallitems`, {
                headers: {
                    id: localStorage.getItem('customeridtaxrx'),
                },
            });
            console.log(response.data);
            if (response.data.success) {
                setItems(response.data.results);
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
            return items.filter((item: any) => {
                return (
                    item.id.toString().includes(search.toLowerCase()) ||
                    item.product_code.toLowerCase().includes(search.toLowerCase()) ||
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.hsn_sac.toLowerCase().includes(search.toLowerCase()) ||
                    item.item_in_stock.toString().toLowerCase().includes(search.toLowerCase()) ||
                    item.uqc.toString().toLowerCase().includes(search.toLowerCase()) ||
                    item.duration.toLowerCase().includes(search.toLowerCase()) ||
                    item.name.toLowerCase().includes(search.toLowerCase())
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
    const header = ['Id', 'Item code', 'Item name', 'Price', 'Hsn sac', 'In stock', 'Uqc', 'Duration'];

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
        console.log('items: ', recordsData);
        const payloadBody = [];
        for(let item of recordsData){
            const tempRow = {};
            tempRow.id = item.id;
            tempRow.product_code = item.product_code;
            tempRow.name = item.name;
            tempRow.price = item.price;
            tempRow.hsn_sac = item.hsn_sac;
            tempRow.item_in_stock = item.item_in_stock;
            tempRow.uqc = item.uqc;
            tempRow.duration = item.duration;
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
        let records = items;
        let filename = 'table';

        let newVariable: any;
        newVariable = window.navigator;

        if (type === 'csv') {
            let coldelimiter = ';';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    if(d === 'owner_id') return;
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                // eslint-disable-next-line array-callback-return
                columns.map((d: any, index: any) => {
                    if(d === 'owner_id') return;
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
                if(d === 'owner_id') return;
                rowhtml += '<th>' + capitalize(d) + '</th>';
            });
            rowhtml += '</tr></thead>';
            rowhtml += '<tbody>';

            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                rowhtml += '<tr>';
                // eslint-disable-next-line array-callback-return
                columns.map((d: any) => {
                    if(d === 'owner_id') return;
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
                    if(d === 'owner_id') return;
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                // eslint-disable-next-line array-callback-return
                columns.map((d: any, index: any) => {
                    if(d === 'owner_id') return;
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

    const [editItemData, setEditItemData] = useState({
        ownerid: localStorage.getItem('customeridtaxrx'),
        product_code: '',
        name: '',
        price: 0,
        hsn_sac: '',
        item_in_stock: 0,
        uqc: '',
        duration: '',
    });

    const handleEditOnchange = (e) => {
        const { name, value } = e.target;
        setEditItemData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleEditExpenses = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${api}/api/items/edititem`, editItemData);
            console.log(response.data); // Handle response data as needed
            if (response.data.success) {
                showAlert('Item edited');
                setModal6(false);
                setEditItemData({
                    ownerid: localStorage.getItem('customeridtaxrx'),
                    product_code: '',
                    name: '',
                    price: 0,
                    hsn_sac: '',
                    item_in_stock: 0,
                    uqc: '',
                    duration: '',
                });
                fetchData();
            } else {
                showAlert('something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [deleteItemData, setDeleteItemData] = useState({
        ownerid: localStorage.getItem('customeridtaxrx'),
        product_code: '',
    });

    const handleDeleteItem = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.delete(`${api}/api/items/deleteitem`, {
                headers: deleteItemData,
            });
            console.log(response.data); // Handle response data as needed
            if (response.data.success) {
                showAlert('Item deleted');
                setInitialRecords(initialRecords.filter((r)=>r.product_code !== deleteItemData.product_code));
                setDeleteItemData({
                    ownerid: localStorage.getItem('customeridtaxrx'),
                    product_code: '',
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
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
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
                            { accessor: 'product_code', sortable: false },
                            { accessor: 'name', sortable: false },
                            {
                                accessor: 'price',
                                sortable: true,
                                render: ({ price }) => <p>₹ {price}</p>,
                            },
                            { accessor: 'hsn_sac', sortable: false },
                            {
                                accessor: 'item_in_stock',
                                sortable: true,
                            },
                            { accessor: 'uqc', sortable: false },
                            { accessor: 'duration', sortable: false },
                            {
                                accessor: 'Action',
                                render: ({ name, product_code, price, hsn_sac, item_in_stock, uqc, duration }) => (
                                    <div className="flex w-full justify-around items-center">
                                        <Tippy content="Delete">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDeleteItemData({
                                                        ownerid: localStorage.getItem('customeridtaxrx'),
                                                        product_code: product_code,
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
                                                    setEditItemData({
                                                        ownerid: localStorage.getItem('customeridtaxrx'),
                                                        product_code: product_code,
                                                        name: name,
                                                        price: price,
                                                        hsn_sac: hsn_sac,
                                                        item_in_stock: item_in_stock,
                                                        uqc: uqc,
                                                        duration: duration,
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

            {/* {Delete Item Modal} */}
            <Transition appear show={modal2} as={Fragment}>
                <Dialog as="div" open={modal2} onClose={() => setModal2(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-center justify-center px-4">
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
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Delete Item</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal2(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <p className="text-gray-500 text-sm px-5 py-1">Are you sure want to delete?</p>
                                    <div className="p-5">
                                        <form onSubmit={handleDeleteItem}>
                                            <div className="flex items-center justify-center">
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

            {/* {Edit Item Modal} */}
            <Transition appear show={modal6} as={Fragment}>
                <Dialog as="div" open={modal6} onClose={() => setModal6(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
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
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Edit Item</h5>
                                        <button onClick={() => setModal6(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-2">
                                        <form onSubmit={handleEditExpenses}>
                                            <div className="flex flex-col p-2 w-full">
                                                <div className="flex justify-between items-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="product_code" className="my-2 text-gray-600">
                                                            Product Code
                                                        </label>
                                                        <input
                                                            id="product_code"
                                                            type="text"
                                                            placeholder="Product Code"
                                                            className="form-input w-full"
                                                            name="product_code"
                                                            value={editItemData.product_code}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="product_name" className="my-2 text-gray-600">
                                                            Product Name
                                                        </label>
                                                        <input
                                                            id="product_name"
                                                            type="text"
                                                            placeholder="Product Name"
                                                            className="form-input w-full"
                                                            name="name"
                                                            value={editItemData.name}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="product_price" className="my-2 text-gray-600">
                                                            Price
                                                        </label>
                                                        <input
                                                            id="product_price"
                                                            type="number"
                                                            placeholder="Price"
                                                            className="form-input w-full"
                                                            name="product_price"
                                                            value={editItemData.price}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="product_hsn_sac" className="my-2 text-gray-600">
                                                            HSN/SAC
                                                        </label>
                                                        <input
                                                            id="product_hsn_sac"
                                                            type="text"
                                                            placeholder="HSN/SAC"
                                                            className="form-input w-full"
                                                            name="hsn_sac"
                                                            value={editItemData.hsn_sac}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="product_price" className="my-2 text-gray-600">
                                                            Item in Stock
                                                        </label>
                                                        <input
                                                            id="product_price"
                                                            type="number"
                                                            placeholder="Item in Stock"
                                                            className="form-input w-full"
                                                            name="item_in_stock"
                                                            value={editItemData.item_in_stock}
                                                            onChange={handleEditOnchange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="item-uqc" className="my-2 text-gray-600">
                                                            UQC (Unit Quantity Code)
                                                        </label>
                                                        <select className="form-select text-white-dark" name="uqc" value={editItemData.uqc} onChange={handleEditOnchange}>
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
                                            </div>
                                            <div className="m-4 flex items-center justify-end">
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

export default Items;
