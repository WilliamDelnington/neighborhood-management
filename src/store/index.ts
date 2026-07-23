import { create } from "zustand";
import { devtools } from "zustand/middleware";
import createAppStore, { AppSlice } from "./appSlice";
import createAuthStore, { AuthSlice } from "./authSlice";
import createNotificationStore, {
    NotificationSlice,
} from "./notificationSlice";

type State = AppSlice & AuthSlice & NotificationSlice;

export const useStore = create<State>()(
    devtools((...a) => ({
        ...createAppStore(...a),
        ...createAuthStore(...a),
        ...createNotificationStore(...a),
    })),
);
