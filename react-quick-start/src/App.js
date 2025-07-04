/* 
实现步骤：
1. 类组件
2. 封装成单独的组件
3. 改写成函数组件「熟悉两种写法」
*/
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            pokemons: [],
            filteredPokemons: []
        };
    }
    componentDidMount() {
        fetch('https://pokeapi.co/api/v2/pokemon')
            .then(res => res.json())
            .then(json => {
                // console.log(json.results);
                const res = json.results.map((result, index) => {
                    return {
                        ...result,
                        id: index + 1,
                    }
                });
                this.setState(
                    () => {
                        return {
                            pokemons: res,
                            filteredPokemons: res
                        };
                    },
                    () => {
                        // console.log(this.state);
                    },
                )
            });
    };

    onChangeHandler = event => {
        const filteredPokemons = this.state.pokemons.filter(pokemon => pokemon.name.includes(event.target.value));
        this.setState(
            () => {
                return {
                    filteredPokemons
                }
            },
            () => {
                // console.log(this.state.filteredPokemons);
            },
        )
    };

    render() {
        return (
            <div>
                <h1>宝可梦</h1>
                <Input onChangeHandler={this.onChangeHandler} />
                <Lists pokemonsLists={this.state.filteredPokemons} />
                {/* 封装前的代码 */}
                {/* <input type="text" onChange={this.onChangeHandler}/>
                <ul className="ul-container">
                    {
                        this.state.filteredPokemons.map(pokemon => {
                            return (
                                <li key={pokemon.id}>
                                    <p>{pokemon.name}</p>
                                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} />
                                </li>
                            );
                        })
                    }
                </ul> */}
            </div>)
        ;
    }
}