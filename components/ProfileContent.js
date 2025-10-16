import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { VStack, Button, ScrollView } from "native-base";
import { useRouter } from "expo-router";
import { resetState, userUpdate } from "../Store/Appdataslice";
import { useDispatch } from "react-redux";
import { MOBILEAPI, MOBILEAPIKEY } from "../utilities/Apiurl";
import axios from "axios";

const ProfileContent = ({ profileData }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const goBack = () => {
    router.push("/student");
  };
  const [image1, setImage] = useState();
  useEffect(() => {
   
       setImage(
         "https://doeresults.gitam.edu/photo/img.aspx?id=" + profileData.regdno
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
      <Layout>
        <View style={styles.ManinContainer}>
          <View>
            {/* <View>
              <TouchableOpacity onPress={goBack}>
                <Image
                  source={require("../assets/backArrow.png")}
                  style={styles.img}
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
                    alt={profileData.name}
                  />
                </View>
                {profileData.hostler === "Y" && (
                  <View style={styles.hostel}>
                    <Text style={styles.hostelText}>H</Text>
                  </View>
                )}
              </View>
              <View>
                <Text style={styles.TextName}>{profileData.name}</Text>
                <Text style={styles.TextId}>{profileData.regdno}</Text>
              </View>
            </View>
            <View style={styles.content}>
              <Text style={styles.heading}>Student Details</Text>
              <VStack>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Campus</Text>
                  <Text style={styles.depname}>{profileData.campus}</Text>
                </View>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Branch</Text>
                  <Text style={styles.depname}>{profileData.branch_code}</Text>
                </View>

                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Batch</Text>
                  <Text style={styles.depname}>{profileData.batch}</Text>
                </View>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Mail ID</Text>
                  <Text style={styles.depname}>{profileData.emailid}</Text>
                </View>
              </VStack>
            </View>

            <View style={styles.content}>
              <Text style={styles.heading}>Parent Details</Text>
              <VStack>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Father's Name</Text>
                  <Text style={styles.depname}>{profileData.father_name}</Text>
                </View>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Mother's Name</Text>
                  <Text style={styles.depname}>{profileData.mother_name || "Not Available"}</Text>
                </View>
              </VStack>
            </View>

            <View style={styles.content}>
              <Text style={styles.heading}>Residence Details</Text>
              <VStack>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>City</Text>
                  <Text style={styles.depname}>{profileData.city}</Text>
                </View>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>State</Text>
                  <Text style={styles.depname}>{profileData.state}</Text>
                </View>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Pincode</Text>
                  <Text style={styles.depname}>{profileData.pincode}</Text>
                </View>
                <View style={styles.cardinnerSection}>
                  <Text style={styles.deptype}>Parent's Mobile</Text>
                  <Text style={styles.depname}>{profileData.parent_mobile}</Text>
                </View>
              </VStack>
            </View>

            <Button bg="#FF5613" mt={2} style={styles.shadwoButton} onPress={logout}>
            Logout
          </Button>
            </ScrollView>
          </View>
        
        </View>
      </Layout>
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
  hostel: {
    width: 24,
    height: 24,
    backgroundColor: "#007367",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    position: "absolute",
    bottom: 0,
    right: 12,
  },
  hostelText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  TextName: {
    fontSize: 18,
    fontWeight: "bold",
    maxWidth: 200, // Prevents overflow
    flexShrink: 1, // Allows text to shrink if needed
    lineHeight: 22, 
    textTransform: "capitalize",
  },
  TextId: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: "600",
  },
  qrCode: {
    width: 100,
    height: 100,
    margin: "auto",
    marginBottom: 20,
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
    width:"40%",
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

export default ProfileContent;
