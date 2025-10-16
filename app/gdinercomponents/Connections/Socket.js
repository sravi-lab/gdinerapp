import React, { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  addonListUpdate, cafeListUpdate, menuListUpdate, socketSidupdate,
  socketStateupdate, updateBanners, updateCart, updateMessages, updateOrderData,
  updateOrders, updateOrderStatus, updateOTPRes, updatePackages,
  updatePaymentID,
  updatePaymentModelStatus, updateSickMealRes, updateSickMealTimes,
  updateSubscription, updateSubUsage, userUpdate
} from "../../../Store/Dinerdataslice";
import { useRouter } from "expo-router";

const SocketContext = React.createContext({
  isConnected: false,
  sendCommand: () => {},
  socket: null,
  onEvent: () => {},
});

export const SocketContextProvider = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const socketRef = useRef(null);
  
  const location = useSelector((state) => state.appdata.location);
  const [socketUrl, setSocketUrl] = useState(location.socketurl); // Store current socket URL
  const [readyState, setReadyState] = useState(false);

  useEffect(() => {
    if (!socketUrl) return; // Skip if no socket URL

    // Disconnect previous socket if exists
    if (socketRef.current) {
      socketRef.current.disconnect();
      console.log("🔄 Reconnecting to new socket URL...");
    }
console.log(location);
    // Connect to the new socket URL
    socketRef.current = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    const handleConnect = () => {
      console.log("✅ Socket connected!");
      setReadyState(true);
      dispatch(socketStateupdate({ state: true }));
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected!");
      setReadyState(false);
      dispatch(socketStateupdate({ state: false }));
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Listen for events
    socket.on("Banner list", (data) => {
        
       dispatch(updateBanners(data));
    });
    socket.on("Cafe list", (data) => dispatch(cafeListUpdate(data)));
    socket.on("Messages", (data) => dispatch(updateMessages(data.messages)));
    socket.on("Sick Meal times", (data) => dispatch(updateSickMealTimes(data)));
    socket.on("Menu list", (data) => dispatch(menuListUpdate({ loader: false, data: data.res || [] })));
    socket.on("order status", (data) => dispatch(updateOrderStatus({ data })));
    socket.on("addon list", (data) => dispatch(addonListUpdate({ loader: false, data: data.res })));
    socket.on("Sick meal res", (data) => dispatch(updateSickMealRes(data.res)));

    socket.on("Guest ID", (data) => {
      dispatch(socketSidupdate(data));
      dispatch(userUpdate({
        islogged: false,
        email: `${data.id}@gitam.edu`,
        sid: data.id,
        name: "Guest User",
        mobile: "",
      }));
      socket.emit("join", { id: data.id });
    });

    socket.on("order id", (data) => {
      dispatch(updatePaymentID({ payment_id: data.id }));
      router.push('gdiner/Payment');
    });

   // socket.on("Sub order id", (data) => router.push(`/packagepayment/${data.id}`));

    socket.on("subscription", (data) => {
      dispatch(updateSubscription({
        status: data.res.status,
        package: data.res.package[0],
        current_time: data.res.current_time,
        usage: data.res.usage,
      }));
    });

    socket.on("Device Status", (data) => {
      if (data.data.status === "no") {
        router.reload();
      }
    });

    socket.on("usage", (data) => dispatch(updateSubUsage({ usage: data.data })));
    socket.on("Order Data", (data) => dispatch(updateOrderData({ loader: false, order: data.data })));
    socket.on("Orders", (data) => dispatch(updateOrders({ loader: false, orders: data.data.records, next: data.data.next })));
    socket.on("packages", (data) => dispatch(updatePackages({ loader: false, packages: data.data })));
    socket.on("OTP Sent", (data) => dispatch(updateOTPRes({ data: data.res })));

    socket.on("User Data", (data) => {
      if (data.res.status === "failed") {
        dispatch(updateOTPRes({ data: data.res }));
      } else {
        socket.emit("getcafelist", { getlist: "getlist", campus: "Bengaluru" });
        dispatch(socketSidupdate(data.res.user.user_id));
        dispatch(userUpdate({
          islogged: true,
          email: data.res.user.email,
          sid: data.res.user.user_id,
          name: data.res.user.name,
          mobile: data.res.user.mobile,
          campus: data.res.user.campus,
        }));
        socket.emit("join", { id: data.res.user.user_id });
        router.push("/");
      }
    });

    // Fetch cafe list after connecting
    socket.emit("getcafelist", { getlist: "getlist", campus: location.name });

    return () => {
       socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("Cafe list");
      socket.off("Banner list");
      socket.off("Messages");
      socket.off("Sick Meal times");
      socket.off("Menu list");
      socket.off("order status");
      socket.off("addon list");
      socket.off("Sick meal res");
      socket.off("Guest ID");
      socket.off("order id");
      socket.off("Sub order id");
      socket.off("subscription");
      socket.off("Device Status");
      socket.off("usage");
      socket.off("Order Data");
      socket.off("Orders");
      socket.off("packages");
      socket.off("OTP Sent");
      socket.off("User Data");
    };
  }, [socketUrl, dispatch]); // Depend on `socketUrl` so it reconnects when changed

  useEffect(() => {
    console.log("🔄 Updating socket URL: ", location.socketurl);
    if (location.socketurl !== socketUrl) {
      console.log(`🔄 Updating socket URL: ${location.socketurl}`);
      setSocketUrl(location.socketurl); // Update socket URL when `location.socketurl` changes
    }
  }, [location]);

  const sendCommand = useCallback((cmd, data) => {
    if (readyState && socketRef.current?.connected) {
      console.log(`📡 Emitting command: ${cmd}`, data);
      socketRef.current.emit(cmd, data);
    } else {
      console.warn("⚠️ Socket is not initialized or not connected yet.");
    }
  }, [readyState]);
const onEvent = useCallback((event, callback) => {
  if (!socketRef.current) {
    console.warn("⚠️ Socket not initialized yet");
    return;
  }

  socketRef.current.on(event, callback);

  return () => {
    socketRef.current.off(event, callback); // clean up
  };
}, []);

  return (
    <SocketContext.Provider value={{ isConnected: readyState, sendCommand, socket: socketRef.current,onEvent }}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
