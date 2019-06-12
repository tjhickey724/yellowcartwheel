'use strict';
const Comment = require( '../models/Comment' );

exports.saveComment = ( req, res ) => {
  //console.log("in saveSkill!")
  //console.dir(req)
  let newComment = new Comment(
   {
    url: req.body.url,
    comment: req.body.comment
   }
  )

  //console.log("skill = "+newSkill)

  newComment.save()
    .then( () => {
      res.redirect( '/showComments' );
    } )
    .catch( error => {
      res.send( error );
    } );
};



// this displays all of the skills
exports.getAllComments = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  Comment.find()
    .exec()
    .then( ( comments ) => {
      res.render( 'comments', {
        comments:comments, title:"Comments"
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
