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
import IconDownload from '../components/Icon/IconDownload';
import { Buffer } from 'buffer';

const col = ['invoice_number', 'buyer_gstin', 'invoice_date', 'buyer_name', 'number_of_products', 'taxable_value', 'hsn_sac', 'final_amount', 'gst_rate', 'igst', 'cgst', 'sgst_utgst'];

const Invoices = () => {
    const navigate = useNavigate();
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

    const [invoices, setInvoices] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Invoices'));
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

    const fetchInvoices = async () => {
        try {
            let response;
            if (localStorage.getItem("isUser")) {
                response = await axios.get(`${api}/api/invoices/getallinvoices`, {
                    headers: {
                        id: localStorage.getItem('customeridtaxrx'),
                    },
                });
            } else {
                response = await axios.get(`${api}/api/invoices/getallinvoices`);
            }

            console.log('invoices result: ', response.data);
            if (response.data.success) {
                setInvoices(response.data.results);
                setInitialRecords(response.data.results);
                let t = 0;
                response.data.results.forEach((element) => {
                    t = t + element.taxable_value;
                });
                setTotalAmount(t);
            }
        } catch (error) {
            console.log('failed to fetch the invoices');
            console.error(error);
        }
    };

    const [editInvoiceData, setEditInvoiceData] = useState({
        invoice_ownerid: localStorage.getItem('customeridtaxrx'),
        invoice_number: '',
        buyer_name: '',
        gst_rate: 0,
        igst: 0,
        cgst: 0,
        sgst_utgst: 0,
        products: [],
        taxable_value: 0,
        final_amount: 0,
    });

    const handleChangeEdit = (e) => {
        setEditInvoiceData({ ...editInvoiceData, [e.target.name]: e.target.value });

        if (e.target.name === 'gst_rate') {
            setEditInvoiceData({
                ...editInvoiceData,
                gst_rate: e.target.value,
                final_amount: editInvoiceData.taxable_value + editInvoiceData.taxable_value * (e.target.value / 100),
            });
        }
    };

    const handleChangeEditProduct = (e, product) => {
        let productList = editInvoiceData.products;

        if (e.target.name === 'item') {
            productList[productList.indexOf(product)].item = e.target.value;
        } else if (e.target.name === 'price') {
            productList[productList.indexOf(product)].price = e.target.value;
        } else if (e.target.name === 'quantity') {
            productList[productList.indexOf(product)].quantity = e.target.value;
        } else if (e.target.name === 'uqc') {
            productList[productList.indexOf(product)].uqc = e.target.value;
        }

        let total = 0;

        for (let p of productList) {
            let itemTotal = parseFloat(p.quantity) * parseFloat(p.price);
            total = total + itemTotal;
        }

        setEditInvoiceData({
            ...editInvoiceData,
            products: productList,
            taxable_value: total,
            final_amount: total + total * (editInvoiceData.gst_rate / 100),
        });
    };

    const handleEditInvoice = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${api}/api/invoices/editinvoice`, editInvoiceData);
            console.log(response.data);
            if (response.data.success) {
                showAlert(response.data.msg);
                fetchInvoices();
                setModal6(false);
            } else {
                showAlert(response.data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('something went wrong');
        }
    };

    const [deleteInvoiceData, setDeleteInvoiceData] = useState({
        invoice_ownerid: localStorage.getItem('customeridtaxrx'),
        invoice_number: '',
    });

    const handleDeleteInvoice = async (e) => {
        e.preventDefault();
        console.log('delete data: ', deleteInvoiceData);
        try {
            const response = await axios.delete(`${api}/api/invoices/deleteinvoice`, {
                headers: {
                    invoice_number: deleteInvoiceData.invoice_number,
                    invoice_ownerid: deleteInvoiceData.invoice_ownerid,
                },
            });
            console.log(response.data);
            if (response.data.success) {
                showAlert(response.data.msg);
                setInitialRecords(initialRecords.filter((r)=>r.invoice_number !== deleteInvoiceData.invoice_number));
                setDeleteInvoiceData({
                    invoice_ownerid: localStorage.getItem('customeridtaxrx'),
                    invoice_number: '',
                })
                fetchInvoices();
                setModal2(false);
            } else {
                showAlert(response.data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('something went wrong');
        }
    };

    const [viewInvoiceData, setViewInvoiceData] = useState(null);

    const countQuantity = (productList) => {
        let quantity = 0;
        for (let product of productList) {
            quantity = quantity + parseInt(product.quantity);
        }
        return quantity;
    };

    useEffect(() => {
        fetchInvoices();
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
            return invoices.filter((invoice: any) => {
                return (
                    invoice.buyer_name.includes(search.toLowerCase()) ||
                    invoice.buyer_gstin.toLowerCase().includes(search.toLowerCase()) ||
                    invoice.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
                    invoice.hsn_sac.toLowerCase().includes(search.toLowerCase()) ||
                    invoice.taxable_value.toString().toLowerCase().includes(search.toLowerCase()) ||
                    invoice.final_amount.toString().toLowerCase().includes(search.toLowerCase()) ||
                    invoice.gst_rate.toString().toLowerCase().includes(search.toLowerCase())
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
    const header = [
        'Seller Name',
        'Seller Billing Address',
        'Seller Shipping Address',
        'Seller GSTIN',
        'Seller Phone',
        'Seller Email',
        'Invoice Type',
        'Buyer GSTIN',
        'Buyer Name',
        'Buyer Phone',
        'Buyer Email',
        'Buyer Billing Address',
        'Buyer Shipping Address',
        'Place of Supply',
        'Invoice Number',
        'Invoice Date',
        'HSN/SAC',
        'Products',
        'Subtotal',
        'Total Amount',
        'Reverse Charge',
        'GST Rate',
        'IGST',
        'CGST',
        'SGST/UGST',
        'Supply Type',
    ];

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
        console.log('invoices: ', recordsData);
        const payloadBody = [];
        for(let invoice of recordsData){
            const tempRow = {};
            tempRow.seller_trade_name = invoice.seller_trade_name;
            tempRow.seller_office_address = invoice.seller_office_address;
            tempRow.seller_shipping_address = invoice.seller_shipping_address;
            tempRow.seller_gstin = invoice.seller_gstin;
            tempRow.seller_phone = invoice.seller_phone;
            tempRow.seller_email = invoice.seller_email;
            tempRow.invoice_type = invoice.invoice_type;
            tempRow.buyer_gstin = invoice.buyer_gstin;
            tempRow.buyer_name = invoice.buyer_name;
            tempRow.buyer_phone = invoice.buyer_phone;
            tempRow.buyer_email = invoice.buyer_email;
            tempRow.bill_to_address = invoice.bill_to_address;
            tempRow.ship_to_address = invoice.ship_to_address;
            tempRow.place_of_supply = invoice.place_of_supply;
            tempRow.invoice_number = invoice.invoice_number;
            tempRow.invoice_date = invoice.invoice_date;
            tempRow.hsn_sac = invoice.hsn_sac;
            tempRow.products = invoice.products;
            tempRow.taxable_value = invoice.taxable_value;
            tempRow.final_amount = invoice.final_amount;
            tempRow.reverse_charge = invoice.reverse_charge;
            tempRow.gst_rate = invoice.gst_rate;
            tempRow.igst = invoice.igst;
            tempRow.cgst = invoice.cgst;
            tempRow.sgst_utgst = invoice.sgst_utgst;
            tempRow.supply_type = invoice.supply_type;
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
        let records = invoices;
        let filename = 'table';

        let newVariable: any;
        newVariable = window.navigator;

        if (type === 'csv') {
            let coldelimiter = ';';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    if(d === 'invoice_file' || d === 'id' || d === 'invoice_ownerid') return;
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                // eslint-disable-next-line array-callback-return
                columns.map((d: any, index: any) => {
                    if(d === 'invoice_file' || d === 'id' || d === 'invoice_ownerid') return;
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
                if(d === 'invoice_file' || d === 'id' || d === 'invoice_ownerid') return;
                rowhtml += '<th>' + capitalize(d) + '</th>';
            });
            rowhtml += '</tr></thead>';
            rowhtml += '<tbody>';

            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                rowhtml += '<tr>';
                // eslint-disable-next-line array-callback-return
                columns.map((d: any) => {
                    if(d === 'invoice_file' || d === 'id' || d === 'invoice_ownerid') return;
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
                    if(d === 'invoice_file' || d === 'id' || d === 'invoice_ownerid') return;
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                // eslint-disable-next-line array-callback-return
                columns.map((d: any, index: any) => {
                    if(d === 'invoice_file' || d === 'id' || d === 'invoice_ownerid') return;
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

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:invoices-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex invoices-center flex-wrap">
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
                            { accessor: 'invoice_number', sortable: false },
                            { accessor: 'buyer_gstin', sortable: false },
                            {
                                accessor: 'invoice_date',
                                sortable: true,
                                render: ({ invoice_date }) => (
                                    <p>{`${new Date(invoice_date).getDate()} ${months.get(new Date(invoice_date).getMonth() + 1)} ${new Date(invoice_date).getFullYear()}`}</p>
                                ),
                            },
                            { accessor: 'buyer_name', sortable: false },
                            {
                                accessor: 'products',
                                sortable: false,
                                render: ({ products }) => <p>{JSON.parse(products).length}</p>,
                            },
                            {
                                accessor: 'taxable_value',
                                sortable: true,
                                render: ({ taxable_value }) => <p>₹ {taxable_value}</p>,
                            },
                            { accessor: 'hsn_sac', sortable: false },
                            {
                                accessor: 'final_amount',
                                sortable: true,
                                render: ({ final_amount }) => <p>₹ {final_amount}</p>,
                            },
                            {
                                accessor: 'gst_rate',
                                sortable: true,
                                render: ({ gst_rate }) => <p>{gst_rate}%</p>,
                            },
                            {
                                accessor: 'igst',
                                sortable: true,
                                render: ({ igst }) => <p>{igst}%</p>,
                            },
                            {
                                accessor: 'cgst',
                                sortable: true,
                                render: ({ cgst }) => <p>{cgst}%</p>,
                            },
                            {
                                accessor: 'sgst_utgst',
                                sortable: true,
                                render: ({ sgst_utgst }) => <p>{sgst_utgst}%</p>,
                            },
                            {
                                accessor: 'Invoice Actions',
                                render: ({ buyer_name, invoice_number, products, taxable_value, final_amount, gst_rate, igst, cgst, sgst_utgst, invoice_file, invoice_date }) => (
                                    <div className="flex w-full justify-around invoices-center">
                                        <Tippy content="Delete">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDeleteInvoiceData({
                                                        invoice_ownerid: localStorage.getItem('customeridtaxrx'),
                                                        invoice_number: invoice_number,
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
                                                    setEditInvoiceData({
                                                        invoice_ownerid: localStorage.getItem('customeridtaxrx'),
                                                        invoice_number: invoice_number,
                                                        buyer_name: buyer_name,
                                                        gst_rate: gst_rate,
                                                        igst: igst,
                                                        cgst: cgst,
                                                        sgst_utgst: sgst_utgst,
                                                        products: JSON.parse(products),
                                                        taxable_value: taxable_value,
                                                        final_amount: final_amount,
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
                                                onClick={() => {
                                                    console.log(invoice_file);
                                                    const buffer = Buffer.from(invoice_file);
                                                    const blob = new Blob([buffer]);

                                                    const url = window.URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    document.body.appendChild(a);
                                                    a.style = 'display: none';
                                                    a.href = url;
                                                    a.download = `${buyer_name}-${new Date(invoice_date).getDate()}-${months.get(new Date(invoice_date).getMonth() + 1)}-${new Date(
                                                        invoice_date
                                                    ).getFullYear()}.pdf`;
                                                    a.click();
                                                    window.URL.revokeObjectURL(url);
                                                }}
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

            {/* {Delete Invoice Modal} */}
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
                                        <h5 className="text-lg font-bold">Delete Invoice</h5>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal2(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <p className="text-gray-500 text-sm px-5 py-1">Are you sure want to delete?</p>
                                    <div className="p-5">
                                        <form onSubmit={handleDeleteInvoice}>
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

            {/* {Edit Invoice Modal} */}
            <Transition appear show={modal6} as={Fragment}>
                <Dialog as="div" open={modal6} onClose={() => setModal6(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] bg-[black]/60">
                        <div className="flex min-h-screen invoices-start justify-center px-4">
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
                                    <div className="flex invoices-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Edit Invoice</h5>
                                        <button onClick={() => setModal6(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-2 max-h-[80svh] overflow-y-scroll">
                                        <form onSubmit={handleEditInvoice}>
                                            <div className="flex flex-col p-2 w-full">
                                                <div className="flex justify-between invoices-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="invoice_number" className="my-2 text-gray-600">
                                                            Invoice Number
                                                        </label>
                                                        <input
                                                            id="invoice_number"
                                                            type="text"
                                                            placeholder="Invoice Number"
                                                            className="form-input w-full"
                                                            name="invoice_number"
                                                            value={editInvoiceData.invoice_number}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="buyer_name" className="my-2 text-gray-600">
                                                            Buyer Name
                                                        </label>
                                                        <input
                                                            id="buyer_name"
                                                            type="text"
                                                            placeholder="Buyer Name"
                                                            className="form-input w-full"
                                                            name="buyer_name"
                                                            value={editInvoiceData.buyer_name}
                                                            onChange={handleChangeEdit}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-between invoices-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="gst_rate" className="my-2 text-gray-600">
                                                            GST Rate
                                                        </label>
                                                        <input
                                                            id="gst_rate"
                                                            type="number"
                                                            placeholder="GST Rate"
                                                            className="form-input w-full"
                                                            name="gst_rate"
                                                            value={editInvoiceData.gst_rate}
                                                            onChange={handleChangeEdit}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="product_hsn_sac" className="my-2 text-gray-600">
                                                            IGST
                                                        </label>
                                                        <input
                                                            id="igst"
                                                            type="text"
                                                            placeholder="HSN/SAC"
                                                            className="form-input w-full"
                                                            name="igst"
                                                            value={editInvoiceData.igst}
                                                            onChange={handleChangeEdit}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-between invoices-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="product_price" className="my-2 text-gray-600">
                                                            CGST
                                                        </label>
                                                        <input
                                                            id="cgst"
                                                            type="text"
                                                            placeholder="Item in Stock"
                                                            className="form-input w-full"
                                                            name="cgst"
                                                            value={editInvoiceData.cgst}
                                                            onChange={handleChangeEdit}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="sgst_utgst" className="my-2 text-gray-600">
                                                            SGST/UGST
                                                        </label>
                                                        <input
                                                            id="sgst_utgst"
                                                            type="text"
                                                            placeholder="SGST/UGST"
                                                            className="form-input w-full"
                                                            name="sgst_utgst"
                                                            value={editInvoiceData.sgst_utgst}
                                                            onChange={handleChangeEdit}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-between invoices-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="taxable_value" className="my-2 text-gray-600">
                                                            Subtotal
                                                        </label>
                                                        <input
                                                            id="taxable_value"
                                                            type="number"
                                                            placeholder="Item in Stock"
                                                            className="form-input w-full"
                                                            name="taxable_value"
                                                            value={editInvoiceData.taxable_value}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                        <label htmlFor="final_amount" className="my-2 text-gray-600">
                                                            Total Amount
                                                        </label>
                                                        <input
                                                            id="final_amount"
                                                            type="number"
                                                            placeholder="SGST/UGST"
                                                            className="form-input w-full"
                                                            name="final_amount"
                                                            value={editInvoiceData.final_amount}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <h5 className="my-2">Products</h5>

                                                {editInvoiceData.products.map((product, i) => {
                                                    return (
                                                        <div className="flex justify-between">
                                                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                                <label htmlFor="product_name" className="my-2 text-gray-600">
                                                                    Item
                                                                </label>
                                                                <input
                                                                    id="product_name"
                                                                    type="text"
                                                                    placeholder="Product Name"
                                                                    className="form-input w-full"
                                                                    name="item"
                                                                    value={product.item}
                                                                    onChange={(e) => handleChangeEditProduct(e, product)}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                                <label htmlFor="product_price" className="my-2 text-gray-600">
                                                                    Price
                                                                </label>
                                                                <input
                                                                    id="product_price"
                                                                    type="number"
                                                                    placeholder="Product Price"
                                                                    className="form-input w-full"
                                                                    name="price"
                                                                    value={product.price}
                                                                    onChange={(e) => handleChangeEditProduct(e, product)}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                                <label htmlFor="product_quantity" className="my-2 text-gray-600">
                                                                    Quantity
                                                                </label>
                                                                <input
                                                                    id="product_quantity"
                                                                    type="number"
                                                                    placeholder="Product Quantity"
                                                                    className="form-input w-full"
                                                                    name="quantity"
                                                                    value={product.quantity}
                                                                    onChange={(e) => handleChangeEditProduct(e, product)}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                                <label htmlFor="item-uqc" className="my-2 text-gray-600">
                                                                    UQC
                                                                </label>
                                                                <select className="form-select text-white-dark" name="uqc" value={product.uqc} onChange={(e) => handleChangeEditProduct(e, product)}>
                                                                    <option>Open this select menu</option>
                                                                    <option value="NO OF PCS">NO OF PCS</option>
                                                                    <option value="KG">KG</option>
                                                                    <option value="METER">METER</option>
                                                                    <option value="DOZEN">DOZEN</option>
                                                                    <option value="LITER">LITER</option>
                                                                    <option value="ETC">ETC</option>
                                                                </select>
                                                            </div>

                                                            <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                                <label htmlFor="product_quantity" className="my-2 text-gray-600">
                                                                    Item Total
                                                                </label>
                                                                <input
                                                                    id="product_item_total"
                                                                    type="number"
                                                                    placeholder="Item Total"
                                                                    className="form-input w-full"
                                                                    name="product_item_total"
                                                                    value={parseFloat(product.price) * parseFloat(product.quantity)}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="m-4 flex invoices-center justify-end">
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

export default Invoices;
