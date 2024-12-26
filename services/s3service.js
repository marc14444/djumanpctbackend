// s3service.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

// Créer une instance du client S3
const s3 = new S3Client({ region: process.env.AWS_REGION || 'eu-north-1' });

export const s3Uploadv2 = async (file, fileName) => {
    if (!fileName) {
        throw new Error("Le nom de fichier est manquant");
    }
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${fileName}`,
      Body: file.buffer,
        ContentType: file.mimetype,
    };
  
    try {
      const data = await s3.send(new PutObjectCommand(params));
      return { Location: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}` }; // Assure-toi que l'URL est correcte
    } catch (error) {
      console.error(error);
      throw new Error("Error uploading file");
    }
};  
