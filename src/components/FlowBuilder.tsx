import React, { useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import NodesPanel from './NodesPanel';
import SettingsPanel from './SettingsPanel';
import SaveButton from './SaveButton';
import TextNode from './nodes/TextNode';
import { ChatbotNodeData } from '../types';

// Register custom node types
const nodeTypes = {
  text: TextNode,
};

// Initial node for added to the flow
const initialNodes: Node<ChatbotNodeData>[] = [
  {
    id: '1',
    type: 'text',
    position: { x: 250, y: 150 },
    data: { type: 'text', label: 'Hello! This is a Message Node.' },
  },
];

const initialEdges: Edge[] = [];

const FlowBuilder = () => {
  // State for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // State for selected node id
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState<boolean>(false);

  // Find the selected node object
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  // Handle connecting nodes
  const onConnect = useCallback((connection: Edge | Connection) => {
    const sourceHasEdge = edges.some((e) => e.source === connection.source);
    if (sourceHasEdge) return;
    setEdges((eds) => addEdge({
      ...connection,
      type: 'default',
      style: { stroke: '#A2D5C6',strokeWidth:2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#888',
        width: 20,
        height: 20,
      }
    }, eds));
  }, [edges, setEdges]);

  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Update node label
  const updateNodeLabel = (id: string, label: string) => {
    setNodes((nds) => nds.map((node) =>
      node.id === id ? { ...node, data: { ...node.data, label } } : node
    ));
  };

  // Inject onChange into each node's data
  const nodesWithOnChange = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onChange: (label: string) => updateNodeLabel(node.id, label),
    },
  }));

  // Deselect node when clicking on empty canvas
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Handle drag over the React Flow canvas
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop on the React Flow canvas
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const reactFlowBounds = (event.target as HTMLDivElement).getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;
    // Calculate position relative to the canvas
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };
    // Create a new node with a unique id
    const newNode: Node<ChatbotNodeData> = {
      id: `${+new Date()}`,
      type: type as any,
      position,
      data: { type: type as any, label: 'New ' + type.charAt(0).toUpperCase() + type.slice(1) + ' Node' },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  // Validate and save the flow
  const handleSave = () => {
    setSaveError(null);
    setSaveSuccess(false);
    // Find nodes with no outgoing edge
    const nodeIdsWithOutgoing = new Set(edges.map(e => e.source));
    const nodesWithNoOutgoing = nodes.filter(n => !nodeIdsWithOutgoing.has(n.id));
    if (nodes.length > 1 && nodesWithNoOutgoing.length > 1) {
      setSaveError('Error: More than one node has no outgoing edge (empty target handle).');
      return;
    }
    
    setSaveSuccess(true);
    // Optionally, log the flow
    // console.log('Flow saved:', { nodes, edges });
  };

  return (
    <div style={{ display: 'flex', height: '80vh', border: '1px solid #ddd', borderRadius: 8, background: '#fff' }}>
      {selectedNode ? (
        <SettingsPanel
          node={selectedNode}
          updateNodeLabel={updateNodeLabel}
        />
      ) : (
        <NodesPanel />
      )}
      <div style={{ flex: 1, position: 'relative', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodesWithOnChange}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              fitView
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <Background />
              <MiniMap
                nodeColor={n => '#A2D5C6'}
                // nodeStrokeColor={n => '#128c7e'} 
              />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
        <SaveButton onSave={handleSave} error={saveError} success={saveSuccess} />
      </div>
    </div>
  );
};

export default FlowBuilder; 