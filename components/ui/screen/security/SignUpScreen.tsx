import {useState} from "react";
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Icon, TextInput} from "react-native-paper";
import {Color} from "@/constants/Colors";

const logo = require('../../../../assets/images/logo/logo.png');

export default function SignUpScreen({navigation}:any) {
    const [email, setEmail] = useState('');
    const [passwordDisplayState, setPasswordDisplayState] = useState(false);
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    return (
        <ScrollView style={styles.container}>
            <View style={styles.logoWrapper}>
                <Image source={logo} style={styles.logo} resizeMode={'contain'}/>
            </View>
            <View style={styles.inputOuter}>
                <View style={styles.formGroup}>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                </View>
                <View style={styles.formGroup}>
                    <TextInput
                        label="Password"
                        secureTextEntry={!passwordDisplayState}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        right={<TextInput.Icon onPress={() => {
                            setPasswordDisplayState(!passwordDisplayState)
                        }} size={20} icon={passwordDisplayState ? 'eye' : 'eye-off'}/>}
                    />
                </View>
                <View style={styles.formGroup}>
                    <TextInput
                        label="User name"
                        value={displayName}
                        onChangeText={(text) => setDisplayName(text)}
                    />
                </View>
                <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginText}>Sign Up</Text>
                </TouchableOpacity>
                <Text style={styles.separateText}>OR</Text>
                <View style={styles.socialLoginWrapper}>
                    <TouchableOpacity style={styles.iconOuter}>
                        <Icon size={20} source={'google'}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconOuter}>
                        <Icon size={20} source={'facebook'}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconOuter}>
                        <Icon size={20} source={'twitter'}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconOuter}>
                        <Icon size={20} source={'instagram'}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{...styles.loginButton,backgroundColor:Color.primary}}>
                    <Text style={styles.loginText} onPress={()=>{navigation.navigate('Login')}}>Already have an Account</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    loginText: {
        color: Color.light
    },
    loginButton: {
        backgroundColor: Color.blue,
        height: 50,
        marginTop: 30,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 60
    },
    logoWrapper: {
        alignItems: "center",
        marginTop: 20
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: Color.light
    },
    formGroup: {
        marginBottom: 10,
    },
    inputOuter: {
        marginTop: 50,
    },
    iconOuter: {
        backgroundColor: Color.darkGray,
        width:50,
        height:50,
        borderRadius:50,
        alignItems:'center',
        justifyContent:'center',
    },
    socialLoginWrapper: {
        flexDirection: 'row',
        marginTop:20,
        justifyContent:'space-around',
    },
    separateText: {
        textAlign: 'center',
        marginTop: 20
    },
})