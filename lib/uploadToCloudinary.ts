import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(process.env.CLOUDINARY_API_KEY, " ", process.env.CLOUDINARY_API_SECRET, " ", process.env.CLOUDINARY_CLOUD_NAME);
export const uploadImage = async (imagePath) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };

    try {
        const result = await cloudinary.uploader.upload(imagePath, options);
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

uploadImage('../public/badges/ai-visionary.png');