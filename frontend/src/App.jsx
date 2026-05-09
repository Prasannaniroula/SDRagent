import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Composer from './pages/Composer'
import Leads from './pages/Leads'
import Sidebar from './components/Sidebar'
import { useTheme } from './Context/ThemeContext'

export default function App() {
  const { isDark } = useTheme()

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Sidebar />
      <main className={`flex-1 p-6 mt-14 md:mt-0 overflow-y-auto ${isDark ? 'text-white' : 'text-gray-800'}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/composer" element={<Composer />} />
          <Route path="/leads" element={<Leads />} />
        </Routes>
      </main>
    </div>
  )
}