import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import EmailVerify from "./components/EmailVerify";

function App() {
    const user = localStorage.getItem("token");

    return (
        <Router>
            <Routes>
                {user && <Route path="/" exact element={<Main />} />}
                <Route path="/signup" exact element={<Signup />} />
                <Route path="/login" exact element={<Login />} />
                <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="*" element={<Navigate replace to={user ? "/" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;
