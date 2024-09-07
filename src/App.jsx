import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import InvoiceInput from './components/InvoiceInput/invoiceInput';
import InvoiceGenerator from './components/InvoiceGenerator/invoiceGenerator';

function App() {
  const [invoiceData, setInvoiceData] = useState(null);

  const handleGenerateInvoice = (data) => {
    setInvoiceData(data);
  };

  return (
    <Router>
      <div className="app">
        <div className="logo">
          <img src="https://cdn-icons-png.flaticon.com/512/314/314421.png" alt="" />
          <h1>Invoice Gen.</h1>
        </div>
        <Routes>
          <Route
            path="/"
            element={<InvoiceInput onGenerateInvoice={handleGenerateInvoice} />}
          />
          <Route
            path="/invoice"
            element={<InvoiceGenerator invoiceData={invoiceData} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
