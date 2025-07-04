class Input extends React.Component {
    render() {
        const { onChangeHandler } = this.props;
        return (
            <input type="text" onChange={onChangeHandler} />
        );
    }
}