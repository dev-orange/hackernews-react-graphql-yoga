import React from 'react';
import CreateLink from './CreateLink';
import Header from './Header';
import LinkList from './LinkList';
import {Outlet, createBrowserRouter, RouterProvider, createRoutesFromElements, Route} from 'react-router-dom';
import Search from "./Search";
import Login from "./Login";
import Oauth from "./Oauth";

const AppLayout = () => (
    <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
            <Outlet />
        </div>
    </div>
)

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<AppLayout />}>
            <Route path="/" element={<LinkList />} />
            <Route path="/create" element={<CreateLink />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/oauth/redirect" element={<Oauth/>} />
        </Route>
    )
);
const App = () => (
    <RouterProvider router={router} />
);

export default App;