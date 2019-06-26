'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

var movieRatingSchema = Schema( {
  movieName: String,
  rating: Number,
  createdAt: Date,
  review: String
} );

module.exports = mongoose.model( 'MovieRating', movieRatingSchema );
