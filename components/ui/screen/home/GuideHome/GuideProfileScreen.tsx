import React, {useState} from "react";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

const GuideProfileScreen = ({navigation}:any) => {
    const [tourist, setTourist] = useState({});

    // For birthDate display
    const [year, month, day] = tourist.birthDate.split('-');
    const monthName = new Date(tourist.birthDate).toLocaleString('default', { month: 'long' });

    // Handlers for array fields
    const handleAddItem = (field:any, value:any) => {
        // @ts-ignore
        if (value && !tourist[field].includes(value)) {
            // @ts-ignore
            setTourist({
                ...tourist,
                [field]: [...tourist[field], value]
            });
        }
    };
    const handleRemoveItem = (field:any, index:any) => {
        // @ts-ignore
        setTourist({
            ...tourist,
            [field]: tourist[field].filter((_, i) => i !== index)
        });
    };

    // Handler for text fields
    const handleChange = (field, value) => {
        setTourist({ ...tourist, [field]: value });
    };

    // For adding new preferences/languages
    const [newPreference, setNewPreference] = useState('');
    const [newLanguage, setNewLanguage] = useState('');

    // Dummy profile photo if empty
    // const profilePhotoSource = tourist.profilePhoto
    //     ? { uri: tourist.profilePhoto }
    //     : require('./assets/default-avatar.png'); // Make sure this exists

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={()=>{navigation.navigate('Process')}}
                >
                    <Ionicons name="arrow-back" size={24} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>

            {/* Profile Avatar */}
            <View style={styles.avatarContainer}>
                {/*<Image*/}
                {/*    source={profilePhotoSource}*/}
                {/*    style={styles.avatar}*/}
                {/*/>*/}
                <TouchableOpacity style={styles.editPhotoBtn}>
                    <Ionicons name="camera" size={18} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.profileName}>{tourist.firstName} {tourist.lastName}</Text>
            </View>

            {/* Profile Form */}
            <View style={styles.formContainer}>
                {/* Full Name */}
                <Text style={styles.label}>First Name</Text>
                <TextInput
                    style={styles.input}
                    value={tourist.firstName}
                    onChangeText={text => handleChange('firstName', text)}
                />
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                    style={styles.input}
                    value={tourist.lastName}
                    onChangeText={text => handleChange('lastName', text)}
                />

                {/* Email */}
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    value={tourist.email}
                    onChangeText={text => handleChange('email', text)}
                />

                {/* WhatsApp */}
                <Text style={styles.label}>WhatsApp Number</Text>
                <TextInput
                    style={styles.input}
                    value={tourist.whatsapp}
                    onChangeText={text => handleChange('whatsapp', text)}
                />

                {/* Birth Date */}
                <Text style={styles.label}>Birth Date</Text>
                <View style={styles.birthDateRow}>
                    <TextInput style={styles.birthInput} value={day} editable={false} />
                    <TextInput style={styles.birthInput} value={monthName} editable={false} />
                    <TextInput style={styles.birthInput} value={year} editable={false} />
                </View>

                {/* Nationality */}
                <Text style={styles.label}>Nationality</Text>
                <TextInput
                    style={styles.input}
                    value={tourist.nationality}
                    onChangeText={text => handleChange('nationality', text)}
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
                        }}>
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
                        }}>
                        <Ionicons name="add" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Special Requirement */}
                <Text style={styles.label}>Special Requirement</Text>
                <TextInput
                    style={styles.input}
                    value={tourist.specialRequirement}
                    onChangeText={text => handleChange('specialRequirement', text)}
                    placeholder="e.g. Wheelchair accessible"
                />
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>

            {/* Bottom Navigation Icons */}
            <View style={styles.bottomNav}>
                <Ionicons name="home-outline" size={28} color="#bbb" />
                <Ionicons name="calendar-outline" size={28} color="#bbb" />
                <Ionicons name="heart-outline" size={28} color="#bbb" />
                <Ionicons name="person-outline" size={28} color="#bbb" />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 24,
        flexGrow: 1,
        borderRadius: 24,
        minHeight: '100%',
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
    saveBtnText: {
        color: '#fff',
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