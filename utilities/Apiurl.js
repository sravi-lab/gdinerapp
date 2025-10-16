const APIURL = "https://gphoenixserver.gitam.edu:4041";
export const APIURl1 = "https://studentmobileapi.gitam.edu";
export const STAFFURL = "https://staffmobapp.gitam.edu";
export const STAFFKEY = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTmFkYWt1cnRoaSBSYW11IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiRW1wbG95ZWUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImM0YjMyMzkyLWY5YTQtNDA2OC1hYWIxLTAwYWI3NTI4M2EyZCIsImlzcyI6Ind3dy5naXRhbS5lZHUiLCJhdWQiOiJ3d3cuZ2l0YW0uZWR1In0.DlSmq1hPmcZVfMmHYkpTBP7qCc5hLgniqD0BN9zZf4Q";


export const MOBILEAPI = "https://gitamappsapi.gitam.edu/api";
export const MOBILEAPIKEY = "rwetygdsgrfsgtyth5678dhdmadbu23u4u23bbdfsd";


export const MOBILEAPINEW = "http://172.17.58.140:4000";
export const SOCKETURL = "http://172.17.58.140:4000";
// export const getLocationInfo=async (code)=> {
//    if(code=="VSP"){
//     return {
//       name:"Visakhapatnam",
//       code:"VSP",
//       socketurl:"ws://172.17.58.140:3007",
//       gatewaycode:null
//     }
// }else if(code=="HYD"){
//     return {
//       name:"Hyderabad",
//       code:"HYD",
//       socketurl:"ws://172.17.58.140:3008",
//       gatewaycode:null
//     }
// }else if(code=="BLR"){
//     return {
//       name:"Bengaluru",
//       code:"BLR",
//       socketurl:"ws://172.17.58.140:3009",
//       gatewaycode:"rzp_live_P6w8kvz35IcHNj"
//     }
// }

// } 

export const getLocationInfo=async (code)=> {
  if(code=="VSP"){
   return {
     name:"Visakhapatnam",
     code:"VSP",
     socketurl:"wss://fnbservervsp.gitam.edu:4008",
     gatewaycode:"rzp_live_6xZblQpT7wAsHR"
   }
}else if(code=="HYD"){
   return {
     name:"Hyderabad",
     code:"HYD",
     socketurl:"wss://fnbserverhyd.gitam.edu:4009",
     gatewaycode:"rzp_live_Wxnhp1wrnGLnCb"
   }
}else if(code=="BLR"){
   return {
     name:"Bengaluru",
     code:"BLR",
     socketurl:"wss://fnbserverblr.gitam.edu:4007",
     gatewaycode:"rzp_live_P6w8kvz35IcHNj"
   }
}

} 

export default APIURL;
