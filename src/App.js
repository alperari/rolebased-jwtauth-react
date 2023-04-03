import Router from './config/router';
import { UserProvider } from './providers/UserProvider';

function App() {
  return (
    <Router>
      <UserProvider>
        <App />
      </UserProvider>
    </Router>
  );
}

export default App;
