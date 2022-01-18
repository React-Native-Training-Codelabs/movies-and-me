import React from 'react'
import {StyleSheet, View, TextInput, Button, FlatList, Text, ActivityIndicator} from 'react-native'
import FilmItem from './FilmItem'
import FilmList from './FilmList'
import { getFilmsFromApiWithSearchedText } from '../api/TMDBApi'

class Search extends React.Component {

  constructor(props) {
    super(props)
    this.page = 0
    this.totalPages = 0
    this.searchedText = ""
    this.state = {
      films: [],
      isLoading: false
    }
    this._loadFilms = this._loadFilms.bind(this)
  }

  _loadFilms() {
    this.setState({ isLoading: true })
    if (this.searchedText.length > 0) {
      getFilmsFromApiWithSearchedText(this.searchedText, this.page + 1).then(data => {
        this.page = data.page
        this.totalPages = data.total_pages
        this.setState({
          films: [...this.state.films, ...data.results],
          isLoading: false
        })
      })
    }
  }

  _searchTextInputChanged(text) {
    this.searchedText = text
  }

  _displayLoading() {
    if (this.state.isLoading) {
      console.log("display loading");
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' color='#757575'/>
        </View>
      )
    }
  }

  _searchFilms() {
    this.page = 0
    this.totalPages = 0
    this.setState({
      films: []
    }, () => {
      this._loadFilms()
    })
  }

  _displayDetailForFilm = (idFilm) => {
    this.props.navigation.navigate("FilmDetail", { idFilm: idFilm })
  }

  render() {
    return (
      <View style={styles.main_container}>
        <TextInput
          style={styles.textInput}
          onSubmitEditing={() => this._searchFilms()}
          onChangeText={(text) => this._searchTextInputChanged(text)}
          placeholder="Titre du film"
          />
        <Button
          title="Rechercher"
          onPress={() => this._searchFilms()}
          />
        <FilmList
          films={this.state.films}
          navigation={this.props.navigation}
          loadFilms={this._loadFilms}
          page={this.page}
          totalPages={this.totalPages}
          favoriteList={false}
          />
        {this._displayLoading()}
      </View>
    )
  }
}
// Search view's styles
const styles = StyleSheet.create ({
  main_container: {
    flex: 1,
    marginTop: 30
  },
  textInput: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    borderColor: '#000000',
    borderWidth: 1,
    padding: 5
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
// Export the component to use it in others components
export default Search
