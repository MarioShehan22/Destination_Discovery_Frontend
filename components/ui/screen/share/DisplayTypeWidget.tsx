import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from "react-native-paper";
import {useState} from "react";
import {Color} from "@/constants/Colors";

export default function DisplayTypeWidget({callback}:any) {
    const [gridState, setGridState]=useState(true);
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={()=>{
                    setGridState(true);
                    callback(true);
                }}
                style={{...styles.button, backgroundColor:gridState?Color.blue:Color.darkGray}}>
                <Icon size={20} source={'grid'} color={gridState?Color.light:Color.blue}/>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={()=>{
                    setGridState(false);
                    callback(false);
                }}
                style={{...styles.button, backgroundColor:gridState?Color.darkGray:Color.blue}}>
                <Icon size={20} source={'menu'} color={gridState?Color.blue:Color.light}/>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    button: {
        width: 55,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flexDirection:'row',
        justifyContent:'flex-end',
    }
})