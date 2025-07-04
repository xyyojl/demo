/* 
实现步骤：
1. 类组件
2. 封装成单独的组件
3. 改写成函数组件「熟悉两种写法」
*/

const App = () => {
    const [pokemons, setPokemons] = React.useState([]);
    const [filteredPokemons, setFilteredPokemons] = React.useState([]);

    React.useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon')
            .then(res => res.json())
            .then(json => {
                const res = json.results.map((result, index) => {
                    return {
                        ...result,
                        id: index + 1,
                    }
                });
                setPokemons(res);
                setFilteredPokemons(res);
            })
    }, []);

    const onChangeHandler = (event) => {
        const filteredPokemons = pokemons.filter(pokemon => pokemon.name.includes(event.target.value));
        setFilteredPokemons(filteredPokemons);
    };


    return (
        <div>
            <h1>宝可梦</h1>
            <Input onChangeHandler={onChangeHandler} />
            <Lists pokemonsLists={filteredPokemons} />
        </div>
    );
};