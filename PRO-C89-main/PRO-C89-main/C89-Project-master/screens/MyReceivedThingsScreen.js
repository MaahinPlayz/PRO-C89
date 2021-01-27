import React from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import db from '../config';
import {ListItem} from 'react-native-elements';

export default class MyReceivedThingsScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            userId: firebase.auth().currentUser.email,
            receivedThingsList: []
        }

        this.requestRef = null;
    }

    getReceivedThingsList = () => {
        this.requestRef = db.collection('requested_things').where('user_id', '==', this.state.userId).where('thing_status', '==', 'received').onSnapshot((snapshot) => {
            var receivedThingsList = snapshot.docs.map((doc) => doc.data());
            console.log(receivedThingsList.length);
            this.setState({
                receivedThingsList: receivedThingsList
            });
        });
    }

    componentDidMount() {
        this.getReceivedThingsList();
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({item,index}) =>{
        return (
            <ListItem
                key={index}
                title={item.thing_name}
                titleStyle={{ color: 'black', fontWeight: 'bold' }}
                subtitle={item.thing_status}
                bottomDivider
            />
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <MyHeader title="Received Things" navigation={this.props.navigation}/>
                <View style={{flex: 1}}>
                    {this.state.receivedThingsList.length === 0 ? (
                        <View style={styles.subContainer}>
                            <Text style={{fontSize: 20}}>List of all received things</Text>
                        </View>
                    ) : (
                        <FlatList 
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderItem}
                            data={this.state.receivedThingsList}
                        />
                    )}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    subContainer: {
        flex: 1,
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
});