export type ComponentType = 'client' | 'service' | 'database' | 'cache' | 'queue' | 'storage' | 'load_balancer' | 'worker';

export interface BaseComponentProps {
  // Common properties
  name: string;
  description?: string;
  latencyMs: number;
}

export interface ClientProps extends BaseComponentProps {
  requestsPerSecond: number;
  // Browser vs Mobile etc
  clientType: 'browser' | 'mobile';
}

export interface ServiceProps extends BaseComponentProps {
  engine: 'go' | 'nodejs' | 'java';
  instances: number;
  coresPerInstance: number;
  memoryPerInstance: number;
}

export interface DatabaseProps extends BaseComponentProps {
  engine: 'postgresql' | 'mysql' | 'mongodb' | 'cassandra';
  instanceSize: string;
  readReplicas: number;
  shards: number;
  // Simplification for the playground state
  readWriteRatio: '50/50' | '70/30' | '80/20' | '90/10';
}

export interface CacheProps extends BaseComponentProps {
  engine: 'redis' | 'memcached';
  memoryGb: number;
  ttlSeconds: number;
}

export interface QueueProps extends BaseComponentProps {
  engine: 'kafka' | 'rabbitmq' | 'sqs';
  partitions: number;
}

export interface StorageProps extends BaseComponentProps {
  provider: 's3' | 'gcs';
}

export interface LoadBalancerProps extends BaseComponentProps {
  layer: 'L4 (Transport)' | 'L7 (Application)';
  algorithm: 'Round Robin' | 'Least Connections';
}

export interface WorkerProps extends BaseComponentProps {
  engine: 'go' | 'nodejs' | 'java' | 'python';
  instances: number;
  concurrency: number;
}

// Union for the generic Node data
export interface NodeData {
  label: string;
  type: ComponentType;
  // Dynamically calculated state
  metrics?: {
    throughput: number;
    capacity: number;
    utilizationRatio: number; // 0 to 1 (or > 1 for bottleneck)
    latency: number;
    bottleneckReason?: string;
  };
  // Specific properties (e.g. ServiceProps, DatabaseProps)
  properties: any;
}

export interface EdgeData {
  traffic: number; // req/s flowing through this edge
  latency: number; // ms overhead
  isBottleneck: boolean; // if source or target is congested
}
