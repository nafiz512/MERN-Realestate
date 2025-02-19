//index.js
import express from 'express';
import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv';
import 'dotenv/config'
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import multer from 'multer';
import cors from 'cors';
import cookieParser from 'cookie-parser';


mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB!');
}).catch((err) => {
    console.log(err);
})

const app = express();

app.use(cors());

app.use(express.json());
app.use(cookieParser());


app.listen(3000, () => {
    console.log('Server is running on port 3000');
}
);

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post("/upload-profile", upload.single("my_file"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (uploadError, cloudinaryResult) => {
                if (uploadError) {
                    return res.status(500).json({
                        success: false,
                        message: "File upload failed",
                        error: uploadError.message,
                    });
                }
                res.json({
                    success: true,
                    message: "File uploaded successfully",
                    fileUrl: cloudinaryResult.secure_url,
                    public_id: cloudinaryResult.public_id,
                });

            }
        );

        cloudinaryUploadStream.end(req.file.buffer);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "File upload failed",
            error: error.message,
        });
    }
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });