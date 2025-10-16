import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import SocketContext from "./Connections/Socket";
 
export default function FoodRating({ order,place }) {
    const [rating, setRating] = useState(order.rating || 0);
    const [review, setReview] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const ctx = useContext(SocketContext);

    const submitReview = () => {
     
        if (rating !== 0) {
            ctx.sendCommand("Add Rating", {
                rating,
                review,
                order_id: order.order_id,
                mess_code: order.mess_id,
                user_id: order.user_id,
            });
            setModalVisible(false);
            if(place=="inside"){
                ctx.sendCommand('Get Order', { order_id: order.payment_order_id });
            }else{
            ctx.sendCommand("Get Orders", { user_id: order.user_id, page: 0 });
            }
        }
    };
const openRating=()=>{
    if (rating == 0) {
    setModalVisible(true);
    }
}
    return (
        <View width="100%">
            {/* Display Rating Directly */}
            <TouchableOpacity onPress={() => openRating()}>
                <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((index) => (
                        <FontAwesome
                            key={index}
                            name={index <= rating ? "star" : "star-o"}
                            size={24}
                            color={index <= rating ? "#ff9104" : "#ccc"}
                            style={styles.starIcon}
                        />
                    ))}
                </View>
            </TouchableOpacity>

            {/* Rating Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Rate Your Food</Text>

                        <View style={styles.starRow}>
                            {[1, 2, 3, 4, 5].map((index) => (
                                <TouchableOpacity key={index} onPress={() => setRating(index)}>
                                    <FontAwesome
                                        name={index <= rating ? "star" : "star-o"}
                                        size={30}
                                        color={index <= rating ? "#ff9104" : "#ccc"}
                                        style={styles.starIcon}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Write your comment"
                            value={review}
                            onChangeText={setReview}
                            multiline
                        />

                        <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    ratingContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    starIcon: {
        marginHorizontal: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    starRow: {
        flexDirection: "row",
        marginBottom: 15,
    },
    input: {
        width: "100%",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        marginTop: 10,
        paddingVertical: 5,
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: "#ff9104",
        padding: 10,
        marginTop: 15,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
    },
    submitText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
