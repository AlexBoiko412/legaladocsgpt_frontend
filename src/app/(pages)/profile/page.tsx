'use client';

import { useUser } from '@/context/UserContext';

export default function ProfilePage() {
    const { user, loading } = useUser();

    if (loading) {
        return <div className="container mx-auto p-8">Loading user profile...</div>;
    }

    if (!user) {
        return <div className="container mx-auto p-8">Please log in to view your profile.</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <strong className="text-gray-600">Username:</strong>
                    <p className="text-lg">{user.username}</p>
                </div>
                <div className="mb-4">
                    <strong className="text-gray-600">Email:</strong>
                    <p className="text-lg">{user.email}</p>
                </div>
                <div>
                    <strong className="text-gray-600">Role:</strong>
                    <p className="text-lg">{user.role}</p>
                </div>
            </div>
        </div>
    );
}