import React, { useEffect, useState } from 'react';
import { Box, HStack, VStack, Text, Image, Divider } from 'native-base';
 

const DetailedMenuList = ({ items }) => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        if (items) {
            setMenuItems(JSON.parse(items));
        }
    }, [items]);
 
    return (
        <Box background={"#fff"} borderWidth={1} borderColor="gray.300" borderRadius="md">
            {/* Table Header */}
            <HStack justifyContent="space-between" p={2} bg="gray.100">
                <Text bold flex={3}>Item</Text>
                <Text bold flex={1} textAlign="center">Qty</Text>
                <Text bold flex={1} textAlign="right">Price</Text>
            </HStack>

            <Divider />

            {/* Table Body */}
            {menuItems.map((row, index) => (
                <VStack key={index}>
                    <HStack justifyContent="space-between" p={2}>
                        <HStack flex={3} alignItems="center">
                            
                            <Text>{row.name}</Text>
                        </HStack>
                        <Text flex={1} textAlign="center">{row.quantity}</Text>
                        <Text flex={1} textAlign="right">₹{row.price}</Text>
                    </HStack>
                    <Divider />
                </VStack>
            ))}
        </Box>
    );
};

export default DetailedMenuList;
