import type { 
  NodeData, 
  ServiceProps, 
  DatabaseProps, 
  CacheProps, 
  QueueProps, 
  StorageProps,
  LoadBalancerProps,
  WorkerProps
} from '../types';

/**
 * calculates the maximum throughput (req/s) and latency based on properties
 */
export function calculateComponentCapacity(data: NodeData): { capacity: number, latency: number, bottleneckReason?: string } {
  switch (data.type) {
    case 'client':
      // Clients are generators, their "capacity" is infinite in theory, 
      // but they generate traffic based on requestsPerSecond.
      return { capacity: Infinity, latency: data.properties.latencyMs || 50 };
      
    case 'service':
      return calculateServiceCapacity(data.properties as ServiceProps);
      
    case 'database':
      return calculateDatabaseCapacity(data.properties as DatabaseProps);
      
    case 'cache':
      return calculateCacheCapacity(data.properties as CacheProps);
      
    case 'queue':
      return calculateQueueCapacity(data.properties as QueueProps);
      
    case 'storage':
      return calculateStorageCapacity(data.properties as StorageProps);
      
    case 'load_balancer':
      return calculateLoadBalancerCapacity(data.properties as LoadBalancerProps);
      
    case 'worker':
      return calculateWorkerCapacity(data.properties as WorkerProps);
      
    default:
      return { capacity: 1000, latency: 10 };
  }
}

function calculateWorkerCapacity(props: WorkerProps) {
  let baseThroughput = 0;
  
  if (props.engine === 'go') baseThroughput = 8000;
  else if (props.engine === 'java') baseThroughput = 5000;
  else if (props.engine === 'python') baseThroughput = 1000;
  else baseThroughput = 2000; // nodejs

  const capacity = baseThroughput * props.concurrency * props.instances;
  
  return { 
    capacity, 
    latency: props.latencyMs || 50 
  };
}

function calculateLoadBalancerCapacity(props: LoadBalancerProps) {
  let capacity = 500000; // L4 is very fast
  let latency = 2;

  if (props.layer === 'L7 (Application)') {
    capacity = 50000; // L7 parsing overhead
    latency = 5;
  }
  
  if (props.algorithm === 'Least Connections') {
    capacity *= 0.8; // slightly more overhead to track state
  }

  return { capacity, latency: props.latencyMs || latency };
}

function calculateServiceCapacity(props: ServiceProps) {
  let baseThroughput = 0;
  
  if (props.engine === 'go') baseThroughput = 12000;
  else if (props.engine === 'java') baseThroughput = 8000;
  else baseThroughput = 2500; // nodejs

  // Diminishing returns on cores
  const coreFactor = Math.pow(props.coresPerInstance / 2, 0.85);
  const capacity = baseThroughput * coreFactor * props.instances;
  
  return { 
    capacity, 
    latency: props.latencyMs || 15 
  };
}

function calculateDatabaseCapacity(props: DatabaseProps) {
  let baseReads = 0;
  let baseWrites = 0;

  if (props.engine === 'postgresql') {
    baseReads = 8000; baseWrites = 2000;
  } else if (props.engine === 'mysql') {
    baseReads = 12000; baseWrites = 3000;
  } else if (props.engine === 'mongodb') {
    baseReads = 15000; baseWrites = 5000;
  } else if (props.engine === 'cassandra') {
    baseReads = 10000; baseWrites = 15000; // write optimized
  } else {
    baseReads = 10000; baseWrites = 2500; // fallback
  }

  // Simulate instance size scaling
  let sizeFactor = 1;
  if (props.instanceSize.includes('xlarge')) sizeFactor = 4;
  else if (props.instanceSize.includes('2xlarge')) sizeFactor = 8;
  else if (props.instanceSize.includes('4xlarge')) sizeFactor = 16;

  // Reads scale with replicas, writes scale with shards
  const readCapacity = baseReads * sizeFactor * (1 + props.readReplicas);
  const writeCapacity = baseWrites * sizeFactor * props.shards;
  
  // Mix ratio
  const [r, w] = props.readWriteRatio.split('/').map(Number);
  const readRatio = r / 100;
  const writeRatio = w / 100;
  
  // We'll return a blended capacity for the simple mode, 
  // though real calculations compare read load vs read capacity separately.
  // Blended approximation:
  const capacity = Math.min(readCapacity / readRatio, writeCapacity / writeRatio);

  return { capacity, latency: props.latencyMs || 5 };
}

function calculateCacheCapacity(props: CacheProps) {
  const base = props.engine === 'redis' ? 100000 : 200000;
  // Just a simple approximation for the prototype
  return { capacity: base, latency: props.latencyMs || 1 };
}

function calculateQueueCapacity(props: QueueProps) {
  let base = 0;
  if (props.engine === 'kafka') base = 100000;
  else if (props.engine === 'rabbitmq') base = 20000;
  else base = 5000; // sqs fifo approx

  return { capacity: base * props.partitions, latency: props.latencyMs || 10 };
}

function calculateStorageCapacity(props: StorageProps) {
  return { capacity: 5500, latency: props.latencyMs || 100 }; // S3 baseline GET
}
