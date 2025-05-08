const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Path to your Express app

// Initialize chaiHttp properly
chai.use(chaiHttp);
const { expect } = chai;

describe('GET /r/:short_link', () => {
  // Test data
  const testLink = {
    short_code: 'test12',
    long_url: 'https://example.com/testing'
  };

  before(async () => {
    // Insert test data
    await pool.query(
      'INSERT INTO links (short_code, long_url) VALUES (?, ?)',
      [testLink.short_code, testLink.long_url]
    );
  });

  after(async () => {
    // Cleanup
    await pool.query('DELETE FROM links WHERE short_code = ?', [testLink.short_code]);
    await pool.end();
  });

  // Tests will go here
  it('should redirect to the long URL (302)', async () => {
    const res = await chai.request(app)
      .get(`/r/${testLink.short_code}`)
      .redirects(0); // Prevent automatic redirect
  
    expect(res).to.redirect;
    expect(res).to.have.status(302);
    expect(res.header.location).to.equal(testLink.long_url);
  });

  it('should reject malformed codes (400)', async () => {
    const res = await chai.request(app)
      .get('/r/invalid!')
      .redirects(0);
  
    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Invalid short link format');
  });

  it('should return 404 for unknown codes', async () => {
    const res = await chai.request(app)
      .get('/r/000000')
      .redirects(0);
  
    expect(res).to.have.status(404);
    expect(res.body.message).to.equal('Link not found');
  });

  it('should increment the counter', async () => {
    // Initial count
    const [initial] = await pool.query(
      'SELECT count FROM counters WHERE link_id = ?',
      [testLink.id]
    );
    const initialCount = initial[0]?.count || 0;
  
    await chai.request(app).get(`/r/${testLink.short_code}`);
  
    // Verify count increased
    const [updated] = await pool.query(
      'SELECT count FROM counters WHERE link_id = ?',
      [testLink.id]
    );
    expect(updated[0].count).to.equal(initialCount + 1);
  });
});