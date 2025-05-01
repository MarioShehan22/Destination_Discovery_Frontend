import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "@/constants/Colors";
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

export default function TourListViewWidget({ navigation,data }:Props) {

    const tour = data;

    if (!tour) return null;

    // Format price for display
    const formattedPrice = `$${tour.price.toFixed(2)}`;

    // Calculate availability percentage for visual indicator
    const availabilityPercentage = Math.floor((tour.currentParticipants / tour.maxParticipants) * 100);

    // Format the tour date
    const formattedDate = formatDate(tour?.startDate);


    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('TourDetails', { dataId: tour?._id })}
            style={styles.listContainer}
        >
            <View style={styles.imageView}>
                {/*<TouchableOpacity*/}
                {/*    style={styles.bookmarkButton}*/}
                {/*    onPress={() => onFavorite && onFavorite(tour._id.$oid || tour._id)}*/}
                {/*>*/}
                {/*    <Ionicons name="heart-outline" size={20} color="#FFFFFF" />*/}
                {/*</TouchableOpacity>*/}
                <Image
                    source={{ uri: tour?.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn2p3xRAPsZDtCigNjp5Zi7FP5hHxErTcUuQ&s' }}
                    style={styles.image}
                    resizeMode={'cover'}
                />
                {tour.status !== 'active' && (
                    <View style={[styles.statusIndicator,
                        tour.status === 'completed' ? styles.completedIndicator : styles.cancelledIndicator
                    ]} />
                )}
            </View>
            <View style={styles.listDetailsView}>
                <Text style={styles.listName}>{tour.title}</Text>
                <View style={styles.listLocationRow}>
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text style={styles.listLocationText}>{tour.location}</Text>
                </View>
                <View style={styles.dateRow}>
                    <Ionicons name="calendar-outline" size={14} color="#666" />
                    <Text style={styles.dateText}>{formattedDate}</Text>
                </View>
                <View style={styles.listBottomRow}>
                    <Text style={styles.listPrice}>{formattedPrice}</Text>
                    <View style={styles.listOccupancyContainer}>
                        <View style={styles.occupancyBar}>
                            <View
                                style={[styles.occupancyFill, {width: `${availabilityPercentage}%`}]}
                            />
                        </View>
                        <Text style={styles.occupancyText}>
                            {tour.currentParticipants}/{tour.maxParticipants} booked
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        width: '100%',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        margin: 2,
    },
    imageView: {
        width: 120,
        height: 100,
        backgroundColor: Color.light,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    bookmarkButton: {
        width: 32,
        height: 32,
        backgroundColor: Color.primary,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 8,
        top: 8,
        zIndex: 1
    },
    statusIndicator: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        left: 8,
        top: 8,
    },
    completedIndicator: {
        backgroundColor: '#4CAF50',
    },
    cancelledIndicator: {
        backgroundColor: '#F44336',
    },
    listDetailsView: {
        flex: 1,
        paddingLeft: 12,
        justifyContent: 'space-between',
    },
    listName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    listLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    listLocationText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    dateText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    listBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listPrice: {
        color: Color.primary,
        fontWeight: 'bold',
        fontSize: 18,
    },
    listOccupancyContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    occupancyBar: {
        width: 80,
        height: 6,
        backgroundColor: '#F0F0F0',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 2,
    },
    occupancyFill: {
        height: '100%',
        backgroundColor: Color.primary,
    },
    occupancyText: {
        fontSize: 12,
        color: '#666',
    }
});