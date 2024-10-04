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
import IconChecks from '../components/Icon/IconChecks';
import IconCircleCheck from '../components/Icon/IconCircleCheck';
import IconCrossCircled from '../components/Icon/IconCrossCircled';

const col = ['id', 'acknowldgement', 'company_name', 'user_name', 'type', 'filed_on'];

const TaxFiles = () => {
    const { download } = useDownloader();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Export Table'));
    });
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [modal2, setModal2] = useState(false);
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

    const [taxFiles, setTaxFiles] = useState([]);

    const fetchAllTaxFiles = async() => {
        try {
            const response = await axios.get(
                `${api}/admin/getalltaxfiles`
            );
    
            console.log("taxfiles result: ", response.data);
            if (response.data.success) {
                console.log("All taxfiles fetched successfully");
                setTaxFiles(response.data.results);
                setInitialRecords(response.data.results);
            }else{
                showAlert(response.data.msg);
            }
        } catch (error) {
            console.log("failed to fetch the Projects");
            console.error(error);
        }
    }


    useEffect(() => {
        if (!localStorage.getItem('adminidtaxrx')) {
            navigate('/');
        }
        fetchAllTaxFiles();
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
            return taxFiles.filter((taxfile: any) => {
                return (
                    taxfile.acknowledgement.toLowerCase().includes(search.toLowerCase()) ||
                    taxfile.company_name.toLowerCase().includes(search.toLowerCase()) ||
                    taxfile.user_name.toLowerCase().includes(search.toLowerCase())
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
    const header = ['acknowldgement', 'company_name', 'user_name', 'type', 'filed_on'];

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
        for(let taxFile of taxFiles){
            const tempRow = {};
            tempRow.acknowledgement = taxFile.acknowledgement;
            tempRow.user_name = taxFile.user_name;
            tempRow.company_name = taxFile.company_name;
            tempRow.type = taxFile.type;
            tempRow.filed_on = taxFile.filed_on;
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
        let records = taxFiles;
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
                    if(d === 'file') return;
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
                if(d === 'file') return;
                rowhtml += '<th>' + capitalize(d) + '</th>';
            });
            rowhtml += '</tr></thead>';
            rowhtml += '<tbody>';

            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                rowhtml += '<tr>';
                // eslint-disable-next-line array-callback-return
                columns.map((d: any) => {
                    if(d === 'file') return;
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
                    if(d === 'file') return;
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

    const markAsCompleted = async(id) => {
        try {
            const response = await axios.delete(
                `${api}/admin/deletetaxfile`,
                {
                    headers:{
                        id: id
                    }
                }
            );
    
            console.log("taxfiles result: ", response.data);
            if (response.data.success) {
                showAlert("Marked as completed successfully");
                fetchAllTaxFiles();
            }else{
                showAlert("Error while marking as completed");
            }
        } catch (error) {
            console.log("failed to fetch the Projects");
            console.error(error);
        }
    }

    
    const [fileToReject, setFileToReject] = useState({
        id: '',
        reason: ''
    });

    const rejectTaxFile = async(e, id) => {
        e.preventDefault();
        try {
          const response = await axios.delete(
              `${api}/admin/rejecttaxfile`,
              {
                id: fileToReject.id,
                reason: fileToReject.reason
              }
          );
    
          console.log("taxfiles result: ", response.data);
          if (response.data.success) {
              showAlert("Tax file rejected successfully");
              fetchAllTaxFiles();
          }else{
              showAlert("Error while rejecting tax file");
          }
        } catch (error) {
          console.log("failed to fetch the Projects");
          console.error(error);
        }
    }

    const [emailCannotChangeMsg, setEmailCannotChangeMsg] = useState('');

    return (
        <div>
            <h1 className='text-4xl font-semibold'>All Tax Files</h1>
            <p>All tax filed by users</p>
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
                            { accessor: 'acknowledgement', title: 'Acknowledgement Number', sortable: false },
                            { accessor: 'user_name', title: 'Username', sortable: false },
                            {
                                accessor: 'company_name',
                                title: 'Project Name',
                                sortable: false
                            },
                            {
                                accessor: 'type',
                                title: 'Type',
                                sortable: false
                            },
                            {
                                accessor: 'filed_on',
                                title: 'Uploaded On',
                                sortable: true,
                                render: ({ filed_on }) => <p>{`${new Date(filed_on).getDate()} ${months.get(new Date(filed_on).getMonth() + 1)} ${new Date(filed_on).getFullYear()}`}</p>
                            },
                            {
                                accessor: 'TaxFile Action',
                                render: ({ id, company_name, filed_on, file }) => (
                                    <div className="flex w-[60%] justify-around expenses-center">
                                        <Tippy content="Download">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    download(file, `${company_name}-${months.get(new Date(filed_on).getMonth()+1)}.xls`)
                                                }}
                                            >
                                                <IconDownload className="m-auto" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Approve">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    markAsCompleted(id);
                                                }}
                                            >
                                                <IconCircleCheck className="m-auto" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Reject">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setModal2(true);
                                                }}
                                            >
                                                <IconCrossCircled className="m-auto" />
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

            {/* {Edit Package Modal} */}
            <Transition appear show={modal2} as={Fragment}>
                <Dialog as="div" open={modal2} onClose={() => setModal2(false)}>
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
                                <Dialog.Panel className="panel my-8 w-full max-w-xl overflow-hidden  rounded-lg border-0 p-0 text-black dark:text-white-dark h-[45svh]">
                                    <div className="flex expenses-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Edit Package</h5>
                                        <button onClick={() => setModal2(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-2">
                                        <form onSubmit={(e) => rejectTaxFile(e, fileToReject.id)}>
                                            <div className="flex flex-col p-2 w-full">
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-full">
                                                        <label htmlFor="tax_file_rejection_reason" className="my-2 text-gray-600">
                                                            Reason
                                                        </label>
                                                        <textarea
                                                            id="tax_file_rejection_reason"
                                                            rows={5}
                                                            placeholder="Define the reason for rejection"
                                                            className="form-input w-full"
                                                            name="address"
                                                            value={fileToReject.reason}
                                                            onChange={(e)=>setFileToReject({...fileToReject, reason: e.target.value})}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="m-4 flex expenses-center justify-end">
                                                <button onClick={() => setModal2(false)} type="reset" className="btn btn-outline-danger">
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
        </div>
    );
};

export default TaxFiles;
