import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import React from "react";




export default function Users() {
  const [users, setUsers] = useState([]);
  const [nacionality, setnacionality] = useState('');
  const [person, setPerson] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    let { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('id', true);
    if (error) console.log('error', error);
    else {
      setUsers(users);
      console.log(users);
    };
  }

  async function createUsers() {
    let { data: user, error } = await supabase.from('users').insert([{ person, nacionality }]);
    if (error) {
      console.log('error', error);
    } else if (user && user.length > 0) {
      setPerson('');
      setnacionality('');
      await fetchUsers();
    }
  }

  async function updateUsers(id, updatedPerson, updatedNacionality) {
    let { data: user, error } = await supabase
      .from('users')
      .update({ person: updatedPerson, nacionality: updatedNacionality })
      .eq('id', id);
    if (error) console.log('error', error);
    else {
      const index = users.findIndex((u) => u.id === id);
      if (users.length > 0) {
        users[index] = user[0];
        setUsers([...users]);
      }
    }
  }

  async function deleteUsers(id) {
    await supabase.from('users').delete().eq('id', id);
    setUsers(users.filter((u) => u.id !== id));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <div className="users-container">
      <h1>Users</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createUsers();
        }}
      >
        <input
          type="text"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          placeholder="Person"
        />
        <input
          type="text"
          value={nacionality}
          onChange={(e) => setnacionality(e.target.value)}
          placeholder="nacionality"
        />
        <button type="submit">Create User</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Person</th>
            <th>nacionality</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <input
                  type="text"
                  defaultValue={user.person}
                  onBlur={(e) => updateUsers(user.id, e.target.value, user.nacionality)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={user.nacionality}
                  onBlur={(e) => updateUsers(user.id, user.person, e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => deleteUsers(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        <button onClick={handleLogout}>Desloguearse</button>
      </table>
    </div>
  );
}