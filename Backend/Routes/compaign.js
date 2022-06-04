const express = require('express')
const Compaign = require('../models/compaign')
const router = new express.Router()
const multer = require('multer')
const checkAuth = require('../middlewares/check-auth')

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req, file)
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

router.post(
  '',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    console.log(req.body)
    const url = req.protocol + '://' + req.get('host')
    console.log(url)
    const compaign = new Compaign({
      title: req.body.title,
      planDetails: req.body.planDetails,
      fundingType: req.body.fundingType,
      pitchMaterial: req.body.pitchMaterial,
      targetPrice: req.body.targetPrice,
      status: req.body.status,
      videoPath: req.body.videoPath,
      imagePath: url + '/images/' + req.file.filename,
      creator: req.userData.userId,
      postDate: req.body.postDate,
    })
    console.log(compaign)
    compaign
      .save()
      .then((compaign) => {
        if (compaign) {
          res.status(201).json({
            message: 'Compaign added successfully',
            compaign: {
              ...compaign,
              id: compaign._id,
            },
          })
        }

        if (!compaign) {
          res.status(404).json({
            message: 'Error Adding Compaign',
          })
        }
      })
      .catch((e) => {
        console.log(e)
        res.status(501).json({ message: 'Error Adding PCompaignS' + e })
      })
  }
)

router.put(
  '/:id',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath
    if (req.file) {
      const url = req.protocol + '://' + req.get('host')
      imagePath = url + '/images/' + req.file.filename
    }

    console.log('90', req.body)
    const compaign = new Compaign({
      _id: req.body.id,
      title: req.body.title,
      planDetails: req.body.planDetails,
      fundingType: req.body.fundingType,
      pitchMaterial: req.body.pitchMaterial,
      targetPrice: req.body.targetPrice,
      status: req.body.status,
      videoPath: req.body.videoPath,
      imagePath: imagePath,
      creator: req.userData.userId,
    })
    console.log('98---------------------', compaign)
    Compaign.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      compaign
    ).then((result) => {
      if (result) {
        res.status(200).json({ message: 'Update successful!' })
      } else {
        res.status(500).json({ message: 'Error Upating' })
      }
    })
  }
)

router.get('/mycompaign', checkAuth, (req, res, next) => {
  Compaign.find({ creator: req.userData.userId })
    .then((compaign) => {
      if (compaign) {
        res.status(200).json({
          message: 'Compaigns fetched successfully!',
          compaigns: compaign,
        })
      } else {
        res.status(404).json({ message: 'Compaign not found!' })
      }
    })
    .catch((e) => {
      console.log(e)
    })
})

router.get('', (req, res, next) => {
  Compaign.find().then((documents) => {
    if (documents) {
      res.status(200).json({
        message: 'Compaigns fetched successfully!',
        compaigns: documents,
      })
    } else {
      res.status(404).json({ message: 'Compaign not found!' })
    }
  })
})
router.get('/:id', (req, res, next) => {
  Compaign.findById(req.params.id).then((compaign) => {
    if (compaign) {
      res.status(200).json(compaign)
    } else {
      res.status(404).json({ message: 'Compaign not found!' })
    }
  })
})

router.delete('/:id', checkAuth, (req, res, next) => {
  Compaign.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      console.log(result)
      if (result.n > 0) {
        res.status(200).json({ message: 'Deletion successful!' })
      } else {
        return res.status(401).json({ message: 'Not authorized!!' })
      }
    }
  )
})

module.exports = router
