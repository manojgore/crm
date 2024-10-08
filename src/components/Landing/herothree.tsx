import React, { useState } from 'react';
import CountUp from 'react-countup';
import IconMonitor from '../Icon/IconMonitor';
import IconTrendUp from '../Icon/IconTrendUp';
import { useNavigate } from 'react-router-dom';
import { GetContext } from '../../context/UserContextProvider';


export default function HeroThree() {
    let [isOpen, setOpen] = useState(false);

    const context = GetContext();
    const {userGetStarted, setUserGetStarted} = context;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserGetStarted({...userGetStarted, [e.target.name]: e.target.value});
    }
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate('/signup');
    }

    return
}
