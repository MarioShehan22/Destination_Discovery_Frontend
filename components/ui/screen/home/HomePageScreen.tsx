import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { Searchbar } from "react-native-paper";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import PlacesCarousel from "@/components/ui/screen/share/PlacesCarousel"; // Make sure to install expo icons

// Get device width for better responsiveness
const { width } = Dimensions.get('window');

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
            <Searchbar
                placeholder="Search places"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                iconColor="#666"
            />
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
    searchBar: {
        marginBottom: 16,
        elevation: 0,
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        height: 48,
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

});