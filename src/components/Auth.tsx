import { useEffect } from "react";
import { useStore } from "@store";

const Auth = () => {
    const [token, bootstrapSession] = useStore(state => [
        state.token,
        state.bootstrapSession,
    ]);

    useEffect(() => {
        if (!token) {
            bootstrapSession();
        }
    }, []);

    return null;
};

export default Auth;
