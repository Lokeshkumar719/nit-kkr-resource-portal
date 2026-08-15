const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:5173/api';
// Create an axios instance with cookies
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  validateStatus: () => true // Resolve all statuses so we can inspect them
});

let cookieHeader = '';

// Helper to set cookies
api.interceptors.response.use(response => {
  const cookies = response.headers['set-cookie'];
  if (cookies) {
    cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');
  }
  return response;
});
api.interceptors.request.use(config => {
  if (cookieHeader) config.headers.Cookie = cookieHeader;
  return config;
});

async function runTests() {
  const results = [];
  
  function log(name, status, data) {
    results.push({ name, status, data });
    console.log(`[${status === 200 || status === 201 ? 'PASS' : 'FAIL'}] ${name} (Status: ${status})`);
    if (status >= 400) {
      console.log('   Error:', data?.message || data);
    }
  }

  try {
    // 1. Auth - Login with test user we created earlier
    const loginRes = await api.post('/auth/login', {
      email: 'testuser@nitkkr.ac.in',
      password: 'Password123!'
    });
    log('Login (/auth/login)', loginRes.status, loginRes.data);

    // 2. Auth - Verify Session
    const meRes = await api.get('/auth/me');
    log('Verify Session (/auth/me)', meRes.status, meRes.data);

    // 3. Subjects - Get all
    const subjectsRes = await api.get('/subjects', { params: { branch: 'CSE', semester: 4 } });
    log('Get Subjects (/subjects)', subjectsRes.status, subjectsRes.data);
    
    // 4. Resources - Get resources for a subject (if we have any subjects)
    if (subjectsRes.data?.data && subjectsRes.data.data.length > 0) {
      const subjectId = subjectsRes.data.data[0]._id;
      const resourcesRes = await api.get('/resources', { params: { subjectId } });
      log('Get Resources (/resources)', resourcesRes.status, resourcesRes.data);
    } else {
      // Just test the endpoint directly with a fake id to see if it responds correctly (not 404 or 500)
      const resourcesRes = await api.get('/resources', { params: { subjectId: '000000000000000000000000' } });
      log('Get Resources Empty (/resources)', resourcesRes.status, resourcesRes.data);
    }

    // 5. Mentors/Seniors
    const mentorsRes = await api.get('/mentors', { params: { branch: 'CSE' } });
    log('Get Mentors (/mentors)', mentorsRes.status, mentorsRes.data);

    // 6. Alumni (mentors with year=Alumni)
    const alumniRes = await api.get('/mentors', { params: { branch: 'CSE', year: 'Alumni' } });
    log('Get Alumni (/mentors)', alumniRes.status, alumniRes.data);

    // 7. Bugs - Create
    const bugRes = await api.post('/bugs', { description: 'This is a test bug from automated script' });
    log('Create Bug (/bugs)', bugRes.status, bugRes.data);

    // 8. Auth - Logout
    const logoutRes = await api.post('/auth/logout');
    log('Logout (/auth/logout)', logoutRes.status, logoutRes.data);

  } catch (err) {
    console.error("Test execution failed:", err.message);
  }
  
  fs.writeFileSync('test_results.json', JSON.stringify(results, null, 2));
}

runTests();
