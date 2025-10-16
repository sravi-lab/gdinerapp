import React, { useState, useEffect } from "react";
import { Box, HStack, Text, VStack, Image, View, Center } from "native-base";
import { ImageBackground, StyleSheet, Dimensions } from "react-native";
import QRCode from "react-native-qrcode-svg";
import idbg from "../../assets/idbg.png";

const { width } = Dimensions.get('window');

const IdCard = ({ profileData }) => {
  const [imageUri, setImageUri] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [encodedid, setEncodedID] = useState();

  useEffect(() => {
    if (profileData?.empid) {
      setImageUri(`https://gstaff.gitam.edu/img1.aspx?empid=${profileData.empid}`);
    }

    // Update date & time
    const updateDateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString();
      const formattedTime = now.toLocaleTimeString();
      setCurrentDateTime(`${formattedDate} ${formattedTime}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, [profileData]);

  useEffect(() => {
    if (encodedid != '') {
      const empid1 = profileData?.empid || "NoQR";
      setEncodedID((btoa('DGID#' + empid1)))
    }
  }, [profileData])
   return (
    <View style={styles.cardContainer}>
      {/* Header Section with Gradient */}
      <View style={styles.headerSection}>
        <View style={styles.headerAccent} />
      
        <Text style={styles.cardTitle}>DIGITAL IDENTITY CARD</Text>
        <Text style={styles.employeeName}>{profileData?.emP_NAME || "N/A"}</Text>
      </View>

      {/* Main Profile Section */}
      <ImageBackground source={idbg} style={styles.background} resizeMode="cover">
        <View style={styles.overlay} />
        <Box style={styles.mainProfileSection}>
          <HStack space={4} alignItems="flex-start">
            {/* Employee Details */}
            <VStack style={styles.detailsSection} space={0}>
              <View style={styles.detailRow}>
                <Text style={styles.labelText}>Department</Text>
                <Text style={styles.valueText}>{profileData?.depT_CODE || "N/A"}, {profileData?.collegE_CODE || "N/A"} ({profileData?.campus || "N/A"})</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.labelText}>Designation</Text>
                <Text style={styles.valueText}>{profileData?.designation || "N/A"}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.labelText}>Mobile</Text>
                <Text style={styles.valueText}>{profileData?.mobile || "N/A"}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.labelText}>Email</Text>
                <Text style={styles.valueText} numberOfLines={2}>
                  {profileData?.emailid || "N/A"}
                </Text>
              </View>
            </VStack>

            {/* Profile Image Section */}
            <Center style={styles.imageSection}>
              <View style={styles.imageFrame}>
                {imageUri ? (
                  <Image 
                    source={{ uri: imageUri }} 
                    alt="Profile Image" 
                    style={styles.profileImage} 
                  />
                ) : (
                  <View style={styles.noImageContainer}>
                    <Text style={styles.noImageText}>NO PHOTO</Text>
                  </View>
                )}
              </View>
              
              {/* Employee ID Badge */}
              <View style={styles.idBadge}>
                <Text style={styles.idBadgeText}>ID: {profileData?.empid || "N/A"}</Text>
              </View>
            </Center>
          </HStack>
        </Box>
      </ImageBackground>

      {/* QR Code Section */}
      <View style={styles.qrSection}>
        <View style={styles.qrContainer}>
          <QRCode 
            value={encodedid} 
            size={180} 
            backgroundColor="transparent"
            color="#007367"
          />
        </View>
        
        <View style={styles.timestampSection}>
          <Text style={styles.timestampLabel}>Generated on</Text>
          <Text style={styles.timestampValue}>{currentDateTime}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footerSection}>
        <View style={styles.securityStrip} />
        <Text style={styles.footerText}>
          This is an official digital identity card. Present when required.
        </Text>
        <Text style={styles.poweredBy}>Powered by GITAM</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: width * 0.92,
    alignSelf: "center",
    marginVertical: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    overflow: "hidden",
  },
  
  // Header Section
  headerSection: {
    backgroundColor: "#007367",
    paddingVertical: 12,
    paddingHorizontal: 15,
    position: 'relative',
  },
  headerAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomLeftRadius: 40,
  },
  institutionName: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    letterSpacing: 2,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 12,
  },
  employeeName: {
    fontSize: 20,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Main Profile Section
  background: {
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
   
  },
  mainProfileSection: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  
  detailsSection: {
    flex: 1,
    paddingRight: 10,
  },
  detailRow: {
    marginBottom: 6,
  },
  labelText: {
    fontSize: 11,
    color: "#007367",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  valueText: {
    fontSize: 14,
    color: "#2C3E50",
    fontWeight: "500",
    flexWrap: 'wrap',
  },

  // Image Section
  imageSection: {
    alignItems: "center",
  },
  imageFrame: {
    backgroundColor: "#FFFFFF",
    padding: 4,
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  profileImage: {
    width: 120,
    height: 140,
    borderRadius: 8,
  },
  noImageContainer: {
    width: 120,
    height: 140,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E9ECEF",
    borderStyle: 'dashed',
  },
  noImageText: {
    color: "#6C757D",
    fontSize: 12,
    fontWeight: "600",
  },
  idBadge: {
    backgroundColor: "#007367",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 10,
    minWidth: 100,
  },
  idBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },

  // QR Section
  qrSection: {
    backgroundColor: "#F8F9FA",
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
  },
  qrContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  timestampSection: {
    alignItems: "center",
  },
  timestampLabel: {
    fontSize: 11,
    color: "#6C757D",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  timestampValue: {
    fontSize: 13,
    color: "#495057",
    fontWeight: "600",
  },

  // Footer
  footerSection: {
    backgroundColor: "#007367",
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    position: 'relative',
  },
  securityStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#FFD700",
  },
  footerText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 5,
    lineHeight: 14,
  },
  poweredBy: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    letterSpacing: 1,
  },
});

export default IdCard;