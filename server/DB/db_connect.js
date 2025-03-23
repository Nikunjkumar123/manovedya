import mongoose from 'mongoose';

const connectDb = async () => {
    try {
        const connection = await mongoose.connect('mongodb://localhost:27017/Manovaidya', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB connected:", connection.connection.host);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1); // Exit the process with failure
    }
};

export { connectDb };