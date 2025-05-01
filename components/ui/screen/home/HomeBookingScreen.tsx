import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo

// Mock data - replace with your actual API call
const fetchUserBookings = async (userId) => {
    // Replace this with your actual API fetch
    try {
        // Example API call:
        // const response = await fetch(`your-api-url/bookings/user/${userId}`);
        // const data = await response.json();
        // return data;

        // Mock data for demonstration
        return [
            {
                _id: '1',
                tourId: { _id: 't1', name: 'Paris City Tour' },
                participantCount: 2,
                totalPrice: 199.99,
                status: 'PENDING',
                bookingDate: new Date('2025-04-20'),
                paymentStatus: 'PENDING',
                specialRequests: 'Need vegetarian food options'
            },
            {
                _id: '2',
                tourId: { _id: 't2', name: 'London Explorer' },
                participantCount: 1,
                totalPrice: 149.50,
                status: 'COMPLETED',
                bookingDate: new Date('2025-03-15'),
                paymentStatus: 'COMPLETED',
                specialRequests: ''
            },
            {
                _id: '3',
                tourId: { _id: 't3', name: 'Rome Adventure' },
                participantCount: 4,
                totalPrice: 399.99,
                status: 'CANCELLED',
                bookingDate: new Date('2025-05-10'),
                paymentStatus: 'REFUNDED',
                specialRequests: 'Early check-in if possible'
            }
        ];
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
    }
};

export default function BookingManagement ({navigation}:any){
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('ALL');

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const userBookings = await fetchUserBookings();
            setBookings(userBookings);
        } catch (error) {
            Alert.alert('Error', 'Failed to load your bookings');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadBookings();
    };

    const getFilteredBookings = () => {
        if (selectedFilter === 'ALL') return bookings;
        return bookings.filter(booking => booking.status === selectedFilter);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#FFA500'; // Orange
            case 'COMPLETED': return '#4CAF50'; // Green
            case 'CANCELLED': return '#F44336'; // Red
            case 'REJECTED': return '#9E9E9E'; // Grey
            default: return '#000000';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#FFA500'; // Orange
            case 'COMPLETED': return '#4CAF50'; // Green
            case 'REFUNDED': return '#2196F3'; // Blue
            default: return '#000000';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderBookingItem = ({ item }) => (
        <TouchableOpacity
            style={styles.bookingCard}
            onPress={() => Alert.alert('Booking Details', `Booking ID: ${item._id}\nSpecial Requests: ${item.specialRequests || 'None'}`)}
        >
            <View style={styles.bookingHeader}>
                <Text style={styles.tourName}>{item.tourId.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#555" />
                    <Text style={styles.detailText}>Booked on: {formatDate(item.bookingDate)}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Ionicons name="people-outline" size={16} color="#555" />
                    <Text style={styles.detailText}>Participants: {item.participantCount}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Ionicons name="card-outline" size={16} color="#555" />
                    <Text style={styles.detailText}>
                        Payment: <Text style={{ color: getPaymentStatusColor(item.paymentStatus) }}>{item.paymentStatus}</Text>
                    </Text>
                </View>
            </View>

            <View style={styles.priceContainer}>
                <Text style={styles.totalPrice}>${item.totalPrice.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderFilterButton = (filter, label) => (
        <TouchableOpacity
            style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(filter)}
        >
            <Text
                style={[
                    styles.filterButtonText,
                    selectedFilter === filter && styles.filterButtonTextActive
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.filterContainer}>
                {renderFilterButton('ALL', 'All')}
                {renderFilterButton('PENDING', 'Pending')}
                {renderFilterButton('COMPLETED', 'Completed')}
                {renderFilterButton('CANCELLED', 'Cancelled')}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0066cc" />
                </View>
            ) : bookings.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="calendar-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>You don't have any bookings yet</Text>
                </View>
            ) : (
                <FlatList
                    data={getFilteredBookings()}
                    renderItem={renderBookingItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#0066cc"]}
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#f0f0f0',
    },
    filterButtonActive: {
        backgroundColor: '#0066cc',
    },
    filterButtonText: {
        fontSize: 14,
        color: '#555',
    },
    filterButtonTextActive: {
        color: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    listContainer: {
        padding: 16,
    },
    bookingCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    tourName: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    bookingDetails: {
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#555',
    },
    priceContainer: {
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 12,
        alignItems: 'flex-end',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});
