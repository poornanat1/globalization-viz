import { Provider } from 'react-redux';
import store from './store/store';
import Globe from './components/Globe/Globe.jsx';

function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <Globe />
      </div>
    </Provider>
  );
}

export default App; 