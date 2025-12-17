'use client'

import {useUser} from "@/context/UserContext";

export default function DashboardPage() {
    const {user, loading} = useUser()

    return (
        <div className={"container mx-auto p-8 text-black"}>
            {
                loading &&
                <p>Loading user data...</p>
            }
            {
                user &&
                <>
                    <h1>Welcome, {user.username}</h1>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                </>
            }
        </div>
    );
}