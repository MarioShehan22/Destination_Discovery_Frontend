import React, { useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "@/constants/Colors";
import {Guide} from "@/constants/Utils";
import AvailabilityCalendarScreen from "@/components/ui/screen/share/AvailabilityCalendarScreen";


export default function GuideDetailsScreen({ navigation, route }: any) {
    const [activeTab, setActiveTab] = useState('About');

    // In a real app, you would fetch the guide data based on the guideId from route.params
    // const { guideId } = route.params;

    const guide: Guide = {
        _id: "6437a99b2c7b2e001fc1e871",
        firstName: "John",
        lastName: "Doe",
        profilePhoto: "",
        expertise: ["Hiking", "Wildlife", "History", "Photography", "Cultural Tours"],
        languages: ["English", "Spanish", "French"],
        bio: "Professional tour guide with 5+ years of experience in adventure tourism. Specialized in wildlife tours and historical sites. I'm passionate about sharing local culture and hidden gems with travelers from around the world. My tours focus on authentic experiences and sustainable tourism practices.",
        education: "Bachelor's in Tourism Management",
        phoneNumber: "+1234567890",
        is_active: true
    };

    // Format guide name
    const fullName = `${guide.firstName} ${guide.lastName}`;

    // Format expertise and languages for display
    const expertiseList = guide.expertise.join(", ");
    const languagesList = guide.languages.join(", ");

    // Image URL handling
    const imageUrl = guide.profilePhoto && guide.profilePhoto.length > 0
        ? (guide.profilePhoto.startsWith('http')
            ? guide.profilePhoto
            : `https://your-api-base-url.com/images/${guide.profilePhoto}`)
        : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjIpMnEnpoUEI0dFyMnaQzGgPRhzhx31JItA&s';

    // Handle phone call
    const handlePhoneCall = () => {
        Linking.openURL(`tel:${guide.phoneNumber}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header with Background and Profile Image */}
                <View style={styles.headerContainer}>
                    <View style={styles.backgroundImageContainer}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/800x200?text=Background' }}
                            style={styles.backgroundImage}
                            resizeMode="cover"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation && navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.profileImage}
                            resizeMode="cover"
                        />
                        {guide.is_active ? (
                            <View style={[styles.statusBadge, styles.activeBadge]}>
                                <Text style={styles.statusText}>Active</Text>
                            </View>
                        ) : (
                            <View style={[styles.statusBadge, styles.inactiveBadge]}>
                                <Text style={styles.statusText}>Inactive</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.nameContainer}>
                        <Text style={styles.nameText}>{fullName}</Text>
                        <Text style={styles.educationText}>{guide.education}</Text>
                    </View>
                </View>

                {/* Contact Button */}
                <View style={styles.contactContainer}>
                    <TouchableOpacity style={styles.contactButton} onPress={handlePhoneCall}>
                        <Ionicons name="call-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.contactButtonText}>Contact Guide</Text>
                    </TouchableOpacity>
                </View>

                {/* Tabs Navigation */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'About' && styles.activeTab]}
                        onPress={() => setActiveTab('About')}
                    >
                        <Text style={[styles.tabText, activeTab === 'About' && styles.activeTabText]}>About</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'Expertise' && styles.activeTab]}
                        onPress={() => setActiveTab('Expertise')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Expertise' && styles.activeTabText]}>Expertise</Text>
                    </TouchableOpacity>
                </View>

                {/* Content based on active tab */}
                {activeTab === 'About' ? (
                    <View style={styles.contentContainer}>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Bio</Text>
                            <Text style={styles.bioText}>{guide.bio}</Text>
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Languages</Text>
                            <View style={styles.tagContainer}>
                                {guide.languages.map((language, index) => (
                                    <View key={index} style={styles.tag}>
                                        <Text style={styles.tagText}>{language}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Contact Information</Text>
                            <View style={styles.contactInfoRow}>
                                <Ionicons name="call-outline" size={18} color="#555" />
                                <Text style={styles.contactInfoText}>{guide.phoneNumber}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={()=>{navigation.navigate('AvailabilityCalendar', { guideId: guide?._id })}}
                            style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Check Availability Calendar</Text>
                            {/*<View style={styles.contactInfoRow}>*/}
                            {/*    <Ionicons name="call-outline" size={18} color="#555" />*/}
                            {/*    <Text style={styles.contactInfoText}>{guide.phoneNumber}</Text>*/}
                            {/*</View>*/}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.contentContainer}>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Areas of Expertise</Text>
                            <View style={styles.tagContainer}>
                                {guide.expertise.map((skill, index) => (
                                    <View key={index} style={styles.tag}>
                                        <Text style={styles.tagText}>{skill}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Education & Certifications</Text>
                            <View style={styles.educationCard}>
                                <Ionicons name="school-outline" size={22} color="#555" />
                                <View style={styles.educationDetails}>
                                    <Text style={styles.educationDegree}>{guide.education}</Text>
                                    <Text style={styles.educationSchool}>Tourism Academy</Text>
                                </View>
                            </View>

                            <View style={styles.educationCard}>
                                <Ionicons name="ribbon-outline" size={22} color="#555" />
                                <View style={styles.educationDetails}>
                                    <Text style={styles.educationDegree}>Certified Tour Guide</Text>
                                    <Text style={styles.educationSchool}>National Tourism Board</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    headerContainer: {
        position: 'relative',
        marginBottom: 60,
    },
    backgroundImageContainer: {
        height: 150,
        backgroundColor: Color.primary,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        opacity: 0.6,
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    profileImageContainer: {
        position: 'absolute',
        bottom: -50,
        left: 24,
        borderRadius: 75,
        width: 100,
        height: 100,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    statusBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    activeBadge: {
        backgroundColor: '#4CAF50',
    },
    inactiveBadge: {
        backgroundColor: '#F44336',
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    nameContainer: {
        position: 'absolute',
        bottom: -40,
        left: 140,
        right: 20,
    },
    nameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
    },
    educationText: {
        fontSize: 14,
        color: '#777777',
        marginTop: 2,
    },
    contactContainer: {
        paddingHorizontal: 24,
        marginTop: 8,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    contactButton: {
        backgroundColor: Color.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 6,
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#FFFFFF',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: Color.primary,
    },
    tabText: {
        fontSize: 16,
        color: '#777',
    },
    activeTabText: {
        color: Color.primary,
        fontWeight: '600',
    },
    contentContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginBottom: 16,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    bioText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 14,
        color: '#555',
    },
    contactInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactInfoText: {
        fontSize: 15,
        color: '#555',
        marginLeft: 8,
    },
    educationCard: {
        flexDirection: 'row',
        backgroundColor: '#f7f7f7',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    educationDetails: {
        marginLeft: 12,
    },
    educationDegree: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    educationSchool: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    }
});