import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskBoard } from './components/TaskBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskBoard />} />
        <Route path="/dashboard" element={<TaskBoard />} />
        <Route path="/calendar" element={<TaskBoard />} />
        <Route path="/completed" element={<TaskBoard />} />
        <Route path="/settings" element={<TaskBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
