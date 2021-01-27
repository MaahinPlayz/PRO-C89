import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
import db from '../config';

export default class ReceiverDetailsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: firebase.auth().currentUser.email,
            receiverId: this.props.navigation.getParam('details')['user_id'],
            requestId: this.props.navigation.getParam('details')['request_id'],
            thingName: this.props.navigation.getParam('details')['thing_name'],
            reasonForRequesting: this.props.navigation.getParam('details')['reason_to_request'],
            requestId: this.props.navigation.getParam('details')['request_id'],
            receiverName: '',
            receiverContact: '',
            receiverAddress: '',
            receiverRequestDocId: '',
            username: ''
        }
    }

    getReceiverDetails = () => {
        db.collection('users').where('email_id', '==', this.state.receiverId).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                this.setState({
                    receiverName: doc.data().first_name,
                    receiverContact: doc.data().contact,
                    receiverAddress: doc.data().address
                });
            });
        });

        db.collection('requested_things').where('request_id', '==', this.state.requestId).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                this.setState({
                    receiverRequestDocId: doc.id
                });
            });
        });
    }

    getUserDetails = () => {
        db.collection("users").where('email_id','==', this.state.userId).get().then((snapshot)=>{
            snapshot.forEach((doc) => {
                this.setState({
                    username: doc.data().first_name + " " + doc.data().last_name
                });
            });
        });
    }

    updateThingStatus = () => {
        db.collection('all_barters').add({
            thing_name: this.state.thingName,
            request_id: this.state.requestId,
            requested_by: this.state.receiverName,
            donor_id: this.state.userId,
            request_status: 'Donor Interested'
        });
    }

    addNotification = () => {
        var message = this.state.username + 'has shown interest in donating your requested item';
        db.collection('all_notifications').add({
            'targeted_user_id': this.state.receiverId,
            'donor_id': this.state.userId,
            'request_id': this.state.requestId,
            'thing_name': this.state.thingName,
            'date': firebase.firestore.FieldValue.serverTimestamp(),
            'notification_status': 'unread',
            'message': message
        });
    }

    componentDidMount(){
        this.getReceiverDetails();
    }

    render() {
        return (
            <ScrollView style={{marginHorizontal: 20}}>
                <View style={styles.container}>
                    <View>
                        <Card title={`Requested Thing's information`} titleStyle={{fontSize: RFValue(30)}}>
                            <Card>
                                <Text style={{fontWeight: 'bold', fontSize: RFValue(25)}}>
                                    Name: {this.state.thingName}
                                </Text>
                            </Card>

                            <Card>
                                <Text style={{fontWeight: 'bold', fontSize: RFValue(25)}}>
                                    Reason to request: {this.state.reasonForRequesting}
                                </Text>
                            </Card>
                        </Card>
                    </View>

                    <View>
                        <Card title = {'Receiver Information'} titleStyle = {{fontSize: RFValue(30)}}> 
                            <Card>
                                <Text style={{fontWeight: 'bold', fontSize: RFValue(25)}}>
                                    Name: {this.state.receiverName}
                                </Text>
                            </Card>

                            <Card>
                                <Text style={{fontWeight: 'bold', fontSize: RFValue(25)}}>
                                    Contact: {this.state.receiverContact}
                                </Text>
                            </Card>

                            <Card>
                                <Text style={{fontWeight: 'bold', fontSize: RFValue(25)}}>
                                    Address: {this.state.receiverAddress}
                                </Text>
                            </Card>
                        </Card>
                    </View>

                    <View style={styles.buttonContainer}>
                        {this.state.receiverId !== this.state.userId ? (
                            <TouchableOpacity 
                                style={styles.button}
                                onPress={() => {
                                    this.updateThingStatus();
                                    this.addNotification();
                                    this.props.navigation.navigate('MyBarters');
                                }}
                            >
                                <Text style={{fontSize: RFValue(20)}}>I want to exchange</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
    },
    buttonContainer : {
      flex:0.3,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:200,
      height:50,
      justifyContent:'center',
      alignItems : 'center',
      borderRadius: 10,
      backgroundColor: 'orange',
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       },
      elevation : 16,
      marginTop: 55
    }
});