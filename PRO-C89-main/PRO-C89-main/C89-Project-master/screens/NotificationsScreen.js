import React from 'react';
import {Text, View, FlatList} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import {ListItem} from 'react-native-elements';
import SwipeableFlatlist from '../components/SwipeableFlatlist';

export default class NotificationsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allNotifications: [],
            userId: firebase.auth().currentUser.email
        }

        this.notificationRef = null;
    }

    getNotifications = () => {
        this.requestRef = db.collection('all_notifications').where('notification_status', '==', 'unread').where('targeted_user_id', '==', this.state.userId)
        .onSnapshot((snapshot) => {
            var allNotifications = [];
            snapshot.docs.map((doc) => {
                var notification = doc.data();
                notification['doc_id'] = doc.id;
                allNotifications.push(notification);
            });
            this.setState({
                allNotifications: allNotifications
            });

            console.log(this.state.allNotifications.length);
        });
    }

    componentDidMount() {
        this.getNotifications();
    }

    componentWillUnmount() {
        this.notificationRef;
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({item,index}) =>{
        return (
            <ListItem
                key={index}
                title={item.thing_name}
                titleStyle={{ color: 'black', fontWeight: 'bold' }}
                subtitle={item.message}
                bottomDivider
            />
        )
    }

    render() {
        return (
        <View style={{flex: 1}}>
            <View style={{flex:0.1}}>
                <MyHeader title={"Notifications"} navigation={this.props.navigation}/>
            </View>

            <View style={{flex:0.9}}>
                {
                    this.state.allNotifications.length !== 0 ? (
                        <SwipeableFlatlist allNotifications={this.state.allNotifications}/>
                    ) : (
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize:25}}>You have no notifications</Text>
                        </View>
                    )
                }
            </View>
        </View>
        );
    }
}
