import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator';
import CustomSidebarMenu from './CustomSidebarMenu';
import SettingScreen from '../screens/SettingsScreen';
import MyBartersScreen from '../screens/MyBartersScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import MyReceivedThingsScreen from '../screens/MyReceivedThingsScreen';
import { Icon } from 'react-native-elements'; 

export const AppDrawerNavigator =  createDrawerNavigator({
    Home: {
        screen: AppTabNavigator,
        navigationOptions: {
            drawerIcon: <Icon name="home" type="fontawesome5"/>
        }
    },
    MyBarters: {
        screen: MyBartersScreen,
        navigationOptions: {
            drawerIcon: <Icon name="exchange" type="font-awesome"/>,
            drawerLabel: "My Barters"
        }
    },
    Notifications: {
        screen: NotificationsScreen,
        navigationOptions: {
            drawerIcon: <Icon name="bell" type="font-awesome"/>,
            drawerLabel: "Notifications"
        }
    },
    Setting: {
        screen: SettingScreen,
        navigationOptions: {
            drawerIcon: <Icon name="settings" type="fontawesome5"/>,
            drawerLabel: "Settings"
        }
    },
    MyReceivedThings: {
        screen: MyReceivedThingsScreen,
        navigationOptions: {
            drawerIcon: <Icon name="gift" type="font-awesome"/>,
            drawerLabel: "My Received Books"
        }
    }
},{contentComponent: CustomSidebarMenu},{initialRouteName: 'Home'});