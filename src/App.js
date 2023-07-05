import React, { useState, useEffect } from "react";
import Users from "./Components/Home";
import AuthForm from "./Components/LoginPage";
import CrudForm from "./Components/CRUDForm";
import { supabase } from "./Components/supabaseClient";
import Core from "./Components/Core";

function App() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      // Retrieve user's email from the session
      const userEmail = session && session.user && session.user.email;
      console.log(session);

      // Query the 'users' table to check if the user is an admin
      supabase
        .from("users")
        .select("admin")
        .eq("mail", userEmail)
        .then(({ data, error }) => {
          if (error) {
            console.error("Error retrieving user data:", error);
          } else if (data.length > 0) {
            // User found, check if admin property is true
            setIsAdmin(data[0].admin);
          }
        });
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    console.log(session);
  }, []);

  return (
    <div>
      {session ? (
        !isAdmin ? (
          <Core />
        ) : (
          <CrudForm />
        )
      ) : (
        <AuthForm />
      )}
    </div>
  );
}

export default App;
