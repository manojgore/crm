import React, { useEffect } from 'react';
import { Hourglass } from 'react-loader-spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/apiProvider';

function CheckPayment() {
    const navigate = useNavigate();
    const days = new Map([
        ["Monthly", 30],
        ["Weekly", 7],
        ["6 Months", 180],
        ["Yearly", 365],
    ]);
    const PurchasePlan = async() => {
          const response = await axios.put(`${api}/api/user/subscribe`, {
            id: localStorage.getItem("customeridtaxrx"),
            planType: sessionStorage.getItem("plantypetaxrx"),
            purchased_on: new Date(),
            expiring_on: new Date(new Date().getTime() + (days.get(sessionStorage.getItem("plandurationtaxrx")) * 24 * 60 * 60 * 1000))
          })
          if(response.data.success){
            alert("plan subscribed");
            navigate('/user-dashboard');
          }else{
            alert("plan not subscribed");
            navigate('/user-dashboard');
          }
      }
    const checkPaymentStatus = async() => {
        const marchentTansactionId = window.location.href.split("/")[window.location.href.split("/").length - 1];
        try {
            const response = await axios.get(`${api}/api/user/checkpayment`,{
                headers: {
                    marchentTransactionId: marchentTansactionId
                }
            });

            if(response.data.success){
                PurchasePlan();
            }else{
                console.log(response.data.error);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        checkPaymentStatus();
    },[])
  return (
    <div style={{width: '100%', display: 'flex', justifyContent: 'center', height: "500px", alignItems: "center"}}>
        <div style={{display: "flex", flexDirection: "column"}}>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <Hourglass
                visible={true}
                height="80"
                width="80"
                ariaLabel="hourglass-loading"
                wrapperStyle={{}}
                wrapperClass=""
                colors={['#306cce', '#72a1ed']}
            />
          </div>
          <div style={{display: "flex", flexDirection: "column", marginTop: "50px", justifyContent: "center", alignItems: "center"}}>
            <p style={{color: "blue", fontSize: "16px"}}>Processing your payment</p>
            <p style={{color: "red", fontSize: "18px", fontWeight: "bold"}}>Do not Refresh or Close the tab</p>
          </div>
        </div>
    </div>
  )
}

export default CheckPayment;