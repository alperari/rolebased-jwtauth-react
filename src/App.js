import Router from './config/router';
import { UserProvider } from './providers/UserProvider';

function App() {
  return (
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );
}

export default App;
