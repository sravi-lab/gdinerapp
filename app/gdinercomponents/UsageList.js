import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Button, Icon, HStack } from 'native-base';
import { useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import SocketContext from './Connections/Socket';


const UsageList = () => {
  const ctx = useContext(SocketContext);
  const user = useSelector((state) => state.appdata.user);
  const [sickMeal, setSickMeal] = useState('');
  const usage = useSelector((state) => state.dinerdata.sub_usage);
  const sickmeal_times = useSelector((state) => state.dinerdata.sickmeal_times);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (ctx && ctx.sendCommand) {
        ctx.sendCommand('get usage', { user_id: user?.regdno });
      }
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [ctx, user?.sid]);

  function isTimeBetween(start, end) {
    const startTime = new Date();
    startTime.setHours(start[0]);
    startTime.setMinutes(start[1]);
    startTime.setSeconds(start[2]);

    const endTime = new Date();
    endTime.setHours(end[0]);
    endTime.setMinutes(end[1]);
    endTime.setSeconds(end[2]);

    const currentTime = new Date();

    return currentTime >= startTime && currentTime <= endTime;
  }

  useEffect(() => {
    if (sickmeal_times?.length > 0) {
      const mealTypes = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

      for (let i = 0; i < mealTypes.length; i++) {
        if (isTimeBetween(sickmeal_times[i]?.start_time.split(","), sickmeal_times[i]?.end_time.split(","))) {
          const selectedData = usage.find((item) => item.meal_type === mealTypes[i]);
          if (!selectedData) {
            setSickMeal(mealTypes[i]);
          }
          return;
        }
      }
      setSickMeal('');
    }
  }, [sickmeal_times, usage]);

  return (
    <View p={4} bg="#FFF6E870"   borderRadius={10} mt={4} width="100%" marginBottom={5}>
      <Text fontSize="lg" textAlign={"center"} fontWeight="bold" mb={4}>Today Card Usage</Text>
      <ScrollView>
        {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((mealType, index) => {
          const selectedData = usage?.find((item) => item.meal_type === mealType);
          const status = selectedData ? "Taken" : "Pending";

          return (
            <HStack key={index} mb={5} alignItems="center">
              <Icon 
                as={MaterialIcons} 
                name={status === 'Pending' ? 'remove-circle' : 'check-circle'} 
                color={status === 'Pending' ? 'red.500' : 'green.500'} 
                size="lg"
              />
              <Text ml={2}>{mealType}</Text>
              <Text ml="auto" color={status === 'Pending' ? 'red.500' : 'green.500'}>{status}</Text>
            </HStack>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default UsageList;
