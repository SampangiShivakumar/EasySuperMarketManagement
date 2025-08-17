const cron = require('node-cron');
const Product = require('../models/Product');
const { checkStockLevels, checkExpirationStatus } = require('./notificationHelper');

// Schedule tasks to run at specific intervals
const scheduleNotificationTasks = () => {
    // Run daily at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        console.log('Running daily product checks...');
        
        try {
            // Check all products
            const products = await Product.find({});
            
            for (const product of products) {
                // Check stock levels
                if (product.quantity <= 20) {
                    await checkStockLevels(product);
                }

                // Check expiration dates
                await checkExpirationStatus(product);
            }
            
            console.log('Daily product checks completed');
        } catch (error) {
            console.error('Error in daily product checks:', error);
        }
    });

    // Run weekly comprehensive check on Sunday at 10:00 AM
    cron.schedule('0 10 * * 0', async () => {
        console.log('Running weekly comprehensive product checks...');
        
        try {
            const products = await Product.find({});
            const lowStockProducts = products.filter(p => p.quantity <= 20);
            const expiringProducts = products.filter(p => {
                if (!p.expirationDate) return false;
                const oneMonthFromNow = new Date();
                oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
                return p.expirationDate <= oneMonthFromNow;
            });

            // Send weekly summary to admin
            if (process.env.ADMIN_EMAIL && (lowStockProducts.length > 0 || expiringProducts.length > 0)) {
                const { sendEmail } = require('../config/email.config');
                
                const message = `
                    Weekly Inventory Status Report

                    Low Stock Products (${lowStockProducts.length}):
                    ${lowStockProducts.map(p => `- ${p.name}: ${p.quantity} units remaining`).join('\n')}

                    Products Expiring Within 1 Month (${expiringProducts.length}):
                    ${expiringProducts.map(p => `- ${p.name}: Expires on ${p.expirationDate.toLocaleDateString()}`).join('\n')}

                    Please take necessary action for these products.
                `;

                await sendEmail(process.env.ADMIN_EMAIL, 'notification', {
                    username: 'Admin',
                    message: message
                });
            }

            console.log('Weekly comprehensive checks completed');
        } catch (error) {
            console.error('Error in weekly product checks:', error);
        }
    });
};

module.exports = { scheduleNotificationTasks };
