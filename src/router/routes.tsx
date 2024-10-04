import { lazy } from 'react';
import AddCustomer from '../pages/AddCustomer';
import AddVendor from '../pages/AddVendor';
import AddItem from '../pages/AddItem';
import AddInvoice from '../pages/AddInvoice';
import AddExpenses from '../pages/AddExpenses';
import UserAccountSettings from '../pages/UserAccountSettings';
import UserCompanySettings from '../pages/UserCompanySettings';
import Items from '../pages/Items';
import Invoices from '../pages/Invoices';
import Expenses from '../pages/Expenses';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import AdminDashboard from '../pages/AdminDashboard';
import Projects from '../pages/Projects';
import Subscriptions from '../pages/Subscription';
import AdminPlans from '../pages/AdminPlans';
import TaxFiles from '../pages/TaxFiles';
import AdminAccountSettings from '../pages/AdminAccountSettings';
import ForgotPassword from '../pages/ForgotPassword';
import RefundPloicy from '../pages/RefundPolicy';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsAndConditions from '../pages/TermsAndConditions';
import TermsOfUse from '../pages/TermsOfUse';
import Faq from '../pages/Faq';
import CheckPayment from '../pages/CheckPayment';
import AdminLogin from '../pages/AdminLogin';
import Customers from '../pages/Customers';
import Vendors from '../pages/Vendors';
const UserDashboard = lazy(() => import('../pages/UserDashboard'));
const Plans = lazy(() => import('../pages/Plans'));
const LandingPage = lazy(() => import('../pages/Index'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <LandingPage />,
        layout: 'blank',
    },
    {
        path: '/refund-policy',
        element: <RefundPloicy />,
        layout: 'blank',
    },
    {
        path: '/privacy-policy',
        element: <PrivacyPolicy />,
        layout: 'blank',
    },
    {
        path: '/terms-and-condition',
        element: <TermsAndConditions />,
        layout: 'blank',
    },
    {
        path: '/terms-of-use',
        element: <TermsOfUse />,
        layout: 'blank',
    },
    {
        path: '/faq',
        element: <Faq />,
        layout: 'blank',
    },
    {
        path: '/check-payment/:marchentTransactionId',
        element: <CheckPayment />,
        layout: 'blank',
    },
    {
        path: '/user-dashboard',
        element: <UserDashboard />,
        layout: 'default',
    },
    {
        path: '/purchase-plan',
        element: <Plans />,
        layout: 'default',
    },
    {
        path: '/add-customer',
        element: <AddCustomer />,
        layout: 'default',
    },
    {
        path: '/add-vendor',
        element: <AddVendor />,
        layout: 'default',
    },
    {
        path: '/add-item',
        element: <AddItem />,
        layout: 'default',
    },
    {
        path: '/add-invoice',
        element: <AddInvoice />,
        layout: 'default',
    },
    {
        path: '/add-expense',
        element: <AddExpenses />,
        layout: 'default',
    },
    {
        path: '/user-account-settings',
        element: <UserAccountSettings />,
        layout: 'default',
    },
    {
        path: '/user-company-settings',
        element: <UserCompanySettings />,
        layout: 'default',
    },
    {
        path: '/items',
        element: <Items />,
        layout: 'default',
    },
    {
        path: '/invoices',
        element: <Invoices />,
        layout: 'default',
    },
    {
        path: '/expenses',
        element: <Expenses />,
        layout: 'default',
    },
    {
        path: '/customers',
        element: <Customers />,
        layout: 'default',
    },
    {
        path: '/vendors',
        element: <Vendors />,
        layout: 'default',
    },
    {
        path: '/login',
        element: <LoginPage />,
        layout: 'blank',
    },
    {
        path: '/admin-login',
        element: <AdminLogin />,
        layout: 'blank',
    },
    {
        path: '/signup',
        element: <SignupPage />,
        layout: 'blank',
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />,
        layout: 'blank',
    },
    {
        path: '/admin-dashboard',
        element: <AdminDashboard />,
        layout: 'admin',
    },
    {
        path: '/Projects',
        element: <Projects />,
        layout: 'admin',
    },
    {
        path: '/subscriptions',
        element: <Subscriptions />,
        layout: 'admin',
    },
    {
        path: '/admin-plans',
        element: <AdminPlans />,
        layout: 'admin',
    },
    {
        path: '/admin-taxfiles',
        element: <TaxFiles />,
        layout: 'admin',
    },
    {
        path: '/admin-account-settings',
        element: <AdminAccountSettings />,
        layout: 'admin',
    }
];

export { routes };
