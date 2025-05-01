import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "@/constants/Colors";

interface GuideProps {
    _id: string;
    firstName: string;
    lastName: string;
    profilePhoto: string;
    expertise: string[];
    languages: string[];
    bio: string;
    education: string;
    phoneNumber: string;
    is_active: boolean;
}

interface GuideGridViewWidgetProps {
    navigation?: any;
    //guide?: GuideProps;
}

export default function GuideGridViewWidget({ navigation }: GuideGridViewWidgetProps) {
    // Default guide data if none provided
    const defaultGuide: GuideProps = {
        _id: "6437a99b2c7b2e001fc1e871",
        firstName: "John",
        lastName: "Doe",
        profilePhoto: "",
        expertise: ["Hiking", "Wildlife", "History"],
        languages: ["English", "Spanish"],
        bio: "Professional tour guide with 5+ years of experience in adventure tourism.",
        education: "Bachelor's in Tourism Management",
        phoneNumber: "+1234567890",
        is_active: true
    };

    const guideData = defaultGuide;
    //
    // // Handle the case if guide is undefined
    if (!guideData) return null;

    // Format guide name
    const fullName = `${guideData.firstName} ${guideData.lastName}`;

    // Format expertise and languages
    const expertiseText = guideData.expertise.slice(0, 2).join(", ") +
        (guideData.expertise.length > 2 ? "..." : "");
    const languagesText = guideData.languages.join(", ");

    // Image URL handling - handle both full URLs and relative paths
    const imageUrl = guideData.profilePhoto && guideData.profilePhoto.length > 0
        ? (guideData.profilePhoto.startsWith('http')
            ? guideData.profilePhoto
            : `https://your-api-base-url.com/images/${guideData.profilePhoto}`)
        : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjIpMnEnpoUEI0dFyMnaQzGgPRhzhx31JItA&s';

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => navigation && navigation.navigate('GuideDetails', { guideId: guideData._id })}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.locationBadge}>
                    <Text style={styles.nameText}>{fullName}</Text>
                </View>
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.infoRow}>
                    <Ionicons name="school-outline" size={16} color="#555" />
                    <Text style={styles.infoText} numberOfLines={1}>{guideData.education}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="star-outline" size={16} color="#555" />
                    <Text style={styles.infoText} numberOfLines={1}>{expertiseText}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="language-outline" size={16} color="#555" />
                    <Text style={styles.infoText}>{languagesText}</Text>
                </View>
                <View style={styles.statsContainer}>
                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => navigation && navigation.navigate('Contact', { guideId: guideData._id })}
                    >
                        <Ionicons name="call-outline" size={16} color="#FFFFFF" />
                        <Text style={styles.contactButtonText}>Contact</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() => navigation && navigation.navigate('GuideDetails', { guideId: guideData._id })}
                    >
                        <Text style={styles.detailsButtonText}>View Details</Text>
                    </TouchableOpacity>
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
    imageContainer: {
        backgroundColor: Color.light,
        position: 'relative',
    },
    image: {
        width: '100%',
        aspectRatio: 16 / 12
    },
    detailsContainer: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    locationBadge:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    nameText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    infoText: {
        marginLeft: 6,
        color: '#555555',
        fontSize: 14,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    contactButton: {
        backgroundColor: Color.primary,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactButtonText: {
        color: '#FFFFFF',
        fontWeight: '500',
        fontSize: 12,
        marginLeft: 4,
    },
    detailsButton: {
        backgroundColor: '#F0F0F0',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    detailsButtonText: {
        color: '#333333',
        fontWeight: '500',
        fontSize: 12,
    }
});