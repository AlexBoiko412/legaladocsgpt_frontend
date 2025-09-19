import { headers } from "next/headers";

export default async function DashboardPage() {
    const h = await headers();
    const userHeader = h.get("x-user-info");


    let user = null;
    if (userHeader) {
        try {
            user = JSON.parse(userHeader);
        } catch (err) {
            console.error("Failed to parse x-user-info:", err);
        }
    }

    if (!user) return <div>Unauthorized</div>;

    return (
        <div>
            <h1>Welcome, {user.username}</h1>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
        </div>
    );
}
