import React, { useState, useEffect } from "react";
import { View, Modal, Image, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import Carousel from "react-native-snap-carousel";
import axios from "axios";
import { useSelector } from "react-redux";
import { MOBILEAPI, MOBILEAPIKEY } from "../utilities/Apiurl";
import { Skeleton, VStack } from "native-base";

const { width, height } = Dimensions.get("window");
const carouselHeight = 180;

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.appdata.user);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const url = `${MOBILEAPI}/getBanners`;
      const response = await axios.post(
        url,
        { user_id: user.regdno, campus: user.campus },
        { headers: { Authorization: `Bearer ${MOBILEAPIKEY}` } }
      );

      if (response.data.status) {
        setBanners(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching banners:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (banner) => {
    setSelectedBanner(banner);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <Image source={{ uri: item.banner }} style={styles.bannerImage} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ backgroundColor: "#fff" }}>
        <View style={styles.main}>
          <VStack space={4} alignItems="center" px={4}>
            <Skeleton h={carouselHeight} w="100%" borderRadius={10} startColor="gray.100" endColor="gray.300" />
          </VStack>
        </View>
      </View>
    );
  }

  if (banners.length === 0) {
    return (
      <View style={{ backgroundColor: "#007367" }}>
        <View style={styles.main}></View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: "#007367" }}>
      <View style={styles.main}>
        <Carousel
          data={banners}
          renderItem={renderItem}
          sliderWidth={width}
          itemWidth={width * 0.9}
          loop
          autoplay
        />

        <Modal visible={modalVisible} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>

            {selectedBanner && (
              <View style={styles.modalContent}>
                <Image source={{ uri: selectedBanner.banner }} style={styles.modalImage} />
                <Text style={styles.bannerTitle}>{selectedBanner.title}</Text>
                <Text style={styles.bannerDescription}>{selectedBanner.description}</Text>
              </View>
            )}
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  bannerImage: {
    width: "100%",
    height: carouselHeight,
    borderRadius: 10,
    resizeMode: "contain",
    backgroundColor:"#f0f9f7"
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    alignItems: "center",
    width: "100%",
  },
  modalImage: {
    width: width * 0.9,
    height: height * 0.5,
    borderRadius: 10,
    resizeMode: "contain",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
  },
  bannerDescription: {
    color: "#ddd",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeText: {
    fontSize: 42,
    color: "#fff",
  },
});

export default BannerCarousel;
