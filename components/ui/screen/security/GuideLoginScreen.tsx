import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useState } from 'react';
import {Color} from "@/constants/Colors";
import axios from "axios";
import getBaseUrl from "@/constants/BASEURL";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GuideLoginScreen({navigation}:any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${getBaseUrl()}users/login`, {
                email,
                password
            });
            if (response.data.token) {
                console.log(response.data.payload.user);
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.payload.user));
                navigation.navigate('GuideProcess');
            }
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <ScrollView style={styles.container}>
            <View style={styles.logoWrapper}>
                <Text style={styles.headerText}>Guide Log In</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.formGroup}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            label="Email"
                            left={<TextInput.Icon icon="email-outline" />}
                            value={email}
                            mode='outlined'
                            style={styles.input}
                            activeUnderlineColor="transparent"
                            underlineColor="transparent"
                            onChangeText={setEmail}
                            contentStyle={styles.inputContent}
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            label="Password"
                            left={<TextInput.Icon icon="lock-outline" />}
                            secureTextEntry={!passwordVisible}
                            mode='outlined'
                            style={styles.input}
                            underlineColor="transparent"
                            activeUnderlineColor="transparent"
                            contentStyle={styles.inputContent}
                            right={
                                <TextInput.Icon
                                    icon={passwordVisible ? 'eye-off' : 'eye'}
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                    color="#888"
                                    size={20}
                                />
                            }
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={()=>{handleLogin()}}>
                    <Text style={styles.loginButtonText}>Log in</Text>
                </TouchableOpacity>

                <View style={styles.or_Button}>
                    <Text style={styles.or_Text}>
                        OR
                    </Text>
                </View>

                <TouchableOpacity style={styles.signUpButton}>
                    <Text style={styles.signButtonText} onPress={()=>{navigation.navigate('SignUp')}}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Color.light
    },
    content: {
        flex: 1,
        paddingTop: 40,
    },
    headerWrapper:{
        alignItems: "flex-end",
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#222'
    },
    logoWrapper: {
        alignItems: "center",
        marginTop: 20
    },
    formGroup: {
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    inputIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    input: {
        flex: 1,
        backgroundColor: 'transparent',
        height: 40,
        padding: 0,
        justifyContent: 'center',
    },
    inputContent: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    loginButton: {
        backgroundColor: '#0066FF',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    or_Button:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    or_Text:{
        marginHorizontal: 10,
        color: '#888',
        fontWeight: '500',
    },
    signUpButton:{
        backgroundColor: Color.darkGray,
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    signButtonText:{
        color: Color.light,
        fontSize: 16,
        fontWeight: '500',
    }
});
