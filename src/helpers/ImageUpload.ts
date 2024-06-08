import cloudinary from "cloudinary";

export const UploadImageToCloudinary = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataUri = `data:${image.mimetype};base64,${base64Image}`;

  const uploadImageCloud = await cloudinary.v2.uploader.upload(dataUri);

  return uploadImageCloud.url;
};
