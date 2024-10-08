import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IconMenu from '../Icon/IconMenu';
import IconCrossCircled from '../Icon/IconCrossCircled';
import { HashLink } from 'react-router-hash-link';

export default function Navbar() {
    let [scroll, setScroll] = useState(false);
    let [manu, setManu] = useState(false);

    const [hamMenuOpen, setHamMenuOpen] = useState(false);
    const toggleHamMenu = () => {
        if(hamMenuOpen){
            setHamMenuOpen(false);
        }else{
            setHamMenuOpen(true);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setScroll(window.scrollY > 50);
        });
        return () => {
            window.removeEventListener('scroll', () => {
                setScroll(window.scrollY > 50);
            });
        };
    }, []);

    return (
        <nav className="py-1 flex justify-between md:justify-around items-center h-[10svh] px-6" id='landing-navbar'>
            <div className="flex">
                <img width={132} height={32} src="/assets/images/logo.png" alt="" className='cursor-pointer' onClick={()=>window.location.reload()} />
            </div>
            <div className="w-[50%] justify-end items-center hidden md:flex">
                
                <div className="nav-icons flex items-center lg_992:order-2 ms-auto md:ms-8">
                    <ul className="list-none menu-social mb-0">
                        <li className="inline">
                            <Link to='/login' className="h-8 px-4 text-[12px] tracking-wider inline-flex items-center justify-center font-medium rounded-md bg-primary text-white uppercase">{localStorage.getItem('customeridtaxrx') || localStorage.getItem('adminidtaxrx') ? 'Dashboard' : 'Login' }</Link>
                        </li>
                    </ul>
                    <button data-collapse="menu-collapse" type="button" className="collapse-btn inline-flex items-center ms-2 text-dark dark:text-white lg_992:hidden" onClick={() =>setManu(!manu)}>
                        <span className="sr-only">Navigation Menu</span>
                        <i className="mdi mdi-menu text-[24px]"></i>
                    </button>
                </div>
            </div>
            <div className='flex md:hidden w-fit' onClick={toggleHamMenu} >
                <IconMenu className='size-10' />
            </div>

            <div className={`absolute right-0 top-0 h-[100svh] w-[60%] z-999 bg-white flex-col justify-start items-center ${hamMenuOpen ? 'flex' : 'hidden'}`} style={{boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px"}}>
                <div className='flex w-full px-4 py-6 items-center justify-end'>
                    <IconCrossCircled className='size-8' onClick={toggleHamMenu} />
                </div>
                <ul className='flex flex-col justify-start items-start w-[70%] px-5 mt-[5rem]'>
                    <Link to='/' className='my-6 text-lg'>Home</Link>
                </ul>
                <Link to='/login' className="h-8 px-4 text-[12px] tracking-wider inline-flex items-center justify-center font-medium rounded-md bg-primary text-white uppercase">{localStorage.getItem('customeridtaxrx') || localStorage.getItem('adminidtaxrx') ? 'Dashboard' : 'Login' }</Link>
            </div>
        </nav>
    );
}
