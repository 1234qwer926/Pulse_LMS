import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HeaderMegaMenu } from './components/HeaderMegaMenu/HeaderMegaMenu';
import { FooterLinks } from './components/FooterLinks/FooterLinks';
import { AuthenticationForm } from './components/AuthenticationForm/AuthenticationForm';
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

// Import the new result management components
import { ResultManagement } from './components/LmsDashboard/ResultManagement';
import { UserResults } from './components/LmsDashboard/UserResults';
import { AssignmentReview } from './components/LmsDashboard/AssignmentReview';
import { Assignment } from './components/Course/Assignment';
import { JotformAssignment } from './components/Course/JotformAssignment';

import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Router>
        <HeaderMegaMenu />
        <Routes>
          {/* Existing Routes */}
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

          {/* New Routes for Result Management */}
          <Route path="/resultmanagement" element={<ResultManagement />} />
          <Route path="/user-results/:courseId" element={<UserResults />} />
          <Route path="/assignment-review/:courseId/:userId" element={<AssignmentReview />} />
          <Route path="/course/:courseId/assignment" element={<Assignment />} />
        
        {/* New assignment route */}
        <Route path="/assignment/:jotformId" element={<JotformAssignment />} />
        </Routes>
        <FooterLinks />
      </Router>
    </div>
  );
}

export default App;
