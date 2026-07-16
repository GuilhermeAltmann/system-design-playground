import type { AppNode, AppEdge } from '../stores/canvas-store';
import { calculateComponentCapacity } from './calculator';
import type { EdgeData, NodeData } from '../types';

/**
 * Propagates traffic from clients down to databases.
 * Very simplified BFS for the initial prototype.
 */
export function propagateTraffic(nodes: AppNode[], edges: AppEdge[]): {
  newNodes: AppNode[],
  newEdges: AppEdge[]
} {
  // Deep clone to avoid mutating React Flow state directly
  const nextNodes = JSON.parse(JSON.stringify(nodes)) as AppNode[];
  const nextEdges = JSON.parse(JSON.stringify(edges)) as AppEdge[];

  // 1. Reset metrics
  const incomingTrafficMap = new Map<string, number>();
  
  nextNodes.forEach(n => {
    n.data.metrics = {
      throughput: 0,
      capacity: calculateComponentCapacity(n.data).capacity,
      utilizationRatio: 0,
      latency: calculateComponentCapacity(n.data).latency,
    };
    incomingTrafficMap.set(n.id, 0);
  });

  // 2. Find sources (Clients)
  const clients = nextNodes.filter(n => n.data.type === 'client');
  const queue = [...clients];
  
  // Set initial traffic for clients
  clients.forEach(c => {
    const rps = c.data.properties.requestsPerSecond || 1000;
    incomingTrafficMap.set(c.id, rps);
  });

  const visited = new Set<string>();

  // 3. Propagate traffic via BFS
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current.id)) continue;
    visited.add(current.id);

    const traffic = incomingTrafficMap.get(current.id) || 0;
    
    // Update node metrics
    const capacityInfo = calculateComponentCapacity(current.data);
    
    // If it's a client, throughput is what it generates
    let effectiveThroughput = traffic;
    let utilizationRatio = traffic / capacityInfo.capacity;
    
    // Cascading failure simulation:
    // If utilization > 1, the node acts as a bottleneck and only passes 'capacity' downstream
    if (utilizationRatio > 1 && current.data.type !== 'client') {
      effectiveThroughput = capacityInfo.capacity;
    }

    current.data.metrics = {
      throughput: traffic, // Total attempted traffic
      capacity: capacityInfo.capacity,
      utilizationRatio,
      latency: capacityInfo.latency * (utilizationRatio > 1 ? Math.pow(utilizationRatio, 2) : 1), // Exponential latency on saturation
      bottleneckReason: utilizationRatio > 1 ? 'Resource Exhaustion' : undefined,
    };

    // Find outgoing edges
    const outEdges = nextEdges.filter(e => e.source === current.id);
    
    if (outEdges.length > 0) {
      // Divide traffic among outgoing edges
      // In a real system, you'd route differently (e.g. cache vs DB). 
      // For this prototype, if it connects to a cache, it acts as a shield.
      let trafficToDistribute = effectiveThroughput;

      // Extremely simplified cache hit ratio mechanic
      const cacheEdge = outEdges.find(e => nextNodes.find(n => n.id === e.target)?.data.type === 'cache');
      if (cacheEdge) {
        // Assume 90% hit ratio
        const hitRatio = 0.9;
        const targetNode = nextNodes.find(n => n.id === cacheEdge.target);
        if (targetNode) {
           const currentIncoming = incomingTrafficMap.get(targetNode.id) || 0;
           incomingTrafficMap.set(targetNode.id, currentIncoming + trafficToDistribute);
           queue.push(targetNode);
           
           cacheEdge.data = { traffic: trafficToDistribute, latency: 1, isBottleneck: false };
           
           // The remaining 10% goes to the DB (if connected from the service)
           trafficToDistribute = trafficToDistribute * (1 - hitRatio);
        }
      }

      // Group other edges by target component type
      const otherEdges = outEdges.filter(e => e !== cacheEdge);
      const edgesByType = new Map<string, AppEdge[]>();
      
      otherEdges.forEach(e => {
        const targetNode = nextNodes.find(n => n.id === e.target);
        if (targetNode) {
          const type = targetNode.data.type;
          if (!edgesByType.has(type)) edgesByType.set(type, []);
          edgesByType.get(type)!.push(e);
        }
      });

      // Distribute traffic: 100% of remaining traffic goes to EACH component type,
      // but divided among instances of the SAME type (e.g. 2 DBs split traffic 50/50)
      edgesByType.forEach((edgesOfSameType, type) => {
        const perEdgeTraffic = trafficToDistribute / edgesOfSameType.length;

        edgesOfSameType.forEach(e => {
          const targetNode = nextNodes.find(n => n.id === e.target);
          if (targetNode) {
            const currentIncoming = incomingTrafficMap.get(targetNode.id) || 0;
            incomingTrafficMap.set(targetNode.id, currentIncoming + perEdgeTraffic);
            queue.push(targetNode);

            e.data = {
              traffic: perEdgeTraffic,
              latency: 5,
              isBottleneck: utilizationRatio > 1
            };
          }
        });
      });
    }
  }

  return { newNodes: nextNodes, newEdges: nextEdges };
}
