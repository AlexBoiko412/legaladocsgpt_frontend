"use client";

import {Info} from "lucide-react";
import {useState} from "react";
import "./ErrorHint.css"

interface IErrorHintProps {
    title: string,
    message: string
}

export default function ErrorHint({ title, message }: IErrorHintProps) {
    const [popupActive, setPopupActive] = useState<boolean>(false);


    return (
        <div className={"error-hint"}
             onMouseEnter={e => setPopupActive(true)}
             onMouseLeave={e => setPopupActive(false)}
        >
            <p>{title}</p>
            <Info/>
            {popupActive && <div className="absolute left-1/2 transform -translate-x-1/2 w-max max-w-[200px] bg-amber-950 text-amber-50 p-2 rounded-xl popup-enter">
                {message}
            </div>
            }
        </div>
    );
}