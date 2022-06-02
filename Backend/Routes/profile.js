const express = require('express')

const multer = require('multer')
const checkAuth = require('../middlewares/check-auth')
const Profile = require('../models/profile')
const Compaign = require('../models/compaign')

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]

    let error = new Error('Invalid mime type')
    if (isValid) {
      error = null
    }
    cb(error, 'images')
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-')

    console.log(name)
    const ext = MIME_TYPE_MAP[file.mimetype]
    cb(null, name + '-' + Date.now() + '.' + ext)
  },
})

const router = express.Router()

router.post(
  '/create',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    console.log(url)
    const profile = new Profile({
      companyName: req.body.companyName,
      contactNumber: req.body.contactNumber,
      address: req.body.address,
      registerNumber: req.body.registerNumber,
      businessType: req.body.businessType,
      companyDescription: req.body.companyDescription,
      imagePath: url + '/images/' + req.file.filename,
      creator: req.userData.userId,
    })

    Profile.findOne({ creator: req.userData.userId })
      .then((user1) => {
        if (user1) {
          return res.status(401).json({
            message: 'Profile Already Exist',
          })
        }
        return profile.save()
      })
      .then((prof) => {
        if (!prof) {
          return res.status(500).json({
            message: 'Error Creating Profile',
          })
        }
        res.status(201).json({
          message: 'Profile created!',
          profile: prof,
        })
      })
      .catch((e) => {
        console.log('error is', e)
      })
  }
)

router.put(
  '/edit/:id',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath
    const url = req.protocol + '://' + req.get('host')
    if (req.file) {
      const url = req.protocol + '://' + req.get('host')
      imagePath = url + '/images/' + req.file.filename
    }

    const profile = new Profile({
      _id: req.body.id,
      companyName: req.body.companyName,
      contactNumber: req.body.contactNumber,
      address: req.body.address,
      registerNumber: req.body.registerNumber,
      businessType: req.body.businessType,
      companyDescription: req.body.companyDescription,
      imagePath: imagePath,
      creator: req.userData.userId,
    })

    Profile.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      profile
    )
      .then((result) => {
        if (result) {
          res.status(200).json({ message: 'Update successful!' })
        } else {
          res.status(500).json({ message: 'Error Upating Profile' })
        }
      })
      .catch((e) => {
        res
          .status(500)
          .json({ message: 'Error Upating Profile ,company name taken' })
        console.log(e)
      })
  }
)

router.get('/profiles', (req, res, next) => {
  Profile.find()
    .then((prof) => {
      if (prof) {
        res.status(200).json({
          message: 'Profile fetched successfully!',
          profile: prof,
        })
      } else {
        res.status(404).json({ message: 'Profile not found!' })
      }
    })
    .catch((e) => {
      console.log(e)
    })
})

router.get('/viewprofile', checkAuth, (req, res, next) => {
  Profile.findOne({ creator: req.userData.userId }).then((prof) => {
    if (prof) {
      res.status(200).json({
        message: 'Profile fetched successfully!',
        profile: prof,
      })
    } else {
      res.status(404).json({ message: 'Profile not found!' })
    }
  })
})

router.get('/bycreator/:id', (req, res, next) => {
  Profile.findOne({ creator: req.params.id }).then((prof) => {
    if (prof) {
      res.status(200).json({
        message: 'Profile fetched successfully!',
        profile: prof,
      })
    } else {
      res.status(404).json({ message: 'Profile not found!' })
    }
  })
})
router.get('/:id/mycompaign', (req, res, next) => {
  let user
  let creatorId
  Profile.findOne({ companyName: req.params.id })
    .then((prof) => {
      if (prof) {
        user = prof
        return Compaign.find({ creator: user.creator })
      }
    })
    .then((compaign) => {
      res.status(200).json({
        message: 'Post fetched successfully!',
        compaign: compaign,
      })
    })
    .catch((e) => {
      console.log(e)
      res.status(404).json({ message: 'error Fetching Post!' })
    })
})

router.get('/:id', (req, res, next) => {
  let creatorId
  Profile.findOne({ companyName: req.params.id }).then((prof) => {
    if (prof) {
      res.status(200).json({
        message: 'Profile fetched successfully!',
        profile: prof,
      })
    } else {
      res.status(404).json({ message: 'Profile not found!' })
    }
  })
})

module.exports = router
