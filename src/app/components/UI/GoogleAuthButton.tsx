import "./GoogleAuthButton.css"
import Image from "next/image";
import googleImage from "../../../static/5847f9cbcef1014c0b5e48c8.png"

const GoogleAuthButton = () => {
    return (
        <button
            type={"button"}
            className={"google_auth_button"}
            onClick={() => window.location.href = "http://localhost:8080/api/auth/oauth2/authorization/google"}>
            Log In with Google
            <Image
                height={24}
                width={24}
                alt="Google Auth"
                src={googleImage}
            />
        </button>
    );
};

export default GoogleAuthButton;