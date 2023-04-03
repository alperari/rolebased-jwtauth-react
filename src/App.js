import Router from './config/router';
import { UserProvider } from './providers/UserProvider';

function App() {
  console.log(process.env.REACT_APP_API_URL);
  return (
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );
}

export default App;
