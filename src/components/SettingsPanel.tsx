import React from 'react';
import { Node } from 'reactflow';
import { ChatbotNodeData } from '../types';

export interface SettingsPanelProps {
  node: Node<ChatbotNodeData>;
  updateNodeLabel: (id: string, label: string) => void;
}

const SettingsPanel= ({ node, updateNodeLabel }:SettingsPanelProps) => {
  // Using node.data.label directly for two-way sync to edit text in the node
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeLabel(node.id, e.target.value);
  };

  return (
    <aside style={{ width: 300, padding: 16, borderRight: '1px solid #eee', background: '#f9fafb' }}>
      <h3>Settings</h3>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 500 }}>Text:</label>
        <input
          type="text"
          value={node.data.label}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}
        />
      </div>
      {/* Future settings fields can be added here */}
    </aside>
  );
};

export default SettingsPanel; 