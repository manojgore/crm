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
import IconPlusCircle from '../components/Icon/IconPlusCircle';
import IconEyeOpen from '../components/Icon/IconEyeOpen';
import IconEyeClosed from '../components/Icon/IconEyeClosed';
import {PLAN_STATUS} from "../utils/"
const col = ['company_name', 'company_email', 'company_address', 'city', 'state', 'country', 'pincode', 'phone_number', 'plan_type', 'registered_on', 'purchased_on', 'expiring_on'];;

const Projects = () => {
    const { download } = useDownloader();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Projects'));
    });
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);
    const [modal6, setModal6] = useState(false);
    const [modal7, setModal7] = useState(false);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState([]);
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [services, setServices] = useState([]);
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

    const PLAN_STATUS = {
        NOT_STARTED : "Not Started",
        IN_PROGRESS : "In Progress",
        ON_HOLD: "On Hold",
        CANCELLED : "Cancelled",
        FINISHED : "Finished"
    }

    const [Projects, setProjects] = useState([]);

    const [planValue, setPlanValue] = useState(new Map([]));
    const [packages, setPackages] = useState([]);
    const [customers, setCustomers] = useState([]);

    const fetchProjects = async () => {
        try {
          const response = await axios.get(`${api}/admin/getallProjects`, 
            {
                headers: {
                    id: localStorage.getItem("isAdmin") ? undefined : localStorage.getItem('customeridtaxrx'),
                }
            }
          );
    
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

    const fetchServices = async () => {
        try {
          const response = await axios.get(`${api}/api/items/getallservices`);
    
          console.log("Service result: ", response.data);
          if (response.data.success) {
            setServices(response.data.results);
          }
        } catch (error) {
          console.log("failed to fetch the service");
          console.error(error);
        }
    };

    const [itemMode, setItemMode] = useState('Product');
    const handleChangeItemMode = () => {
        if (itemMode === 'Product') {
            setItemMode('Service');
        } else {
            setItemMode('Product');
        }
    };

    const fetchPackages = async () => {
        try {
          const response = await axios.get(`${api}/admin/getallpackages`);
    
          console.log("Packages result: ", response.data);
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

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`${api}/api/customers/getallcustomers`);
            if (response.data.success) {
                setCustomers(response.data.results);
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
        fetchServices();
        fetchPackages();
        fetchProjects(); 
        fetchCustomers();       
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
    const header = ['company_name', 'company_email', 'company_address', 'city', 'state', 'country', 'pincode', 'phone_number', 'plan_type', 'registered_on', 'purchased_on', 'expiring_on'];

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
        for(let company of Projects){
            const tempRow = {};
            tempRow.company_name = company.company_name;
            tempRow.company_email = company.company_email;
            tempRow.company_address = company.company_address;
            tempRow.city = company.city;
            tempRow.state = company.state;
            tempRow.country = company.country;
            tempRow.pincode = company.pincode;
            tempRow.phone_number = company.phone_number;
            tempRow.plan_type = company.plan_type;
            tempRow.registered_on = company.registered_on;
            tempRow.purchased_on = company.purchased_on;
            tempRow.expiring_on = company.expiring_on;
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
        let records = Projects;
        let filename = 'table';

        let newVariable: any;
        newVariable = window.navigator;

        if (type === 'csv') {
            let coldelimiter = ';';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    if(d === 'company_name' || d === 'company_email' || d === 'company_address' || d === 'city' || d === 'state' || d === 'country' || d === 'pincode' || d === 'phone_number' || d === 'plan_type' || d === 'registered_on' || d === 'purchased_on' || d === 'expiring_on'){
                        return capitalize(d);
                    }
                    return;
                })
                .join(coldelimiter);
            result += linedelimiter;
            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                // eslint-disable-next-line array-callback-return
                columns.map((d: any, index: any) => {
                    if(d === 'company_name' || d === 'company_email' || d === 'company_address' || d === 'city' || d === 'state' || d === 'country' || d === 'pincode' || d === 'phone_number' || d === 'plan_type' || d === 'registered_on' || d === 'purchased_on' || d === 'expiring_on'){
                        if (index > 0) {
                            result += coldelimiter;
                        }
                        let val = item[d] ? item[d] : '';
                        result += val;
                    }
                    return; 
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
                if(d === 'company_name' || d === 'company_email' || d === 'company_address' || d === 'city' || d === 'state' || d === 'country' || d === 'pincode' || d === 'phone_number' || d === 'plan_type' || d === 'registered_on' || d === 'purchased_on' || d === 'expiring_on'){
                    rowhtml += '<th>' + capitalize(d) + '</th>';
                }
                return;
            });
            rowhtml += '</tr></thead>';
            rowhtml += '<tbody>';

            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                rowhtml += '<tr>';
                // eslint-disable-next-line array-callback-return
                columns.map((d: any) => {
                    if(d === 'company_name' || d === 'company_email' || d === 'company_address' || d === 'city' || d === 'state' || d === 'country' || d === 'pincode' || d === 'phone_number' || d === 'plan_type' || d === 'registered_on' || d === 'purchased_on' || d === 'expiring_on'){
                        let val = item[d] ? item[d] : '';
                        rowhtml += '<td>' + val + '</td>';
                    }
                    return;
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
                    if(d === 'company_name' || d === 'company_email' || d === 'company_address' || d === 'city' || d === 'state' || d === 'country' || d === 'pincode' || d === 'phone_number' || d === 'plan_type' || d === 'registered_on' || d === 'purchased_on' || d === 'expiring_on'){
                        return capitalize(d);
                    }
                    return;
                })
                .join(coldelimiter);
            result += linedelimiter;
            // eslint-disable-next-line array-callback-return
            records.map((item: any) => {
                // eslint-disable-next-line array-callback-return
                columns.map((d: any, index: any) => {
                    if(d === 'company_name' || d === 'company_email' || d === 'company_address' || d === 'city' || d === 'state' || d === 'country' || d === 'pincode' || d === 'phone_number' || d === 'plan_type' || d === 'registered_on' || d === 'purchased_on' || d === 'expiring_on'){
                        if (index > 0) {
                            result += coldelimiter;
                        }
                        let val = item[d] ? item[d] : '';
                        result += val;
                    }
                    return;
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

    const [editCompanyData, setEditCompanyData] = useState({
        ownerId:null,
        projectName: "",
        projectDetails:"",
        planType: "",
        plan: 0,
        purchased_on: "",
        expiring_on: "",
        plan_status:""
    });

    const [editCompanyPassView, setEditCompanyPassView] = useState(false);
    const toggleEditCompanyPassView = () => {
        if(editCompanyPassView){
            setEditCompanyPassView(false);
        }else{
            setEditCompanyPassView(true);
        }
    }

    const handleChangeEdit = (e) => {
        let expiringOn = new Date(editCompanyData.purchased_on);
        if (e.target.name === "planType" && e.target.value !== "All Plans") {
            const daysToAdd =  Number(e.target.value.split(" ").at(-1));
            expiringOn.setDate(expiringOn.getDate() + daysToAdd);
            setEditCompanyData({ ...editCompanyData, [e.target.name]: e.target.value, expiring_on: `${expiringOn.toISOString()}` });
        } else if (e.target.name === "planType" && e.target.value === "All Plans") {
          setEditCompanyData({ ...editCompanyData, plan: 0 });
        } else {
            setEditCompanyData({ ...editCompanyData, [e.target.name]: e.target.value});
        }
    };

    const handleEditCompany = async (e) => {
        e.preventDefault();
        // console.log(new Date(new Date(editCompanyData.purchased_on).getTime() + days.get(formdata.plan_type.split(" ")[0]) * 24 * 60 * 60 * 1000))
        try {
          const response = await axios.put(`${api}/admin/editCompany`, {
            project_name:editCompanyData.projectName,
            project_details:editCompanyData.projectDetails,
            planType: editCompanyData.planType,
            plan_status: editCompanyData.plan_status || PLAN_STATUS.NOT_STARTED,
            id: localStorage.getItem("isAdmin") ? editCompanyData.ownerId : localStorage.getItem("customeridtaxrx"),
            purchased_on: editCompanyData.purchased_on,
            expiring_on: editCompanyData.expiring_on  
          });
          if (response.data.success) {
            showAlert("Project/Service Edited Successfully");
            setModal6(false);
            setModal7(false);
            fetchProjects();
          } else {
            showAlert("Company Can not be Edited");
          }
          setEditCompanyData({
            projectName: "",
            projectDetails: "",
            phoneNumber: "",
            website: "",
            password: "",
            confirmPassword: "",
            address: "",
            planType: "",
            plan: 0,
            purchased_on: "",
            expiring_on: "",
            plan_status:""
          });
          setEditCompanyPassView(false);
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
            showAlert("Project Deleted Successfully");
            fetchProjects();
            setModal2(false);
          } else {
            showAlert("Project Can not be Deleted");
          }
        } catch (error) {
          console.log("failed to delete Project");
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

    const loginToCompany = (id) => {
        localStorage.removeItem("adminidtaxrx");
        localStorage.removeItem("customeridtaxrx");
        localStorage.setItem("customeridtaxrx", id);
        window.open("/user-dashboard", "_blank");
    };


    const [formdata, setFormdata] = useState({
        project_details:"",
        project_name:"",
        username: "",
        phoneNumber: "",
        mobileOtp: "",
        email: "",
        emailOtp: 0,
        password: "",
        emailverified: 1,
        confirmPassword: "",
        id: "",
        company_address: "",
        company_email: "",
        address_line_1: "",
        address_line_2: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        plan: 0,
        plan_type: "",
        company_website: "",
        registered_on: "",
        purchased_on: "",
        expiring_on: "",
        cust_id:null
    });
    const [passwordMatchError, setPasswordMatchError] = useState("");
    const handleChange = (e) => {
        setFormdata({ ...formdata, [e.target.name]: e.target.value });
    };
    const handleAddCompany = async (e) => {
        e.preventDefault();
        const currentDate = new Date();
        const daysToAdd =  Number(formdata.plan_type.split(" ").at(-1));
        console.log("company adding");
        try {
          const response = await axios.post(`${api}/admin/addCompany`, {
            project_name:formdata.project_name,
            project_details:formdata.project_details,
            id:formdata.cust_id,
            plan_type: formdata.plan_type,
            registered_on: new Date(),
            purchased_on: formdata.plan_type === "" ? null : new Date(),
            expiring_on:
              formdata.plan_type === ""
                ? null
                : new Date(currentDate.setDate(currentDate.getDate() + daysToAdd)).toISOString(),
          });
          console.log(response.data); // For debugging purposes
          // Handle successful registration (e.g., redirect to a success page)
          showAlert("Project added successful!");
          console.log("customer id: ", response.data.customerId);
          if (response.data.result !== 0) {
            showAlert("registered successfully");
            setModal3(false);
            fetchProjects();
          } else {
            showAlert("something went wrong");
          }
          setFormdata({
            username: "",
            project_details:"",
            project_name:"",
            phoneNumber: "",
            mobileOtp: "",
            email: "",
            emailOtp: 0,
            password: "",
            emailverified: 1,
            confirmPassword: "",
            id: "",
            company_address: "",
            company_email: "",
            address_line_1: "",
            address_line_2: "",
            country: "",
            state: "",
            city: "",
            pincode: "",
            plan: 0,
            plan_type: "",
            company_website: "",
            registered_on: "",
            purchased_on: "",
            expiring_on: "",
          });
        } catch (error) {
          console.error("Error registering customer:", error);
          // Handle errors (e.g., display error message to the user)
          showAlert("Registration failed. Please try again", "red");
        }
    };

    const getPlanStatusClass = (plan_status:string) => {
        switch (plan_status) {
          case PLAN_STATUS.NOT_STARTED:
            return 'bg-gray-200 text-gray-500';  // Not Started
          case PLAN_STATUS.IN_PROGRESS:
            return 'bg-blue-200 text-blue-500';  // In Progress
          case PLAN_STATUS.ON_HOLD:
            return 'bg-yellow-200 text-yellow-500';  // On Hold
          case PLAN_STATUS.CANCELLED:
            return 'bg-red-200 text-red-500';  // Cancelled
          case PLAN_STATUS.FINISHED:
            return 'bg-green-200 text-green-500';  // Finished
          default:
            return 'bg-gray-100 text-gray-400';  // Default for unknown statuses
        }
      };

    const [emailCannotChangeMsg, setEmailCannotChangeMsg] = useState('');

    return (
        <div>
            <h1 className='text-4xl font-semibold'>All Projects</h1>
            <p>All registered Projects</p>
            
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
                        <button type="button" onClick={() => setModal3(true)} className="btn btn-primary btn-sm m-1">
                            <IconPrinter className="ltr:mr-2 rtl:ml-2" />
                            Add Project
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
                            { accessor: 'project_name', title: 'Project Name', sortable: false },
                            { accessor: 'project_details', title: 'Project Description', sortable: false },
                            { accessor: 'plan_type', title: 'Plan Type', sortable: false },
                            { accessor: 'name', title: 'Name', sortable: false },
                            { accessor: 'email', title: 'Email', sortable: false },
                            { accessor: 'number', title: 'Mobile No', sortable: false },
                            // { accessor: 'plan_type', title: 'Plan Type', sortable: false },
                            {
                                accessor: 'purchased_on',
                                title: 'Created on',
                                sortable: true,
                                render: ({ purchased_on }) => <p>{`${new Date(purchased_on).getDate()} ${months.get(new Date(purchased_on).getMonth() + 1)} ${new Date(purchased_on).getFullYear()}`}</p>
                            },
                            {
                                accessor: 'expiring_on',
                                title: 'Expiring on',
                                sortable: true,
                                render: ({ expiring_on }) => <p>{`${new Date(expiring_on).getDate()} ${months.get(new Date(expiring_on).getMonth() + 1)} ${new Date(expiring_on).getFullYear()}`}</p>
                            },
                            {
                                accessor: 'plan_status',
                                title: 'Status',
                                render: ({ plan_status }) => (
                                    <span className={`${getPlanStatusClass(plan_status)} py-1 px-2 rounded-md`}>
                                        {plan_status}
                                    </span>
                                ),
                            },
                            {
                                accessor: 'Projects Action',
                                render: ({ id, company_name,plan_status, company_email, company_website, password, company_address, plan_type, plan, purchased_on, expiring_on, project_name, project_details}) => (
                                    <div className="flex w-full justify-around expenses-center">
                                        <Tippy content="Delete">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCompanyId(id);
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
                                                    setEditCompanyData({
                                                        projectName: project_name,
                                                        projectDetails: project_details,
                                                        planType: plan_type,
                                                        plan_status: plan_status,
                                                        ownerId:id,
                                                        expiring_on: expiring_on,
                                                        purchased_on: purchased_on
                                                    });
                                                    setModal6(true);
                                                }}
                                            >
                                                <IconEdit className="m-auto" />
                                            </button>
                                        </Tippy>
                                        {localStorage.getItem("isAdmin") && (<Tippy content="Cancel Plan">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    cancellSubscription(id)
                                                }
                                            >
                                                <IconCancel className="m-auto" />
                                            </button>
                                        </Tippy>)}
                                        {/* <Tippy content="Login to Company">
                                            <button
                                                type="button"
                                                onClick={() => loginToCompany(id)}
                                            >
                                                <IconLogin2 className="m-auto" />
                                            </button>
                                        </Tippy> */}
                                        {localStorage.getItem("isAdmin") && (
                                            <Tippy content="Change Plan">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditCompanyData({
                                                        projectName: project_name,
                                                        projectDetails: project_details,
                                                        planType: plan_type,
                                                        plan: plan,
                                                        purchased_on: purchased_on,
                                                        expiring_on: expiring_on,
                                                        ownerId:id
                                                    });
                                                    setModal7(true);
                                                }}
                                            >
                                                <IconChangePlan className="m-auto" />
                                            </button>
                                        </Tippy>
                                        )}
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

            {/* {Delete Company Modal} */}
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

            {/* {Edit Company Modal} */}
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
                                        <h5 className="text-lg font-bold">Edit Project</h5>
                                        <button onClick={() => {
                                            setModal6(false);
                                            setEditCompanyPassView(false);
                                        }} type="button" className="text-white-dark hover:text-dark">
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-2">
                                        <form onSubmit={(e) => handleEditCompany(e)}>
                                            <div className="flex flex-col p-2 w-full">
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[100%]">
                                                        <label htmlFor="company_name" className="my-2 text-gray-600">
                                                            Project Name
                                                        </label>
                                                        <input
                                                            id="company_name"
                                                            type="text"
                                                            className="form-input w-full"
                                                            name="projectName"
                                                            value={editCompanyData.projectName}
                                                            onChange={handleChangeEdit}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-full">
                                                        <label htmlFor="project_details" className="my-2 text-gray-600">
                                                            Project Details
                                                        </label>
                                                        <textarea
                                                            id="project_details"
                                                            rows={5}
                                                            className="form-input w-full"
                                                            name="projectDetails"
                                                            value={editCompanyData.projectDetails}
                                                            onChange={handleChangeEdit}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[100%]">
                                                        <label htmlFor="company_choose_plan" className="my-2 text-gray-600">
                                                            Choose Project/Service
                                                        </label>
                                                        <select
                                                        id="company_choose_plan"
                                                        className="form-select text-white-dark"
                                                        name="planType"
                                                        disabled={true}
                                                        value={editCompanyData.planType}
                                                        onChange={handleChangeEdit}
                                                        >
                                                        <option>Select Project</option>
                                                            {packages.map((pkg:any, i):any => {
                                                            return (
                                                            <option key={i} value={`${pkg.Type} ${pkg.Duration}`}>
                                                                {pkg.Type} {pkg.Duration} Days
                                                            </option>
                                                            );
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[100%]">
                                                        <label htmlFor="choose_plan_status" className="my-2 text-gray-600">
                                                            Choose Status
                                                        </label>
                                                        <select
                                                        id="choose_plan_status"
                                                        className="form-select text-white-dark"
                                                        name="plan_status"
                                                        value={editCompanyData.plan_status}
                                                        onChange={handleChangeEdit}
                                                        >
                                                        <option>Select Status</option>
                                                        {Object.values(PLAN_STATUS).map((plan_state:string, i):any => {
                                                            return (
                                                            <option key={i} value={plan_state}>
                                                                {plan_state}
                                                            </option>
                                                            );
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="m-4 flex expenses-center justify-end">
                                                <button onClick={() => {
                                                    setModal6(false);
                                                    setEditCompanyPassView(false);
                                                }} type="reset" className="btn btn-outline-danger">
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
                                        <h5 className="text-lg font-bold">Change Plan</h5>
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
                                                        Project Name
                                                    </p>
                                                    <p className="w-full">{editCompanyData.projectName}</p>
                                                </div>
                                                <div className="flex flex-col mx-4 my-2 w-[80%]">
                                                    <p className="my-2 text-gray-600 font-semibold">
                                                        Project Details
                                                    </p>
                                                    <p className="w-full">{editCompanyData.projectDetails}</p>
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
                                        <form onSubmit={(e)=>handleEditCompany(e)}>
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
                                                            disabled={localStorage.getItem("isAdmin") ? false : true}
                                                            value={editCompanyData.planType}
                                                            onChange={handleChangeEdit}
                                                            >
                                                            <option>Select Project</option>
                                                            {packages.map((pkg:any, i):any => {
                                                                return (
                                                                <option key={i} value={`${pkg.Type} ${pkg.Duration}`}>
                                                                    {pkg.Type} {pkg.Duration} Days
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
                                                            onChange={(date:any) => {
                                                                const daysToAdd =  Number(editCompanyData.planType.split(" ").at(-1));
                                                                let selectedDate = new Date(date);
                                                                selectedDate.setDate(selectedDate.getDate() + daysToAdd)
                                                                setEditCompanyData({
                                                                    ...editCompanyData,
                                                                    purchased_on: new Date(date).toISOString(),
                                                                    expiring_on: `${selectedDate.toISOString()}`
                                                                })
                                                                }
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

            {/* { Add Projects Modal } */}
            <Transition appear show={modal3} as={Fragment}>
                <Dialog as="div" open={modal3} onClose={() => setModal3(false)}>
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
                                <Dialog.Panel className="panel my-8 w-full max-w-xl overflow-hidden  rounded-lg border-0 p-0 text-black dark:text-white-dark h-[90svh] overflow-y-scroll">
                                    <div className="flex expenses-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold">Add Project / Service</h5>
                                        <button onClick={() => setModal3(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-2">
                                        <form onSubmit={handleAddCompany}>
                                            <div className="flex flex-col p-2 w-full">
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-[100%]">
                                                        <label htmlFor="company_name" className="my-2 text-gray-600">
                                                            Project Name
                                                        </label>
                                                        <input
                                                            id="company_name"
                                                            type="text"
                                                            className="form-input w-full"
                                                            name="project_name"
                                                            value={formdata.project_name}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between expenses-center w-full">
                                                    <div className="flex flex-col mx-4 my-2 w-full">
                                                        <label htmlFor="project_details" className="my-2 text-gray-600">
                                                            Project Details
                                                        </label>
                                                        <textarea
                                                            id="project_details"
                                                            rows={5}
                                                            className="form-input w-full"
                                                            name="project_details"
                                                            value={formdata.project_details}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between expenses-center w-full">                                       
                                                <div className="flex flex-col mx-4 my-2 w-[100%]">
                                                    <label htmlFor="company_choose_plan" className="my-2 text-gray-600">
                                                        Choose Service/Project
                                                    </label>
                                                        <select
                                                        id="company_choose_plan"
                                                        className="form-select text-white-dark"
                                                        name="plan_type"
                                                        value={formdata.plan_type}
                                                        onChange={handleChange}
                                                        >
                                                        <option>Select Service</option>
                                                        {packages.map((pkg:any, i):any => {
                                                            return (
                                                            <option key={i} value={`${pkg.Type} ${pkg.Duration}`}>
                                                                {pkg.Type} {pkg.Duration} Days
                                                            </option>
                                                            );
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col mx-4 my-2 w-[100%]">
                                                    <label htmlFor="company_choose_plan" className="my-2 text-gray-600">
                                                        Select Customer
                                                    </label>
                                                        <select
                                                        id="company_choose_plan"
                                                        className="form-select text-white-dark"
                                                        name="cust_id"
                                                        value={formdata.cust_id}
                                                        onChange={handleChange}
                                                        >
                                                        <option>Select Service</option>
                                                        {customers.map((cust:any, i):any => {
                                                            return (
                                                            <option key={i} value={cust.owner_id}>
                                                                {cust.name}
                                                            </option>
                                                            );
                                                            })}
                                                        </select>
                                                </div>
                                            </div>
                                            <div className="m-4 flex expenses-center justify-end">
                                                <button onClick={() => setModal3(false)} type="reset" className="btn btn-outline-danger">
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                    Add Project
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

export default Projects;
