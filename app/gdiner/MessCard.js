import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, HStack, Button, Box, Image, VStack, Heading } from 'native-base';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { Avatar } from 'native-base';

 import BottomBar from '../gdinercomponents/BottomBar';
 import SocketContext from '../gdinercomponents/Connections/Socket';
import UsageList from '../gdinercomponents/UsageList';
import Counter from '../gdinercomponents/Counter';
import { useRouter } from 'expo-router';
import Header1 from '../gdinercomponents/Header1';
import { Pressable } from 'react-native';

const formatDate = (date) => {
  var d = date.replace("T", " ");
  var dd = d.split(".");
  var date = new Date(dd[0].replace(/-/g, "/"));

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
};

const stringAvatar = (name) => {
  var cnn = name.split(' ').length;
  if (name != undefined) {
    if (cnn === 1) {
      return {
        children: `${name.split(' ')[0][0]}`,
      };
    } else {
      return {
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
      };
    }
  } else return 'GU';
};

const MessCard = () => {
  const ctx = useContext(SocketContext);
  const [selectedItem, setSelectedItem] = useState({ amount: 0 });
  const navigation = useRouter();
  const user = useSelector((state) => state.appdata.user);
  const subscription = useSelector((state) => state.dinerdata.subscription);
  const packages = useSelector((state) => state.dinerdata.packages);

  useEffect(() => {
    console.log(user);
    ctx.sendCommand('Check Subscription', { user_id: user.regdno });
    ctx.sendCommand('Get Packages', { type: 'packages' });
    ctx.sendCommand('Get sick meal times', { type: 'packages' });
  }, []);

  const buyPackage = () => {
    if (selectedItem.amount > 0) {
      ctx.sendCommand('Create Subscription', { item: selectedItem, user });
    } else {
      alert('Please choose package');
    }
  };
 console.log(packages);
  return (
    <>
      <Header1 title={"Mess Card"} />
      <View h={"83.5%"} p={4}>
      
       
        <ScrollView>
          {subscription.status === 'yes' ? (
            <>
             <HStack mt={4} mb={6} p={4} borderWidth={1} borderColor="gray.200" borderRadius={8}>
          
          <Avatar {...stringAvatar(user.name)} />
          <View ml={4}>
            <Text fontSize="lg"  bold color={"#007367"}>{user.name}</Text>
            <Text fontSize="sm" color={"#007367"}>{user.regdno}</Text>    
            </View>
        </HStack>
              <View alignItems="center" mb={4}>
                <QRCode
                  value={`subscribe-${subscription.package.payment_id}-${subscription.current_time}`}
                  size={200}
                  color="#000"
                />
                <Text mt={2}>QR code <Text bold>expires</Text> in <Counter sec={60} onComplete={() => navigation.navigate('gdiner')} /></Text>
              </View>
              <UsageList subscription={subscription} />
            </>
          ) : (
            <>
              {/* <PackageList selectedItem={setSelectedItem} /> */}
            <View alignItems="center" my={6}>
  <Image
    source={{ uri: "https://cdn-icons-png.flaticon.com/512/857/857681.png" }}
    alt="No Subscription"
    size="xl"
    mb={4}
  />
  <Heading size="md" color="#007367" mb={2}>No Active Subscription</Heading>
  <Text textAlign="center" color="gray.600" mb={4}>
    You don't have an active meal subscription. Please select a package to continue accessing dining services.
  </Text>
  <Button
    onPress={() => {
      navigation.push({
        pathname: 'gdiner/Packages',
        params: { type: 'packages' },
      });
    }}
    bg="#007367"
    _pressed={{ bg: "#005f52" }}
    _text={{ color: "white", fontWeight: "bold" }}
  >
    View Available Packages
  </Button>
</View>

            </>
          )}
        </ScrollView>
      </View>
      <BottomBar />
    </>
  );
};

export default MessCard;