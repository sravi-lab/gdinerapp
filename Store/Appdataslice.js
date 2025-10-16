import { createSlice } from "@reduxjs/toolkit";
import { Children } from "react";

const initialState = {
  sid: null,
  user: { islogged: false, email: null, empid: null, name: null, token: null },
  sockettoken:null,
  mainuser:{},
  socketstate: false,
  error: { location: null, message: null, show: false },
  success: { location: null, message: null, show: false },
  pushtoken: null,
  notificationdata: null,
  servicetoken: null,
  attendance:{},
  timetable:{},
  dynamicapps:[],
  cart:[],
  children:[],
  location:{name:null,code:null,socketurl:null,gatewaycode:null},
  biometricdata:{data:[
    {
      dayType: "ToDay",
      firsT_PUNCH: "HOLIDAY",
      lasT_PUNCH: null,
      totalWorkingHours: "00:00",
    },
    {
      dayType: "PreviousDay",
      firsT_PUNCH: "HOLIDAY",
      lasT_PUNCH: null,
      totalWorkingHours: "00:00",
    },
  ],lastfetch:null}
};

const appdataSlice = createSlice({
  name: "appdata",
  initialState,
  reducers: {
    socketStateupdate(state, action) {
      state.socketstate = action.payload.state;
    },
    socketSidupdate(state, action) {
      state.sid = action.payload.id;
    },
     socketTokenupdate(state, action) {
      state.sockettoken = action.payload.token;
      state.mainuser=action.payload.user;
    },
    userUpdate(state, action) {
      state.user = action.payload;
    },
    updateChildren(state, action) {
      state.children = action.payload;
    },
    updateLocation(state, action) {
      state.location = action.payload;
    },
    updateError(state, action) {
      state.error = action.payload;
    },
    updateSuccess(state, action) {
      state.success = action.payload;
    },
    savePushToken(state, action) {
      state.pushtoken = action.payload;
    },
    saveServiceToken(state, action) {
      state.servicetoken = action.payload;
    },
    setnotificationdata(state, action) {
      state.notificationdata = action.payload;
    },
    updateAttendanceData(state,action){
          state.attendance=action.payload;
    },
    updateTimetableData(state,action){
      state.timetable=action.payload;
}, updateDynamicApps(state,action){
  state.dynamicapps=[...action.payload];
},  updateBiometricData(state, action) {
  state.biometricdata = action.payload;
},   updateCart: (state, action) => {
  const { mess_code,mess_name, total, items, mess_type,reset } = action.payload;
  //  console.log(mess_code, total, items, mess_type);
  // Find the index of the existing cart for the mess
  if(reset==1){
    state.cart=[];
  }else{
  const existingCartIndex = state.cart.findIndex(
    (cart) => cart.mess_code === mess_code
  );

  if (existingCartIndex > -1) {
    // Update the existing cart
    state.cart[existingCartIndex].total = total;
    state.cart[existingCartIndex].items = items;
    state.cart[existingCartIndex].mess_type = mess_type;
    state.cart[existingCartIndex].mess_name = mess_name;
  } else {
    // Add a new cart if the mess doesn't already exist
    state.cart.push({ mess_code,mess_name, total, mess_type, items });
  }

  }
},

    resetState(state) {
      return {
        ...initialState,
        pushtoken: state.pushtoken,
      };
    },
  },
});

export const {
  updateChildren,
  updateCart,
  updateLocation,
  socketStateupdate,
  socketSidupdate,
  userUpdate,
  updateError,
  updateSuccess,
  setnotificationdata,
  savePushToken,
  saveServiceToken,
  resetState,
  socketTokenupdate,
  updateAttendanceData,
  updateTimetableData,
  updateDynamicApps,
  updateBiometricData,
} = appdataSlice.actions;

export default appdataSlice.reducer;
