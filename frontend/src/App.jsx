import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import Customize from "./pages/Customize";
import Customize2 from "./pages/Customize2";
import { dataContext } from "./context/data.context.js";

function App() {
  const { userdata, isAuthLoading } = useContext(dataContext)

  if (isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p role="status">Loading your account...</p>
      </main>
    )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          userdata?.assistantImage && userdata?.assistantName ? (
            <Home />
          ) : (
            <Navigate to="/customize" replace />
          )
        }
      />
      <Route
        path="/signup"
        element={!userdata ? <Signup /> : <Navigate to="/" replace />}
      />
      <Route
        path="/signin"
        element={!userdata ? <Signin /> : <Navigate to="/" replace />}
      />
      <Route
        path="/customize"
        element={
          userdata ? <Customize /> : <Navigate to="/signup" replace />
        }

      />
      <Route
        path="/customize2"
        element={
          userdata ? <Customize2 /> : <Navigate to="/signup" replace />
        }
        
      />
    </Routes>
  );
}

export default App;
