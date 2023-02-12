import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

import { createClient, Provider } from 'urql';
import {AUTH_TOKEN} from "./constants";

const client = createClient({
    url: 'http://localhost:4000/graphql',
    fetchOptions: () => {
        const token = localStorage.getItem(AUTH_TOKEN);
        return {
            // ①
            headers: { authorization: token ? `Bearer ${token}` : '' },
        };
    },
});
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Provider value={client}>
            <App />
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
