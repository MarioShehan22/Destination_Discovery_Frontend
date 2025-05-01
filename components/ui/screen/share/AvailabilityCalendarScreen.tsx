import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {Modal,TextInput} from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons';
import { Color } from '@/constants/Colors';
import AxiosInstance from "@/constants/AxiosInstance";
import getBaseUrl from "@/constants/BASEURL";

//@ts-ignore
const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};
//@ts-ignore
const formatShortDate = (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};
//@ts-ignore
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
//@ts-ignore
const addWeeks = (date, weeks) => {
    return addDays(date, weeks * 7);
};
//@ts-ignore
const addMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};
//@ts-ignore
const isSameDay = (date1, date2) => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

//@ts-ignore route
interface Props {
    navigation: any;
    route: {
        params: {
            guideId: string;
        };
    };
}

export default function AvailabilityCalendarScreen({ navigation,route}:Props) {

    const { guideId } = route.params; // Use logged-in guide ID in production

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availabilityData, setAvailabilityData] = useState([]);
    const [selectedDayAvailability, setSelectedDayAvailability] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [calendarDates, setCalendarDates] = useState([]);

    // Modal form state
    const [timeSlots, setTimeSlots] = useState([{ startTime: '09:00', endTime: '10:00' }]);
    const [recurrenceType, setRecurrenceType] = useState('none');
    const [recurrenceEndDate, setRecurrenceEndDate] = useState(addDays(new Date(), 30));

    // Edit mode
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentAvailabilityId, setCurrentAvailabilityId] = useState(null);

    // Generate calendar dates for the current month
    useEffect(() => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);

        const dates = [];
        let currentDate = new Date(startOfMonth);

        while (currentDate <= endOfMonth) {
            dates.push(new Date(currentDate));
            currentDate = addDays(currentDate, 1);
        }
        //@ts-ignore
        setCalendarDates(dates);
    }, []);

    // Load availability data when component mounts
    useEffect(() => {
        fetchAvailabilityData();
    }, []);

    // Filter availability data for selected date
    useEffect(() => {
        if (selectedDate && availabilityData.length > 0) {
            const dayAvailability = availabilityData.filter(item =>
                //@ts-ignore
                isSameDay(new Date(item.date), selectedDate)
            );
            setSelectedDayAvailability(dayAvailability);
        } else {
            setSelectedDayAvailability([]);
        }
    }, [selectedDate, availabilityData]);

    // Fetch guide's availability data from API
    const fetchAvailabilityData = async () => {
        try {
            const startDate = formatShortDate(new Date());
            const endDate = formatShortDate(addDays(new Date(), 60));

            //Mock data for testing - replace with actual API call
            const response = await AxiosInstance.get(`${getBaseUrl()}availability`, {
              params: { guideId, startDate, endDate }
            });
            console.log(response.data);
            //@ts-ignore
            setAvailabilityData(response.data);
        } catch (error) {
            console.error('Error fetching availability data:', error);
            Alert.alert('Error', 'Failed to load availability data');
        }
    };

    // Format time for display (convert 24h format to 12h format)
    //@ts-ignore
    const formatTimeForDisplay = (time24h) => {
        const [hours, minutes] = time24h.split(':');
        const hour = parseInt(hours, 10);
        const suffix = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${suffix}`;
    };

    // Add new time slot to form
    const addTimeSlot = () => {
        const lastSlot = timeSlots[timeSlots.length - 1];
        // Parse last end time and add 1 hour for new slot's start time
        const [hours, minutes] = lastSlot.endTime.split(':');
        const newStartHour = parseInt(hours, 10);
        const newEndHour = newStartHour + 1;

        // Format new times
        const newStartTime = `${String(newStartHour).padStart(2, '0')}:${minutes}`;
        const newEndTime = `${String(newEndHour > 23 ? 23 : newEndHour).padStart(2, '0')}:${minutes}`;

        setTimeSlots([...timeSlots, { startTime: newStartTime, endTime: newEndTime }]);
    };

    // Remove time slot from form
    //@ts-ignore
    const removeTimeSlot = (index) => {
        if (timeSlots.length > 1) {
            const updatedSlots = [...timeSlots];
            updatedSlots.splice(index, 1);
            setTimeSlots(updatedSlots);
        }
    };

    // Update time slot value
    //@ts-ignore
    const updateTimeSlot = (index, field, value) => {
        const updatedSlots = [...timeSlots];
        // @ts-ignore
        updatedSlots[index][field] = value;
        setTimeSlots(updatedSlots);
    };

    // Submit availability form
    const submitAvailability = async () => {
        try {
            // Validate time slots (end time > start time for each slot)
            for (const slot of timeSlots) {
                if (slot.startTime >= slot.endTime) {
                    Alert.alert('Invalid Time', 'End time must be later than start time');
                    return;
                }
            }
            console.log(guideId);
            const payload = {
                guideId,
                date: formatShortDate(selectedDate),
                timeSlots,
                recurrence: recurrenceType,
                recurrenceEndDate: recurrenceType !== 'none' ? formatShortDate(recurrenceEndDate) : null
            };

            // In a real app, uncomment and use the appropriate API call:
            if (isEditMode && currentAvailabilityId) {
              // Update existing availability
              await AxiosInstance.put(`${getBaseUrl()}availability/${currentAvailabilityId}`, {
                timeSlots
              });
            } else {
              // Create new availability
              await AxiosInstance.post(`${getBaseUrl()}availability/set`, payload);
            }

            // For now, just simulate success and update local state
            if (isEditMode && currentAvailabilityId) {
                // Update existing availability in mock data
                const updatedData = availabilityData.map(item =>
                    //@ts-ignore
                    item._id === currentAvailabilityId ? { ...item, timeSlots } : item
                );
                //@ts-ignore
                setAvailabilityData(updatedData);
            } else {
                // Create new availability in mock data
                const newId = String(Date.now());
                const newAvailability = {
                    _id: newId,
                    guideId,
                    date: selectedDate.toISOString(),
                    timeSlots,
                    recurrence: recurrenceType,
                    recurrenceEndDate: recurrenceType !== 'none' ? recurrenceEndDate.toISOString() : null
                };
                //@ts-ignore
                setAvailabilityData([...availabilityData, newAvailability]);
            }

            // Reset and refresh data
            setIsModalVisible(false);
            resetForm();
            setSelectedDayAvailability(availabilityData.filter(item =>
                //@ts-ignore
                isSameDay(new Date(item.date), selectedDate)
            ));

            Alert.alert('Success', 'Availability saved successfully');
        } catch (error) {
            console.error('Error saving availability:', error);
            Alert.alert('Error', 'Failed to save availability');
        }
    };

    // Delete availability
    //@ts-ignore
    const deleteAvailabilitySlot = async (availabilityId) => {
        try {
            // In a real app, uncomment:
            await AxiosInstance.delete(`${getBaseUrl()}/availability/${availabilityId}`);

            // For now, just update local state
            //@ts-ignore
            const updatedData = availabilityData.filter(item => item._id !== availabilityId);
            setAvailabilityData(updatedData);
            setSelectedDayAvailability(prevAvailability =>
                //@ts-ignore
                prevAvailability.filter(item => item._id !== availabilityId)
            );

            Alert.alert('Success', 'Availability deleted successfully');
        } catch (error) {
            console.error('Error deleting availability:', error);
            Alert.alert('Error', 'Failed to delete availability');
        }
    };

    // Open modal to add availability for selected date
    const handleAddAvailability = () => {
        setIsEditMode(false);
        setCurrentAvailabilityId(null);
        resetForm();
        setIsModalVisible(true);
    };

    // Open modal to edit existing availability
    //@ts-ignore
    const handleEditAvailability = (availability) => {
        setIsEditMode(true);
        setCurrentAvailabilityId(availability._id);
        setTimeSlots(availability.timeSlots);
        setIsModalVisible(true);
    };

    // Reset form to default values
    const resetForm = () => {
        setTimeSlots([{ startTime: '09:00', endTime: '10:00' }]);
        setRecurrenceType('none');
        setRecurrenceEndDate(addDays(new Date(), 30));
    };

    // Check if a date has availability
    // @ts-ignore
    const hasAvailability = (date) => {
        //@ts-ignore
        return availabilityData.some(item => isSameDay(new Date(item.date), date));
    };

    // Render a calendar date item
    //@ts-ignore
    const renderCalendarDay = ({ item }) => {
        const isSelected = isSameDay(item, selectedDate);
        const hasAvail = hasAvailability(item);
        const isToday = isSameDay(item, new Date());

        return (
            <TouchableOpacity
                style={[
                    styles.calendarDay,
                    isSelected && styles.selectedDay,
                    isToday && styles.todayDay
                ]}
                onPress={() => setSelectedDate(item)}
            >
                <Text style={[
                    styles.calendarDayText,
                    isSelected && styles.selectedDayText,
                    isToday && styles.todayDayText
                ]}>
                    {item.getDate()}
                </Text>
                {hasAvail && <View style={styles.availabilityDot} />}
            </TouchableOpacity>
        );
    };

    // Group calendar dates by week
    //@ts-ignore
    const calendarWeeks = [];
    //@ts-ignore
    let currentWeek = [];

    calendarDates.forEach((date, index) => {
        currentWeek.push(date);

        if (currentWeek.length === 7 || index === calendarDates.length - 1) {
            //@ts-ignore
            calendarWeeks.push([...currentWeek]);
            currentWeek = [];
        }
    });
    //@ts-ignore
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={Color.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Availability Calendar</Text>
            </View>

            <View style={styles.calendarContainer}>
                <View style={styles.monthHeader}>
                    <Text style={styles.monthTitle}>
                        {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </Text>
                </View>

                <View style={styles.weekdayHeader}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <Text key={index} style={styles.weekdayText}>{day}</Text>
                    ))}
                </View>

                {calendarWeeks.map((week, weekIndex) => (
                    <View key={weekIndex} style={styles.calendarWeek}>
                        {week.map((date, dateIndex) => {
                            const isSelected = isSameDay(date, selectedDate);
                            const hasAvail = hasAvailability(date);
                            const isToday = isSameDay(date, new Date());

                            return (
                                <TouchableOpacity
                                    key={dateIndex}
                                    style={[
                                        styles.calendarDay,
                                        isSelected && styles.selectedDay,
                                        isToday && styles.todayDay
                                    ]}
                                    onPress={() => setSelectedDate(date)}
                                >
                                    <Text style={[
                                        styles.calendarDayText,
                                        isSelected && styles.selectedDayText,
                                        isToday && styles.todayDayText
                                    ]}>
                                        {date.getDate()}
                                    </Text>
                                    {hasAvail && <View style={styles.availabilityDot} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </View>

            <View style={styles.availabilityHeader}>
                <Text style={styles.dateTitle}>
                    {formatDate(selectedDate)}
                </Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddAvailability}
                >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.availabilityList}>
                {selectedDayAvailability.length > 0 ? (
                    selectedDayAvailability.map((availability) => (
                        <View key={availability._id} style={styles.availabilityCard}>
                            <View style={styles.availabilityInfo}>
                                <Text style={styles.recurrenceText}>
                                    {availability.recurrence !== 'none'
                                        ? `${availability.recurrence.charAt(0).toUpperCase() + availability.recurrence.slice(1)} Schedule`
                                        : 'One-time Schedule'}
                                </Text>

                                {availability.timeSlots.map((slot, index) => (
                                    <View key={index} style={styles.timeSlot}>
                                        <Text style={styles.timeText}>
                                            {formatTimeForDisplay(slot.startTime)} - {formatTimeForDisplay(slot.endTime)}
                                        </Text>
                                        <View style={[
                                            styles.statusBadge,
                                            slot.isBooked ? styles.bookedBadge : styles.availableBadge
                                        ]}>
                                            <Text style={styles.statusText}>
                                                {slot.isBooked ? 'Booked' : 'Available'}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                                
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => handleEditAvailability(availability)}
                                    disabled={availability.timeSlots.some(slot => slot.isBooked)}
                                >
                                    <Ionicons
                                        name="create-outline"
                                        size={18}
                                        color={availability.timeSlots.some(slot => slot.isBooked) ? "#999" : Color.primary}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => {
                                        Alert.alert(
                                            'Delete Availability',
                                            'Are you sure you want to delete this availability?',
                                            [
                                                { text: 'Cancel', style: 'cancel' },
                                                {
                                                    text: 'Delete',
                                                    style: 'destructive',
                                                    onPress: () => deleteAvailabilitySlot(availability._id)
                                                }
                                            ]
                                        );
                                    }}
                                    disabled={availability.timeSlots.some(slot => slot.isBooked)}
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={18}
                                        color={availability.timeSlots.some(slot => slot.isBooked) ? "#999" : "#FF3B30"}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="calendar-outline" size={50} color="#CCCCCC" />
                        <Text style={styles.emptyStateText}>No availability set for this date</Text>
                        <Text style={styles.emptyStateSubText}>Tap the Add button to set your availability</Text>
                    </View>
                )}
            </ScrollView>

            {/* Add/Edit Availability Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {isEditMode ? 'Edit Availability' : 'Add Availability'}
                            </Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#555" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.sectionTitle}>
                                Date: {formatDate(selectedDate)}
                            </Text>

                            <Text style={styles.formLabel}>Time Slots</Text>
                            {timeSlots.map((slot, index) => (
                                <View key={index} style={styles.timeSlotForm}>
                                    <View style={styles.timeInputContainer}>
                                        <Text style={styles.timeLabel}>Start</Text>
                                        <TextInput
                                            style={styles.timeInput}
                                            value={slot.startTime}
                                            onChangeText={(value) => updateTimeSlot(index, 'startTime', value)}
                                            placeholder="09:00"
                                            keyboardType="numbers-and-punctuation"
                                        />
                                    </View>

                                    <View style={styles.timeInputDivider}>
                                        <Text>-</Text>
                                    </View>

                                    <View style={styles.timeInputContainer}>
                                        <Text style={styles.timeLabel}>End</Text>
                                        <TextInput
                                            style={styles.timeInput}
                                            value={slot.endTime}
                                            onChangeText={(value) => updateTimeSlot(index, 'endTime', value)}
                                            placeholder="10:00"
                                            keyboardType="numbers-and-punctuation"
                                        />
                                    </View>

                                    <TouchableOpacity
                                        style={styles.removeSlotButton}
                                        onPress={() => removeTimeSlot(index)}
                                        disabled={timeSlots.length === 1}
                                    >
                                        <Ionicons
                                            name="remove-circle"
                                            size={24}
                                            color={timeSlots.length === 1 ? "#CCCCCC" : "#FF3B30"}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            <TouchableOpacity
                                style={styles.addSlotButton}
                                onPress={addTimeSlot}
                            >
                                <Ionicons name="add-circle" size={20} color={Color.primary} />
                                <Text style={styles.addSlotButtonText}>Add Time Slot</Text>
                            </TouchableOpacity>

                            {!isEditMode && (
                                <>
                                    <Text style={[styles.formLabel, { marginTop: 20 }]}>Recurrence</Text>
                                    <View style={styles.recurrenceOptions}>
                                        {['none', 'daily', 'weekly', 'biweekly', 'monthly'].map((type) => (
                                            <TouchableOpacity
                                                key={type}
                                                style={[
                                                    styles.recurrenceOption,
                                                    recurrenceType === type && styles.selectedRecurrenceOption
                                                ]}
                                                onPress={() => setRecurrenceType(type)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.recurrenceOptionText,
                                                        recurrenceType === type && styles.selectedRecurrenceOptionText
                                                    ]}
                                                >
                                                    {type === 'none' ? 'One-time' : type.charAt(0).toUpperCase() + type.slice(1)}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {recurrenceType !== 'none' && (
                                        <View style={styles.endDateContainer}>
                                            <Text style={styles.formLabel}>End Date</Text>
                                            <TouchableOpacity
                                                style={styles.datePickerButton}
                                                onPress={() => {
                                                    // Simple date increment without date picker dependency
                                                    setRecurrenceEndDate(addDays(recurrenceEndDate, 7));
                                                }}
                                            >
                                                <Text style={styles.datePickerButtonText}>
                                                    {formatDate(recurrenceEndDate)}
                                                </Text>
                                                <Ionicons name="calendar-outline" size={20} color={Color.primary} />
                                            </TouchableOpacity>

                                            <View style={styles.dateControls}>
                                                <TouchableOpacity
                                                    style={styles.dateControlButton}
                                                    onPress={() => setRecurrenceEndDate(addDays(recurrenceEndDate, -7))}
                                                >
                                                    <Text style={styles.dateControlText}>-7 days</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.dateControlButton}
                                                    onPress={() => setRecurrenceEndDate(addDays(recurrenceEndDate, 7))}
                                                >
                                                    <Text style={styles.dateControlText}>+7 days</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.dateControlButton}
                                                    onPress={() => setRecurrenceEndDate(addMonths(recurrenceEndDate, 1))}
                                                >
                                                    <Text style={styles.dateControlText}>+1 month</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                </>
                            )}
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={submitAvailability}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE'
    },
    backButton: {
        marginRight: 16
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600'
    },
    calendarContainer: {
        padding: 12
    },
    monthHeader: {
        alignItems: 'center',
        marginBottom: 12
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: '600'
    },
    weekdayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8
    },
    weekdayText: {
        width: 40,
        textAlign: 'center',
        fontWeight: '500',
        color: '#555'
    },
    calendarWeek: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8
    },
    calendarDay: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    selectedDay: {
        backgroundColor: Color.primary
    },
    todayDay: {
        borderWidth: 1,
        borderColor: Color.primary
    },
    calendarDayText: {
        fontSize: 14
    },
    selectedDayText: {
        color: '#FFFFFF',
        fontWeight: '600'
    },
    todayDayText: {
        fontWeight: '600',
        color: Color.primary
    },
    availabilityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Color.primary,
        position: 'absolute',
        bottom: 4
    },
    availabilityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EEEEEE'
    },
    dateTitle: {
        fontSize: 16,
        fontWeight: '600'
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16
    },
    addButtonText: {
        color: '#FFFFFF',
        marginLeft: 4,
        fontWeight: '500'
    },
    availabilityList: {
        flex: 1,
        padding: 16
    },
    availabilityCard: {
        backgroundColor: '#F8F8F8',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    availabilityInfo: {
        flex: 1
    },
    recurrenceText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8
    },
    timeSlot: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    timeText: {
        fontSize: 15,
        fontWeight: '500'
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 8
    },
    bookedBadge: {
        backgroundColor: '#FFE8E6'
    },
    availableBadge: {
        backgroundColor: '#E3F2FD'
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500'
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    editButton: {
        padding: 8
    },
    deleteButton: {
        padding: 8
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 16,
        color: '#666'
    },
    emptyStateSubText: {
        fontSize: 14,
        color: '#999',
        marginTop: 8
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '85%'
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE'
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600'
    },
    modalBody: {
        padding: 16,
        maxHeight: 500
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 16
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: '#555'
    },
    timeSlotForm: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    timeInputContainer: {
        flex: 1
    },
    timeLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4
    },
    timeInput: {
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 6,
        padding: 10,
        fontSize: 14
    },
    timeInputDivider: {
        paddingHorizontal: 8,
        alignSelf: 'flex-end',
        paddingBottom: 10
    },
    removeSlotButton: {
        paddingLeft: 8,
        alignSelf: 'flex-end',
        paddingBottom: 10
    },
    addSlotButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        marginTop: 4
    },
    addSlotButtonText: {
        marginLeft: 8,
        color: Color.primary,
        fontWeight: '500'
    },
    recurrenceOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16
    },
    recurrenceOption: {
        borderWidth: 1,
        borderColor: '#DDDDDD',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8
    },
    selectedRecurrenceOption: {
        backgroundColor: Color.primary,
        borderColor: Color.primary
    },
    recurrenceOptionText: {
        color: '#444'
    },
    selectedRecurrenceOptionText: {
        color: '#FFFFFF',
        fontWeight: '500'
    },
    endDateContainer: {
        marginTop: 8
    },
    datePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 6,
        padding: 12,
        marginBottom: 8
    },
    datePickerButtonText: {
        fontSize: 14
    },
    dateControls: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dateControlButton: {
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6
    },
    dateControlText: {
        fontSize: 12,
        color: '#555'
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE'
    },
    cancelButton: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 8,
        marginRight: 8
    },
    cancelButtonText: {
        color: '#555',
        fontWeight: '500'
    },
    saveButton: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        backgroundColor: Color.primary,
        borderRadius: 8,
        marginLeft: 8
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: '500'
    }
});