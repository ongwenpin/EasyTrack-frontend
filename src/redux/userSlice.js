import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: {},
    loading: false,
    error: "",
    verified: false,
    hasCurrentUser: false,
    hasError: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        logInStart: (state) => {
            state.loading = true;
            state.error = "";
            state.hasError = false;
        },
        logInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.hasCurrentUser = true;
            state.loading = false;
            state.error = "";
            state.hasError = false;
            state.verified = action.payload.verified;
        },
        logInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.hasError = true;
        },
        logOutStart: (state) => {
            state.loading = true;
            state.error = "";
            state.hasError = false;
        },
        logOutSuccess: (state) => {
            state.currentUser = {};
            state.hasCurrentUser = false;
            state.loading = false;
            state.error = "";
            state.hasError = false;
        },
        logOutFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.hasError = true;
        },
        signUpStart: (state) => {
            state.loading = true;
            state.error = "";
            state.hasError = false;
        },
        signUpFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.hasError = true;
        },
        signUpSuccess: (state) => {
            state.loading = false;
            state.error = "";
            state.hasError = false;
        },
        changeUsernameSuccess: (state, action) => {
            state.currentUser.username = action.payload;
            state.error = "";
            state.hasError = false;
            state.loading = false;
        },
        verifyEmailSuccess: (state) => {
            state.verified = true;
            state.error = "";
            state.hasError = false;
        }
    }
});

export const { 
    logInStart, logInSuccess, logInFailure, logOutStart, logOutSuccess, logOutFailure, signUpFailure, 
    signUpStart, signUpSuccess, changeUsernameSuccess, verifyEmailSuccess 
} = userSlice.actions;

export default userSlice.reducer;