import {Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";

const image1 = require('../../../../assets/images/Location/image1.png'); // Train bridge image
const image2 = require('../../../../assets/images/Location/image1.png'); // Flower field image

// Get device width for better responsiveness
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8; // Card takes 80% of screen width
const CARD_MARGIN = 10;

export default function PlacesCarousel({navigation}: {navigation: any}) {
    return (
        <View>
            {/* Places Carousel */}
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContainer}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + CARD_MARGIN}
                snapToAlignment="center"
            >
                {/* Nine Arch Bridge Card */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('PlaceDetail')}
                >
                    <Image
                        source={image1}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
                    <View style={styles.favoriteButton}>
                        <MaterialIcons name="favorite-border" size={24} color="white" />
                    </View>
                    <View style={styles.cardOverlay}>
                        <Text style={styles.placeName}>Nine Arch Bridge</Text>
                        <View style={styles.locationRow}>
                            <MaterialIcons name="location-on" size={16} color="white" />
                            <Text style={styles.locationText}>Ella, Srilanka</Text>
                        </View>
                        <View style={styles.ratingRow}>
                            <MaterialIcons name="star" size={16} color="white" />
                            <Text style={styles.ratingText}>4.8</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Horton Place Card */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('PlaceDetail')}
                >
                    <Image
                        source={image2}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
                    <View style={styles.favoriteButton}>
                        <MaterialIcons name="favorite-border" size={24} color="white" />
                    </View>
                    <View style={styles.cardOverlay}>
                        <Text style={styles.placeName}>Horton Place</Text>
                        <View style={styles.locationRow}>
                            <MaterialIcons name="location-on" size={16} color="white" />
                            <Text style={styles.locationText}>Nuwara Elle</Text>
                        </View>
                        <View style={styles.ratingRow}>
                            <MaterialIcons name="star" size={16} color="white" />
                            <Text style={styles.ratingText}>4.6</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    carouselContainer: {
        paddingBottom: 16,
    },
    card: {
        width: CARD_WIDTH,
        height: 240,
        marginRight: CARD_MARGIN,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    favoriteButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 6,
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    placeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    locationText: {
        color: 'white',
        fontSize: 14,
        marginLeft: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        color: 'white',
        fontSize: 14,
        marginLeft: 4,
    },
});