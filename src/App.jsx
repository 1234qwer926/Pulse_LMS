import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HeaderMegaMenu } from './components/HeaderMegaMenu/HeaderMegaMenu'
import { FeaturesCards } from './components/FeaturesCards/FeaturesCards'
import { HeroText } from './components/HeroText/HeroText'
import { FooterLinks } from './components/FooterLinks/FooterLinks'
import { AuthenticationForm } from './components/AuthenticationForm/AuthenticationForm'
import Home from './components/Home/Home';
import { UserMapping } from './components/LmsDashboard/UserMapping';
import { LmsDashboard } from './components/LmsDashboard/LmsDashboard';
import { CreateJotform } from './components/LmsDashboard/CreateJotform';
import { CreateJotformBuilder } from './components/LmsDashboard/CreateJotformBuilder';
import { JotformMapping } from './components/LmsDashboard/JotformMapping';
import { CourseManagement } from './components/LmsDashboard/CourseManagement';
import { AnalyticLeaderDashboard } from './components/AnalyticLeaderDashboard/AnalyticLeaderDashboard';
import { Course } from './components/Course/Course';
import { JotformViewer } from './components/Course/JotformViewer';
import { JotformManagement } from './components/LmsDashboard/JotformManagement';
import { UserManagement } from './components/LmsDashboard/UserManagement';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (

      <div>
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      
      
      {/* <HeroTitle/> */}
      <Router>
        <HeaderMegaMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthenticationForm />} />
          <Route path="/mapuser" element={<UserMapping />} />
          <Route path="/lmsdashboard" element={<LmsDashboard />} />
          <Route path="/createjotform" element={<CreateJotform />} />
          <Route path="/jotformbuilder" element={<CreateJotformBuilder />} />
          <Route path="/jotformmapping" element={<JotformMapping />} />
          <Route path="/coursemanagment" element={<CourseManagement />} />
          <Route path="/analyticdashboard" element={<AnalyticLeaderDashboard />} />
          <Route path="/course" element={<Course />} />
          <Route path="/jotformviewer" element={<JotformViewer />} />
          <Route path="/jotformmanagment" element={<JotformManagement />} />
          <Route path="/usermanagment" element={<UserManagement />} />
        </Routes>
        <FooterLinks/>
      </Router>
    </div>

  )
}

export default App
