import React, { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";

const NationalityRelationForm = () => {
  const [idPlayer, setIdPlayer] = useState(1);
  const [idNation, setIdNation] = useState(1);
  const [jugadores, setJugadores] = useState([]);
  const [nacionalidades, setNacionalidades] = useState([]);

  useEffect(() => {
    fetchJugadores();
    fetchNacionalidades();
  }, []);

  const fetchJugadores = async () => {
    try {
      const { data, error } = await supabase.from('Jugadores').select('id, name');

      if (error) {
        throw error;
      }

      setJugadores(data);
    } catch (error) {
      console.error('Error fetching Jugadores:', error.message);
      // Handle error
    }
  };

  const fetchNacionalidades = async () => {
    try {
      const { data, error } = await supabase.from('nacionalidad').select('id, nation_name');

      if (error) {
        throw error;
      }

      setNacionalidades(data);
    } catch (error) {
      console.error('Error fetching Nacionalidades:', error.message);
      // Handle error
    }
  };

  const handleIdPlayerChange = (event) => {
    setIdPlayer(parseInt(event.target.value));
  };

  const handleIdNationChange = (event) => {
    setIdNation(parseInt(event.target.value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data, error } = await supabase
        .from('nationality_relation')
        .insert([{ id_player: idPlayer, id_nation: idNation }]);

      if (error) {
        throw error;
      }

      console.log('New record added successfully:', data);
      // Perform any necessary post-submission actions

      // Reset form
      setIdPlayer(1);
      setIdNation(1);
    } catch (error) {
      console.error('Error adding record:', error.message);
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        ID Player:
        <select value={idPlayer} onChange={handleIdPlayerChange}>
          {jugadores.map((jugador) => (
            <option key={jugador.id} value={jugador.id}>
              {jugador.name}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        ID Nation:
        <select value={idNation} onChange={handleIdNationChange}>
          {nacionalidades.map((nacionalidad) => (
            <option key={nacionalidad.id} value={nacionalidad.id}>
              {nacionalidad.nation_name}
            </option>
          ))}
        </select>
      </label>
      <br />
      <button type="submit">Add Record</button>
    </form>
  );
};

export default NationalityRelationForm;
