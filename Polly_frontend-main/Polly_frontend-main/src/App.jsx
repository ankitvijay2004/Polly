import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Profile from "./components/Profile.jsx";
import Signin from "./components/Signin.jsx";
import Signup from "./components/Signup.jsx";
import NewPoll from "./components/newPoll.jsx";
import PollDetails from "./components/PollDetails.jsx";
import VotePage from "./components/vote.jsx";
import Uri from "./components/uri.jsx";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/profile" /> : <Navigate to="/signin" />
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/newpoll" element={<NewPoll />} />
        <Route path="/details/:pollId" element={<PollDetails />} />
        <Route path="/vote/:pollId" element={<VotePage />} />
        <Route path="/uri/:pollId" element={<Uri />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
