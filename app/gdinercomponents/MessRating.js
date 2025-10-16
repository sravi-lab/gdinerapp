import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Modal, Button, Box } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import SocketContext from "./Connections/Socket";
 
export default function MessRating({ open, setOpen, meal, subscription }) {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [reviewErr, setReviewErr] = useState(false);
    const ctx = useContext(SocketContext);

    const toggleDrawer = (status) => {
        ctx.sendCommand("rating skip", { id: meal.id, user_id: meal.user_id });
        setOpen(status);
    };

    const submitReview = () => {
        if (rating !== 0) {
            if (rating > 2 || (rating <= 2 && review !== "")) {
                ctx.sendCommand("Add Mess Rating", {
                    rating,
                    review,
                    order_id: meal.id,
                    mess_code: subscription.mess_code,
                    user_id: subscription.user_id,
                });
                setOpen(false);
            } else {
                alert("Please enter a review for food.");
            }
        }
    };

    return (
        <Modal isOpen={open}   size="lg">
            <Modal.Content maxWidth="400px">
                <Modal.CloseButton onPress={()=>toggleDrawer(true)}/>
                <Modal.Header>Rate Your Food</Modal.Header>
                <Modal.Body>
                    <Text style={{ fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
                        {subscription.mess_name} - {meal.meal_type}
                    </Text>

                    {/* Star Rating */}
                    <Box flexDirection="row" justifyContent="center" my={3}>
                        {[1, 2, 3, 4, 5].map((index) => (
                            <TouchableOpacity key={index} onPress={() => { 
                                setRating(index);
                                setReviewErr(index <= 2);
                            }}>
                                <FontAwesome 
                                    name={index <= rating ? "star" : "star-o"} 
                                    size={30} 
                                    color={index <= rating ? "#ff9104" : "#ccc"} 
                                    style={{ marginHorizontal: 5 }} 
                                />
                            </TouchableOpacity>
                        ))}
                    </Box>

                    {/* Review Input */}
                    <TextInput
                        placeholder="Write your comment"
                        value={review}
                        onChangeText={(text) => {
                            setReview(text);
                            setReviewErr(false);
                        }}
                        style={{
                            borderBottomWidth: 1,
                            borderColor: reviewErr ? "red" : "gray",
                            padding: 5,
                            fontSize: 16,
                        }}
                        multiline
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button isDisabled={reviewErr} onPress={submitReview}>Submit</Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}
