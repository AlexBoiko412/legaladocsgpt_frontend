import {AxiosError} from "axios";

export type SignUpError = AxiosError & {
    response: {
        data: {
            error: string,
            message: string,
            status: number
        }
    }
}