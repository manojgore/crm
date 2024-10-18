import { useEffect, useState } from 'react';
import IconArrowLeft from '../components/Icon/IconArrowLeft';
import axios from 'axios';
import { api } from '../utils/apiProvider';
import { useNavigate } from 'react-router-dom';

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


const Plans = () => {
    const days = new Map([
        ["Monthly", 30],
        ["Weekly", 7],
        ["6 Months", 180],
        ["Yearly", 365],
      ]);
    
    const navigate = useNavigate();

    const [subscribed, setSubscribed] = useState(false);
    const [subsCriptionType, setSubsCriptionType] = useState("");

    const checkSubscription = async () => {
        try {
          const response = await axios.post(`${api}/customer/checksubscription`, {
            id: localStorage.getItem("customeridtaxrx"),
          });
          console.log("subscription status: ", response.data);
          if (response.data.subscribed) {
            setSubscribed(true);
            setSubsCriptionType(response.data.plan_type);
          }
        } catch (error) {
          console.log(error);
        }
      };
    
      const makePayment = async (id: string, planPrice: number) => {
        console.log("planPrice: ", planPrice);
        try {
          const response = await axios.get(`${api}/api/user/initiatepayment`, {
            headers: {
              id: id,
              planPrice: planPrice,
            },
          });
          console.log("payment response: ", response.data);
          if (response.data.success) {
            window.location.href = response.data.url;
          } else {
            alert("Error redirecting to the payment page");
          }
        } catch (error) {
          console.log(error);
        }
      };
    
      const PurchasePlan = async (plan: packageInterface) => {
        console.log("first");
        if (plan.Price === "0" || plan.Price === "0.00") {
          const response = await axios.put(`${api}/api/user/subscribe`, {
            id: localStorage.getItem("customeridtaxrx"),
            planType: plan.Duration + " " + plan.Type,
            purchased_on: new Date(),
            expiring_on: new Date(
              new Date().getTime() + days.get(plan.Duration) * 24 * 60 * 60 * 1000
            ),
          });
          if (response.data.success) {
            setSubscribed(true);
            setSubsCriptionType(plan.Duration + " " + plan.Type);
            alert("plan subscribed");
          } else {
            alert("plan not subscribed");
          }
        } else {
          makePayment(
            localStorage.getItem("customeridtaxrx"),
            parseInt(plan.Price)
          );
          sessionStorage.setItem("plantypetaxrx", plan.Type + " " + plan.Duration);
          sessionStorage.setItem("plandurationtaxrx", plan.Duration);
        }
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

    useEffect(() => {
        fetchPackages();
        checkSubscription();
    }, []);
    return (
        <div>
            <h1 className='text-4xl font-semibold'>All Plans</h1>
            <div className="flex justify-center flex-wrap py-8">
                {packages.map((pkg, i) => {
                    return (
                        <div key={i} className={`p-3 lg:p-5 border border-black dark:border-[#1b2e4b] text-center rounded group hover:border-primary w-full md:w-[25%] my-2 mx-4 ${subsCriptionType === pkg.Duration + " " + pkg.Type ? 'border-green-500' : ''}`}>
                            <h3 className="text-xl lg:text-2xl">{pkg.Type}</h3>
                            <div className="border-t border-black dark:border-white-dark w-1/5 mx-auto my-6 group-hover:border-primary"></div>
                            <p className="text-[15px]">{pkg.Description}</p>
                            <div className={`my-7 p-2.5 text-center text-lg group-hover:text-primary ${subsCriptionType === pkg.Duration + " " + pkg.Type ? 'text-green-500' : ''}`}>
                                <strong className={`text-[#3b3f5c] dark:text-white-dark text-3xl lg:text-5xl group-hover:text-primary ${subsCriptionType === pkg.Duration + " " + pkg.Type ? 'text-green-500' : ''}`}>₹{pkg.Price}</strong> / {pkg.Duration}
                            </div>
                            <ul className={`space-y-2.5 mb-5 font-semibold group-hover:text-primary ${subsCriptionType === pkg.Duration + " " + pkg.Type ? 'text-green-500' : ''}`}>
                                <li className="flex justify-center items-center">
                                    <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                                    {pkg.Number_of_invoices} 
                                </li>
                                <li className="flex justify-center items-center">
                                    <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                                    {pkg.Number_of_products} 
                                </li>
                                <li className="flex justify-center items-center">
                                    <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                                    {pkg.Number_of_suppliers} 
                                </li>
                                <li className="flex justify-center items-center">
                                    <IconArrowLeft className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180 shrink-0" />
                                    {pkg.Number_of_users} 
                                </li>
                            </ul>
                            <button
                                type="button"
                                className={`btn text-black shadow-none group-hover:text-primary group-hover:border-primary group-hover:bg-primary/10 dark:text-white-dark dark:border-white-dark/50 w-full ${subsCriptionType === pkg.Duration + " " + pkg.Type ? 'border-green-500 text-green-500 bg-green-50' : ''}`}
                                onClick={() => PurchasePlan(pkg)}
                            >
                                Buy Now
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Plans;
