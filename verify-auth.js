async function testAuth() {
    const baseURL = 'http://localhost:3001/ideaFlow/api/v1';
    const username = `test_${Date.now()}`;
    const password = 'password123';

    try {
        console.log(`Registering user: ${username}`);
        const regRes = await fetch(`${baseURL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const regData = await regRes.json();
        console.log('Registration status:', regRes.status);
        if (!regRes.ok) {
            console.error('Registration failed:', regData);
            return;
        }

        console.log('Logging in...');
        const loginRes = await fetch(`${baseURL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const loginData = await loginRes.json();
        console.log('Login status:', loginRes.status);
        console.log('Login successful:', loginRes.ok);
        if (loginRes.ok) {
            console.log('Token received:', !!loginData.data.accessToken);
        } else {
            console.error('Login failed:', loginData);
        }

    } catch (error) {
        console.error('Network/Script Error:', error.message);
    }
}

testAuth();
