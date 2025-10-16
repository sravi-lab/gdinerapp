import React from "react";
import { Slide, Alert, Text } from "native-base";
import { useSelector } from "react-redux";

const SocketStatus = () => {
   const socketstate = useSelector((state) => state.dinerdata.socketstate);
 return <></>
  //  return <Slide in={!socketstate} placement="bottom" >
  //       <Alert justifyContent="center" status="error" >
  //         <Alert.Icon />
  //         <Text color="error.600" fontWeight="medium">
  //           Connecting to server
  //         </Text>
  //       </Alert>
  //     </Slide>;
};

    export default SocketStatus;