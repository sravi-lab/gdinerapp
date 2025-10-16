import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QrcodeView = ({ order, size }) => {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {order.order_status >3 ? (
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'green' }}>
                    Order Success
                </Text>
            ) : (
                <QRCode
                    size={size}
                    value={order.payment_order_id || 'N/A'}
                    color="#000"
                    backgroundColor="white"
                />
            )}
        </View>
    );
};

export default QrcodeView;
