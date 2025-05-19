import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
    invoiceId: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: true
    },
    customerType: {
        type: String,
        enum: ['Member', 'Normal'],
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    productLine: {
        type: String,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    payment: {
        type: String,
        enum: ['Credit', 'Cash', 'E-wallet'],
        required: true
    },
    city: {
        type: String,
        required: true
    }
});

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;