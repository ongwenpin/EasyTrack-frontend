import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: {},
    loading: false,
    verified: false,
    hasCurrentUser: false,
    isAdmin: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        logInStart: (state) => {
            state.loading = true;
        },
        logInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.hasCurrentUser = true;
            state.loading = false;
            state.verified = action.payload.verified;
            state.isAdmin = action.payload.role === "admin";    
        },
        logInFailure: (state, action) => {
            state.loading = false;
        },
        logOutStart: (state) => {
            state.loading = true;
        },
        logOutSuccess: (state) => {
            state.currentUser = {};
            state.hasCurrentUser = false;
            state.loading = false;
            state.verified = false;
            state.isAdmin = false;
        },
        logOutFailure: (state, action) => {
            state.loading = false;
        },
        signUpStart: (state) => {
            state.loading = true;
        },
        signUpFailure: (state, action) => {
            state.loading = false;
        },
        signUpSuccess: (state) => {
            state.loading = false;
        },
        changeUsernameSuccess: (state, action) => {
            state.currentUser.username = action.payload;
            state.error = "";
        },
        verifyEmailSuccess: (state) => {
            state.verified = true;
        }
    }
});

export const { 
    logInStart, logInSuccess, logInFailure, logOutStart, logOutSuccess, logOutFailure, signUpFailure, 
    signUpStart, signUpSuccess, changeUsernameSuccess, verifyEmailSuccess 
} = userSlice.actions;

export default userSlice.reducer;