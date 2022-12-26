import { BrowserRouter, Routes, Route } from "react-router-dom"
import Homepage from "./Pages/Homepage";
import Profilepage from "./Pages/Profilepage";
import ImportExportpage from "./Pages/ImportExportpage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Homepage/> } />
        <Route path="profile/:id" element={ <Profilepage/> } />
        <Route path="importexport" element={ <ImportExportpage/> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;