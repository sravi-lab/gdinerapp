// socketContext.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { SOCKETURL } from "./Apiurl";

const SocketContext = React.createContext({
  isConnected: false,
  sendCommand: () => {},
  onEvent: () => {},
  offEvent: () => {},
  socket: null,
});

export const SocketContextProvider = ({ children }) => {
  const token = useSelector((state) => state.appdata.sockettoken);  
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

   const socketUrl = SOCKETURL;

  useEffect(() => {
    if (!token) {
      console.log("⚠️ No token, not connecting to socket.");
      return;
    }

     if (socketRef.current) {
      socketRef.current.disconnect();
      console.log("🔌 Disconnected previous socket.");
    }

    console.log("🌍 Connecting socket:", socketUrl);

    // create socket instance
    const socket = io(socketUrl, {
      transports: ["websocket"],
      auth: { token },  
      withCredentials: true,
    });

    socketRef.current = socket;

    // connection listeners
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("⚠️ Socket connect_error:", err.message);
    });

    // cleanup
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      setIsConnected(false);
    };
  }, [socketUrl, token]);

  // ---------- Emit ----------
  const sendCommand = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      console.log(`📡 Emitting: ${event}`, data);
      socketRef.current.emit(event, data);
    } else {
      console.warn("⚠️ Cannot emit, socket not connected.");
    }
  }, []);

  // ---------- Listen ----------
  const onEvent = useCallback((event, callback) => {
    if (!socketRef.current) return;
    socketRef.current.on(event, callback);
    return () => socketRef.current.off(event, callback);
  }, []);

  // ---------- Remove Listener ----------
  const offEvent = useCallback((event, callback) => {
    if (!socketRef.current) return;
    socketRef.current.off(event, callback);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        sendCommand,
        onEvent,
        offEvent,
        socket: socketRef.current,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => React.useContext(SocketContext);
export default SocketContext;
