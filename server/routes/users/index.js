const express = require('express');
const router = express.Router();
const passport = require('passport');

const UserModel = require('../../models/UserModel');
const middlewares = require('../middlewares');

const redirectIfLogin = (req, res, next) => {
  if (!req.user) {
    return next();
  }
  return res.redirect('/');
};

module.exports = (params) => {
  const { avatars } = params;

  router.get('/registration', redirectIfLogin, (req, res) =>
    res.render('users/registration', { success: req.query.success })
  );

  router.post(
    '/registration',
    middlewares.upload.single('avatar'),
    middlewares.handleAvatar(avatars),
    redirectIfLogin,
    async (req, res, next) => {
      try {
        const user = new UserModel({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        });

        if (req.file && req.file.storedFilename) {
          user.avatar = req.file.storedFilename;
        }

        const saveUser = await user.save();

        if (saveUser) {
          res.redirect('/users/registration?success=true');
        }

        return next(new Error('Failed to add a new user'));
      } catch (err) {
        if (req.file && req.file.storedFilename) {
          await avatars.delete(req.file.storedFilename);
        }

        return next(err);
      }
    }
  );

  router.get('/login', redirectIfLogin, (req, res) => {
    res.render('users/login', { error: req.query.error });
  });

  router.post(
    '/login',
    redirectIfLogin,
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/login?error=true',
    })
  );

  router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
  });

  router.get('/avatar/:filename', (req, res) => {
    res.type('png');
    return res.sendFile(avatars.filePath(req.params.filename));
  });

  router.get(
    '/account',
    (req, res, next) => {
      if (req.user) {
        return next();
      }
      return res.status(401).end();
    },
    (req, res) => res.render('users/account', { user: req.user })
  );

  return router;
};
