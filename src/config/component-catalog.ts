import type { ComponentType, NodeData } from '../types';

interface CatalogItem {
  type: ComponentType;
  label: string;
  description: string;
  defaultData: NodeData;
}

export const COMPONENT_CATALOG: CatalogItem[] = [
  {
    type: 'client',
    label: 'Client (Web/Mobile)',
    description: 'Generates incoming requests to the system.',
    defaultData: {
      label: 'Client',
      type: 'client',
      properties: {
        clientType: 'browser',
        requestsPerSecond: 1000,
        latencyMs: 50,
      }
    }
  },
  {
    type: 'service',
    label: 'API Service',
    description: 'Compute layer for business logic.',
    defaultData: {
      label: 'API Service',
      type: 'service',
      properties: {
        engine: 'nodejs',
        instances: 2,
        coresPerInstance: 2,
        memoryPerInstance: 4,
        latencyMs: 15,
      }
    }
  },
  {
    type: 'database',
    label: 'Database',
    description: 'Persistent data storage.',
    defaultData: {
      label: 'Database',
      type: 'database',
      properties: {
        engine: 'postgresql',
        instanceSize: 'db.r6g.xlarge',
        readReplicas: 0,
        shards: 1,
        readWriteRatio: '80/20',
        latencyMs: 5,
      }
    }
  },
  {
    type: 'cache',
    label: 'Cache',
    description: 'In-memory data store for fast retrieval.',
    defaultData: {
      label: 'Redis Cache',
      type: 'cache',
      properties: {
        engine: 'redis',
        memoryGb: 16,
        ttlSeconds: 3600,
        latencyMs: 1,
      }
    }
  },
  {
    type: 'queue',
    label: 'Message Queue',
    description: 'Asynchronous event streaming and buffering.',
    defaultData: {
      label: 'Kafka Queue',
      type: 'queue',
      properties: {
        engine: 'kafka',
        partitions: 12,
        latencyMs: 10,
      }
    }
  },
  {
    type: 'storage',
    label: 'Object Storage',
    description: 'Unstructured data storage (images, docs).',
    defaultData: {
      label: 'S3 Bucket',
      type: 'storage',
      properties: {
        provider: 's3',
        latencyMs: 100,
      }
    }
  },
  {
    type: 'load_balancer',
    label: 'Load Balancer',
    description: 'Distributes incoming traffic across multiple targets.',
    defaultData: {
      label: 'Load Balancer',
      type: 'load_balancer',
      properties: {
        layer: 'L7 (Application)',
        algorithm: 'Round Robin',
        latencyMs: 5,
      }
    }
  },
  {
    type: 'worker',
    label: 'Worker Service',
    description: 'Background processor for async jobs.',
    defaultData: {
      label: 'Background Worker',
      type: 'worker',
      properties: {
        engine: 'nodejs',
        instances: 1,
        concurrency: 5,
        latencyMs: 50,
      }
    }
  }
];
