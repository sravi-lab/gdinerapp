import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import WebView from "react-native-webview";
import Header from "./StaffComponents/Header";
import Header1 from "./Header";
import { useSelector } from "react-redux";
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Text } from "native-base";

const SecurityKey = "Mallikarjun";

const WebViewPage = (props) => {
  const user = useSelector((state) => state.appdata.user);
  const [password, setPassword] = useState({});
  const [processedUrl, setProcessedUrl] = useState(null);

  const encrypt = (toEncrypt, key) => {
    const hashedKey = CryptoJS.MD5(key);
    const encrypted = CryptoJS.TripleDES.encrypt(toEncrypt, hashedKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  };

  const getPassword = async (user_id) => {
    if (props.title !== 'Bell the Cats') return; // Fetch password only if needed

    try {
      const response = await axios.post("https://apiserver.gitam.edu/mobileapi/getpassword", {
        user_id: user_id
      }, {
        headers: { "Content-Type": "application/json" }
      });
 
      if (response.data.success && response.data.data.password) {
        setPassword(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching password:", error);
    }
  };

  useEffect(() => {
    if (user?.regdno) {
      getPassword(user.regdno);
    }
  }, [user]);

  useEffect(() => {
    if (props.url && user?.regdno) {
      const separator = props.url.includes("?") ? "&" : "?";
      var newProcessedUrl1;

      if (props.title === 'Bell the Cats') {
        newProcessedUrl1 = `${props.url}${separator}&password=${password.password}&username=${password.id}`;
      } else if (props.title === 'Help Desk1') {
        newProcessedUrl1 = `${props.url}${separator}id=${encrypt(user.name+'#'+user.emailid, 'Cums$dHs')}&cryptid=${encrypt(user.regdno, SecurityKey)}`;

      }else {
        newProcessedUrl1 = `${props.url}${separator}userid=${user.regdno}&cryptid=${encrypt(user.regdno, SecurityKey)}`;
      }
      setProcessedUrl(newProcessedUrl1);
    }
  }, [props.url, password]);
 console.log(processedUrl)
  return (
    <>
      {processedUrl ? (
        <View style={styles.webview}>
          {props.location === "staff" ? (
            <Header title={props.title} />
          ) : (
            <Header1 title={props.title} />
          )}
          <WebView
            key={processedUrl} // Forces reload when URL changes
            source={{ uri: processedUrl }}
            style={styles.fullWebView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccess={true}
            originWhitelist={["*"]}
            mixedContentMode="always"
          />
        </View>
      ) : <Text>No Content</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  fullWebView: {
    flex: 1,
  },
  webview: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: "#fff",
  },
});

export default WebViewPage;
