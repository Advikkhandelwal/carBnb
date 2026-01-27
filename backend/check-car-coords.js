// Check if cars in database have latitude/longitude coordinates

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCarCoordinates() {
    console.log('🗺️  Checking car coordinates in database...\n');

    const cars = await prisma.car.findMany({
        select: {
            id: true,
            brand: true,
            model: true,
            location: true,
            latitude: true,
            longitude: true,
        }
    });

    console.log(`Found ${cars.length} cars:\n`);

    let withCoords = 0;
    let withoutCoords = 0;

    cars.forEach(car => {
        const hasCoords = car.latitude && car.longitude;
        if (hasCoords) withCoords++;
        else withoutCoords++;

        console.log(`${hasCoords ? '✅' : '❌'} ${car.brand} ${car.model}`);
        console.log(`   Location: ${car.location}`);
        console.log(`   Coordinates: ${car.latitude || 'N/A'}, ${car.longitude || 'N/A'}`);
        console.log('');
    });

    console.log(`Summary:`);
    console.log(`  ✅ With coordinates: ${withCoords}`);
    console.log(`  ❌ Without coordinates: ${withoutCoords}`);
    console.log('');

    if (withoutCoords > 0) {
        console.log('⚠️  Some cars don\'t have coordinates. The map will only show cars with valid lat/long.');
    }

    await prisma.$disconnect();
}

checkCarCoordinates().catch(console.error);
