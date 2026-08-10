import Routes from "@pages";
import React from "react";
import { App, SnackbarProvider } from "zmp-ui";
import ErrorNotification from "./notifications/ErrorNotification";

const MyApp = () => (
    <App>
        <SnackbarProvider>
            <ErrorNotification />
            <Routes />
        </SnackbarProvider>
    </App>
);

export default MyApp;
