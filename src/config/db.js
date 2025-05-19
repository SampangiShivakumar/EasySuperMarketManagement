import mongoose from 'mongoose/index.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.REACT_APP_MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return false;
    }
};

export default connectDB;