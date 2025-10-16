import { Image, ScrollView, StyleSheet, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HStack, Skeleton } from "native-base";
import SocketContext from "./Connections/Socket";
import { menuListUpdate, updateSelectedMess } from "../../Store/Dinerdataslice";

const Banners = () => {
  const ctx = useContext(SocketContext);
  const router = useRouter();
  const banners = useSelector((state) => state.dinerdata.banners);
const dispatch=useDispatch();
  useEffect(() => {
    setTimeout(() => {
      ctx.sendCommand("Get Banners", {});
    }, 200);
  }, [ctx]);

  const onClickHandler = (banner) => {
    if(banner.bannertype=="cafe"){
      var item={};
        dispatch(updateSelectedMess({code:banner.mess_code,name:banner.mess_name,item}))
                dispatch(menuListUpdate({ loader: true, data: [] }));
      
                ctx.sendCommand('Get Menu', { 'mess_code': banner.mess_code });
      const params = JSON.parse(banner.params || "{}");  
      router.push({ pathname: banner.path, params }); // Push to the specified path
    }else{
      const params = JSON.parse(banner.params || "{}");  
      router.push({ pathname: banner.path, params }); // Push to the specified path
    }
   
  };

  return (
    <View style={styles.container}>
      {banners.loader ? (
        <HStack space={2}>
          <Skeleton height={140} width={250} borderRadius={10} />
          <Skeleton height={140} width={250} borderRadius={10} />
        </HStack>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {banners.data?.map((banner, index) => {
            const params = JSON.parse(banner.params || "{}"); // Parse params JSON
            return (
              <Pressable
                key={banner.id || index}
                onPress={() => onClickHandler(banner)}
              >
                <Image source={{ uri: banner.banner }} style={styles.banner} />
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  banner: {
    width: 250,
    height: 140,
    marginRight: 10,
    borderRadius: 10,
    resizeMode: "cover",
  },
});

export default Banners;
