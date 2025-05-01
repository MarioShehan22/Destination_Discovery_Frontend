import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const dummyBookings = [
    {
        _id: '1',
        tourId: {
            title: 'Grand Canyon Adventure',
            location: 'Arizona, USA',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60',
            rating: 4.8,
        },
    },
    {
        _id: '2',
        tourId: {
            title: 'Eiffel Tower Tour',
            location: 'Paris, France',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=60',
            rating: 4.6,
        },
    },
    {
        _id: '3',
        tourId: {
            title: 'Safari in Kenya',
            location: 'Nairobi, Kenya',
            image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=60',
            rating: 4.9,
        },
    },
    {
        _id: '4',
        tourId: {
            title: 'Tokyo City Lights',
            location: 'Tokyo, Japan',
            image: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=800&q=60',
            rating: 4.7,
        },
    },
];

const GuideDashboard = () => {
    const [bookings, setBookings] = useState(dummyBookings);
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState('Most Viewed');

    // Filter bookings by search
    const filtered = bookings.filter(
        b =>
            b.tourId &&
            b.tourId.title.toLowerCase().includes(search.toLowerCase())
    );

    // Example tab filtering (can be expanded)
    // For demo, just return filtered list for all tabs
    const tabFiltered = filtered;

    const renderCard = ({ item }:any) => (
        <View style={styles.card}>
            <Image
                source={{ uri: item.tourId.image || 'https://via.placeholder.com/150' }}
                style={styles.cardImage}
            />
            <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>{item.tourId.title}</Text>
                <Text style={styles.cardSubtitle}>{item.tourId.location}</Text>
                <Text style={styles.cardRating}>⭐ {item.tourId.rating?.toFixed(1) || 'N/A'}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Popular Places */}
            <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Popular places</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAll}>View all</Text>
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchBar}>
                <TextInput
                    placeholder="Search places"
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                />
            </View>

            {/* Tabs */}
            <View style={styles.tabsRow}>
                {['Most Viewed', 'Nearby', 'Latest'].map(t => (
                    <TouchableOpacity key={t} onPress={() => setTab(t)}>
                        <Text style={[styles.tab, tab === t && styles.tabActive]}>{t}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Bookings as cards */}
            <FlatList
                data={tabFiltered}
                keyExtractor={item => item._id}
                renderItem={renderCard}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 16 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 24 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    greeting: { fontSize: 24, fontWeight: 'bold' },
    subGreeting: { color: '#888', marginTop: 2 },
    profileImage: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#eee' },
    sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '600' },
    viewAll: { color: '#0d6efd', fontWeight: '500' },
    searchBar: { marginBottom: 16 },
    searchInput: { backgroundColor: '#f3f3f3', borderRadius: 12, padding: 12, fontSize: 16 },
    tabsRow: { flexDirection: 'row', marginBottom: 12 },
    tab: { marginRight: 18, paddingVertical: 6, paddingHorizontal: 16, borderRadius: 18, backgroundColor: '#f3f3f3', color: '#666' },
    tabActive: { backgroundColor: '#222', color: '#fff' },
    card: { width: 220, height: 280, borderRadius: 24, marginRight: 16, overflow: 'hidden', backgroundColor: '#eee', position: 'relative' },
    cardImage: { width: '100%', height: '100%' },
    cardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.4)', padding: 14, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    cardTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    cardSubtitle: { color: '#eee', fontSize: 13, marginTop: 2 },
    cardRating: { color: '#fff', fontSize: 13, marginTop: 2 },
});

export default GuideDashboard;
