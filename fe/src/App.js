import Header from './component/layout/Header/Header'
import Footer from './component/layout/Footer/Footer'
import Home from './component/Home/Home'
import './App.css';
import {BrowserRouter as Router, Route , Routes} from "react-router-dom"
import WebFont from "webfontloader"
import React from "react"



function App() {

  React.useEffect(()=>{
    WebFont.load({
      google:{
        families:["Roboto","Droid sans","Chilanka"]
      }
    })
  },[])

  return (
    <Router>
    <Header/>
      <Routes>
    <Route path="/" element={<Home />} />
    </Routes>
  <Footer/>
    </Router>
  );
}

export default App;
