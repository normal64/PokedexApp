import react, { useState, useEffect} from "react";
import axios from "axios";
import "./css/Pokemon.css";

const Pokemon = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [currentoffset, setCurrentoffset] = useState(0);
    const [pokedata, setPokedata] = useState([]);
    const [choosenPokemonDetailedData, setChoosenPokemonDetailedData] = useState(null)

    //rendered list of pokemons witrhg choosen data
    const renderedPokemons = pokedata.map(  (result) =>  {
        const type = result.types.map( elem =>  `${elem.type.name}; ` )
        return(<div className="single-pokemon"   key={result.name}> 
            <div className="pokemondata-container">
                <div>
                    <h3 onClick={(event) =>onPokemonNameClick(event)} value={result.name}>{result.name}</h3>
                    <img alt="Pokemon image"    src={result.sprites["front_default"]}></img> 
                </div>
                <div>
                    <p>Types: {type}</p> 
                </div>
            </div>
        </div>
        )
    } );

    const choosenDetailedPokemonDataSegment = () => {
        return(<div className="detailed-pokemondata">
                {choosenPokemonDetailedData? <div>
                    <p> Weight:{choosenPokemonDetailedData.weight}</p> 
                    <p> Height:{choosenPokemonDetailedData.height}</p>
                    <div className="pokemonImagesDetailedView">
                        <img src={choosenPokemonDetailedData.sprites["front_default"]}></img>
                        <img src={choosenPokemonDetailedData.sprites["back_default"]}></img>
                    </div>
                </div> 
                :<p> "Pokemon no selected"</p>}
                </div>
        )
    };

    const currentListUrls = pokemonList.map( element => element.url);
    //useEffect to get list of 20 pokemons map over it and set state with mapped version
    useEffect(() => {
        const search = async() => {
            const {data}    =   await
            axios.get("https://pokeapi.co/api/v2/pokemon",{
                params:{
                    limit:  20,
                    offset: currentoffset,
                }
            });
            //add pokemons with new offset to existing ones
            setPokemonList(pokemonList.concat(data.results)  );
        }
        search();
        // return () => {
        //     cleanup
        // }
    }, [currentoffset]);
    //function to change offset in order to add more pokemons to a list
    const addPokemons = () =>{
        setCurrentoffset(currentoffset  + 20);
    };
    //method to find data for clicked pokemons by its name and set state with this data
    const onPokemonNameClick = (event) => {
        const clickedPokemonName = event.target.textContent;
        const clickedPokemonData = pokedata.find( e => e.name === clickedPokemonName);
        const renderedChosenPokemonDetails = clickedPokemonData;
        setChoosenPokemonDetailedData(renderedChosenPokemonDetails);
    }
    //Effect to get ApI response for each url for current pokemon list
    useEffect(() => {
        // creating geturl arr for
        const requestListArr = currentListUrls.map( url =>  axios.get(url));
        console.log(`requestListArr`, requestListArr);
        const search = async() => {
            const data    =   await
            axios.all(requestListArr).then(
                axios.spread((...responses) => {
                //saving data for each pokemon
                const pokedataList = responses.map( response => response.data);
                setPokedata(pokedataList)
                  // use/access the results
                })
            )
            .catch(errors => {
                // react on errors.
                console.error(errors);
            });
            //add pokemons with new offset to existing ones
            
        }
        search();
        console.log(`currentListUrls from separate use effect`, currentListUrls);
        // return () => {
        //     cleanup
        // }
    }, [pokemonList])
    console.log(`pokedata`, pokedata);
    console.log(pokemonList);
    console.log("currentListUrls",currentListUrls);
    return(<div className="pokemon-main-container">
            {renderedPokemons}
            {choosenDetailedPokemonDataSegment()}
            <button className="add-more-pokemons" onClick={addPokemons} type="">Load more pokemons</button>
        </div>
    )
}
export default Pokemon;