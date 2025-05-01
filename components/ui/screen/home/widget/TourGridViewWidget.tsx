import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Color } from "@/constants/Colors";
import React, {useEffect} from "react";
import {Tour} from "@/constants/Utils";

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
    navigation?: any;
    data?: Tour;
}
export default function TourGridViewWidget({ navigation,data }:Props) {
    const tour = data;

    if (!tour) return null;

    // Safe price formatting
    const priceNumber = Number(tour.price);
    const formattedPrice = Number.isFinite(priceNumber)
        ? `$${priceNumber.toFixed(2)}`
        : 'Price N/A';


    // Calculate availability
    const spotsLeft = (tour.maxParticipants || 0) - (tour.currentParticipants || 0);
    const availability = spotsLeft > 0 ? `${spotsLeft} spots left` : 'Fully booked';

    // Format the tour date
    const formattedDate = formatDate(tour.startDate);
    useEffect(() => {
        console.log(tour);
    }, []);
    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => navigation.navigate('TourDetails', { dataId: tour?._id })}
        >
            {/* Tour Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: tour?.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn2p3xRAPsZDtCigNjp5Zi7FP5hHxErTcUuQ&s' }}
                    style={styles.image}
                    resizeMode="cover"
                />
                {/* Status Badge */}
                {tour.status === 'active' ? (
                    <View style={[styles.statusBadge, styles.activeBadge]}>
                        <Text style={styles.statusText}>Active</Text>
                    </View>
                ) : (
                    <View style={[styles.statusBadge, styles.inactiveBadge]}>
                        <Text style={styles.statusText}>Fully Booked</Text>
                    </View>
                )}
                <View style={styles.locationBadge}>
                    <Text style={styles.tourTitle}>{tour.title}</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={16} color="#FFFFFF" />
                        <Text style={styles.locationText}>{tour.location}</Text>
                    </View>
                </View>
            </View>

            {/* Details Section */}
            <View style={styles.detailsContainer}>
                <View style={styles.statsContainer}>
                    <View style={styles.stats}>
                        <View style={styles.statItem}>
                            <Ionicons name="time-outline" size={18} color="#333" />
                            <Text style={styles.statText}>{tour.duration}h</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="calendar-outline" size={18} color="#333" />
                            <Text style={styles.statText}>{formattedDate}</Text>
                        </View>
                    </View>
                    <View style={styles.stats}>
                        {/* Uncomment if you want to show availability */}
                        {/* <View style={styles.statItem}>
              <Ionicons name="people-outline" size={18} color="#333" />
              <Text style={styles.statText}>{availability}</Text>
            </View> */}
                        <View style={styles.priceContainer}>
                            <Text style={styles.priceText}>{formattedPrice}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        margin: 16,
    },
    stats: {
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imageContainer: {
        backgroundColor: Color.light,
        position: 'relative',
    },
    image: {
        width: '100%',
        aspectRatio: 16 / 12
    },
    statusBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
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
    locationBadge: {
        position: 'absolute',
        bottom: 5,
        left: 5,
        right: 5,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius:'3%',
    },
    tourTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        color: '#FFFFFF',
        fontSize: 14,
        marginLeft: 4,
    },
    detailsContainer: {
        padding: 16,
    },
    statsContainer: {
        flex: 1,
        marginBottom: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    statText: {
        marginLeft: 6,
        color: '#333333',
    },
    priceContainer: {
        backgroundColor: Color.primary,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    priceText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    }
});