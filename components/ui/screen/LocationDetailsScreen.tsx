import React, {useEffect, useState} from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "@/constants/Colors";
import getBaseUrl from "@/constants/BASEURL";
import AxiosInstance from "@/constants/AxiosInstance";
import {Location} from "@/constants/Utils";

interface Props {
    navigation: any;
    route: {
        params: {
            dataId: string;
        };
    };
}

export default function LocationDetailsScreen({ navigation, route}: Props) {
    const { dataId } = route.params; // Get dataId from route.params instead of props
    const [activeTab, setActiveTab] = useState('Overview');
    const [location, setLocation] = useState<Location>({
        _id: "",
        locationName: "",
        description: "",
        temperature: 0,
        type: "",
        accessibility_info: "",
        best_visit_time: "",
        facilities: "",
        to: "",
        image: "",
        is_active: "",
    });

    const fetchAllLocations = async () => {
        try {
            const response = await AxiosInstance.get(`${getBaseUrl()}location/find/${dataId}`);
            setLocation(response.data.data);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        // Call fetchAllLocations when component mounts or dataId changes
        if (dataId) {
            fetchAllLocations();
        }
    }, [dataId]);

    // Helper function to format temperature
    const formatTemperature = (value: number) => {
        return `${value.toFixed(1)}°C`;
    };

    // @ts-ignore
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Image Header with Back Button */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{uri:location.image}}
                        style={styles.headerImage}
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation && navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    {/* Title Overlay */}
                    <View style={styles.titleOverlay}>
                        <Text style={styles.title}>{location.locationName}</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={16} color="#FFFFFF" />
                            <Text style={styles.locationText}>{location.to}</Text>
                        </View>
                    </View>
                </View>

                {/* Tabs Navigation */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'Overview' && styles.activeTab]}
                        onPress={() => setActiveTab('Overview')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Overview' && styles.activeTabText]}>Overview</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'Details' && styles.activeTab]}
                        onPress={() => setActiveTab('Details')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Details' && styles.activeTabText]}>Details</Text>
                    </TouchableOpacity>
                </View>

                {/* Key Info Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Ionicons name="time-outline" size={20} color="#555" />
                        <Text style={styles.statText}>{location.best_visit_time}</Text>
                    </View>

                    <View style={styles.statItem}>
                        <Ionicons name="thermometer-outline" size={20} color="#555" />
                        <Text style={styles.statText}>{formatTemperature(location.temperature)}</Text>
                    </View>
                </View>

                {/* Content based on active tab */}
                {activeTab === 'Overview' ? (
                    <View style={styles.contentContainer}>
                        <Text style={styles.descriptionText}>{location.description}</Text>
                    </View>
                ) : (
                    <View style={styles.contentContainer}>
                        <View style={styles.detailSection}>
                            <Text style={styles.detailHeader}>Location Type</Text>
                            <Text style={styles.detailText}>{location.type}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.detailHeader}>Accessibility</Text>
                            <Text style={styles.detailText}>{location.accessibility_info}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.detailHeader}>Facilities</Text>
                            <Text style={styles.detailText}>{location.facilities}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.detailHeader}>Best Time to Visit</Text>
                            <Text style={styles.detailText}>{location.best_visit_time}</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Booking Bar */}
            <View style={styles.bookingBar}>
                <View>
                    <Text style={styles.priceLabel}>Current Status</Text>
                    <Text style={styles.priceValue}>{location.is_active}</Text>
                </View>

                <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Visit Now</Text>
                </TouchableOpacity>
            </View>
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
    imageContainer: {
        position: 'relative',
        backgroundColor: Color.light,
    },
    headerImage: {
        width: '100%',
        height: 300,
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
    },
    titleOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 16,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginLeft: 4,
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#FFFFFF',
    },
    tabButton: {
        paddingVertical: 16,
        paddingHorizontal: 24,
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
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        marginLeft: 8,
        fontSize: 15,
        color: '#555',
    },
    contentContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginTop: 8,
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#666',
    },
    detailSection: {
        marginBottom: 16,
    },
    detailHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    detailText: {
        fontSize: 15,
        color: '#666',
        lineHeight: 20,
    },
    bookingBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    priceLabel: {
        fontSize: 14,
        color: '#777',
    },
    priceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Color.primary,
    },
    bookButton: {
        backgroundColor: Color.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    bookButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});