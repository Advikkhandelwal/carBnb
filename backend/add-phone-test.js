// Manual phone number addition script for testing
// This will add a phone number to the user with email advik.khandelwal@adypu.edu.in

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addPhoneToUser() {
    const email = 'advik.khandelwal@adypu.edu.in';
    const phone = '+91 98765 43210'; // Test phone number

    console.log(`\n🔧 Adding phone number to user: ${email}`);
    console.log(`📞 Phone number: ${phone}\n`);

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { phone },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            }
        });

        console.log('✅ SUCCESS! Phone number added:');
        console.log(`   User ID: ${user.id}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Phone: ${user.phone}`);
        console.log('\n📱 Now refresh the Owner Dashboard to see the phone number!\n');

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

addPhoneToUser();
