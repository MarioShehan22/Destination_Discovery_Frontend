import axios, { AxiosInstance} from "axios";
import BASE_URL from "./BASEURL";
import AsyncStorage from "@react-native-async-storage/async-storage";

// @ts-ignore
const instance: AxiosInstance = axios.create({
    baseURL: BASE_URL()
});

instance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token=');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;