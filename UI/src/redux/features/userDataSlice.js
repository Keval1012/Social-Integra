import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: '',
    permissions: [],
    currentUserData: null,
    currentUserRole: null,
    currLongAccessToken: null,
    fbData: null,
    igData: null,
    linkedinData: null,
    twitterData: null
}

export const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserIdData: (state, action) => {
            state.userId = action.payload;
        },
        setCurrentUserData: (state, action) => {
            state.currentUserData = action.payload;
        },
        setCurrentUserRole: (state, action) => {
            state.currentUserRole = action.payload;
        },
        setPermissionData: (state, action) => {
            state.permissions = action.payload;
        },
        setCurrLongAccessToken: (state, action) => {
            state.currLongAccessToken = action.payload;
        },
        setFbCredential: (state, action) => {
            state.fbData = action.payload;
        },
        setIgCredential: (state, action) => {
            state.igData = action.payload;
        },
        setLinkedinCredential: (state, action) => {
            state.linkedinData = action.payload;
        },
        setTwitterCredential: (state, action) => {
            state.twitterData = action.payload;
        },
    },
});

export const { setUserIdData, setPermissionData, setCurrentCompanyData, setCurrentUserRole, setFbCredential, setIgCredential, setLinkedinCredential, setCurrLongAccessToken, setTwitterCredential } = userDataSlice.actions;

export default userDataSlice.reducer;