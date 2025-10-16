import React, { useEffect } from "react";
import Login from "./Login";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import { socketTokenupdate, updateDynamicApps } from "../Store/Appdataslice";
import { APIURl1, MOBILEAPINEW } from "../utilities/Apiurl";
import axios from "axios";
import CheckInternet from "../components/CheckInternet";
import { Alert } from "react-native";

const index = () => {
  const router = useRouter();

  const user = useSelector((state) => state.appdata.user);


  
   const dispatch=useDispatch();
  useEffect(() => {
 
    const fetchDynamicapps = async () => {
      try {
        
        var live=APIURl1+'/getdynamicapps?regdno='+user.regdno;
        
        const response = await axios.get(live, {
          headers: {
            Authorization: user.token, 
          },
        });
 
     
        dispatch(updateDynamicApps(response.data.dynamicapps));
      } catch (err) {
        Alert.alert(err.message);
         
      }
    };

    fetchDynamicapps();
  }, [user]);


useEffect(() => {
  const fetchDynamicApps = async () => {
    try {
      const url = `${MOBILEAPINEW}/auth/login`; // ✅ fixed endpoint
console.log(user);
      const payload = {
        id: user?.regdno,   // sending user id (regdno in your case)
        type: user?.role,   // sending type
      };
 console.log(payload);
      const response = await axios.post(url, payload, {
        headers: {
       
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Dynamic Apps Response:", response.data);

       dispatch(socketTokenupdate({token:response.data.token,user:response.data.user}));
    } catch (err) {
     
      console.error(err,`${MOBILEAPINEW}/auth/login`);
      console.error("❌ fetchDynamicApps error:", err);
    }
  };

  if (user?.token) {
    fetchDynamicApps();
  }
}, [user]);



  useEffect(() => {
    
    setTimeout(() => {
      if (user.islogged) {
       router.push("/gdiner");
   
      } else {
        router.navigate("/Login");
      }
    }, 2000);
  }, [user]);


  return (
    <>
    <CheckInternet/>
      <Loading />
    </>
  );
};

export default index;
