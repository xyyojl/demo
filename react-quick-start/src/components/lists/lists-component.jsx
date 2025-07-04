const Lists = ({ pokemonsLists }) => {
    const imgCSS = {
        border: '1px solid darkorange',
        borderRadius: '10px'
    };
    return (
        <ul className="ul-container">
            {
                pokemonsLists.map(pokemon => {
                    return (
                        <li key={pokemon.id}>
                            <p>{pokemon.name}</p>
                            <img
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                                style={imgCSS}
                            />
                        </li>
                    );
                })
            }
        </ul>
    );
};