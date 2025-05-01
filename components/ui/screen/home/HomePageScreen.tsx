import {StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions, TextInput} from "react-native";
import React, { useState } from "react";
import PlacesCarousel from "@/components/ui/screen/share/PlacesCarousel"; // Make sure to install expo icons


export default function HomePageScreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('Most Viewed');

    const filters = ['Most Viewed', 'Nearby', 'Latest'];

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.titleText}>
                Explore the world
            </Text>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>
                    Popular places
                </Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.searchBar}>
                <TextInput
                    placeholder="Search places"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                />
            </View>
            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                            styles.filterButton,
                            activeFilter === filter && styles.activeFilterButton
                        ]}
                        onPress={() => setActiveFilter(filter)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                activeFilter === filter && styles.activeFilterText
                            ]}
                        >
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <PlacesCarousel navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    viewAllText: {
        fontSize: 14,
        color: '#777',
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginRight: 12,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    activeFilterButton: {
        backgroundColor: '#222',
    },
    filterText: {
        fontSize: 14,
        color: '#666',
    },
    activeFilterText: {
        color: '#fff',
    },
    searchBar: { marginBottom: 16 },
    searchInput: { backgroundColor: '#f3f3f3', borderRadius: 12, padding: 12, fontSize: 16 },
});