import React from "react";
import TableCRUD from "./Crud";
import './TableCRUD.css';

const CrudForm = () => {

  return (
    <div>
      <h1>Supabase CRUD App</h1>
      <TableCRUD tableName="Jugadores" columns={[{ name: 'name', type: 'text' }, { name: 'injuries', type: 'number' }, { name: 'goals', type: 'number' }, { name: 'assists', type: 'number' }, { name: 'matchs', type: 'number' }, { name: 'position', type: 'text' }, { name: 'age', type: 'number' }]} />
      <TableCRUD tableName="Team" columns={[{ name: 'name', type: 'text' },{ name: 'budget', type: 'number' }]} />
    </div>
  );
  
};


export default CrudForm;
