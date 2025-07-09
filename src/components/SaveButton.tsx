import React from 'react';

export interface SaveButtonProps {
  onSave: () => void;
  error: string | null;
  success: boolean;
}

const SaveButton = ({ onSave, error, success }: SaveButtonProps) => {
  return (
    <div style={{ margin: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <button
        onClick={onSave}
        style={{
          padding: '8px 24px',
          fontSize: 16,
          borderRadius: 4,
          background: '#007bff',
          color: '#fff',
          border: 'none',
          marginBottom: 8,
        }}
      >
        Save Flow
      </button>
      {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 4 }}>Flow saved successfully!</div>}
    </div>
  );
};

export default SaveButton;
