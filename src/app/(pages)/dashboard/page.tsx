'use client'
import Cookies from "js-cookie";
import { useState, useEffect } from "react"; // 1. Import hooks

export default function DashboardPage() {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        role: ''
    });

    useEffect(() => {
        setUserData({
            username: Cookies.get("username") || '',
            email: Cookies.get("email") || '',
            role: Cookies.get("role") || ''
        });
    }, []);

    return (
        <div className={"text-amber-50"}>
            <h1>Welcome, {userData.username}</h1>
            <p>Email: {userData.email}</p>
            <p>Role: {userData.role}</p>
            {userData.username === '' && <p>Loading user data...</p>}
        </div>
    );
}