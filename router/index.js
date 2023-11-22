const router = require('express').Router();
const galleryRouter = require('../controllers/galleryController');


router.post('/add-files',galleryRouter.addFiles);
router.get('/get-all-images-videos',galleryRouter.getAllImagesAndVideos);
router.delete('/select-delete',galleryRouter.deleteSelectedFile);
// router.get('/get-all-videos',galleryRouter.getAllVideos);


module.exports = router;