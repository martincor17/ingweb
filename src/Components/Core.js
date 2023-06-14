import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function Core() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    fetchTeams();
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

  const fetchPlayers = async (teamId) => {
    try {
      const { data } = await supabase.from('Jugadores').select('*');
      setPlayers(data);
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

  const handleCalculateTopPlayers = () => {
    if (selectedTeam) {
      const budget = selectedTeam.budget;
      const sortedPlayers = [...players].sort((a, b) => {
        const scoreA = calculatePlayerScore(a);
        const scoreB = calculatePlayerScore(b);
        return scoreB - scoreA;
      });
      const topThreePlayers = sortedPlayers.filter(
        (player, index) => index < 3 && calculatePlayerCost(player) <= budget
      );
      setTopPlayers(topThreePlayers);
    }
  };

  const handlePlayerPosition = (position,goals,assist,entradas,atajadas) => {
    const lowercasePosition = position.toLowerCase();
    if (lowercasePosition === 'delantero') {
      return (goals*10000)+(assist*100)+(entradas*10);
    } else if (lowercasePosition === 'mediocampista') {
      return (goals*100)+(assist*10000)+(entradas*10);
    } else if (lowercasePosition === 'defensa') {
      return (goals*100)+(entradas*10000)+(assist*10);
    } 
    else if (lowercasePosition === 'portero'){
      return (atajadas*10110); 
    }
    else {
      return 1250*goals;
    }
  };

  const handlePlayerTime = (playtime) => {
    if (playtime>=13000) {
      return playtime*10000;
    } else if (playtime>=10000) {
      return playtime*9500;
    } else if (playtime>=8000) {
      console.log('Es de mas de 8 Miiil!!')
      return playtime*5000;
    } 
    else if (playtime>=5000){
      return playtime*2000; 
    }
    else {
      return playtime*850;
    }
  };
  
  return (
    <div>
      <h1>Team Budget Analysis</h1>
      <div>
        <label htmlFor="teamSelect">Select a team:</label>
        <select id="teamSelect" onChange={handleTeamChange}>
          <option value="">Select</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <button onClick={handleCalculateTopPlayers} disabled={!selectedTeam}>
          Calculate Top Players
        </button>
      </div>
      {topPlayers.length > 0 && (
        <div>
          <h2>Top Players:</h2>
          <ul>
            {topPlayers.map((player) => (
              <li key={player.id}>
                {player.name} - Score: {calculatePlayerScore(player)} - Cost: {calculatePlayerCost(player)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Core;
