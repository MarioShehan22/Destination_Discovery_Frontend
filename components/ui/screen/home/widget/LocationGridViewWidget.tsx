import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "@/constants/Colors";
import {Location} from "@/constants/Utils";

const formatTemperature = (value: number) => {
    return `${value.toFixed(1)}°C`;
};

interface dataGridViewWidgetProps {
    navigation?: any;
    data?: Location;
}

export default function dataGridViewWidget({ navigation,data}: dataGridViewWidgetProps) {
    // Use provided data or fallback to default
    
    const dataData = data || data;

    // Handle the case if data is undefined
    if (!dataData) return null;

    // Format the data temperature
    const formattedTemp = formatTemperature(data.temperature);

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => navigation && navigation.navigate('LocationDetails', { dataId: dataData?._id })}
        >
            {/* data Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{uri:dataData?.image}}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* data Badge */}
                <View style={styles.dataBadge}>
                    <Text style={styles.dataTitle}>{dataData.locationName}</Text>
                    <View style={styles.dataRow}>
                        <Ionicons name="information-circle-outline" size={16} color="#FFFFFF" />
                        <Text style={styles.dataText}>{dataData.to}</Text>
                    </View>
                </View>
            </View>

            {/* Details Section */}
            <View style={styles.detailsContainer}>
                <View style={styles.statsContainer}>
                    <View style={styles.stats}>
                        <View style={styles.statItem}>
                            <Ionicons name="time-outline" size={18} color="#333" />
                            <Text style={styles.statText}>{dataData.best_visit_time}</Text>
                        </View>
                    </View>
                    <View style={styles.stats}>
                        <View style={styles.statItem}>
                            <Ionicons name="construct-outline" size={18} color="#333" />
                            <Text style={styles.statText}>{dataData.facilities}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="thermometer-outline" size={18} color="#333" />
                            <Text style={styles.statText}>{formattedTemp}</Text>
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
        top: 12,
        right: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    completedBadge: {
        backgroundColor: '#4CAF50',
    },
    cancelledBadge: {
        backgroundColor: '#F44336',
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    dataBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    dataTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    dataRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dataText: {
        color: '#FFFFFF',
        fontSize: 14,
        marginLeft: 4,
    },
    detailsContainer: {
        padding: 16,
    },
    statsContainer: {
        flex: 1,
        marginBottom: 8,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
    },
    statText: {
        marginLeft: 6,
        color: '#333333',
        fontSize: 12,
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