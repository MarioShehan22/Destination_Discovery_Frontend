import React, {useEffect, useState} from 'react';
import {View, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Color } from "@/constants/Colors";
import AxiosInstance from "@/constants/AxiosInstance";
import {Tour} from "@/constants/Utils";
import { Modal, Text, Button, TextInput, } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper function to format date
const formatDate = (dateString:Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};
interface Props {
    navigation: any;
    route: {
        params: {
            dataId: string;
        };
    };
}
export default function TourDetailsScreen({ navigation,route }:Props) {
    const [activeTab, setActiveTab] = useState('Overview');
    const { dataId } = route.params; // Get dataId from route.params instead of props
    const [tour, setTour] = useState<Tour>({});
    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [participantCount, setParticipantCount] = useState(1);
    const [specialRequests, setSpecialRequests] = useState('');

    const [user, setUser] = useState(null);

    const fetchTour = async () => {
        try {
            const response = await AxiosInstance.get(`tours/find-By/${dataId}`);
            console.log(response.data.data);
            setTour(response.data.data);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.log('Failed to load user:', error);
            }
        };

        fetchUser();
    }, []);

    const submitBooking = async () => {
        try {
            if (!user) {
                console.log('User not loaded yet');
                return;
            }
            console.log(user._id);
            //@ts-ignore
            const response = await AxiosInstance.post(`booking/create`, {
                tourId: tour._id,
                participantCount,
                specialRequests,
                touristId: user._id,  // Pass only the _id string
            });

            if (response.status === 200) {
                hideModal();
            }
        } catch (e) {
            console.log('Booking submission error:', e);
        }
    };

    useEffect(() => {
        // Call fetchAllTour when component mounts or dataId changes
        if (dataId) {
            fetchTour();
        }
    }, [dataId]);

    // Format price for display
    const priceNumber = Number(tour.price);
    const formattedPrice = Number.isFinite(priceNumber)
        ? `$${priceNumber.toFixed(2)}`
        : 'Price N/A';

    // Calculate availability
    const spotsLeft = tour.maxParticipants - tour.currentParticipants;
    const availability = spotsLeft > 0 ? `${spotsLeft} spots left` : 'Fully booked';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Image Header with Back Button */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: tour?.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn2p3xRAPsZDtCigNjp5Zi7FP5hHxErTcUuQ&s' }}
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
                        <Text style={styles.title}>{tour.title}</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={16} color="#FFFFFF" />
                            <Text style={styles.locationText}>{tour.location}</Text>
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
                        <Text style={styles.statText}>{tour.duration} hours</Text>
                    </View>
                </View>

                {/* Content based on active tab */}
                {activeTab === 'Overview' ? (
                    <View style={styles.contentContainer}>
                        <Text style={styles.descriptionText}>{tour.description}</Text>
                    </View>
                ) : (
                    <View style={styles.contentContainer}>
                        <View style={styles.detailSection}>
                            <Text style={styles.detailHeader}>Date & Time</Text>
                            <Text style={styles.detailText}>
                                {formatDate(tour.startDate)},
                                {new Date(tour.startDate).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})} -
                                {new Date(tour.endDate).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}
                            </Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.detailHeader}>Group Size</Text>
                            <Text style={styles.detailText}>Maximum {tour.maxParticipants} people</Text>
                            <Text style={styles.detailText}>{availability}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.detailHeader}>Cancellation Policy</Text>
                            <Text style={styles.detailText}>{tour.cancellationPolicy}</Text>
                        </View>
                    </View>
                )}
            </ScrollView>
            <Modal visible={visible} onDismiss={hideModal} style={{backgroundColor: '#FFFFFF', padding: 20,flex: 1,flexDirection:"column",justifyContent:'center',alignItems:"center"}}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Book This Tour</Text>
                <Text style={{ marginBottom: 8 }}>Number of Participants</Text>
                <TextInput
                    mode="outlined"
                    label="Participants"
                    value={participantCount.toString()}
                    onChangeText={text => setParticipantCount(Number(text.replace(/[^0-9]/g, '')))}
                    keyboardType="numeric"
                    style={{ marginBottom: 16 }}
                    min={1}
                    max={tour.maxParticipants - tour.currentParticipants}
                />
                <Text style={{ marginBottom: 8 }}>Special Requests (optional)</Text>
                <TextInput
                    mode="outlined"
                    label="Special Requests"
                    value={specialRequests}
                    onChangeText={setSpecialRequests}
                    multiline
                    style={{ marginBottom: 16 }}
                />
                <Button
                    mode="contained"
                    onPress={() => {
                        submitBooking()
                    }}
                    style={{ marginTop: 8 }}
                >
                    Confirm Booking
                </Button>
                <Button onPress={hideModal} style={{ marginTop: 8 }} textColor={Color.primary}>
                    Cancel
                </Button>
            </Modal>

            {/* Bottom Booking Bar */}
            <View style={styles.bookingBar}>
                <View>
                    <Text style={styles.priceLabel}>Price per person</Text>
                    <Text style={styles.priceValue}>{formattedPrice}</Text>
                </View>

                <TouchableOpacity style={styles.bookButton} onPress={showModal}>
                    <Text style={styles.bookButtonText}>Book Now</Text>
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
    },
    model_color:{
        backgroundColor: '#FFFFFF',
    }
});