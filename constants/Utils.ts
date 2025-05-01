export interface Location {
    _id: string,
    locationName: string,
    description: string,
    temperature: number,
    type: string,
    accessibility_info: string,
    best_visit_time: string,
    facilities: string,
    to: string,
    image: string,
    is_active: string,
}
export interface Tour {
    _id: string,
    title: string,
    description: string,
    location: string,
    startDate: Date,
    endDate: Date,
    duration: number,
    price: number,
    maxParticipants: number,
    currentParticipants: number,
    guideId: string,
    image: string,
    status: string,
    cancellationPolicy: string,
    createdAt: Date,
}

export interface Guide {
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
