import {PermissionsAndroid} from "react-native";

async function requestUserPermission() {
    const granted = await PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.granted);
    if (!granted) {
        
    }
}
export default function useNotification() {

}