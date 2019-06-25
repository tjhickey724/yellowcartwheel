'use strict';
const ForumPost = require( '../models/ForumPost' );

exports.saveForumPost = ( req, res ) => {
  //console.log("in saveSkill!")
  //console.dir(req)
  if (!res.locals.loggedIn) {
    return res.send("You must be logged in to post to the forum.")
  }

  let newForumPost = new ForumPost(
   {
    userId: req.user._id,
    userName:req.user.googlename,
    post: req.body.post,
    createdAt: new Date()
   }
  )

  //console.log("skill = "+newSkill)

  newForumPost.save()
    .then( () => {
      res.redirect( 'forum' );
    } )
    .catch( error => {
      res.send( error );
    } );
};


// this displays all of the skills
exports.getAllForumPosts = ( req, res, next ) => {
  //gconsle.log('in getAllSkills')
  ForumPost.find({}).sort({createdAt: -1})
    .exec()
    .then( ( posts ) => {
      res.render('forum',{posts:posts,title:"Forum"})
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};

exports.deleteForumPost = (req, res) => {
  console.log("in deleteForumPost")
  let deleteId = req.body.delete
  if (typeof(deleteId)=='string') {
      // you are deleting just one thing ...
      ForumPost.deleteOne({_id:deleteId})
           .exec()
           .then(()=>{res.redirect('/forum')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(deleteId)=='object'){
      ForumPost.deleteMany({_id:{$in:deleteId}})
           .exec()
           .then(()=>{res.redirect('/forum')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(deleteId)=='undefined'){
      //console.log("This is if they didn't select a skill")
      res.redirect('/forum')
  } else {
    //console.log("This shouldn't happen!")
    res.send(`unknown deleteId: ${deleteId} Contact the Developer!!!`)
  }

};

/*
// this displays all of the skills
exports.getOneComment = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  const id = req.params.id
  console.log('the id is '+id)
  Comment.findOne({_id:id})
    .exec()
    .then( ( comment ) => {
      res.render( 'comment', {
        comment:comment, title:"Comment"
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
*/
