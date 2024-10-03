import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client'

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

// Tailwind css
import './tailwind.css';

// i18n (needs to be bundled)
import './i18n';

// Router
import { RouterProvider } from 'react-router-dom';
import router from './router/index';

// Redux
import { Provider } from 'react-redux';
import store from './store/index';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme } from './theme';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { GetStartedProvider } from './context/UserContextProvider';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="217056023941-a0n53f2tl8v4geq8fmli9mqou4scmuno.apps.googleusercontent.com">
            <MantineProvider theme={theme}>
                <Suspense>
                    <GetStartedProvider>
                        <Provider store={store}>
                            <RouterProvider router={router} />
                        </Provider>
                    </GetStartedProvider>
                </Suspense>
            </MantineProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>
);

