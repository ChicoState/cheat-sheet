import React from 'react';

const CheatSheetList = ({ sheets, onSelect, onDelete, onNew }) => {
  return (
    <div className="cheat-sheet-list">
      <h2>My Cheat Sheets</h2>
      <button onClick={onNew} className="btn primary">New Cheat Sheet</button>
      
      {sheets.length === 0 ? (
        <p>No cheat sheets found. Create one!</p>
      ) : (
        <ul className="sheet-list">
          {sheets.map((sheet) => (
            <li key={sheet.id} className="sheet-item">
              <span className="sheet-title" onClick={() => onSelect(sheet)}>
                {sheet.title}
              </span>
              <div className="actions">
                <button onClick={() => onDelete(sheet.id)} className="btn delete">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CheatSheetList;
