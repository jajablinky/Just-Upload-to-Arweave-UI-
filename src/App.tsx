import { HashRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import HomePage from './views/HomePage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path={'/'} element={<HomePage />} />
      </Routes>
      <Toaster />
    </HashRouter>
  );
}

export default App;
