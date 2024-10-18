import IconLayoutGrid from '../components/Icon/IconLayoutGrid';
import ReactApexChart from 'react-apexcharts';
import IconUsersGroup from '../components/Icon/IconUsersGroup';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IconTrendingUp from '../components/Icon/IconTrendingUp';
import axios from 'axios';
import { api } from '../utils/apiProvider';
import IconLink from '../components/Icon/IconLink';
import IconChatDots from '../components/Icon/IconChatDots';
import IconMultipleForwardRight from '../components/Icon/IconMultipleForwardRight';

const AdminDashboard = () => {
    const [mostUsedPlan, setMostUsedPlan] = useState('');
    const [totalOrderMostUsed, setTotalOrderMostUsed] = useState(0);

    const [invoices, setInvoices] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAmountInvAnl, setTotalAmountInvAnl] = useState(0);
    const [invoiceGrowth, setInvoiceGrowth] = useState(0);
    const [totalAmountGrowth, setTotalAmountGrowth] = useState(0);
    const [salesAnlMode, setSalesAnlMode] = useState('All Time'); 
    const [expenses, setExpenses] = useState([]);
    const [totalAmountExpenses, setTotalAmountExpenses] = useState(0);
    const [expensesGrowth, setExpensesGrowth] = useState(0);
    const [services, setServices] = useState([]);
    const [expenseStatusCount, setExpenseStatusCount] = useState({
        paid: 0,
        pending: 0,
        cancelled: 0,
    });

    const [expenseCancelled, setExpenseCancelled] = useState(0);
    const [expensePending, setExpensePending] = useState(0);
    const [expensePaid, setExpensePaid] = useState(0);
    
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
    const [planValue, setPlanValue] = useState(new Map([]));
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

    const [ProjectsGrowth, setProjectsGrowth] = useState(0);
    const calculateProjectsGrowth = (comapnies) => {
        let totalThisWeek = 0;

        for (let comapny of comapnies) {
            if (new Date(comapny.registered_on) >= new Date() - 30 * 24 * 60 * 60 * 1000) {
                totalThisWeek = totalThisWeek + 1;
            }
        }

        return ((totalThisWeek / comapnies.length) * 100).toFixed(2);
    };

    useEffect(() => {
        fetchInvoices();
        fetchServices();
        fetchExpenses();
        fetchMembers();
        fetchPackages();
    }, []);

    const [activeProjectsGrowth, setActiveProjectsGrowth] = useState(0);

    const handleChangeSaleAnMode = (mode:any) => {
        let total = calculateTotalInvoiceAmnt(invoices, mode);
        setTotalAmount(total);
        let totalExpenses = calculateTotalExpenseAmnt(expenses, mode);
        setTotalAmountExpenses(totalExpenses);
        setSalesAnlMode(mode);
    };

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(`${api}/expenses/searchExpense`, {
                headers: {
                    id: localStorage.getItem('customeridtaxrx'),
                },
            });

            console.log('expenses result: ', response.data);
            if (response.data.success) {
                setExpenses(response.data.results);
                let total = calculateTotalExpenseAmnt(response.data.results, salesAnlMode);
                setTotalAmountExpenses(total);

                let statusCountTotal = calcutateExpensesStatus(response.data.results);
                setExpenseStatusCount(statusCountTotal);

                let expenseGrth = calculateExpensesGrowth(response.data.results);
                console.log(expenseGrth);

                calculateExpenseNumberByCategory(response.data.results);

                setExpensesGrowth(expenseGrth);
            }
        } catch (error) {
            console.log('failed to fetch the expenses');
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

    const calculateExpensesGrowth = (expences:any) => {
        let thisWeekCount = 0;
        for (let expence of expences) {
            if (new Date(expence.Expense_Date).getTime() >= new Date().getTime() - 7 * 24 * 60 * 60 * 1000) {
                thisWeekCount = thisWeekCount + 1;
            }
        }

        return ((thisWeekCount / expences.length) * 100).toFixed(2);
    };
    
    const calcutateExpensesStatus = (expenses:any) => {
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

    const calculateTotalExpenseAmnt = (expences:any, mode:any) => {
        let t = 0;
        expences.forEach((element:any) => {
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

    const fetchInvoices = async () => {
        try {
            const response = await axios.get(`${api}/api/invoices/getallinvoices`, {
                headers: {
                    id: localStorage.getItem('customeridtaxrx'),
                },
            });

            console.log('invoices result: ', response.data);
            if (response.data.success) {
                setInvoices(response.data.results);
                let total = calculateTotalInvoiceAmnt(response.data.results, salesAnlMode);
                setTotalAmount(total);
                setTotalAmountInvAnl(total);
                let totalAmntGrth = calculateTotalAmountGrowth(response.data.results, total);
                setTotalAmountGrowth(totalAmntGrth);
                let invgrth = calculateInvoiceGrowth(response.data.results);
                console.log(invgrth);
                setInvoiceGrowth(invgrth);
            }
        } catch (error) {
            console.log('failed to fetch the invoices');
            console.error(error);
        }
    };

    const calculateInvoiceGrowth = (invoices:any) => {
        let thisWeekCount = 0;
        for (let invoice of invoices) {
            if (new Date(invoice.invoice_date).getTime() >= new Date().getTime() - 7 * 24 * 60 * 60 * 1000) {
                thisWeekCount = thisWeekCount + 1;
            }
        }

        return ((thisWeekCount / invoices.length) * 100).toFixed(2);
    };

    const calculateTotalAmountGrowth = (invoices:any, total:any) => {
        let thisWeekCount = 0;
        for (let invoice of invoices) {
            if (new Date(invoice.invoice_date).getTime() >= new Date().getTime() - 7 * 24 * 60 * 60 * 1000) {
                thisWeekCount = thisWeekCount + invoice.taxable_value;
            }
        }

        return ((thisWeekCount / total) * 100).toFixed(2);
    };

    const calculateTotalInvoiceAmnt = (invoices : any, mode: any) => {
        let t = 0;

        invoices.forEach((element: any) => {
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

    const calculateCustomersGrowth = (customers:any) => {
        let thisWeekCount = 0;
        for (let customer of customers) {
            if (new Date(customer.registration_date).getTime() >= new Date().getTime() - 7 * 24 * 60 * 60 * 1000) {
                thisWeekCount = thisWeekCount + 1;
            }
        }

        return ((thisWeekCount / customers.length) * 100).toFixed(2);
    };

    const calculateActiveProjectsGrowth = (comapnies:any, totalActive:any) => {
        let totalThisWeek = 0;

        for (let comapny of comapnies) {
            if (new Date(comapny.purchased_on) >= new Date() - 30 * 24 * 60 * 60 * 1000) {
                totalThisWeek = totalThisWeek + 1;
            }
        }

        return ((totalThisWeek / totalActive) * 100).toFixed(2);
    };

    const [companySubscribedToday, setCompanySubscribedToday] = useState(0);

    const calculateProjectsToday = (comapnies) => {
        let totalThisDay = 0;

        for (let comapny of comapnies) {
            if (new Date(comapny.purchased_on) >= new Date() - 1 * 24 * 60 * 60 * 1000) {
                totalThisDay = totalThisDay + 1;
            }
        }

        return totalThisDay;
    };

    const navigate = useNavigate();
    const [Projects, setProjects] = useState([]);
    const [packages, setPackages] = useState([]);
    const [activeUsers, setActiveUsers] = useState(0);
    const fetchPackages = async () => {
        try {
            const response = await axios.get(`${api}/admin/getallpackages`);

            console.log('Packages result: ', response.data);
            if (response.data.success) {
                // setPlanValues(response.data.results);
                for (let pkg of response.data.results) {
                    setPlanValue(planValue.set(`${pkg.Duration} ${pkg.Type}`, pkg.Price));
                }
                setPackages(response.data.results);
            }
        } catch (error) {
            console.log('failed to fetch the packages');
            console.error(error);
        }
    };
    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${api}/admin/getallProjects`);

            console.log('Projects result: ', response.data);
            if (response.data.success) {
                setProjects(response.data.results);
                let totalCompanisGrth = calculateProjectsGrowth(response.data.results);
                setProjectsGrowth(totalCompanisGrth);

                let au = 0;
                response.data.results.forEach((element) => {
                    if (element.plan === 1) {
                        au += 1;
                        console.log('au: ', au);
                        setActiveUsers(au);
                    }
                });

                let activeCompGrth = calculateActiveProjectsGrowth(response.data.results, au);
                setActiveProjectsGrowth(activeCompGrth);

                let totalToday = calculateProjectsToday(response.data.results);
                setCompanySubscribedToday(totalToday);

                let most = planTypeCount(response.data.results);
                setMostUsedPlan(most[0]);
                setTotalOrderMostUsed(most[1]);
                console.log('most: ', most);
            }
        } catch (error) {
            console.log('failed to fetch the Projects');
            console.error(error);
        }
    };

    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${api}/admin/getuserdetails`, {
                headers: {
                    id: localStorage.getItem('adminidtaxrx'),
                },
            });

            console.log('user result: ', response.data);
            if (response.data.success) {
                setUser(response.data.results[0]);
            }
        } catch (error) {
            console.log('failed to fetch the user');
            console.error(error);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem('adminidtaxrx')) {
            navigate('/login');
        }
        fetchPackages();
        fetchProjects();
        fetchUser();
    }, []);
    return (
        <>
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
                                <p className='text-xs'>Get controll over your website here.</p>
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

                <div className="flex justify-between flex-col md:flex-row items-center">
                    <div className="panel h-full w-[90%] md:w-[24%]">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg ">Sales</h5>
                        </div>
                        <div className=" text-[#e95f2b] text-3xl font-bold my-10">
                            <span>
                                ₹{' '}
                                {totalAmount
                                    .toFixed(2)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                            </span>
                            <span className="text-black text-sm dark:text-white-light ltr:mr-2 rtl:ml-2">this week</span>
                            {totalAmountGrowth > 0 && <IconTrendingUp className="text-success inline" />}
                            {totalAmountGrowth < 0 && <IconTrendingUp className="text-success inline" />}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="w-full rounded-full h-5 p-1 bg-dark-light overflow-hidden shadow-3xl dark:shadow-none dark:bg-dark-light/10">
                                <div
                                    className="bg-gradient-to-r from-[#43e0ee] to-[#40a0ff] w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-white before:w-2 before:h-2 before:rounded-full before:m-auto"
                                    style={{ width: `${totalAmountGrowth}%` }}
                                ></div>
                            </div>
                            <span className="ltr:ml-5 rtl:mr-5 dark:text-white-light">{totalAmountGrowth}%</span>
                        </div>
                    </div>

                    <div className="panel h-full w-[90%] md:w-[24%]">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg ">Customers</h5>
                        </div>
                        <div className=" text-[#e95f2b] text-3xl font-bold my-10">
                            <span>{customers.length} </span>
                            <span className="text-black text-sm dark:text-white-light ltr:mr-2 rtl:ml-2">this week</span>
                            <IconTrendingUp className="text-success inline" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="w-full rounded-full h-5 p-1 bg-dark-light overflow-hidden shadow-3xl dark:shadow-none dark:bg-dark-light/10">
                                <div
                                    className="bg-gradient-to-r from-[#4361ee] to-[#805dca] w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-white before:w-2 before:h-2 before:rounded-full before:m-auto"
                                    style={{ width: `${customersGrwth}%` }}
                                ></div>
                            </div>
                            <span className="ltr:ml-5 rtl:mr-5 dark:text-white-light">{customersGrwth}%</span>
                        </div>
                    </div>

                    <div className="panel h-full w-[90%] md:w-[24%]">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg ">Invoices</h5>
                        </div>
                        <div className=" text-[#e95f2b] text-3xl font-bold my-10">
                            <span>
                                ₹{' '}
                                {totalAmount
                                    .toFixed(2)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                            </span>
                            <span className="text-black text-sm dark:text-white-light ltr:mr-2 rtl:ml-2">this week</span>
                            <IconTrendingUp className="text-success inline" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="w-full rounded-full h-5 p-1 bg-dark-light overflow-hidden shadow-3xl dark:shadow-none dark:bg-dark-light/10">
                                <div
                                    className="bg-gradient-to-r from-[#5aee43] to-[#5dca99] w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-white before:w-2 before:h-2 before:rounded-full before:m-auto"
                                    style={{ width: `${invoiceGrowth}%` }}
                                ></div>
                            </div>
                            <span className="ltr:ml-5 rtl:mr-5 dark:text-white-light">{invoiceGrowth}%</span>
                        </div>
                    </div>

                    <div className="panel h-full w-[90%] md:w-[24%]">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg ">Expenses</h5>
                        </div>
                        <div className=" text-[#e95f2b] text-3xl font-bold my-10">
                            <span>
                                ₹{' '}
                                {totalAmountExpenses
                                    .toFixed(2)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                            </span>
                            <span className="text-black text-sm dark:text-white-light ltr:mr-2 rtl:ml-2">this week</span>
                            <IconTrendingUp className="text-success inline" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="w-full rounded-full h-5 p-1 bg-dark-light overflow-hidden shadow-3xl dark:shadow-none dark:bg-dark-light/10">
                                <div
                                    className="bg-gradient-to-r from-[#ee434e] to-[#ca5d6a] w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-white before:w-2 before:h-2 before:rounded-full before:m-auto"
                                    style={{ width: `${expensesGrowth}%` }}
                                ></div>
                            </div>
                            <span className="ltr:ml-5 rtl:mr-5 dark:text-white-light">{expensesGrowth}%</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between my-4">
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                        <div className="panel h-full w-full">
                            <div className="flex items-center justify-between mb-5">
                                <h5 className="font-semibold text-lg dark:text-white-light">Recent Projects</h5>
                            </div>
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr className="border-b-0">
                                            <th className="ltr:rounded-l-md rtl:rounded-r-md">Project Name</th>
                                            <th>Email</th>
                                            <th>Created On</th>
                                            <th>Status</th>
                                            {/* <th className="ltr:rounded-r-md rtl:rounded-l-md">Action</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Projects.slice(0, 4).map((company, i) => {
                                            return (
                                                <tr key={i} className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                                    <td className="min-w-[150px] text-black dark:text-white">
                                                        <div className="flex items-center">
                                                            <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src="/assets/images/profile-7.jpeg" alt="avatar" />
                                                            <span className="whitespace-nowrap">{company.company_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-primary">{company.company_email}</td>
                                                    <td>
                                                        {`${new Date(company.registered_on).getDate()} ${months.get(new Date(company.registered_on).getMonth() + 1)} ${new Date(company.registered_on).getFullYear()}`}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`${
                                                                company.plan === 1 ? 'bg-green-200 text-green-500' : 'bg-red-200 text-red-500'
                                                            } py-1 px-2 rounded-md`}
                                                        >
                                                            {company.plan === 1 ? 'Active' : 'Not Active'}
                                                        </span>
                                                    </td>
                                                    {/* <td>
                                                        <Link className="text-danger flex items-center" to="/Projects">
                                                            <IconMultipleForwardRight className="rtl:rotate-180 ltr:mr-1 rtl:ml-1" />
                                                            Go
                                                        </Link>
                                                    </td> */}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="panel h-full w-full">
                            <div className="flex items-center justify-between mb-5">
                                <h5 className="font-semibold text-lg dark:text-white-light">Services</h5>
                            </div>
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr className="border-b-0">
                                            <th className="ltr:rounded-l-md rtl:rounded-r-md">Service Name</th>
                                            <th>Duration</th>
                                            <th>Price</th>
                                            <th>Purchases</th>
                                            <th className="ltr:rounded-r-md rtl:rounded-l-md">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {packages.map((pkg:any, i:any) => {
                                            return (
                                                <tr key={i} className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                                    <td className="min-w-[150px] text-black dark:text-white">
                                                        <p className="whitespace-nowrap">{pkg.Type}</p>
                                                    </td>
                                                    <td>
                                                        {pkg.Duration}
                                                    </td>
                                                    <td className="text-primary">
                                                        ₹{pkg.Price}
                                                    </td>
                                                    <td>
                                                        1
                                                    </td>
                                                    <td>
                                                        <Link className="text-danger flex items-center" to="/admin-plans">
                                                            <IconMultipleForwardRight className="rtl:rotate-180 ltr:mr-1 rtl:ml-1" />
                                                            Go
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {services.map((pkg:any, i:any) => {
                                            return (
                                                <tr key={i} className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                                    <td className="min-w-[150px] text-black dark:text-white">
                                                        <p className="whitespace-nowrap">{pkg.name}</p>
                                                    </td>
                                                    <td>
                                                        "NA"
                                                    </td>
                                                    <td className="text-primary">
                                                        ₹{pkg.price}
                                                    </td>
                                                    <td>
                                                        1
                                                    </td>
                                                    <td>
                                                        <Link className="text-danger flex items-center" to="/items">
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
        </>
    );
};

export default AdminDashboard;
