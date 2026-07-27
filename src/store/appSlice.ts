import { AppError } from "@dts";
import debounce from "lodash.debounce";
import { StateCreator } from "zustand";

export interface AppSlice {
    error?: AppError;
    setError: (error?: AppError) => void;
}

const appSlice: StateCreator<AppSlice, [], [], AppSlice> = (set, get) => {
    const clearErrorAfterDelay = debounce(() => {
        if (get().error) {
            set(state => ({ ...state, error: undefined }));
        }
    }, 500);

    return {
        setError: (error?: AppError) => {
            set(state => ({ ...state, error }));
            if (error) clearErrorAfterDelay();
        },
    };
};

export default appSlice;
