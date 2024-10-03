import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import AdminLayout from '../components/Layouts/AdminLayout';
import { routes } from './routes';

const finalRoutes = routes.map((route) => {
    return {
        ...route,
        element: route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : route.layout === 'default' ? <DefaultLayout>{route.element}</DefaultLayout> : <AdminLayout>{route.element}</AdminLayout>,
    };
});

const router = createBrowserRouter(finalRoutes);

export default router;
