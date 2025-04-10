import {createStackNavigator} from "@react-navigation/stack";
import HomeBottomTabNavigation from "@/app/navigation/tab-navigation/HomeBottomTabNavigation";
import LoginScreen from "@/components/ui/screen/security/LoginScreen";
import SignUpScreen from "@/components/ui/screen/security/SignUpScreen";

const Stack = createStackNavigator();
export default function StackNavigator(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name={'Process'}
                options={{headerLeft:()=>null, headerShown:false}}
                component={HomeBottomTabNavigation}
            />
            <Stack.Screen
                name={'Login'}
                options={{headerLeft:()=>null, headerShown:false}}
                component={LoginScreen}
            />
            <Stack.Screen
                name={'SignUp'}
                options={{headerLeft:()=>null, headerShown:false}}
                component={SignUpScreen}
            />
        </Stack.Navigator>
    )
}