import React from 'react';
import './App.css';
// import '@avaya/neo-react/avaya-neo-react.css';
import CobrowseReports from './pages/CobrowseReports';



function App() {
  return (
    <div className="App">
      <CobrowseReports interactionId='placeHolderInteractionID' />
    </div>
  );
}

export default App;
