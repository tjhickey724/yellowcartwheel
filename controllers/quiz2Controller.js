'use strict';
const MovieRating = require( '../models/MovieRating' );



// this displays all of the skills
exports.getAllMovieRatings = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  MovieRating.find()
    .exec()
    .then( ( ratings ) => {
      res.render( 'quiz2', {
        title:"Quiz2",ratings:ratings
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};
