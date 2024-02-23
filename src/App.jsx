import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './App.css';
import MorePokemonsButton from './components/MorePokemonsButton';
import Heading from './components/Heading';


function App() {

  const [loading, isLoading] = useState(true)
  const [pokemonList, setPokemonList] = useState([]);
  const [nextPokemonUrl, setNextPokemonUrl] = useState(null);
  const [modal, setModal] = useState(false);
  const [selectedPokemon, setselectedPokemon] = useState(null);

  async function getAllPokemons(url = "https://content.newtonschool.co/v1/pr/64ccef982071a9ad01d36ff6/pokemonspages1", override = false) {
    const res = await axios.get(url)
    const pokemonData = res.data[0].results;
    setNextPokemonUrl(res.data[0].next);
    const pokemonListFromApi = [];
    for (let pokemon of pokemonData) {
      const res = await axios.get(pokemon.url);
      const data = res.data[0];
      pokemonListFromApi.push(data);
    }
    console.log(pokemonListFromApi);
    if (!override) {
      setPokemonList(pokemonListFromApi);
    }
    else {
      setPokemonList((oldlist) => {
        return oldlist.concat(pokemonListFromApi);
      })
    }
    setTimeout(() => {

      isLoading(false);
    }, 500)
  }

  function handleMorePokemon() {
    getAllPokemons(nextPokemonUrl, true);

  }


  function closeModal() {
    setModal(false);
    setselectedPokemon(null);
  }

  useEffect(() => {
    getAllPokemons();
  }, [])

  return (
    <>
    { loading ? <div id="loading"> <img src="https://cdn.dribbble.com/users/621155/screenshots/2835314/simple_pokeball.gif" alt="Pokemon ball gif"/> </div> :
                <div id="parent">
                         
                         {/* HEADING */}
                       <Heading />
              
                        {/* MODAL OF POKEMON DETAILS */}
                        <div className="modal" id={!modal && "inactive"}>
                                <div className="content ">
  {selectedPokemon !== null && selectedPokemon >= 0 && <div className={`details ${pokemonList[selectedPokemon].type}`}>
                                                <div className="img-name">
                                                        <img src={pokemonList[selectedPokemon].image} alt={pokemonList[selectedPokemon].name} />
                                                        <h3>{pokemonList[selectedPokemon].name}</h3>
                                                </div>

                                                <div className="stats">
                                                        <div>
                                                                <h6>Weight: {pokemonList[selectedPokemon].weight}</h6>
                                                                <h6>Height: {pokemonList[selectedPokemon].height}</h6>
                                                        </div>

                                                        <div>
                                                                {pokemonList[selectedPokemon].stats.map((stats, index) => {
                                                                        return <h6>Stat{index + 1}: {stats.stat.name}</h6>

                                                                })}
                                                        </div>

                                                        <div>
                                                                {pokemonList[selectedPokemon].stats.map((stats, index) => {
                                                                        return <h6>Bs{index + 1}: {stats.base_stat}</h6>

                                                                })}
                                                        </div>

                                                        <div>
                                                        </div>
                                                </div>
                                                <div onClick={closeModal} id="close">x</div>
                                        </div>
                                        }
                                </div>
                        </div>
                        
                        {/* POKEMON CARDS (MAIN CONTENT) */}
                        <div className="app-container" id="no-scroll">
                                <div className="pokemon-container">
                                        {pokemonList.map((pokemon, index) => {
                                                return <div key={index} className={`card ${pokemon.type}`}>
                                                        <div className='number'>#{pokemon.id}</div>
                                                        <img src={pokemon.image} alt={pokemon.name} />
                                                        <div className="details">
                                                                <h3>{pokemon.name}</h3>
                                                                <small>Type: {pokemon.type}</small>
                                                        </div>

                                                        <div className="know-more-div">
                                                                <button className="know-more-btn" onClick={() => {
                                                                        setModal(true);
                                                                        setselectedPokemon(index);
                                                                }}>Know more...</button>
                                                        </div>
                                                </div>

                                        })}
                                </div>

                        </div>
                       {/* MORE POKEMON BUTTON */}
                       <MorePokemonsButton handleMorePokemon={handleMorePokemon}/>
                </div>
                }
    </>
  )
}

export default App
