const http = require('http');

const makeRequest = (path) => {
    return new Promise((resolve, reject) => {
        http.get({
            hostname: 'localhost',
            port: 3001,
            path: path,
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        }).on('error', reject);
    });
};

async function test() {
    try {
        const car = await makeRequest('/cars/5');
        console.log('CAR DATA:', JSON.stringify(car.data, null, 2));

        const reviews = await makeRequest('/reviews/car/5');
        console.log('REVIEWS DATA:', JSON.stringify(reviews.data, null, 2));

        const bookings = await makeRequest('/bookings/car/5');
        console.log('BOOKINGS DATA:', JSON.stringify(bookings.data, null, 2));

    } catch (err) {
        console.error('Request failed:', err);
    }
}

test();
