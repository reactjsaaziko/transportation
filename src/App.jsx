import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './app/dashboard/Dashboard'
import LoginPage from './components/auth/LoginPage'
import InspectionFormStandalone from './components/inspection/InspectionFormStandalone'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/show-interest" element={<InspectionFormStandalone />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
