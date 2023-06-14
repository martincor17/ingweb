import React, { useEffect } from "react";
import { supabase } from "./supabaseClient"; 
import TableCRUD from "./Crud";
import './TableCRUD.css';

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut(); 
    if (error) throw error;
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};


const CrudForm = () => {
  useEffect(() => {
    supabase.auth.onAuthStateChange(() => {}); 
  }, []);

  return (
    <div>
      <h1>Supabase CRUD App</h1>
      <button onClick={handleLogout}>Logout</button>
      <TableCRUD
        tableName="Jugadores"
        columns={[
          { name: "name", type: "text" },
          { name: "injuries", type: "number" },
          { name: "goals", type: "number" },
          { name: "assists", type: "number" },
          { name: "matchs", type: "number" },
          { name: "position", type: "text" },
          { name: "age", type: "number" },
          { name: "atajadas", type: "number" },
          { name: "entradas", type: "number" },
          { name: "playTime", type: "number" },
        ]}
      />
      <TableCRUD
        tableName="Team"
        columns={[
          { name: "name", type: "text" },
          { name: "budget", type: "number" },
        ]}
      />
    </div>
  );
};

export default CrudForm;
