// Pokedex.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos.css';

const API_URL = 'https://pokeapi.co/api/v2/pokemon/';
const TOTAL_POKEMON = 493; // Limita a las primeras 4 generaciones

const Pokedex = () => {
  const [todosPokemones, setTodosPokemones] = useState([]); // Almacena todos
  const [pokemonesMostrados, setPokemonesMostrados] = useState([]); // Los que se ven
  const [consulta, setConsulta] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemones = async () => {
      setLoading(true);
      try {
        const requests = [];
        for (let i = 1; i <= TOTAL_POKEMON; i++) {
          requests.push(axios.get(`${API_URL}${i}`));
        }
        const responses = await Promise.all(requests);
        const fetchedPokemons = responses.map(res => res.data);
        setTodosPokemones(fetchedPokemons);
        setPokemonesMostrados(fetchedPokemons); // Muestra todos al inicio
      } catch (error) {
        console.error('Error al obtener los Pokémon', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemones();
  }, []);

  // Búsqueda en tiempo real filtrando la lista local
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setConsulta(searchTerm);

    if (searchTerm.trim() === '') {
      setPokemonesMostrados(todosPokemones); // Muestra todos si no hay búsqueda
      return;
    }

    const filtrados = todosPokemones.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm) ||
      pokemon.id.toString().includes(searchTerm)
    );
    setPokemonesMostrados(filtrados);
  };

  // Función para obtener el sprite animado o el default
  const getSprite = (sprites) => {
      return sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || sprites.front_default;
  }

  return (
    <div className="container">
      <h1>Pokédex</h1>
      <form className="search-form" onSubmit={(e) => e.preventDefault()}> {/* Evita recarga */}
        <input
          className="search-input"
          type="text"
          placeholder="Buscar Pokémon por nombre o ID"
          value={consulta}
          onChange={handleSearch}
        />
      </form>
      {loading ? (
        <p className="message">Cargando Pokédex...</p>
      ) : (
        <div className="pokemon-grid">
          {pokemonesMostrados.length > 0 ? (
            pokemonesMostrados.map(pokemon => (
              <div key={pokemon.id} className="pokemon-card">
                <img
                  src={getSprite(pokemon.sprites)}
                  alt={pokemon.name}
                />
                <h2>{pokemon.name}</h2>
                <p><strong>ID:</strong> {pokemon.id}</p>
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
            <p className="message">No se encontraron Pokémon con "{consulta}"</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Pokedex;