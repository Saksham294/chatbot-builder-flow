export type NodeType = 'text'; // NodeType for extensibility

// Example node data structure
export interface ChatbotNodeData {
  type: NodeType;
  label: string;
} 