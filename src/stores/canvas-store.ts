import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import type { NodeData, EdgeData } from '../types';
import { propagateTraffic } from '../engine/propagator';

export type AppNode = Node<NodeData>;
export type AppEdge = Edge<EdgeData>;

interface CanvasState {
  nodes: AppNode[];
  edges: AppEdge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange<AppEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: AppEdge[]) => void;
  addNode: (node: AppNode) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  updateEdgeData: (id: string, data: Partial<EdgeData>) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  simulate: () => void;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes: NodeChange<AppNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
    get().simulate();
  },
  onEdgesChange: (changes: EdgeChange<AppEdge>[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
    get().simulate();
  },
  onConnect: (connection: Connection) => {
    const edge: AppEdge = {
      ...connection,
      id: `e-${connection.source}-${connection.target}`,
      type: 'traffic',
      animated: true,
      data: { traffic: 0, latency: 0, isBottleneck: false },
    };
    set({
      edges: addEdge(edge, get().edges),
    });
    get().simulate();
  },
  setNodes: (nodes: AppNode[]) => {
    set({ nodes });
    get().simulate();
  },
  setEdges: (edges: AppEdge[]) => {
    set({ edges });
    get().simulate();
  },
  addNode: (node: AppNode) => {
    set({ nodes: [...get().nodes, node] });
    get().simulate();
  },
  updateNodeData: (id: string, data: Partial<NodeData>) => {
    set({
      nodes: get().nodes.map((n) => {
        if (n.id === id) {
          return { ...n, data: { ...n.data, ...data } };
        }
        return n;
      }),
    });
    get().simulate();
  },
  updateEdgeData: (id: string, data: Partial<EdgeData>) => {
    set({
      edges: get().edges.map((e) => {
        if (e.id === id) {
          return { ...e, data: { ...(e.data as EdgeData), ...data } };
        }
        return e;
      }),
    });
    get().simulate();
  },
  deleteNode: (id: string) => {
    set({
      nodes: get().nodes.filter(n => n.id !== id),
      // Also clean up connected edges
      edges: get().edges.filter(e => e.source !== id && e.target !== id)
    });
    get().simulate();
  },
  deleteEdge: (id: string) => {
    set({
      edges: get().edges.filter(e => e.id !== id)
    });
    get().simulate();
  },
  simulate: () => {
    const { nodes, edges } = get();
    if (nodes.length === 0) return;
    
    // Run engine
    const { newNodes, newEdges } = propagateTraffic(nodes, edges);
    
    // Prevent infinite loops by only updating if there's a deep structural change
    // Since we mutate metrics heavily, we just set it directly but avoid calling simulate() again
    set({ nodes: newNodes, edges: newEdges });
  }
    }),
    {
      name: 'system-design-canvas-storage',
    }
  )
);
