import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Bell } from 'react-native-feather';

const NotificationBell = ({
                              count = 0,
                              onPress,
                              color = '#333',
                              size = 24,
                              badgeColor = '#FF3B30',
                              badgeTextColor = '#FFF',
                              animated = true
                          }) => {
    const [scale] = useState(new Animated.Value(1));
    const [rotation] = useState(new Animated.Value(0));

    // Animation when count changes
    useEffect(() => {
        if (animated && count > 0) {
            // Scale up
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.2,
                    duration: 100,
                    useNativeDriver: true,
                }),
                // Scale back
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                // Slight rotation right
                Animated.timing(rotation, {
                    toValue: 0.05,
                    duration: 50,
                    useNativeDriver: true,
                }),
                // Rotation left
                Animated.timing(rotation, {
                    toValue: -0.05,
                    duration: 100,
                    useNativeDriver: true,
                }),
                // Back to center
                Animated.timing(rotation, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [count, animated]);

    const animatedStyle = {
        transform: [
            { scale: scale },
            { rotate: rotation.interpolate({
                    inputRange: [-1, 1],
                    outputRange: ['-30deg', '30deg']
                })
            }
        ]
    };

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Animated.View style={[styles.iconContainer, animatedStyle]}>
                <Bell stroke={color} width={size} height={size} />

                {count > 0 && (
                    <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                        <Text style={[styles.badgeText, { color: badgeTextColor }]}>
                            {count > 99 ? '99+' : count}
                        </Text>
                    </View>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
    },
    iconContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -10,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default NotificationBell;