import Routes from "@pages";
import React from "react";
import { App, SnackbarProvider } from "zmp-ui";
import Auth from "./Auth";
import ErrorNotification from "./notifications/ErrorNotification";

const MyApp = () => (
    <App>
        <SnackbarProvider>
            <ErrorNotification />
            <Auth />
            <Routes />
        </SnackbarProvider>
    </App>
);

export default MyApp;
