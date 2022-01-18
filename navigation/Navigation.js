import React from 'react'
import {Image, StyleSheet} from 'react-native'
import { createStackNavigator } from 'react-navigation-stack'
// import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createAppContainer, createBottomTabNavigator } from 'react-navigation'
import Search from '../components/Search'
import FilmDetail from '../components/FilmDetail'
import Favorite from '../components/Favorite'

const SearchStackNavigator = createStackNavigator({
  Search: {
    screen: Search,
    navigationOptions: {
      title: "Rechercher"
    }
  },
  FilmDetail: {
    screen: FilmDetail,
  }
})

const FavoritesStackNavigator = createStackNavigator({
  Favorites: {
    screen: Favorites,
    navigationOptions: {
      title: 'Favoris'
    }
  },
  FilmDetail: {
    screen: FilmDetail
  }
})

const MoviesTabNavigator = createBottomTabNavigator({
  Search: {
    screen: SearchStackNavigator,
    navigationOptions: {
      tabBarIcon: () => {
        return <Image source={require('../images/ic_search.png')} style={styles.icon}/>
      }
    }
  },
  Favorite: {
    screen: FavoritesStackNavigator,
    navigationOptions: {
      tabBarIcon: () => {
        return <Image source={require('../images/ic_favorite.png')} style={styles.icon}/>
      }
    }
  }
}, {
  tabBarOptions: {
    showLabel: false,
    showIcon: true,
    activeBackgroundColor: "#DDDDDD",
    inactiveBackgroundColor: "#FFFFFF"
  }
})

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30
  }
})

export default createAppContainer(MoviesTabNavigator)
