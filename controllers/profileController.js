'use strict';
const User = require( '../models/User' );

exports.update = ( req, res ) => {

  User.findOne(res.locals.user._id)
  .exec()
  .then((p) => {
    console.log("just found a profile")
    console.dir(p)
    p.userName = req.body.userName
    p.profilePicURL = req.body.profilePicURL
    p.lastUpdate = new Date()
    p.save()
    .then(() => {
      res.redirect( '/profile' );
    })

  })
};
