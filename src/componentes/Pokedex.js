// Pokedex.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos.css';

const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

const Pokedex = () => {
  const [consulta, setConsulta] = useState('');
  const [pokemones, setPokemones] = useState([]);

  useEffect(() => {
    // Cargar los primeros 493 Pokémons, primero y segunda generación al iniciar
    const fetchPokemones = async () => {
      try {
        const requests = [];
        for (let i = 1; i <= 493; i++) {
          requests.push(axios.get(`${API_URL}${i}`));
        }
        const responses = await Promise.all(requests);
        setPokemones(responses.map(res => res.data));
      } catch (error) {
        console.error('Error al obtener los Pokémon', error);
      }
    };
    fetchPokemones();
  }, []);

  // Búsqueda en tiempo real con onChange
  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    setConsulta(searchTerm);

    if (searchTerm.trim() === '') {
      const requests = [];
      for (let i = 1; i <= 100; i++) {
        requests.push(axios.get(`${API_URL}${i}`));
      }
      const responses = await Promise.all(requests);
      setPokemones(responses.map(res => res.data));
      return;
    }

    try {
      const response = await axios.get(`${API_URL}${searchTerm.toLowerCase()}`);
      setPokemones([response.data]);
    } catch (error) {
      console.error('Error al obtener el Pokémon', error);
      setPokemones([]);
    }
  };

  return (
    <div className="container">
      <h1>Pokédex</h1>
      <form>
        <input
          type="text"
          placeholder="Buscar Pokémon por nombre o ID"
          value={consulta}
          onChange={handleSearch}
        />
      </form>
      <div className="pokemon-grid">
        {pokemones.length > 0 ? (
          pokemones.map(pokemon => (
            <div key={pokemon.id} className="pokemon-card">
              <h2>{pokemon.name.toUpperCase()}</h2>
              <img
                src={
                  pokemon.sprites.versions['generation-v']['black-white'].animated.front_default
                }
                alt={pokemon.name}
              />
              <p>
                <strong>Tipo:</strong> {pokemon.types.map(t => t.type.name).join(', ')}
              </p>
              <p>
                <strong>Vida:</strong>{' '}
                {pokemon.stats.find(s => s.stat.name === 'hp').base_stat}
              </p>
              <p>
                <strong>Ataque:</strong>{' '}
                {pokemon.stats.find(s => s.stat.name === 'attack').base_stat}
              </p>
            </div>
          ))
        ) : (
          <p>No se encontraron Pokémon</p>
        )}
      </div>
    </div>
  );
};

export default Pokedex;
