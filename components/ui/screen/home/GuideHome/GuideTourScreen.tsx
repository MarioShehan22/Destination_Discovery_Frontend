import {useEffect, useState} from "react";
import {View, Text, StyleSheet, ScrollView, FlatList} from "react-native";
import {Searchbar} from "react-native-paper";
import DisplayTypeWidget from "@/components/ui/screen/share/DisplayTypeWidget";
import TourGridViewWidget from "@/components/ui/screen/home/widget/TourGridViewWidget";
import TourListViewWidget from "@/components/ui/screen/home/widget/TourListViewWidget";
import AxiosInstance from "@/constants/AxiosInstance";
import getBaseUrl from "@/constants/BASEURL";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeTourScreen({navigation}:any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isGridEnabled, setIsGridEnabled] = useState(true);
    const [tours, setTours] = useState([]);
    const [user, setUser] = useState(null);
    //@ts-ignore
    const guideId = user._id;

    const fetchUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.log('Failed to load user:', error);
        }
    };
    useEffect(() => {
        fetchUser()
    }, []);

    const fetchAllTours = async () => {
        try {
            console.log(guideId);
            const response = await AxiosInstance.get(`tours/find-By-Guide-id/${guideId}`);
            //console.log('API response:', response.data.data);
            setTours(response.data.data); // Set the entire array
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchAllTours();
    }, []);
    return(
        <View style={styles.container}>
            <View style={styles.filter}>
                <Searchbar
                    style={styles.searchbar}
                    placeholder="Search Tour"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                />
                <DisplayTypeWidget callback={(state:boolean)=>setIsGridEnabled(state)}/>
            </View>
            {isGridEnabled?(
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {tours?.map((data,index)=>(
                        <TourGridViewWidget key={index} data={data} navigation={navigation}/>
                    ))}
                </ScrollView>
            ):(
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {tours?.map((data,index)=>(
                        <TourListViewWidget key={index} data={data} navigation={navigation}/>
                    ))}
                </ScrollView>
            )}
        </View>
    )
}
const styles = StyleSheet.create({
    searchbar:{
        width: '65%',
    },
    container:{
        flex:1,
        marginTop:10,
    },
    filter:{
        display: 'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        width: '100%',
    }
})