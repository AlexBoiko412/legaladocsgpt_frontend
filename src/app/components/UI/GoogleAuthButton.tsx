import "./GoogleAuthButton.css"
import Image from "next/image";
import googleImage from "../../../static/5847f9cbcef1014c0b5e48c8.png"
import { GOOGLE_AUTH_URL } from "@/lib/api";

const GoogleAuthButton = () => {
    return (
        <button
            type="button"
            className="google_auth_button"
            onClick={() => { window.location.href = GOOGLE_AUTH_URL; }}
        >
            Log In with Google
            <Image height={24} width={24} alt="Google" src={googleImage} />
        </button>
    );
};

export default GoogleAuthButton;