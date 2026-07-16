export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetReqPerSec: number;
  expectedComponents: string[];
  maxLatencyMs: number;
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Hello World API',
    description: 'Design a simple API that can handle 10,000 req/s with a database, keeping latency under 100ms.',
    targetReqPerSec: 10000,
    expectedComponents: ['client', 'service', 'database'],
    maxLatencyMs: 100,
  },
  {
    id: 'c2',
    title: 'Viral Twitter Feed',
    description: 'A celebrity just posted! Handle 100,000 req/s. Hint: A database alone will melt. Use a Cache shield.',
    targetReqPerSec: 100000,
    expectedComponents: ['client', 'service', 'cache', 'database'],
    maxLatencyMs: 200,
  },
  {
    id: 'c3',
    title: 'Black Friday Checkout',
    description: 'Process 50,000 checkout orders/s without dropping a single one. Use a Message Queue to decouple services.',
    targetReqPerSec: 50000,
    expectedComponents: ['client', 'service', 'queue', 'database'],
    maxLatencyMs: 500, // Background processing allows higher latency for the whole flow
  }
];
