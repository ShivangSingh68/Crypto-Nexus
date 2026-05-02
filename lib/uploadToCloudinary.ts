"use server"

import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv"

dotenv.config();

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log(process.env.CLOUDINARY_CLOUD_NAME, " ", process.env.CLOUDINARY_API_KEY, " ", process.env.CLOUDINARY_API_SECRET);

export const uploadImage = async (file: string, publicId: string): Promise<{publicId?: string, secure_url?: string}> => {
    const options = {
        use_filename: true,
        unique_filename: true,
        overwrite: true,
        public_id: publicId
    };

    try {
        const res = await cloudinary.uploader.upload(file,  options);

        return {
            publicId: res.public_id,
            secure_url: res.secure_url,
        }

    } catch (error) {
        console.error(error);
    }
}

export const getAssestInfo = async(publicId: string): Promise<{url: string}> => {
    try {

        const res = await cloudinary.api.resource(publicId);

        return {
            url: res.secure_url
        }
        
        
    } catch (error) {
        console.error(error);
    }
}

const res = await uploadImage('./public/badges/ai-visionary.png',);
console.log(res);
const resImg = await getAssestInfo(res.publicId);
console.log(resImg);