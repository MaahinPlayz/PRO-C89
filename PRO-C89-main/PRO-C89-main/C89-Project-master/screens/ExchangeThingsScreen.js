import React from 'react';
import {StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert, View, Text} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import { Input } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize'; 

export default class ExchangeThingsScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            userId : firebase.auth().currentUser.email,
            thingName:"",
            reasonToRequest:"",
            requestId: "",
            requestedThingName: "",
            thingStatus: "",
            docId: "",
            userDocId: "",
            IsRequestedItemRequestActive: "",
            countryCurrencyCode: "",
            value: ""
        }
    }

    addRequest = (thingName, reasonToRequest) => {
        var userId = this.state.userId;
        var randomRequestId = this.createUniqueId();

        db.collection('requested_things').add({
            'user_id': userId,
            'thing_name': thingName,
            'reason_to_request': reasonToRequest,
            'request_id': randomRequestId,
            'thing_status': 'requested'
        });

        this.getThingRequest();

        db.collection('users').where('email_id', '==', this.state.userId).get().then().then((snapshot) => {
            snapshot.forEach((doc) => {
                db.collection('users').doc(doc.id).update({
                    IsRequestedItemRequestActive: true
                });
            });
        });

        this.setState({
            reasonToRequest: '',
            thingName: ''
        });

        return Alert.alert('Thing requested successfully');
    }

    createUniqueId() {
        var rand = Math.random().toString(36);

        return rand.substring(7);    
    }

    getIsRequestedItemRequestActive = () => {
        db.collection('users').where('email_id', '==', this.state.userId).onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
                this.setState({
                    IsRequestedItemRequestActive: doc.data().IsRequestedItemRequestActive,
                    userDocId: doc.id
                });
            });
        });
    }

    getThingRequest = () => {
        var thingRequest = db.collection('requested_things').where('user_id', '==', this.state.userId).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                if (doc.data().thing_status !== 'received') {
                    this.setState({
                        requestId: doc.data().request_id,
                        requestedThingName: doc.data().thing_name,
                        thingStatus: doc.data().thing_status,
                        docId: doc.id
                    });
                    
                    console.log(doc.data());
                } 
            });
        });
    }

    sendNotification = () => {
        db.collection('users').where('email_id', '==', this.state.userId).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                var name = doc.data().first_name;
                var lastName = doc.data().last_name;
      
                db.collection('all_notifications').where('request_id', '==', this.state.requestId).get().then((snapshot) => {
                    snapshot.forEach((doc) => {
                        var donorId = doc.data().donor_id;
                        var thingName = doc.data().thing_name;
            
                        db.collection('all_notifications').add({
                            "targeted_user_id": donorId,
                            "message": name + " " + lastName + " " + "received the requested item" + " " + thingName,
                            "notification_status": "unread",
                            "thing_name": thingName 
                        });
                    });
                });
            });
        });
    }

    updateThingRequestStatus = () => {
        db.collection('requested_things').doc(this.state.docId).update({
          "thing_status": "received"
        });
    
        db.collection('users').where("email_id", "==", this.state.userId).get().then((snapshot) => {
          snapshot.forEach((doc) => {
            db.collection('users').doc(doc.id).update({
              "IsRequestedItemRequestActive": false
            });
          });
        });
      }
    
    receivedThings = (thingName) => {
        var userId = this.state.userId;
        var requestId = this.state.requestId;

        db.collection('received_things').add({
            "user_id": userId,
            "thing_name": thingName,
            "request_id": requestId,
            "thing_status": "received"
        });
    }

    getData = () => {
        db.collection("users").where("email_id", "==", this.state.userId).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                this.setState({
                    countryCurrencyCode: doc.data().country_currency_code
                });
            });
        });

        const data =  fetch("http://data.fixer.io/api/latest?access_key=d9f90a6f7fbc2b543415ef8a2a82ef23&format=1")
        .then((response) => {
            return response.json();
        }).then((responseData) => {
            var countryCurrencyCode = this.state.countryCurrencyCode;
            var currency = responseData.rates;
            var value = currency[countryCurrencyCode];

            console.log(currency);

            this.setState({
                value: value
            });
        });
    }
    
    componentDidMount() {
        this.getThingRequest();
        this.getIsRequestedItemRequestActive();
        this.getData();
    }
    
    render() {
        if (this.state.IsRequestedItemRequestActive === true) {
            return (
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <View style={{borderColor: 'orange', borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 10, margin: 10}}>
                        <Text style={{fontSize: RFValue(25), fontWeight: 'bold', textDecorationLine: 'underline', textAlign: 'center'}}>Requested Thing Name</Text>
                        <Text style={{fontSize: RFValue(30), textAlign: 'center', fontWeight: '500', padding: RFValue(10)}}>{this.state.requestedThingName}</Text>
                    </View>

                    <View style={{borderColor: 'orange', borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 10, margin: 10}}>
                        <Text style={{fontSize: RFValue(25), fontWeight: 'bold', textDecorationLine: 'underline', textAlign: 'center'}}>Requested item status</Text>
                        <Text style={{fontSize: RFValue(30), textAlign: 'center', fontWeight: '500', padding: RFValue(10)}}>{this.state.thingStatus}</Text>
                    </View>

                    <TouchableOpacity 
                        style={{borderWidth: 1, borderColor: '#000', backgroundColor: '#ff9800', width: 300, alignItems: 'center', alignSelf: 'center', height: 30, marginTop: 30}}
                        onPress={() => {
                            this.sendNotification();
                            this.updateThingRequestStatus();
                            this.receivedThings(this.state.requestedThingName);
                        }}
                    >
                        <Text>I received the requested item</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={{flex: 1}}>
                    <MyHeader navigation={this.props.navigation} title="Request Things" />
    
                    <KeyboardAvoidingView style={styles.keyBoardStyle} behavior="padding" enabled>
                        <Input 
                            placeholder="Enter thing name" 
                            label={"Enter thing name"}
                            containerStyle={{marginTop: RFValue(60)}}
                            style={styles.formTextInput}
                            multiline
                            onChangeText={e => {this.setState({thingName: e})}}
                            value={this.state.thingName}
                        />
    
                        <Input 
                            placeholder="Enter Reason to Request" 
                            label={"Enter Reason to Request"}
                            containerStyle={{marginTop: RFValue(60)}}
                            style={styles.formTextInput}
                            multiline numberOfLines={8}
                            onChangeText={e => {this.setState({reasonToRequest: e})}}
                            value={this.state.reasonToRequest}
                        />
    
                        <TouchableOpacity 
                            style={styles.button} 
                            onPress={() => {
                                this.addRequest(this.state.thingName, this.state.reasonToRequest)
                            }}
                        >
                            <Text>Request Thing</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    formTextInput: {
        width: '75%',
        height: 35,
        alignSelf: 'center',
        borderColor: '#ffab91',
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 20,
        padding: 20
    },
    button: {
        width: '75%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#ff5722',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop: 20
    },
    keyBoardStyle : {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
});