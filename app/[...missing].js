import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Page Not Found</Text>
      <Text style={{ marginBottom: 20,width:"100%",textAlign:"center" }}>The page you are looking for does not exist.</Text>
      <Button title="Go to Home" onPress={() => router.replace('/')} />
    </View>
  );
}
