import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator,} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import getBaseUrl from '@/constants/BASEURL';
import AxiosInstance from '@/constants/AxiosInstance';
import {Color} from "@/constants/Colors";

// Dummy DateTimePicker for example, replace with actual implementation if needed
function DateTimePicker(props: {
    value: Date;
    mode: string;
    display: string;
    onChange: (event, selectedDate) => void;
    maximumDate: Date;
}) {
    return null;
}

export default function EditTouristProfile ({ navigation }:any){
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    const [tourist, setTourist] = useState({
        firstName: '',
        lastName: '',
        profilePhoto: '',
        profilePhotos: [],
        email: '',
        whatsapp: '',
        birthDate: new Date().toISOString().split('T')[0],
        nationality: '',
        preferences: [],
        languages: [],
        specialRequirement: '',
    });

    const [user, setUser] = useState(null);

    // For adding new preferences/languages
    const [newPreference, setNewPreference] = useState('');
    const [newLanguage, setNewLanguage] = useState('');

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const userId = await AsyncStorage.getItem('user');
            if (userId) {
                setUser(JSON.parse(userId));
            }
            return userId;
        } catch (error) {
            console.log('Failed to load user:', error);
        }
    };

    const formatBirthDate = () => {
        if (!tourist.birthDate) return { day: '', monthName: '', year: '' };

        const date = new Date(tourist.birthDate);
        const day = date.getDate().toString().padStart(2, '0');
        const monthName = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear().toString();

        return { day, monthName, year };
    };

    const { day, monthName, year } = formatBirthDate();

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setTourist({ ...tourist, birthDate: formattedDate });
        }
    };

    useEffect(() => {
        const fetchTouristData = async () => {
            try {
                setLoading(true);
                const userId = await fetchUser();

                if (!userId) {
                    Alert.alert('Error', 'User not authenticated');
                    navigation.navigate('Login');
                    return;
                }

                setTourist((prev) => ({
                    ...prev,
                    userId: userId,
                    touristId: userId,
                }));
            } catch (error) {
                console.error('Error fetching tourist data:', error);
                Alert.alert('Error', 'Failed to load profile data');
            } finally {
                setLoading(false);
                setInitialLoad(false);
            }
        };

        fetchTouristData();
    }, [navigation]);

    const handleImageUpload = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert(
                'Permission needed',
                'Please grant camera roll permissions to upload a photo'
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets && result.assets[0].uri) {
            setTourist({
                ...tourist,
                profilePhoto: result.assets[0].uri,
                profilePhotos: tourist.profilePhotos
                    ? [...tourist.profilePhotos, result.assets[0].uri]
                    : [result.assets[0].uri],
            });
        }
    };

    const handleAddItem = (field, value) => {
        if (value && !tourist[field].includes(value)) {
            setTourist({
                ...tourist,
                [field]: [...tourist[field], value],
            });
        }
    };

    const handleRemoveItem = (field, index) => {
        setTourist({
            ...tourist,
            [field]: tourist[field].filter((_, i) => i !== index),
        });
    };

    const handleChange = (field, value) => {
        setTourist({ ...tourist, [field]: value });
    };

    const saveProfile = async () => {
        try {
            setSaving(true);

            if (!tourist.firstName || !tourist.lastName) {
                Alert.alert('Missing Information', 'First name and last name are required');
                setSaving(false);
                return;
            }

            const userId = await fetchUser();
            if (!userId) {
                Alert.alert('Error', 'User not authenticated');
                navigation.navigate('Login');
                setSaving(false);
                return;
            }

            const touristData = {
                ...tourist,
                userId: userId,
                touristId: userId,
            };

            const response = await AxiosInstance.post(
                `${getBaseUrl()}tourist/create`,
                touristData
            );

            if (response.status === 201 || response.status === 200) {
                Alert.alert('Success', 'Profile saved successfully');
                navigation.navigate('Process');
            } else {
                Alert.alert('Error', 'Failed to save profile');
            }
        } catch (error) {
            console.error('Error saving tourist profile:', error);
            Alert.alert('Error', 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading && initialLoad) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#222" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <View style={styles.flexContainer}>
            <ScrollView
                contentContainerStyle={styles.container}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Process')}>
                        <Ionicons name="arrow-back" size={24} color="#222" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Profile</Text>
                </View>

                {/* Profile Avatar */}
                <View style={styles.avatarContainer}>
                    <Image
                        source={
                            tourist.profilePhoto
                                ? { uri: tourist.profilePhoto }
                                : {
                                    uri:
                                        'https://res.cloudinary.com/dywmv9onv/image/upload/v1745946562/n9xc0ytgmiccjttnr0ik.jpg',
                                }
                        }
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.editPhotoBtn} onPress={handleImageUpload}>
                        <Ionicons name="camera" size={18} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.profileName}>
                        {tourist.firstName} {tourist.lastName}
                    </Text>

                    {/* Image Gallery Preview */}
                    <View style={styles.imagePreviewWrapper}>
                        {tourist.profilePhotos &&
                            tourist.profilePhotos.length > 0 &&
                            tourist.profilePhotos.map((image, index) => (
                                <Image key={index} source={{ uri: image }} style={styles.imagePreview} />
                            ))}
                    </View>
                </View>

                {/* Profile Form */}
                <View style={styles.formContainer}>
                     First Name
                    <Text style={styles.label}>First Name *</Text>
                    <TextInput
                        style={styles.input}
                        value={tourist.firstName}
                        onChangeText={(text) => handleChange('firstName', text)}
                        placeholder="Enter first name"
                    />

                    {/* Last Name */}
                    <Text style={styles.label}>Last Name *</Text>
                    <TextInput
                        style={styles.input}
                        value={tourist.lastName}
                        onChangeText={(text) => handleChange('lastName', text)}
                        placeholder="Enter last name"
                    />

                    {/* Email */}
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        value={tourist.email}
                        onChangeText={(text) => handleChange('email', text)}
                        placeholder="Enter email address"
                        keyboardType="email-address"
                    />

                    {/* WhatsApp */}
                    <Text style={styles.label}>WhatsApp Number</Text>
                    <TextInput
                        style={styles.input}
                        value={tourist.whatsapp}
                        onChangeText={(text) => handleChange('whatsapp', text)}
                        placeholder="Enter WhatsApp number"
                        keyboardType="phone-pad"
                    />

                    {/* Birth Date */}
                    <Text style={styles.label}>Birth Date</Text>
                    <TouchableOpacity
                        style={styles.birthDateRow}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <TextInput style={styles.birthInput} value={day} editable={false} />
                        <TextInput style={styles.birthInput} value={monthName} editable={false} />
                        <TextInput style={styles.birthInput} value={year} editable={false} />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={new Date(tourist.birthDate)}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                            maximumDate={new Date()}
                        />
                    )}

                    {/* Nationality */}
                    <Text style={styles.label}>Nationality</Text>
                    <TextInput
                        style={styles.input}
                        value={tourist.nationality}
                        onChangeText={(text) => handleChange('nationality', text)}
                        placeholder="Enter nationality"
                    />

                    {/* Preferences */}
                    <Text style={styles.label}>Preferences</Text>
                    <View style={styles.chipContainer}>
                        {tourist.preferences.map((pref, idx) => (
                            <View key={idx} style={styles.chip}>
                                <Text style={styles.chipText}>{pref}</Text>
                                <TouchableOpacity onPress={() => handleRemoveItem('preferences', idx)}>
                                    <Ionicons name="close" size={14} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <View style={styles.addRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Add preference"
                            value={newPreference}
                            onChangeText={setNewPreference}
                        />
                        <TouchableOpacity
                            style={styles.addBtn}
                            onPress={() => {
                                handleAddItem('preferences', newPreference);
                                setNewPreference('');
                            }}
                        >
                            <Ionicons name="add" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Languages */}
                    <Text style={styles.label}>Languages</Text>
                    <View style={styles.chipContainer}>
                        {tourist.languages.map((lang, idx) => (
                            <View key={idx} style={styles.chip}>
                                <Text style={styles.chipText}>{lang}</Text>
                                <TouchableOpacity onPress={() => handleRemoveItem('languages', idx)}>
                                    <Ionicons name="close" size={14} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <View style={styles.addRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Add language"
                            value={newLanguage}
                            onChangeText={setNewLanguage}
                        />
                        <TouchableOpacity
                            style={styles.addBtn}
                            onPress={() => {
                                handleAddItem('languages', newLanguage);
                                setNewLanguage('');
                            }}
                        >
                            <Ionicons name="add" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Special Requirement */}
                    <Text style={styles.label}>Special Requirement</Text>
                    <TextInput
                        style={styles.input}
                        value={tourist.specialRequirement}
                        onChangeText={(text) => handleChange('specialRequirement', text)}
                        placeholder="e.g. Wheelchair accessible"
                    />
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                    onPress={saveProfile}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.saveBtnText}>Save Profile</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    flexContainer: {
        flex: 1, // IMPORTANT: allows ScrollView to fill screen and scroll properly
        backgroundColor: Color.light,
    },
    container: {
        padding: 24,
        paddingBottom: 40, // extra padding for scroll space
        borderRadius: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.light,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#222',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
        color: '#222',
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 10,
        backgroundColor: '#eee',
    },
    editPhotoBtn: {
        position: 'absolute',
        bottom: 10,
        right: 110,
        backgroundColor: '#222',
        borderRadius: 16,
        padding: 4,
        zIndex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
    },
    imagePreviewWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
        justifyContent: 'center',
    },
    imagePreview: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    formContainer: {
        marginBottom: 32,
    },
    label: {
        fontSize: 13,
        color: '#bbb',
        marginTop: 16,
        marginBottom: 4,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        fontSize: 16,
        paddingVertical: 8,
        color: '#222',
        marginBottom: 8,
        flex: 1,
    },
    birthDateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    birthInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        fontSize: 16,
        paddingVertical: 8,
        marginHorizontal: 4,
        textAlign: 'center',
        color: '#222',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#222',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 8,
    },
    chipText: {
        color: '#fff',
        marginRight: 6,
    },
    addRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    addBtn: {
        marginLeft: 8,
        backgroundColor: '#222',
        borderRadius: 16,
        padding: 8,
    },
    saveBtn: {
        backgroundColor: '#222',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    saveBtnDisabled: {
        backgroundColor: '#999',
    },
    saveBtnText: {
        color: Color.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 16,
    },
});

