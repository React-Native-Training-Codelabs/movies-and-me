import { createStore } from 'redux'
import toggleFavorite from './reducers/FavoriteReducer'

export default createStore(toggleFavorite)
