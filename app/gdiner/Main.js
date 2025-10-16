import { Text } from "native-base";
import Header from "../gdinercomponents/Header";
import SearchBar from "../gdinercomponents/SearchBar";
import Banners from "../gdinercomponents/Banners";
import { StyleSheet } from "react-native";

const Main=()=>{
    return <>
    <Header title={"G-Diner"}/>
    <SearchBar/>
    <Banners/>
    <Text style={styles.heading}>Cafes</Text>
    </>
}
const styles = StyleSheet.create({
    heading:{
        fontSize:20,
        fontWeight:500,
        padding:15
    }
});
export default Main;