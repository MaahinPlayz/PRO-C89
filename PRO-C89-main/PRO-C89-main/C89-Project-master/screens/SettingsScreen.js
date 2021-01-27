import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';

export default class SettingScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            address: '',
            contact: '',
            firstName: '',
            lastName: '',
            emailId: '',
            docId: ''
        }
    }

    getUserDetails = () => {
        var email = firebase.auth().currentUser.email;
        db.collection('users').where('email_id','==', email).get().then((snapshot) => {
            snapshot.forEach(doc => {
                var data = doc.data();
                this.setState({
                    emailId: data.email_id,
                    address: data.address,
                    contact: data.contact,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    docId: doc.id
                })
            });
        });
    }

    componentDidMount() {
        this.getUserDetails();
    }

    updateUserDetails = () => {
        db.collection('users').doc(this.state.docId).update({
            "address": this.state.address,
            "contact": this.state.contact,
            "first_name": this.state.firstName,
            "last_name": this.state.lastName
        });

        return Alert.alert('Profile updated successfully');
    }

    render() {
        return (
            <View style={styles.container}>
                <MyHeader title="Settings" navigation={this.props.navigation}/>

                <View style={styles.formContainer}>
                        <Input 
                            style={styles.formTextInput}
                            placeholder={"First Name"}
                            label={"First Name"}
                            maxLength={8}
                            containerStyle={{marginBottom: RFValue(25), marginTop: RFValue(30)}}
                            onChangeText={e => {this.setState({firstName: e})}}
                            value={this.state.firstName}
                        />

                        <Input 
                            style={styles.formTextInput}
                            placeholder={"Last Name"}
                            label={"Last Name"}
                            maxLength={8}
                            containerStyle={{marginBottom: RFValue(25)}}
                            onChangeText={e => {this.setState({lastName: e})}}
                            value={this.state.lastName}
                        />

                        <Input 
                            style={styles.formTextInput}
                            placeholder={"Address"}
                            label={"Address"}
                            multiline={true}
                            containerStyle={{marginBottom: RFValue(25)}}
                            onChangeText={e => {this.setState({address: e})}}
                            value={this.state.address}
                        />

                        <Input 
                            style={styles.formTextInput}
                            placeholder={"Contact Number"}
                            label={"Contact Number"}
                            maxLength={10}
                            containerStyle={{marginBottom: RFValue(25)}}
                            keyboardType={"numeric"}
                            onChangeText={e => {this.setState({contact: e})}}
                            value={this.state.contact}
                        />

                        <TouchableOpacity 
                            style={styles.button}
                            onPress={() => {this.updateUserDetails()}}
                        >
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        width: 300,
        height: 40,
        borderBottomWidth: 1.5,
        borderColor: 'black',
        fontSize: 20,
        padding: 10,
        margin: 10
    },
    button: {
        width: 300,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: '#ff9800',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.3,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop: 60
    },
    buttonText: {
        color: '#ffff',
        fontWeight: '200',
        fontSize: 20
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    formTextInput: {
        width: '75%',
        height: 35,
        alignSelf: 'center',
        borderColor: '#000',
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 20,
        padding: 10
    },
    formContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center'
    }
});