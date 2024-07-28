import './App.css';
import Layouts from './Layout';
import AuthProvider from './context/AuthProvider';

const App = () => {
  return (
    <AuthProvider>
      <Layouts />
    </AuthProvider>
  );
}

export default App;
