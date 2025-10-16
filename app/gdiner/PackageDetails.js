import React, { useContext, useEffect, useState } from "react";
import { Button, Box, Text, View } from "native-base";
import RazorpayCheckout from "react-native-razorpay";
import { useDispatch, useSelector } from "react-redux";
import SocketContext from "../gdinercomponents/Connections/Socket";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header1 from "../gdinercomponents/Header1";
import { updateCart } from "../../Store/Appdataslice";
 

const PackageDetails = () => {
    const [retry, setRetry] = useState(false);
    const ctx = useContext(SocketContext);
    const cart = useSelector((state) => state.appdata.cart);
    const location = useSelector((state) => state.appdata.location);
   const [order_id,setOrderId]=useState(null);
    
    const totalAmount = cart.reduce((sum, mess) => sum + mess.total, 0); // Calculate total

    const dispatch = useDispatch();
    const navigation = useRouter();
   const { package: packageParam } = useLocalSearchParams();
const pkg = typeof packageParam === 'string' ? JSON.parse(packageParam) : packageParam;
     const user = useSelector((state) => state.appdata.user);
     const openPayment = () => {
        const options = {
            key: location.gatewaycode,
            amount: totalAmount * 100, // Convert to paisa
            currency: "INR",
            name: "G - Diner",
            description: "Order ID " + order_id,
            image: "https://www.gitam.edu/sites/default/files/2022-09/GITAM-logo.jpg",
            order_id: order_id,
            prefill: {
                name: user.name,
                email: user.emailid,
                contact: user.mobile,
            },
            notes: {
                address: "Gitam University - VSP,HYD,BLR",
            },
            theme: {
                color: "#007367",
            },
        };

        RazorpayCheckout.open(options)
            .then((response) => {
                if (response.razorpay_payment_id) {
                    // ctx.sendCommand("Payment Success", {
                    //     amount: totalAmount,
                    //     user_id: user.regdno,
                    //     payment_id: response.razorpay_payment_id,
                    //     order_id: response.razorpay_order_id,
                    //     signature: response.razorpay_signature,
                    // });

                   
                    navigation.push({
                        pathname: "gdiner/PackageSuccess",
                        params: {
                            amount: totalAmount,
                            user_id: user.regdno,
                            payment_id: response.razorpay_payment_id,
                            order_id: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                        },
                    });

                }
            })
            .catch((error) => {
                console.log("Payment failed", error);
            });
    };

    useEffect(() => {
     
    ctx.sendCommand("Create Subscription", { user:user,item:pkg });

 const cleanup = ctx.onEvent("Sub order id", (data) => {
    setOrderId(data.id);
      console.log("Received cafe list", data);
    });

    return cleanup;
    }, []);
      useEffect(() => {
        if (order_id!=null) {
            setTimeout(() => {
                openPayment();
            }, 100);
        }
   
    }, [order_id]);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         ctx.sendCommand("check payment", { order_id: order_id });
    //     }, 500);

    //     return () => clearInterval(interval);
    // }, []);
    return (
        <View flex={1}>
            <Header1 title={"Payment"} path={"gdiner/Cart"}/>
        <Box flex={1} alignItems="center" justifyContent="center" p={5}>
            <Text fontSize="lg" fontWeight="bold" >Order Total</Text>
            <Text fontSize="2xl" fontWeight="bold" color={"#007367"}>₹{pkg.amount}</Text>
            <Button mt={5} onPress={openPayment} variant="outline" borderColor="#007367" >
               <Text color={"#007367"}> Retry Payment </Text>
            </Button>
        </Box>
        </View>
    );
};

export default PackageDetails;
