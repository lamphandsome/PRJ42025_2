import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CreateOrder from './components/CreateOrder';
import ManageOrders from './components/ManageOrders';
import InvoicePage from './components/InvoicePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./author/Login";
import Register from "./author/Register";
import PrivateRoute from "./author/PrivateRoute";
import Unauthorized from "antd/es/result/unauthorized";
import UserOrders from "./components/UserOrders";

const App = () => {
    return (
        <Router>
            <div style={{display: 'flex', minHeight: '100vh', background: '#f5f7fa'}}>
                <Sidebar/>
                <div style={{
                    marginLeft: "260px", 
                     
                    width: "100%",
                    minHeight: '100vh'
                }}>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/unauthorized" element={<Unauthorized/>}/>

                        {/* USER routes */}
                        <Route element={<PrivateRoute roles={["ROLE_USER", "ROLE_ADMIN"]}/>}>
                            <Route path="/create-order" element={<CreateOrder/>}/>
                            <Route path="/orders" element={<UserOrders/>}/>
                        </Route>

                        {/* ADMIN routes */}
                        <Route element={<PrivateRoute roles={["ROLE_ADMIN"]}/>}>
                            <Route path="/create-order" element={<CreateOrder/>}/>
                            <Route path="/manage-orders" element={<ManageOrders/>}/>
                            <Route path="/invoice/:id" element={<InvoicePage/>}/>
                        </Route>

                        {/* fallback */}
                        <Route path="*" element={<Login/>}/>
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;