import { useState, useEffect } from 'react'
import './App.css'
import CheatSheetList from './components/CheatSheetList';
import CreateCheatSheet from './components/CreateCheatSheet';
import CheatSheetView from './components/CheatSheetView';

function App() {
  const [view, setView] = useState('list'); // list, create, edit, view
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(null);

  useEffect(() => {
    const savedSheets = localStorage.getItem('cheatSheets');
    if (savedSheets) {
      try {
        setSheets(JSON.parse(savedSheets));
      } catch (e) {
        console.error("Failed to parse sheets", e);
        setSheets([]);
      }
    }
  }, []);

  useEffect(() => {
    if (sheets.length > 0) {
      localStorage.setItem('cheatSheets', JSON.stringify(sheets));
    }
  }, [sheets]);

  const handleSave = (data) => {
    if (view === 'edit' && activeSheet) {
      const updatedSheets = sheets.map(s => 
        s.id === activeSheet.id ? { ...s, ...data } : s
      );
      setSheets(updatedSheets);
      setActiveSheet({ ...activeSheet, ...data });
      setView('view');
    } else {
      const newSheet = {
        id: Date.now(),
        ...data
      };
      setSheets([...sheets, newSheet]);
      setActiveSheet(newSheet);
      setView('view');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this cheat sheet?')) {
      const updatedSheets = sheets.filter(s => s.id !== id);
      setSheets(updatedSheets);
      // If we delete all, clear storage or keep empty array
      if (updatedSheets.length === 0) {
        localStorage.removeItem('cheatSheets');
      }
      if (activeSheet && activeSheet.id === id) {
        setActiveSheet(null);
        setView('list');
      }
    }
  };

  const handleSelect = (sheet) => {
    setActiveSheet(sheet);
    setView('view');
  };

  const renderView = () => {
    switch (view) {
      case 'create':
        return (
          <CreateCheatSheet 
            onSave={handleSave} 
            onCancel={() => setView('list')} 
          />
        );
      case 'edit':
        return (
          <CreateCheatSheet 
            initialData={activeSheet} 
            onSave={handleSave} 
            onCancel={() => setView('view')} 
          />
        );
      case 'view':
        return (
          <CheatSheetView 
            sheet={activeSheet} 
            onBack={() => setView('list')}
            onEdit={() => setView('edit')}
          />
        );
      case 'list':
      default:
        return (
          <CheatSheetList 
            sheets={sheets} 
            onSelect={(sheet) => { setActiveSheet(sheet); setView('view'); }} 
            onDelete={(id) => {
              if (window.confirm('Are you sure you want to delete this cheat sheet?')) {
                const updatedSheets = sheets.filter(s => s.id !== id);
                setSheets(updatedSheets);
                if (updatedSheets.length === 0) {
                  localStorage.removeItem('cheatSheets');
                }
              }
            }}
            onNew={() => setView('create')} 
          />
        );
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1 onClick={() => setView('list')} style={{cursor: 'pointer'}}>Cheat Sheet Generator</h1>
        <p>Write cheat sheets with LaTeX support</p>
      </header>
      <main>
        {renderView()}
      </main>
    </div>
  );
}

export default App
