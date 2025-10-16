import React, { useState, useContext } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import SocketContext from "./Connections/Socket";
 
export default function FoodRating({ order, place }) {
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
      if (place === "inside") {
        ctx.sendCommand('Get Order', { order_id: order.payment_order_id });
      } else {
        ctx.sendCommand("Get Orders", { user_id: order.user_id, page: 0 });
      }
    }
  };

  const openRating = () => {
    if (rating === 0) {
      setModalVisible(true);
    }
  };

  return (
    <View className="w-full">
      {/* Display Rating Directly */}
      <TouchableOpacity onPress={openRating} className="items-center py-2">
        <View className="flex-row items-center space-x-1">
          {[1, 2, 3, 4, 5].map((index) => (
            <FontAwesome
              key={index}
              name={index <= rating ? "star" : "star-o"}
              size={24}
              color={index <= rating ? "#fbbf24" : "#d1d5db"}
            />
          ))}
        </View>
        {rating === 0 && (
          <Text className="text-primary-600 text-sm mt-2 font-medium">
            Tap to rate this order
          </Text>
        )}
      </TouchableOpacity>

      {/* Rating Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-xl font-bold text-center text-gray-800 mb-6">
              Rate Your Food
            </Text>

            {/* Star Rating */}
            <View className="flex-row justify-center items-center mb-6">
              {[1, 2, 3, 4, 5].map((index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => setRating(index)}
                  className="mx-1"
                >
                  <FontAwesome
                    name={index <= rating ? "star" : "star-o"}
                    size={32}
                    color={index <= rating ? "#fbbf24" : "#d1d5db"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Review Input */}
            <TextInput
              className="border border-gray-300 rounded-xl p-4 text-base mb-6 min-h-[100px]"
              placeholder="Share your experience (optional)"
              value={review}
              onChangeText={setReview}
              multiline
              textAlignVertical="top"
            />

            {/* Action Buttons */}
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-gray-100 py-3 rounded-xl"
              >
                <Text className="text-gray-700 font-semibold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={submitReview}
                disabled={rating === 0}
                className={`flex-1 py-3 rounded-xl ${
                  rating === 0 ? 'bg-gray-300' : 'bg-primary-500'
                }`}
              >
                <Text className={`font-semibold text-center ${
                  rating === 0 ? 'text-gray-500' : 'text-white'
                }`}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}