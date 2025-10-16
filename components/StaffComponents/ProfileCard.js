import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Share } from "react-native";
import React from "react";
import { HStack, VStack, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";

const ProfileCard = (props) => {
  // Function to handle phone call
  const handleCall = () => {
    const phoneNumber = props.profile.mobile;
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      alert("Phone number not available");
    }
  };

  // Function to handle email
  const handleEmail = () => {
    const email = props.profile.email;
    if (email) {
      Linking.openURL(`mailto:${email}`);
    } else {
      alert("Email address not available");
    }
  };

  // Function to handle WhatsApp share
  const handleWhatsAppShare = () => {
    const profile = props.profile;
    const message = `*${profile.name}*\n${profile.designation}\n${profile.department}, ${profile.college}\n${profile.campus}\n\nEmployee ID: ${profile.employee_ID}\nEmail: ${profile.email}\nMobile: ${profile.mobile}`;
    
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          // Fallback to web WhatsApp
          const webWhatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;
          return Linking.openURL(webWhatsappUrl);
        }
      })
      .catch((err) => {
        console.error('Error opening WhatsApp:', err);
        alert("WhatsApp is not installed or available");
      });
  };

  // Function to handle general share
  const handleShare = async () => {
    const profile = props.profile;
    const shareContent = {
      title: `${profile.name} - Contact Information`,
      message: `${profile.name}\n${profile.designation}\n${profile.department}, ${profile.college}\n${profile.campus}\n\nEmployee ID: ${profile.employee_ID}\nEmail: ${profile.email}\nMobile: ${profile.mobile}`,
    };

    try {
      await Share.share(shareContent);
    } catch (error) {
      console.error('Error sharing:', error);
      alert("Unable to share at this time");
    }
  };

  return (
    <View style={styles.card}>
      {/* Header with Employee ID and Share Options */}
      <View style={styles.headerRow}>
        <Text style={styles.emId}>{props.profile.employee_ID}</Text>
        <HStack space={2}>
          <TouchableOpacity onPress={handleWhatsAppShare} style={styles.shareButton}>
            <Icon as={Ionicons} name="logo-whatsapp" size="md" color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Icon as={Ionicons} name="share-outline" size="md" color="#6B7280" />
          </TouchableOpacity>
        </HStack>
      </View>

      {/* Main Profile Section */}
      <HStack space={4} alignItems="flex-start" mt={3}>
        {/* Profile Picture */}
        <View style={styles.profileCard}>
          <Image
             source={{uri:`https://gstaff.gitam.edu/img1.aspx?empid=${props.profile.employee_ID}`}}
            style={styles.profilePic}
            resizeMode="cover"
          />
        </View>

        {/* Profile Information */}
        <VStack flex={1} space={1}>
          <Text style={styles.name} numberOfLines={2}>
            {props.profile.name}
          </Text>
          <Text style={styles.designation} numberOfLines={1}>
            {props.profile.designation}
          </Text>
          <Text style={styles.department} numberOfLines={2}>
            {props.profile.department}, {props.profile.college}
          </Text>
          <Text style={styles.campus} numberOfLines={1}>
            {props.profile.campus}
          </Text>
        </VStack>
      </HStack>

      {/* Contact Actions */}
      <HStack space={3} mt={4} justifyContent="space-between">
        <TouchableOpacity onPress={handleCall} style={[styles.actionButton, styles.callButton]}>
          <Icon as={Ionicons} name="call" size="sm" color="#FFFFFF" />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleEmail} style={[styles.actionButton, styles.emailButton]}>
          <Icon as={Ionicons} name="mail" size="sm" color="#FFFFFF" />
          <Text style={styles.actionText}>Email</Text>
        </TouchableOpacity>
      </HStack>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 16,
    borderColor: "#E5E7EB",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileCard: {
    width: 90,
    height: 90,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    borderWidth: 3,
    borderColor: "#E5E7EB",
  },
  profilePic: {
    width: "100%",
    height: "100%",
  },
  shareButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emId: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#005C52",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  name: { 
    fontSize: 20, 
    fontWeight: "600",
    color: "#111827",
    lineHeight: 24,
  },
  designation: { 
    fontSize: 16, 
    fontWeight: "500", 
    color: "#6B7280",
    marginTop: 2,
  },
  department: { 
    fontSize: 14, 
    fontWeight: "400", 
    color: "#9CA3AF",
    lineHeight: 18,
    marginTop: 4,
  },
  campus: { 
    fontSize: 13, 
    fontWeight: "500", 
    color: "#005C52",
    marginTop: 2,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },
  callButton: {
    backgroundColor: "#005C52",
  },
  emailButton: {
    backgroundColor: "#3B82F6",
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ProfileCard;