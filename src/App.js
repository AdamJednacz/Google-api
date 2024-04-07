import logo from './logo.svg';
import './App.css';
import {BrowserRouter , Routes,Route} from "react-router-dom";
import View1 from "./JSX/View1";
import Api from "./JSX/Api";
import View2 from "./JSX/View2";

const App = () => {
  return (
      <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Api />} />
                  <Route path="/view2" element={<View2/>} />
              </Routes>
      </BrowserRouter>
  );
}

export default App;
