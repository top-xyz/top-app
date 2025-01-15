import { expect, test, vi } from 'vitest';
import { GET } from '../app/health/route';

// Mock the database module
vi.mock('@repo/database', () => ({
  db: {
    $queryRaw: vi.fn().mockResolvedValue([{ '1': 1 }])
  }
}));

test('Health Check', async () => {
  const response = await GET(new Request('http://localhost:3000/health'));
  const data = await response.json();
  
  expect(response.status).toBe(200);
  expect(data.status).toBe('healthy');
  expect(data.services.database).toBe('connected');
});
