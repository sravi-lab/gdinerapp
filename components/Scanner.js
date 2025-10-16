import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Alert, HStack, Spinner, VStack, Icon } from 'native-base';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APIURl1 } from '../utilities/Apiurl';
import { useSelector } from 'react-redux';

export default function Scanner() {
  const [facing, setFacing] = useState('back');
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState('nrml');
  const [message, setMessage] = useState('');
  const user = useSelector((state) => state.appdata.user);

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const onScanSuccess = async (res) => {
    setScanned(true);
    setMessage('Processing attendance...');
    setProcessing('process');

    const qrData = res.data;
    const attendanceData = {
      Regdno: user.regdno,
      qrdata: qrData,
    };

    try {
      const response = await fetch(`${APIURl1}/PostAttendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.token,
        },
        body: JSON.stringify(attendanceData),
      });

      const result = await response.json();

      if (result.status !== 'failed') {
        setProcessing('success');
        setMessage(result.message);
      } else {
        setTimeout(() => {
          setProcessing('fail');
          setMessage(result.message);
        }, 2000);
      }
    } catch (error) {
      setProcessing('fail');
      setTimeout(() => setMessage(`Error processing attendance: ${error.message}`), 2000);
    } finally {
      setTimeout(() => {
        setProcessing('nrml');
        setMessage('');
        setScanned(false);
      }, 5000);
    }
  };

  return (
    <View style={styles.container}>
      <VStack space={8}>
        <View style={styles.headingBlock}>
          <Text style={styles.headText}>Scan QR Code for Attendance</Text>
        </View>

        <View style={styles.cameraBlock}>
          <CameraView
            style={styles.camera}
            facing={facing}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanned ? undefined : onScanSuccess}
          >
            {/* Bottom Flip Camera Button */}
            <View style={styles.flipButtonContainerBottom}>
              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                <Ionicons name="camera-reverse" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>

        <View style={styles.bottomBlock}>
         
         {processing === 'info' && (
            <Alert status="info" >
              <HStack space={3} w={"100%"}>
                <Icon as={Ionicons} name="information-circle-outline" style={styles.icon} size={35} color="blue.500" />
               <View  style={styles.mbox}>
               <Text style={styles.infoTextBold}>Info</Text>
               <Text style={styles.infoText}>{message}</Text>
               </View>
              </HStack>
            </Alert>
          )}

          {processing === 'fail' && (
            <Alert status="error">
              <HStack space={3} w={"100%"}>
                <Icon as={Ionicons} name="close-circle-outline" style={styles.icon} size={35} color="red.500" />
                <View style={styles.mbox}>
                  <Text style={styles.infoTextBold}>Failed</Text>
                  <Text style={styles.infoText}>{message}</Text>
                </View>
              </HStack>
            </Alert>
          )}

          {processing === 'success' && (
            <Alert status="success">
              <HStack space={3} w={"100%"}>
                <Icon as={Ionicons} name="checkmark-circle-outline" style={styles.icon} size={35} color="green.500" />
                <View style={styles.mbox}>
                  <Text style={styles.infoTextBold}>Success</Text>
                  <Text style={styles.infoText}>{message}</Text>
                </View>
              </HStack>
            </Alert>
          )}

          {processing === 'process' && (
            <Alert status="warning">
              <HStack space={3} w={"100%"} >
                <Spinner style={styles.icon} size={35} />
                <View style={styles.mbox}>
                  <Text style={styles.infoTextBold}>Loading</Text>
                  <Text style={styles.infoText}>{"Proccessing QR"}</Text>
                </View>
              </HStack>
            </Alert>
          )}
        </View>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headingBlock: {
    marginTop: 20,
  },
  headText: {
    textAlign: 'center',
    fontSize: 20,
  },
  cameraBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  bottomBlock: {
    paddingHorizontal: 25,
    textAlign: 'left',
    width: '85%',
    margin: 'auto',
  },
  infoText: {
    textAlign: 'left',
    paddingBottom: 5,
    flexWrap: 'wrap', 
    width:"100%"
  },
  infoTextBold: {
    textAlign: 'left',
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    width: 300,
    height: 300,
    borderRadius: 20,
    position: 'relative',
  },
  flipButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  flipButtonContainerBottom: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  flipButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
  },
  icon:{
    
    width:"15%",
    minHeight:"50px"
  },
  mbox:{
    width:"86%"
  }
});
