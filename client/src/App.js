import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar';
import ChatBox from './components/ChatBox'
import MovingText from './components/MovingText'
import Footer from './components/Footer'

function App() {
  return (
    <div className="App">
       <NavBar />
      <MovingText />
      <ChatBox />
      <Footer />
    </div>
  );
}

export default App;