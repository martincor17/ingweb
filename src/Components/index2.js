// Importar el módulo express
const express = require('express');

// Crear una instancia de la aplicación
const app = express();

// Definir una ruta GET que devuelva el código del componente React
app.get('/core', (req, res) => {
  // El código del componente React como una cadena de texto
  const coreCode = `import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function Core() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const[nation,setNation]=useState(null)
  const [nationsAmount,setNationsAmount]=useState([]);
  const [nationsRelation, setNationsRelation]=useState([]);
  const [allPlayers, setAllPlayers]=useState([]);
  const [topThreeNation,setTopThreeNation]=useState([]);

  useEffect(() => {
    fetchTeams();
    fetchNations();
    fetchPlayersNations();
    fetchAllPlayers();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchPlayers(selectedTeam.id);
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      const { data } = await supabase.from('Team').select('*');
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchNations = async () => {
    try {
      const { data } = await supabase.from('nacionalidad').select('*');
      setNationsAmount(data);
    } catch (error) {
      console.error('Error fetching nations:', error);
    }
  };

  const fetchPlayers = async (teamId) => {
    try {
      const { data } = await supabase.from('Jugadores').select('*');
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const fetchAllPlayers = async () => {
    try {
      const { data } = await supabase.from('Jugadores').select('*');
      setAllPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const fetchPlayersNations = async () => {
    try {
      const { data } = await supabase.from('nationality_relation').select('*');
      setNationsRelation(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const calculatePlayerScore = (player) => {
    return (calculatePlayerCost(player)/100)
  };

  const calculatePlayerCost = (player) => {
    const positionBonus = handlePlayerPosition(player.position,player.goals,player.assists,player.entradas,player.atajadas);
    const timeBonus = handlePlayerTime(player.playTime);
    return (
      Math.round((100/ player.age))  +
      positionBonus + 
      timeBonus -
      player.injuries * 200
    );
  };

  const handleTeamChange = (event) => {
    const teamId = event.target.value;
    const selectedTeam = teams.find((team) => team.id == teamId);
    setSelectedTeam(selectedTeam);
  };

  const handleNationChange = (event) => {
    const nationId = event.target.value;
    setNation(nationId);
  };

  const handleCalculateTopPlayersNation = () => {
    if (nation) {
      const nationality = nationsAmount.find((nationality) => nationality.id == nation);
      console.log("nationality: " + nationality.nation_name);
      
      const nationalityFilter = nationsRelation.filter((relation) => relation.id_nation == nationality.id);
      console.log("nationsRelation: ", nationsRelation);
      console.log("nationalityFilter: ", nationalityFilter);
      
      const playerIds = nationalityFilter.map((filter) => filter.id_player);
      const searchedPlayers = allPlayers.filter((player) => playerIds.includes(player.id));
      console.log("searchedPlayers: ", searchedPlayers);
      
      const sortedPlayers = [...searchedPlayers].sort((a, b) => {
        const scoreA = calculatePlayerScore(a);
        const scoreB = calculatePlayerScore(b);
        return scoreB - scoreA;
      });
      
      setTopThreeNation(sortedPlayers);
    }
  };
  

  const handleCalculateTopPlayers = () => {
    if (selectedTeam) {
      const budget = selectedTeam.budget;
      const sortedPlayers = [...players].sort((a, b) => {
        const scoreA = calculatePlayerScore(a);
        const scoreB = calculatePlayerScore(b);
        return scoreB - scoreA;
      });`;

  // Enviar el código como respuesta en formato JSON
  res.json({ code: coreCode });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
