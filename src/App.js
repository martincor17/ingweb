import React, { useState, useEffect } from "react";
import Users from "./Components/Home";
import AuthForm from "./Components/LoginPage";
import { supabase } from "./Components/supabaseClient";

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])


  return (
    <div>
      {session ? (
        // Render home page component if user is logged in

        <Users />
      ) : (
        // Render login page component if user is not logged in
        <AuthForm  />
      )}
    </div>
  );
}

export default App;
