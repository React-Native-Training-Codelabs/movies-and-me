import React from 'react'
import { View, Text, StyleSheet,
  ActivityIndicator, ScrollView,
  Image, TouchableOpacity, Share,
  Platform } from 'react-native'
import { getFilmDetailFromApi,
  getImageFromApi } from '../api/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'
import { EnlargeShrink } from '../animations/EnlargeShrink'

class FilmDetail extends React.Component {

  static navigationOptions = ({navigation}) => {
    const { params } = navigation.state
    // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
      if (params.film != undefined && Platform.OS === 'ios') {
        return {
            // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
            headerRight: <TouchableOpacity
                            style={styles.share_touchable_headerrightbutton}
                            onPress={() => params.shareFilm()}>
                            <Image
                              style={styles.share_image}
                              source={require('../Images/ic_share.png')} />
                          </TouchableOpacity>
        }
      }
  }

  constructor(props) {
    super(props)
    this.state = {
      film: undefined,
      isLoading: true
    }
  }

  componentDidMount() {
    const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
    if (favoriteFilmIndex !== -1) { // Film déjà dans nos favoris, on a déjà son détail
      // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
      this.setState({
        film: this.props.favoritesFilm[favoriteFilmIndex]
      }, () => { this._updateNavigationParams() })
      return
    }
    // Le film n'est pas dans nos favoris, on n'a pas son détail
    // On appelle l'API pour récupérer son détail
    this.setState({ isLoading: true })
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
      this.setState({
        film: data,
        isLoading: false
      }, () => { this._updateNavigationParams() })
    })
  }

  _toggleFavorite() {
    const action = {type: "TOGGLE_FAVORITE", value: this.state.film}
    this.props.dispatch(action)
  }

  componentDidUpdate() {
    console.log(this.props.favoritesFilm);
  }

  _displayFavoriteImage() {
    var sourceImage = require('../images/ic_favorite_border.png')
    var shouldEnlarge = false
    if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
      sourceImage = require('../images/ic_favorite.png')
      shouldEnlarge = true
    }
    return(
      <EnlargeShrink shouldEnlarge={shouldEnlarge}
        <Image
        source={sourceImage}
        style={styles.favorite_image}/>
      </EnlargeShrink>
    )
  }

  _displayFilm() {
    const {film} = this.state
    if (film != undefined) {
      return(
        <ScrollView style={styles.scrollview_container}>
          <Image style={styles.image} source={{ uri: getImageFromApi(film.backdrop_path) }} />
          <Text style={styles.title_text}>{film.title}</Text>
          <TouchableOpacity
            style={styles.favorite_container}
            onPress={() => this._toggleFavorite()}>{this._displayFavoriteImage()}</TouchableOpacity>
          <Text style={styles.content_text}>{film.overview} </Text>
          <Text style={styles.default_text}>Sorti le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
          <Text style={styles.default_text}>Note : {film.vote_average}/10</Text>
          <Text style={styles.default_text}>Nombre de votes : {film.vote_count}</Text>
          <Text style={styles.default_text}>Budget : {numeral(film.budget).format('0,0[.]00$')}</Text>
          <Text style={styles.default_text}>Genre(s) : {film.genres.map(function(genre){
            return genre.name
          }).join(" / ")}</Text>
          <Text style={styles.default_text}>Compagnie(s) : {film.production_companies.map(function(company){
            return company.name
          }).join(" / ")}</Text>
        </ScrollView>
      )
    }
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' color='#757575' />
        </View>
      )
    }
  }

  _shareFilm() {
    const { film } = this.state
    Share.share({ title: film.title, message: film.overview })
  }

  _displayFloatingActionButton() {
    const { film } = this.state
    if (film != undefined && Platform.os === "android") {
      return (
        <TouchableOpacity
          style={styles.share_touchable_floating_action_button}
          onPress={() => this._shareFilm()}>
          <Image
            style={styles.share_image}
            source={require('../images/ic_share_android.png')}
            />
        </TouchableOpacity>
      )
    } else {

    }
  }

_updateNavigationParams() {
  this.props.navigation.setParams({
    shareFilm: this._shareFilm,
    film: this.state.film
  })
}

  render() {
    const idFilm = this.props.navigation.state.params.idFilm
    return(
      <View style={styles.main_container}>
        {this._displayFilm()}
        {this._displayLoading()}
        {this._displayFloatingActionButton()}
      </View>
    )
  }
}

const styles = StyleSheet.create ({
  main_container: {
    flex: 1,
    marginBottom: 10
  },
  image: {
    width: 400,
    height: 200,
    margin: 5
  },
  title_text: {
    fontSize: 35,
    fontWeight: 'bold',
    color: "black",
    textAlign: "center",
    flexWrap: 'wrap',
    flex: 1,
    paddingRight: 5,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5
  },
  content_text: {
    fontStyle: 'italic',
    color: '#666666',
    margin: 5,
    marginBottom: 15
  },
  default_text: {
    marginTop: 5,
    marginRight: 5,
    marginLeft: 5
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollview_container: {
    flex: 1
  },
  favorite_container: {
    alignItems: 'center'
  },
  favorite_image: {
    flex: 1,
    width: null,
    height: null
  },
  share_touchable_floating_action_button: {
    position: 'absolute',
    width: 60,
    height: 60,
    right: 30,
    bottom: 30,
    borderRadius: 30,
    backgroundColor: "#e91e63",
    justifyContent: 'center',
    alignItems: 'center'
  },
  share_image: {
    width: 30,
    height: 30
  }
})

const mapStateToProps = (state) => {
  return state
}
export default connect(mapStateToProps)(FilmDetail)
