import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    sid: null,
    selected_mess: { code: null, name: null,item:{} },
    user: { islogged: false, email: null, sid: null, name: null },
    socketstate: false,
    cafe_list: {loader: true, data: []},
    menu_list: { loader: true, data: [] },
    addons_list: { loader: true, data: [] },

    cart: [],
    order_id: null,
    orders: { loader: true, data: [], next: true },
    order_data: { loader: true, order: {} },
    otp_res: {},
    packages: { loader: true, data: [] },
    subscription: { status: 'no', package: {}, current_time: Date.now(),usage:[] },
    current_location: {},
    sub_usage: [],
    vegfilter: false,
    payment_model_status: false,
    sick_meal_res: { status: 'no', order: {} },
    messages: [],
    order_status: {},
    sickmeal_times: '',
    payment_id: null,
    banners: { loader: true, data: [] },
}

export const Dinerdataslice = createSlice({
    name: 'counter',
    initialState,
    reducers: {

        socketStateupdate: (state, action) => {
            state.socketstate = action.payload.state;
        },
        socketSidupdate: (state, action) => {

            state.sid = action.payload.id;
        },
        userUpdate: (state, action) => {

            state.user = action.payload.data;
        },
        cafeListUpdate: (state, action) => {
            state.cafe_list.loader = false;
            state.cafe_list.data = action.payload.cafe_list;
        },
        updateBanners: (state, action) => {
            state.banners.loader = false;
            state.banners.data = action.payload.res;
        },
        updateMessages: (state, action) => {

            state.messages = action.payload;
        },
        menuListUpdate: (state, action) => {

            state.menu_list.data = action.payload.data;
            state.menu_list.loader = action.payload.loader;
        },
        updateOrderStatus: (state, action) => {

            state.order_status = action.payload.data;

        },
        updateSickMealTimes: (state, action) => {

            state.sickmeal_times = action.payload.res;

        },
        updateSickMealRes: (state, action) => {

            state.sick_meal_res.order = action.payload.order;
            state.sick_meal_res.status = action.payload.status;
        },
        addonListUpdate: (state, action) => {

            state.addons_list.data = action.payload.data;
            state.addons_list.loader = action.payload.loader;
        },
        updatePaymentID: (state, action) => {

            state.payment_id = action.payload.payment_id;
          
        },

         // Updated `updateCart` to handle multiple messes
    updateCart: (state, action) => {
        const { mess_code, total, items, mess_type } = action.payload;
        //  console.log(mess_code, total, items, mess_type);
        // Find the index of the existing cart for the mess
        const existingCartIndex = state.cart.findIndex(
          (cart) => cart.mess_code === mess_code
        );
  
        if (existingCartIndex > -1) {
          // Update the existing cart
          state.cart[existingCartIndex].total = total;
          state.cart[existingCartIndex].items = items;
          state.cart[existingCartIndex].mess_type = mess_type;
        } else {
          // Add a new cart if the mess doesn't already exist
          state.cart.push({ mess_code, total, mess_type, items });
        }
      },
  
        updateMessCode: (state, action) => {

            state.cart.code = action.payload.code;
            state.cart.name = action.payload.name;

        },
        updateOrderID: (state, action) => {

            state.cart.order_id = action.payload.order_id;


        },
        updateOrders: (state, action) => {


            state.orders.loader = action.payload.loader;
            state.orders.data = action.payload.orders;
            state.orders.next = action.payload.next;

        }, updateOrderData: (state, action) => {

            state.order_data.loader = action.payload.loader;
            state.order_data.order = action.payload.order;


        },
        updateOTPRes: (state, action) => {

            state.otp_res = action.payload.data;


        }, updatePaymentModelStatus: (state, action) => {

            state.payment_model_status = action.payload.status;


        },

        updatePackages: (state, action) => {


            state.packages.loader = action.payload.loader;
            state.packages.data = action.payload.packages;

        },
        updateSubscription: (state, action) => {

            state.subscription.status = action.payload.status;
            state.subscription.package = action.payload.package;
            state.subscription.current_time = action.payload.current_time;
            state.subscription.usage = action.payload.usage;

        }, updateCurrentLocation: (state, action) => {

            state.current_location = action.payload.location;


        }, updateSubUsage: (state, action) => {

            state.sub_usage = action.payload.usage;


        }, updateVegState: (state, action) => {

            state.vegfilter = action.payload.status;


        },
        updateSelectedMess: (state, action) => {

            state.selected_mess = action.payload;

        },resetState(state) {
              return {
                ...initialState,
              };
            },

    },
})

export const { updateBanners,resetState,updatePaymentID,updateSickMealTimes,updateSelectedMess, updateMessages, updateOrderStatus, updatePaymentModelStatus, updateSickMealRes, addonListUpdate, updateOTPRes, updateVegState, userUpdate, updatePackages, updateSubUsage, updateCurrentLocation, updateSubscription, socketStateupdate, updateOrders, updateOrderData, updateCart, updateOrderID, socketSidupdate, cafeListUpdate, menuListUpdate, updateMessCode } = Dinerdataslice.actions

export default Dinerdataslice.reducer