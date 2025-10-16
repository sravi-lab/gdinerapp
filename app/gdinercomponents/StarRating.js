import React from "react";
import { HStack, Text } from "native-base";
import { FontAwesome } from "@expo/vector-icons";

const StarRating = ({ rating, reviews }) => {
  const totalStars = 5;

  return (
    <HStack space={1} alignItems="center" marginY={2}>
      {/* Display Stars */}
      {Array.from({ length: totalStars }).map((_, index) => {
        let iconName =
          index < rating ? "star" : index < rating + 0.5 ? "star-half-o" : "star-o";
        
        return (
          <FontAwesome
            key={index}
            name={iconName}
            size={13}
            color={index < rating ? "#FFD700" : "#C0C0C0"} // Gold for filled stars
          />
        );
      })}
      
      {/* Show number of reviews */}
      <Text ml={2} color="gray.500" fontSize={12}>
        ({reviews} reviews)
      </Text>
    </HStack>
  );
};

export default StarRating;
