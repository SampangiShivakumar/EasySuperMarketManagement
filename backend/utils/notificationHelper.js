const { sendEmail } = require('../config/email.config');

// Enhanced: Accept userEmail and send to both admin and user
const sendLowStockNotification = async (product, userEmail) => {
    if (!process.env.ADMIN_EMAIL && !userEmail) return;
    if (typeof product.stock !== 'number' || typeof product.lowStockThreshold !== 'number') return;

    const message = `
Low Stock Alert!
Product: ${product.name || 'N/A'}
Current Stock: ${product.stock}
Low Stock Threshold: ${product.lowStockThreshold}
Category: ${product.category || 'N/A'}

Please reorder this product soon to maintain adequate inventory levels.
`;

    const recipients = [];
    if (process.env.ADMIN_EMAIL) recipients.push(process.env.ADMIN_EMAIL);
    if (userEmail && userEmail !== process.env.ADMIN_EMAIL) recipients.push(userEmail);

    try {
        for (const email of recipients) {
            await sendEmail(email, 'notification', {
                username: 'User',
                message: message
            });
        }
        console.log(`Low stock notification sent for product: ${product.name} to: ${recipients.join(', ')}`);
    } catch (error) {
        console.error('Error sending low stock notification:', error);
    }
};

const sendExpirationNotification = async (product) => {
    if (!process.env.ADMIN_EMAIL) return;
    if (!product.expirationDate || isNaN(new Date(product.expirationDate))) return;

    const daysUntilExpiration = Math.ceil((new Date(product.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
    const message = `
Product Expiration Alert!
Product: ${product.name || 'N/A'}
Expiration Date: ${product.expirationDate ? new Date(product.expirationDate).toLocaleDateString() : 'N/A'}
Days Until Expiration: ${daysUntilExpiration}
Current Stock: ${typeof product.stock === 'number' ? product.stock : 'N/A'}
Batch Number: ${product.batchNumber || 'N/A'}
Category: ${product.category || 'N/A'}

Please take appropriate action for this soon-to-expire inventory.
`;

    try {
        await sendEmail(process.env.ADMIN_EMAIL, 'notification', {
            username: 'Admin',
            message: message
        });
        console.log(`Expiration notification sent for product: ${product.name}`);
    } catch (error) {
        console.error('Error sending expiration notification:', error);
    }
};

// Check stock levels and send notifications if needed
const checkStockLevels = async (product, userEmail) => {
    if (typeof product.stock === 'number' && typeof product.lowStockThreshold === 'number' && product.stock <= product.lowStockThreshold) {
        await sendLowStockNotification(product, userEmail);
    }
};

// Check expiration and send notifications if needed
const checkExpirationStatus = async (product) => {
    if (!product.expirationDate) return;

    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    if (product.expirationDate <= oneMonthFromNow) {
        await sendExpirationNotification(product);
    }
};

module.exports = {
    sendLowStockNotification,
    sendExpirationNotification,
    checkStockLevels,
    checkExpirationStatus
};
