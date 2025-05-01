import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Color} from "@/constants/Colors";
import {Location} from "@/constants/Utils";

interface Props {
    navigation?: any;
    data?: Location;
}

const formatTemperature = (value:number, unit = 'celsius') => {
    return `${value.toFixed(1)}°C`;
};

export default function dataListViewWidget({ navigation,data }:Props){
    // Handle the case if data is undefined
    if (!data) return null;

    // Format the data date
    const formattedTemp = formatTemperature(data?.temperature);

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('LocationDetails', { dataId: data._id })}
            style={styles.listContainer}
        >
            <View style={styles.imageView}>
                <Image
                    source={{uri:data?.image}}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.listDetailsView}>
                <Text style={styles.listName}>{data.locationName}</Text>
                <View style={styles.listdataRow}>
                    <Ionicons name="ellipsis-vertical-outline" size={14} color="#666"/>
                    <Text style={styles.listdataText}>{data.type}</Text>
                </View>
                <View style={styles.dateRow}>
                    <Ionicons name="thermometer-outline" size={14} color="#666" />
                    <Text style={styles.dateText}>{formattedTemp}</Text>
                </View>
                <View style={styles.dateRow}>
                    <Ionicons name="stopwatch-outline" size={14} color="#666"/>
                    <Text style={styles.dateText}>{data.best_visit_time}</Text>
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
    listdataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    listdataText: {
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
});