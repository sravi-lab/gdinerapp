import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { VStack, Button, ScrollView } from "native-base";
import { useRouter } from "expo-router";
import Layout from "../Layout";
import { resetState, userUpdate } from "../../Store/Appdataslice";
import { useDispatch } from "react-redux";
import { MOBILEAPI, MOBILEAPIKEY } from "../../utilities/Apiurl";
import axios from "axios";
 
const StaffProfileContent = ({ profileData }) => {
 const dispatch = useDispatch();
  const router = useRouter();
  const goBack = () => {
    router.push("/staff");
  };

  const [image1, setImage] = useState();
  
  useEffect(() => {
    setImage(
      "https://gstaff.gitam.edu/img1.aspx?empid=" + profileData.empid
    );
  }, [profileData]);

  
  const logout = async () => {
    try {
      const url = `${MOBILEAPI}/logout`;
      await axios.post(
        url,
        { user_id: profileData.regdno }, // Sending user ID
        { headers: { Authorization: `Bearer ${MOBILEAPIKEY}` } }
      );
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  
    // Clear user data and reset the state
    dispatch(userUpdate({}));
    dispatch(resetState());
    router.navigate("/Login");
  };
  
  return (
    <>
      
        <View style={styles.ManinContainer}>
          {/* <View>
            <TouchableOpacity onPress={goBack}>
              <Image
                source={require("../../assets/backArrow.png")}
                style={styles.img}
                alt="profile"
              />
            </TouchableOpacity>
          </View> */}

          <ScrollView>
            <View style={styles.profileCard}>
              <View style={styles.profilepicSection}>
                <View style={styles.profilePic}>
                  <Image
                    source={{ uri: image1 }}
                    style={styles.profile}
                    alt={profileData.emP_NAME}
                  />
                </View>
              </View>

              <View>
                <Text style={styles.TextName} numberOfLines={2} ellipsizeMode="tail">{profileData.emP_NAME}</Text>
                <Text style={styles.TextId}>{profileData.empid}</Text>
              </View>
            </View>

            <View style={styles.content}>
              <Text style={styles.heading}>Employee Details</Text>
              <VStack>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Designation</Text>
                  <Text style={styles.depname}>{profileData.designation}</Text>
                </View>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Mobile</Text>
                  <Text style={styles.depname}>{profileData.mobile}</Text>
                </View>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Email ID</Text>
                  <Text style={styles.depname}>{profileData.emailid}</Text>
                </View>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Campus</Text>
                  <Text style={styles.depname}>{profileData.campus}</Text>
                </View>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Department Code</Text>
                  <Text style={styles.depname}>{profileData.depT_CODE}</Text>
                </View>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Date of Joining</Text>
                  <Text style={styles.depname}>{profileData.doj}</Text>
                </View>
              </VStack>
            </View>

            <View style={styles.content}>
              <Text style={styles.heading}>Personal Details</Text>
              <VStack>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Father's Name</Text>
                  <Text style={styles.depfname}>{profileData.fatheR_NAME}</Text>
                </View>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Aadhaar No</Text>
                  <Text style={styles.depname}>{profileData.aadhaR_NO}</Text>
                </View>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>PAN</Text>
                  <Text style={styles.depname}>{profileData.panno}</Text>
                </View>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Bank Account</Text>
                  <Text style={styles.depname}>{profileData.banK_ACNO}</Text>
                </View>
              </VStack>
            </View>

            <Button bg="#FF5613" mt={2} style={styles.shadwoButton} onPress={logout}>
              Logout
            </Button>
          </ScrollView>
        </View>
     
    </>
  );
};

const styles = StyleSheet.create({
  img: {
    width: 32,
    height: 32,
    marginBottom: "6%",
  },
  ManinContainer: {
    flex: 1,
     flexDirection: "columns",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#5F5F5F",
  },
  profileCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "4%",
  },
  content: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: "4%",
  },
  profilePic: {
    width: 80,
    height: 80,
    backgroundColor: "#007367",
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#007367",
    marginRight: 12,
  },
  profilepicSection: {
    position: "relative",
  },
  profile: {
    width: "100%",
    height: "100%",
  },
  depfname:{
    textTransform: "capitalize",
    maxWidth: 180, 
    flexShrink: 1, 
    lineHeight: 22, 
    fontWeight: "bold",
  },
  TextName: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "capitalize",
    maxWidth: 200, 
    flexShrink: 1, 
    lineHeight: 22, 
  },
  TextId: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: "600",
  },
  cardinnerSection: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    padding: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: "2%",
  },
  deptype: {
    fontSize: 14,
  },
  depname: {
    fontSize: 14,
    fontWeight: "bold",
  },
  shadwoButton: {
    shadowColor: "#FF5613",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    paddingVertical: 12,
    paddingHorizontal: 24,
    fontSize: 18,
  },
});

export default StaffProfileContent;
