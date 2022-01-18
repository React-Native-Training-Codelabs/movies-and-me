import React from 'react'
import {View, StyleSheet, Text, Image, TouchableOpacity, Animated, Dimensions} from 'react-native'
import { getImageFromApi } from '../api/TMDBApi'
import FadeIn from '../animations/FadeIn'

class FilmItem extends React.Component {

  render() {
    const { film, displayDetailForFilm } = this.props

    return (
      <FadeIn>
        <TouchableOpacity
          onPress={() => displayDetailForFilm(film.id)}
          style={styles.main_container}>
          <Image style={styles.image} source={{ uri: getImageFromApi(film.poster_path) }} />
          <View style={styles.right_container}>
            <View style={styles.header_container}>
              <Text style={styles.title_text}>{film.title}</Text>
              <Text style={styles.rate_text}>{film.vote_average}</Text>
            </View>
            <View styles={styles.content_container}>
              <Text style={styles.content_text} numberOfLines={6}>{film.overview}</Text>
            </View>
            <View styles={styles.footer_container}>
              <Text style={styles.release_date_text}>Sorti le {film.release_date}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </FadeIn>
    )
  }
}

// Component StyleSheet
const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: 180,
    backgroundColor: 'gray',
    margin: 5
  },
  right_container: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  header_container: {
    flex: 3,
    flexDirection: 'row',
    margin: 5
  },
  title_text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "black",
    textAlign: "left",
    flexWrap: 'wrap',
    flex: 1,
    paddingRight: 5
  },
  rate_text: {
    fontSize: 26,
    fontWeight: 'bold',
    color: "gray"
  },
  content_container: {
    flex: 7,
  },
  content_text: {
    fontStyle: 'italic',
    color: '#666666',
    marginTop: 5,
    paddingRight: 5
  },
  footer_container: {
    flex: 1
  },
  release_date_text: {
    textAlign: "right",
    fontSize: 15,
    color: "black",
    marginRight: 5,
    marginTop: 10
  },
  favorite_image: {
    width: 40,
    height: 40,
    marginRight: 5
  }
})

// Export component for others components
export default FilmItem
