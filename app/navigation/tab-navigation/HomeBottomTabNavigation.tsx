import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs/src";
import HomeGuideScreen from "@/components/ui/screen/home/HomeGuideScreen";
import HomePageScreen from "@/components/ui/screen/home/HomePageScreen";
import HomeBookingScreen from "@/components/ui/screen/home/HomeBookingScreen";
import HomeLocationScreen from "@/components/ui/screen/home/HomeLocationScreen";
import HomeMenuScreen from "@/components/ui/screen/home/HomeMenuScreen";
import {Ionicons} from "@expo/vector-icons";
import {Color} from "@/constants/Colors";
import {Chip} from "react-native-paper";

const logo = require('../../../assets/images/logo/logo2.png');
const Tab = createBottomTabNavigator();

 export default function HomeBottomTabNavigation({navigation}:any) {
  return(
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({route, focused}:any)=>({
                tabBarIcon:({color, size})=>{
                    let iconName;
                    if(route.name==='Menu') iconName = focused? 'menu':'menu-outline';
                    else if(route.name==='Location') iconName = focused? 'location':'location-outline';
                    else if(route.name==='Home') iconName = focused? 'home':'home-outline';
                    else if(route.name==='Booking') iconName = focused? 'book':'book-outline';
                    else if(route.name==='Guide') iconName = focused? 'person':'person-outline';
                    // @ts-ignore
                    return <Ionicons name={iconName} size={20} color={color}/>
                },
                tabBarActiveTintColor:Color.blue,
                tabBarInactiveTintColor:Color.darkGray
            })}
        >
            <Tab.Screen name={'Menu'} component={HomeMenuScreen}/>
            <Tab.Screen name={'Location'} component={HomeLocationScreen}/>
            <Tab.Screen
                name={'Home'}
                component={HomePageScreen}
                options={({ navigation }) => ({
                    headerLeft: () => (
                        <View style={styles.headerLeftContainer}>
                            <Text style={styles.greetingText}>
                                Hi, <Text style={styles.userName}>David</Text> <Text style={styles.waveEmoji}>👋</Text>
                            </Text>
                        </View>
                    ),
                    headerTitle: '',
                    headerRight: () => (
                        <View style={styles.headerRightContainer}>
                            <TouchableOpacity
                                onPress={() => console.log('Profile pressed')}
                                style={styles.profileAvatarContainer}
                            >
                                <Image
                                    source={require('../../../assets/images/avatar/image 1.png')}
                                    style={styles.profileAvatar}
                                />
                            </TouchableOpacity>
                        </View>
                    ),
                    headerStyle: {
                        elevation: 0, // Android
                        shadowOpacity: 0, // iOS
                        borderBottomWidth: 0,
                        backgroundColor: '#FFFFFF',
                    }
                })}
            />
            <Tab.Screen name={'Booking'} component={HomeBookingScreen}/>
            <Tab.Screen name={'Guide'} component={HomeGuideScreen}/>
        </Tab.Navigator>
    );
 }

const styles = StyleSheet.create({
    HomeLogInBtn:{
        marginRight:10,
        width:120,
        backgroundColor:Color.blue,
        borderRadius:3,
        height:35,
        alignItems:'center',
        justifyContent:'center'
    },
    avatar: {
        marginLeft:10,
    },
    headerLeftContainer: {
        paddingLeft: 16,
    },
    greetingText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
    },
    userName: {
        fontWeight: '700',
        color: '#000',
    },
    waveEmoji: {
        fontSize: 20,
    },
    headerRightContainer: {
        paddingRight: 16,
    },
    profileAvatarContainer: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    profileAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    }
})