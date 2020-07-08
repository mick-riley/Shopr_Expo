import React, {Component} from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default class ListItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            quantity: 1,
            product: props.item.product,
            brand: props.item.brand,
            id: props.item.id,
            value: props.item.value
        }
    }

    componentDidMount(){
    }

    componentDidUpdate(previousProps, prevState) {
        if (prevState.quantity !== this.state.quantity) {
            this.changeQuantity();
        }
    }

    changeQuantity = () => {
        this.props.updateQuantity(this.state);
    }

    render () {
        return (
            <View style = {styles.row}>
                <Text> {this.state.product} ({this.state.brand}) {this.state.quantity}</Text>
                <TouchableOpacity
                    onPress = {() => {
                        this.state.quantity + 1 <= 10 ? 
                        this.setState({quantity: this.state.quantity + 1}) :
                        this.setState({quantity: this.state.quantity});
                    }}
                >
                    <Feather name="plus" style={styles.iconStyle} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress = {() => {
                        this.state.quantity - 1 >= 1 ? 
                        this.setState({quantity: this.state.quantity - 1}) :
                        this.setState({quantity: this.state.quantity});
                    }}
                >
                    <Feather name="minus" style={styles.iconStyle} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between"
    },
    iconStyle: {
        fontSize: 40,
        alignSelf: 'center',
        marginHorizontal: 10
    }
})