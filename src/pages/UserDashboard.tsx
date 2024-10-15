import IconTrendingUp from '../components/Icon/IconTrendingUp';
import Dropdown from '../components/Dropdown';
import IconHorizontalDots from '../components/Icon/IconHorizontalDots';
import { useSelector } from 'react-redux';
import IconCreditCard from '../components/Icon/IconCreditCard';
import IconTag from '../components/Icon/IconTag';
import IconInbox from '../components/Icon/IconInbox';
import { Fragment, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import IconLayoutGrid from '../components/Icon/IconLayoutGrid';
import IconUsersGroup from '../components/Icon/IconUsersGroup';
import IconMultipleForwardRight from '../components/Icon/IconMultipleForwardRight';
import IconChatDots from '../components/Icon/IconChatDots';
import IconLink from '../components/Icon/IconLink';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '../utils/apiProvider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '../components/Icon/IconX';
import IconArrowLeft from '../components/Icon/IconArrowLeft';

const UserDashboard = () => {
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
        ['Monthly', 30],
        ['Weekly', 7],
        ['Half Yearly', 180],
        ['Yearly', 365],
    ]);

    const planTypeCount = (Projects:any) => {
        let prevcount = 0;
        let planType = '';
        let mostUsed = '';
        for (let company of Projects) {
            let count = 0;
            if (company.plan === 1) {
                planType = company.plan_type;
            }
            for (let c of Projects) {
                if (c.plan_type === planType) {
                    count = count + 1;
                }
            }
            if (count > prevcount) {
                prevcount = count;
                mostUsed = planType;
            }
        }

        return [mostUsed, prevcount];
    };

    const [Projects, setProjects] = useState([]);
    const [activeUsers, setActiveUsers] = useState(0);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const [loading] = useState(false);

    const [expenseCancelled, setExpenseCancelled] = useState(0);
    const [expensePending, setExpensePending] = useState(0);
    const [expensePaid, setExpensePaid] = useState(0);

    const calculateExpenseNumberByCategory = (expences) => {
        let expnCancelled = 0;
        let expnPending = 0;
        let expnPaid = 0;

        for (let expence of expences) {
            if (expence.Payment_Status === 'Paid') {
                expnPaid = expnPaid + 1;
            } else if (expence.Payment_Status === 'Pending') {
                expnPending = expensePending + 1;
            } else {
                expnCancelled = expnCancelled + 1;
            }
        }

        setExpensePaid(expnPaid);
        setExpenseCancelled(expnCancelled);
        setExpensePending(expnPending);
    };

    const salesByCategory: any = {
        series: [expensePaid, expensePending, expenseCancelled],
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#24b500', '#fed400', '#fe0000', '#e2a03f'] : ['#24b500', '#fed400', '#fe0000'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Paid', 'Pending', 'Cancelled'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };

    const [salesAnlMode, setSalesAnlMode] = useState('All Time');

    const handleChangeSaleAnMode = (mode) => {
        let total = calculateTotalInvoiceAmnt(invoices, mode);
        setTotalAmount(total);
        let totalExpenses = calculateTotalExpenseAmnt(expenses, mode);
        setTotalAmountExpenses(totalExpenses);
        setSalesAnlMode(mode);
    };

    const [invoices, setInvoices] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const calculateTotalInvoiceAmnt = (invoices, mode) => {
        let t = 0;

        invoices.forEach((element) => {
            if (mode === 'All Time') {
                t = t + element.final_amount;
            } else if (mode === 'Last Month') {
                if (new Date(element.invoice_date).getTime() >= new Date().getTime() - 30 * 24 * 60 * 60 * 1000) {
                    t = t + element.final_amount;
                }
            } else if (mode === 'Last Year') {
                if (new Date(element.invoice_date).getTime() >= new Date().getTime() - 365 * 24 * 60 * 60 * 1000) {
                    t = t + element.final_amount;
                }
            }
        });

        return t;
    };

    const calculateTotalExpenseAmnt = (expences, mode) => {
        let t = 0;
        expences.forEach((element) => {
            if (mode === 'All Time') {
                if (element.Payment_Status !== 'Cancelled') {
                    t = t + element.Amount;
                }
            } else if (mode === 'Last Month') {
                if (new Date(element.Expense_Date).getTime() >= new Date().getTime() - 30 * 24 * 60 * 60 * 1000) {
                    if (element.Payment_Status !== 'Cancelled') {
                        t = t + element.Amount;
                    }
                }
            } else if (mode === 'Last Year') {
                if (new Date(element.Expense_Date).getTime() >= new Date().getTime() - 365 * 24 * 60 * 60 * 1000) {
                    if (element.Payment_Status !== 'Cancelled') {
                        t = t + element.Amount;
                    }
                }
            }
        });
        console.log('total expense amount: ', t);
        return t;
    };

    const calculateTotalAmountGrowth = (invoices, total) => {
        let thisWeekCount = 0;
        for (let invoice of invoices) {
            if (new Date(invoice.invoice_date).getTime() >= new Date().getTime() - 7 * 24 * 60 * 60 * 1000) {
                thisWeekCount = thisWeekCount + invoice.taxable_value;
            }
        }

        return ((thisWeekCount / total) * 100).toFixed(2);
    };

    const calculateInvoiceGrowth = (invoices) => {
        let thisWeekCount = 0;
        for (let invoice of invoices) {
            if (new Date(invoice.invoice_date).getTime() >= new Date().getTime() - 7 * 24 * 60 * 60 * 1000) {
                thisWeekCount = thisWeekCount + 1;
            }
        }

        return ((thisWeekCount / invoices.length) * 100).toFixed(2);
    };

    const [modal2, setModal2] = useState(false);

    const [expenses, setExpenses] = useState([]);
    const [totalAmountExpenses, setTotalAmountExpenses] = useState(0);

    const calcutateExpensesStatus = (expenses) => {
        let statusCount = {
            paid: 0,
            pending: 0,
            cancelled: 0,
        };

        for (let expense of expenses) {
            if (expense.Payment_Status === 'Paid') {
                statusCount.paid++;
            } else if (expense.Payment_Status === 'Pending') {
                statusCount.pending++;
            } else if (expense.Payment_Status === 'Cancelled') {
                statusCount.cancelled++;
            }
        }

        return statusCount;
    };

    const calculateExpensesGrowth = (expences) => {
        let thisWeekCount = 0;
        for (let expence of expences) {
            if (new Date(expence.Expense_Date).getTime() >= new Date().getTime() - 7 * 24 * 60 * 60 * 1000) {
                thisWeekCount = thisWeekCount + 1;
            }
        }

        return ((thisWeekCount / expences.length) * 100).toFixed(2);
    };

    const calculateCustomersGrowth = (customers) => {
        let thisWeekCount = 0;
        for (let customer of customers) {
            if (new Date(customer.registration_date).getTime() >= new Date().getTime() - 7 * 24 * 60 * 60 * 1000) {
                thisWeekCount = thisWeekCount + 1;
            }
        }

        return ((thisWeekCount / customers.length) * 100).toFixed(2);
    };

    const [customers, setCustomers] = useState([]);
    const [customersGrwth, setCustomersGrwth] = useState(0);

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`${api}/api/customers/getallcustomers`, {
                headers: {
                    id: localStorage.getItem('customeridtaxrx'),
                },
            });

            console.log('members result: ', response.data);
            if (response.data.success) {
                setCustomers(response.data.results);
                let cusgrth = calculateCustomersGrowth(response.data.results);
                setCustomersGrwth(cusgrth);
            }
        } catch (error) {
            console.log('failed to fetch the customers');
            console.error(error);
        }
    };

    const MySwal = withReactContent(Swal);

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

    const [subscribed, setSubscribed] = useState(false);
    const [subsCriptionType, setSubsCriptionType] = useState('');
    const [packages, setPackages] = useState([]);
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

    const [freeTaxFiled, setFreeTaxFiled] = useState(false);

    const checkSubscription = async () => {
        try {
            const response = await axios.post(`${api}/customer/checksubscription`, {
                id: localStorage.getItem('customeridtaxrx'),
            });
            console.log('subscription status: ', response.data);
            if (response.data.subscribed) {
                setSubscribed(true);
                setSubsCriptionType(response.data.plan_type);
                if (response.data.freetaxfiled === 1) {
                    setFreeTaxFiled(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const makePayment = async (id, planPrice) => {
        console.log('planPrice: ', planPrice);
        try {
            const response = await axios.get(`${api}/api/user/initiatepayment`, {
                headers: {
                    id: id,
                    planPrice: planPrice,
                },
            });
            console.log('payment response: ', response.data);
            if (response.data.success) {
                window.location.href = response.data.url;
            } else {
                showAlert('Error redirecting to the payment page');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const PurchasePlan = async (plan) => {
        console.log('first');
        if (plan.Price === '0' || plan.Price === '0.00') {
            const response = await axios.put(`${api}/api/user/subscribe`, {
                id: localStorage.getItem('customeridtaxrx'),
                planType: plan.Duration + ' ' + plan.Type,
                purchased_on: new Date(),
                expiring_on: new Date(new Date().getTime() + days.get(plan.Duration) * 24 * 60 * 60 * 1000),
            });
            if (response.data.success) {
                setSubscribed(true);
                setSubsCriptionType(plan.Duration + ' ' + plan.Type);
                showAlert('plan subscribed');
            } else {
                showAlert('plan not subscribed');
            }
        } else {
            makePayment(localStorage.getItem('customeridtaxrx'), parseInt(plan.Price));
            sessionStorage.setItem('plantypetaxrx', plan.Type + ' ' + plan.Duration);
            sessionStorage.setItem('plandurationtaxrx', plan.Duration);
        }
    };

    const [taxFileData, settaxFileData] = useState({
        id: localStorage.getItem('customeridtaxrx'),
        file: '',
        type: '',
    });
    const [taxFiled, setTaxFiled] = useState(false);

    const taxFileDataOnChange = (e) => {
        if (e.target.name === 'file') {
            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = () => {
                settaxFileData({ ...taxFileData, file: reader.result });
            };
        }
        settaxFileData({ ...taxFileData, [e.target.name]: e.target.value });
    };

    const handleTaxFileSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${api}/api/user/taxFile`, {
                id: taxFileData.id,
                file: taxFileData.file,
                type: taxFileData.type,
                free: !freeTaxFiled,
            });
            console.log('taxfile result: ', response.data.results);
            if (response.data.success) {
                settaxFileData({
                    id: localStorage.getItem('customeridtaxrx'),
                    file: '',
                    type: '',
                });
                document.getElementById('taxfileinput').value = '';
                showAlert('tax filed successfully');
                setTaxFiled(true);
                setModal2(false);
            } else {
                showAlert(response.data.error);
            }
        } catch (error) {
            console.log(error);
            showAlert('something went wrong');
        }
    };

    const checkTaxFileStatus = async () => {
        try {
            const response = await axios.get(`${api}/api/user/checktaxfile`, {
                headers: {
                    id: localStorage.getItem('customeridtaxrx'),
                },
            });
            console.log('taxfile status: ', response.data);
            if (response.data.taxfiled) {
                setTaxFiled(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchMembers();
        fetchPackages();
        checkSubscription();
        checkTaxFileStatus();
    }, []);

    return (
        <>
            

            {subscribed && (
                <div>
                    <h1 className="text-4xl font-semibold">Dashboard</h1>
                    <div className="w-full flex-col md:flex-row flex items-center justify-between md:h-[35svh] my-4">
                    <div className="flex items-center justify-between border-2 border-primary rounded-md h-full p-5 w-full md:w-[45%]">
                        <div className="md:h-full h-[10svh] flex flex-col items-center justify-between">
                            <span className="flex flex-col justify-start items-start">
                                <span className="flex justify-start items-center">
                                    <IconLayoutGrid className="mr-2" />
                                    <h3 className="text-lg md:text-2xl text-gray-500 font-semibold">Good Morning, Admin !!</h3>
                                </span>
                                <p className='text-xs'>Get controll over your Project here.</p>
                            </span>
                            <div className="flex w-full">
                                <span className="flex justify-start items-center">
                                    <button className="md:py-2 py-1 px-1 md:px-3 mr-2 bg-primary text-white rounded-md border-2 border-primary" onClick={()=>navigate('/admin-projects')}>View Projects</button>
                                    <button className="md:py-2 py-1 px-1 md:px-3 ml-2 bg-white text-primary border-2 border-primary rounded-md" onClick={()=>navigate('/admin-plans')}>All Packages</button>
                                </span>
                            </div>
                        </div>
                        <span className="justify-end items-center w-[30%] md:w-[40%] flex">
                            <img src="/assets/images/stat-adm-dashboard.png" alt="" />
                        </span>
                    </div>
                    <div className="panel h-full p-0 mx-2 w-full md:w-[18%]">
                        <div className="flex p-5">
                            <div className="shrink-0 bg-primary/10 text-primary rounded-xl w-11 h-11 flex justify-center items-center dark:bg-primary dark:text-white-light">
                                <IconUsersGroup className="w-5 h-5" />
                            </div>
                            <div className="ltr:ml-3 rtl:mr-3 font-semibold">
                                <p className="text-xl dark:text-white-light">{Projects.length}</p>
                                <h5 className="text-[#506690] text-xs">Total Projects</h5>
                            </div>
                        </div>
                        <div className="h-40">
                            <ReactApexChart
                                series={[{ data: [Projects.filter((company)=> { return new Date(company.registered_on).getTime() >= new Date().getTime() - 30 * 24 * 60 * 60 * 1000 }).length, Projects.filter((company)=> { return new Date(company.registered_on).getTime() >= new Date().getTime() - 15 * 24 * 60 * 60 * 1000 }).length, Projects.filter((company)=> { return new Date(company.registered_on).getTime() >= new Date().getTime() - 10 * 24 * 60 * 60 * 1000 }).length, Projects.filter((company)=> { return new Date(company.registered_on).getTime() >= new Date().getTime() - 5 * 24 * 60 * 60 * 1000 }).length, Projects.filter((company)=> { return new Date(company.registered_on).getTime() >= new Date().getTime() - 1 * 24 * 60 * 60 * 1000 }).length] }]}
                                options={{
                                    chart: {
                                        height: 160,
                                        type: 'area',
                                        fontFamily: 'Nunito, sans-serif',
                                        sparkline: {
                                            enabled: true,
                                        },
                                    },
                                    stroke: {
                                        curve: 'smooth',
                                        width: 2,
                                    },
                                    colors: ['#4361ee'],
                                    grid: {
                                        padding: {
                                            top: 5,
                                        },
                                    },
                                    yaxis: {
                                        show: false,
                                    },
                                    tooltip: {
                                        x: {
                                            show: false,
                                        },
                                        y: {
                                            title: {
                                                formatter: () => {
                                                    return '';
                                                },
                                            },
                                        },
                                    },
                                }}
                                type="area"
                                height={160}
                                className="w-full absolute bottom-0 overflow-hidden"
                            />
                        </div>
                    </div>

                    <div className="panel h-full p-0 mx-2 w-full md:w-[18%]">
                        <div className="flex p-5">
                            <div className="shrink-0 bg-success/10 text-success rounded-xl w-11 h-11 flex justify-center items-center dark:bg-success dark:text-white-light">
                                <IconChatDots className="w-5 h-5" />
                            </div>
                            <div className="ltr:ml-3 rtl:mr-3 font-semibold">
                                <p className="text-xl dark:text-white-light">{activeUsers}</p>
                                <h5 className="text-[#506690] text-xs">Active Projects</h5>
                            </div>
                        </div>
                        <div className="h-40">
                            <ReactApexChart
                                series={[{ data: [Projects.filter((company)=> { return company.purchased_on ? new Date(company.purchased_on).getTime() >= new Date().getTime() - 30 * 24 * 60 * 60 * 1000 : false }).length, Projects.filter((company)=> { return company.purchased_on ? new Date(company.purchased_on).getTime() >= new Date().getTime() - 15 * 24 * 60 * 60 * 1000 : false }).length, Projects.filter((company)=> { return company.purchased_on ? new Date(company.purchased_on).getTime() >= new Date().getTime() - 10 * 24 * 60 * 60 * 1000 : false }).length, Projects.filter((company)=> { return company.purchased_on ? new Date(company.purchased_on).getTime() >= new Date().getTime() - 5 * 24 * 60 * 60 * 1000 : false }).length, Projects.filter((company)=> { return company.purchased_on ? new Date(company.purchased_on).getTime() >= new Date().getTime() - 1 * 24 * 60 * 60 * 1000 : false }).length]}]}
                                options={{
                                    chart: {
                                        height: 160,
                                        type: 'area',
                                        fontFamily: 'Nunito, sans-serif',
                                        sparkline: {
                                            enabled: true,
                                        },
                                    },
                                    stroke: {
                                        curve: 'smooth',
                                        width: 2,
                                    },
                                    colors: ['#1abc9c'],
                                    grid: {
                                        padding: {
                                            top: 5,
                                        },
                                    },
                                    yaxis: {
                                        show: false,
                                    },
                                    tooltip: {
                                        x: {
                                            show: false,
                                        },
                                        y: {
                                            title: {
                                                formatter: () => {
                                                    return '';
                                                },
                                            },
                                        },
                                    },
                                }}
                                type="area"
                                height={160}
                                className="w-full absolute bottom-0 overflow-hidden"
                            />
                        </div>
                    </div>

                    <div className="panel h-full p-0 mx-2 w-full md:w-[18%]">
                        <div className="flex p-5">
                            <div className="shrink-0 bg-danger/10 text-danger rounded-xl w-11 h-11 flex justify-center items-center dark:bg-danger dark:text-white-light">
                                <IconLink className="w-5 h-5" />
                            </div>
                            <div className="ltr:ml-3 rtl:mr-3 font-semibold">
                                <p className="text-xl dark:text-white-light">{Projects.length - activeUsers}</p>
                                <h5 className="text-[#506690] text-xs">Inactive Projects</h5>
                            </div>
                        </div>
                        <div className="h-40">
                            <ReactApexChart
                                series={[{ data: [Projects.filter((company)=> { return new Date(company.registered_on).getTime() >= new Date().getTime() - 30 * 24 * 60 * 60 * 1000 && company.plan !==1 }).length, Projects.filter((company)=> { return new Date(company.registered_on).getTime() >= new Date().getTime() - 15 * 24 * 60 * 60 * 1000 && company.plan !==1 }).length, Projects.filter((company)=> { return new Date(company.registered_on).getTime() >= new Date().getTime() - 10 * 24 * 60 * 60 * 1000 && company.plan !==1 }).length, Projects.filter((company)=> { return new Date(company.registered_on).getTime() >= new Date().getTime() - 5 * 24 * 60 * 60 * 1000 && company.plan !==1 }).length, Projects.filter((company)=> { return new Date(company.registered_on).getTime() >= new Date().getTime() - 1 * 24 * 60 * 60 * 1000 && company.plan !==1 }).length] }]}
                                options={{
                                    chart: {
                                        height: 160,
                                        type: 'area',
                                        fontFamily: 'Nunito, sans-serif',
                                        sparkline: {
                                            enabled: true,
                                        },
                                    },
                                    stroke: {
                                        curve: 'smooth',
                                        width: 2,
                                    },
                                    colors: ['#e7515a'],
                                    grid: {
                                        padding: {
                                            top: 5,
                                        },
                                    },
                                    yaxis: {
                                        show: false,
                                    },
                                    tooltip: {
                                        x: {
                                            show: false,
                                        },
                                        y: {
                                            title: {
                                                formatter: () => {
                                                    return '';
                                                },
                                            },
                                        },
                                    },
                                }}
                                type="area"
                                height={160}
                                className="w-full absolute bottom-0 overflow-hidden"
                            />
                        </div>
                    </div>
                </div>
                    {/*<div className="flex justify-between flex-col md:flex-row my-4">
                        <div className="panel h-full w-full md:w-[70%] mr-4">
                            <div className="flex items-center justify-between dark:text-white-light mb-5">
                                <h5 className="font-semibold text-lg">Summary</h5>

                                <div className="dropdown">
                                    <Dropdown
                                        offset={[0, 5]}
                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                        btnClassName="hover:text-primary"
                                        button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                    >
                                        <ul>
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleChangeSaleAnMode('All Time');
                                                    }}
                                                >
                                                    All Time
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleChangeSaleAnMode('Last Month');
                                                    }}
                                                >
                                                    Last Month
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleChangeSaleAnMode('Last Year');
                                                    }}
                                                >
                                                    Last Year
                                                </button>
                                            </li>
                                        </ul>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="space-y-9">
                                <div className="flex items-center">
                                    <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                                        <div className="bg-secondary-light dark:bg-secondary text-secondary dark:text-secondary-light  rounded-full w-9 h-9 grid place-content-center">
                                            <IconInbox />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex font-semibold text-white-dark mb-2">
                                            <h6>Income</h6>
                                            <p className="ltr:ml-auto rtl:mr-auto">₹ {totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                        </div>
                                        <div className="rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                            <div className="bg-gradient-to-r from-[#7579ff] to-[#b224ef] w-11/12 h-full rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                                        <div className="bg-success-light dark:bg-success text-success dark:text-success-light rounded-full w-9 h-9 grid place-content-center">
                                            <IconTag />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex font-semibold text-white-dark mb-2">
                                            <h6>Profit</h6>
                                            <p className="ltr:ml-auto rtl:mr-auto">
                                                ₹{' '}
                                                {(totalAmount - totalAmountExpenses)
                                                    .toFixed(2)
                                                    .toString()
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            </p>
                                        </div>
                                        <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                            <div className="bg-gradient-to-r from-[#3cba92] to-[#0ba360] w-full h-full rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                                        <div className="bg-warning-light dark:bg-warning text-warning dark:text-warning-light rounded-full w-9 h-9 grid place-content-center">
                                            <IconCreditCard />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex font-semibold text-white-dark mb-2">
                                            <h6>Expenses</h6>
                                            <p className="ltr:ml-auto rtl:mr-auto">₹ {totalAmountExpenses.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                        </div>
                                        <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                            <div className="bg-gradient-to-r from-[#f09819] to-[#ff5858] w-full h-full rounded-full" style={{ width: '80%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="panel h-full w-[90%] md:w-[30%]">
                            <div className="flex items-center mb-5">
                                <h5 className="font-semibold text-lg dark:text-white-light">Expenses Breakdown</h5>
                            </div>
                            <div>
                                <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                    {loading ? (
                                        <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                            <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                        </div>
                                    ) : (
                                        <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div> */}

                    <div className="flex justify-between my-4">
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                            <div className="panel h-full w-full">
                                <div className="flex items-center justify-between mb-5">
                                    <h5 className="font-semibold text-lg dark:text-white-light">Recent Invoice</h5>
                                </div>
                                <div className="table-responsive">
                                    <table>
                                        <thead>
                                            <tr className="border-b-0">
                                                <th className="ltr:rounded-l-md rtl:rounded-r-md">Customer</th>
                                                <th>Amount</th>
                                                <th>Due Date</th>
                                                <th>Supply Type </th>
                                                <th className="ltr:rounded-r-md rtl:rounded-l-md">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.map((invoice, i) => {
                                                return (
                                                    <tr key={i} className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                                        <td className="min-w-[150px] text-black dark:text-white">
                                                            <div className="flex items-center">
                                                                <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src="/assets/images/profile-7.jpeg" alt="avatar" />
                                                                <span className="whitespace-nowrap">{invoice.buyer_name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="text-primary">₹ {invoice.final_amount}</td>
                                                        <td>
                                                            {new Date(invoice.invoice_date).getDate()} {months.get(new Date(invoice.invoice_date).getMonth() + 1)}{' '}
                                                            {new Date(invoice.invoice_date).getFullYear()}
                                                        </td>
                                                        <td>{invoice.supply_type}</td>
                                                        <td>
                                                            <Link className="text-danger flex items-center" to="/invoices">
                                                                <IconMultipleForwardRight className="rtl:rotate-180 ltr:mr-1 rtl:ml-1" />
                                                                Go
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            
        </>
    );
};

export default UserDashboard;
