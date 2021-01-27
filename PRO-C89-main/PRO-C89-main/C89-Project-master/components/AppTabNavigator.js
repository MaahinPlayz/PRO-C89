import React from 'react';
import {Image} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {AppStackNavigator} from './AppStackNavigator';
import ExchangeThingsScreen from '../screens/ExchangeThingsScreen';

export const AppTabNavigator = createBottomTabNavigator({
    HomeScreen: {
        screen: AppStackNavigator,
        navigationOptions: {
            tabBarIcon: <Image source={require('../assets/Exchange.png')} style={{width: 20, height: 20}} />,
            tabBarLabel: 'Exchange Things'
        }
    },
    ExchangeThings: {
        screen: ExchangeThingsScreen,
        navigationOptions: {
            tabBarIcon: <Image source={require('../assets/HomeScreen.png')} style={{width: 20, height: 20}} />,
            tabBarLabel: 'Home Screen'
        }
    }
});