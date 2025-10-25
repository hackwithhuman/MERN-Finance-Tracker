import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosInstance";


const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE_UPLOAD , formData,{
            headers:
            {
                'Content-Type': 'multipart/form-data', // headers for file Upload
            },
        });

        return response.data;
    }
    catch (error) {
        console.error("error upload image");
        throw error;
    }


};

export default uploadImage;