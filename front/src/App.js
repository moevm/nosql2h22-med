import { BrowserRouter, Routes, Route } from "react-router-dom"
import Homepage from "./Pages/Homepage";
import Profilepage from "./Pages/Profilepage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="profile/:id" element={<Profilepage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;