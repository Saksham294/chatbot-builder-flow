import React from 'react';

// Array to store different types of nodes
const NODE_TYPES = [
  { type: 'text', label: 'Message' },
];

const NodesPanel = () => {
  // Handle drag start, set node type in dataTransfer
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{ width: 200, padding: 16, borderRight: '1px solid #eee', background: '#f9fafb' }}>
      <h3>Nodes</h3>
      {/* List of draggable node types */}
      {NODE_TYPES.map((node) => (
        <div
          key={node.type}
          style={{
            padding: '8px 12px',
            marginBottom: 8,
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 4,
            cursor: 'grab',
            userSelect: 'none',
          }}
          draggable
          onDragStart={(event) => onDragStart(event, node.type)}
        >
          {node.label}
        </div>
      ))}
    </aside>
  );
};

export default NodesPanel;
