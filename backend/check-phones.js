// Quick database check script
// Run this to see if users have phone numbers

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPhoneNumbers() {
    console.log('🔍 Checking phone numbers in database...\n');

    // Get all users with their bookings
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            bookings: {
                select: {
                    id: true,
                    status: true,
                }
            }
        }
    });

    console.log(`Found ${users.length} users:\n`);

    users.forEach(user => {
        console.log(`User: ${user.name}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Phone: ${user.phone || '❌ NO PHONE'}`);
        console.log(`  Bookings: ${user.bookings.length}`);
        if (user.bookings.length > 0) {
            user.bookings.forEach(b => {
                console.log(`    - Booking ${b.id}: ${b.status}`);
            });
        }
        console.log('');
    });

    await prisma.$disconnect();
}

checkPhoneNumbers().catch(console.error);
