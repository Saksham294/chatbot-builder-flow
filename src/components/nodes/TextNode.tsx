import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import 'reactflow/dist/style.css';

const TextNode= ({ data }:NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (data.onChange) {
      data.onChange(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      setIsEditing(false);
      e.preventDefault();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };
  return (
    <div 
      style={{ 
        padding: 0, 
        // border: '1px solid #25D366', 
        borderRadius: '0 10px 10px 10px', 
        minWidth: 200, 
        position: 'relative',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {/* Target handle (for incoming edges) - Left side */}
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ 
          background: '#aaaaaa',
          width: 10,
          height: 10,
          left: -5
        }} 
      />
      
      {/* Header banner */}
      <div 
        style={{
          background: '#000000', // Darker WhatsApp green for header
          color: 'white',
          padding: '8px 12px',
          fontSize: '12px',
          fontWeight: 'bold',
          borderRadius: '8px 8px 0 0',
        }}
      >
        Send message
      </div>
      
      {/* Node content */}
      <div 
        style={{
          padding: '12px',
          color: 'black',
          fontSize: '14px',
          backgroundColor: '#ece5dd',
          minHeight: '40px',
          width: 220,
          maxWidth: 220,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          display: 'flex',
          alignItems: isEditing ? 'stretch' : 'center',
          cursor: isEditing ? 'text' : 'pointer',
          borderRadius: '0 0 8px 8px'
        }}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <textarea
            ref={inputRef}
            value={data.label}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'black',
              fontSize: '14px',
              width: '100%',
              minHeight: 40,
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              overflow: 'hidden',
            }}
            rows={Math.max(2, (data.label || '').split('\n').length)}
          />
        ) : (
          <span>{data.label}</span>
        )}
      </div>
      
      {/* Source handle (for outgoing edge) - Right side */}
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ 
          background: '#1B3C53',
          width: 10,
          height: 10,
          right: -5
        }} 
      />
    </div>
  );
};

export default TextNode;