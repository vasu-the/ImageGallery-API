const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const Gallery = require("../models/gallery");


// const addFiles = async (req, res) => {
//   const imageUrl = req.body.imageUrl;
//   const videoUrl = req.body.videoUrl;
//   const newPost = new Gallery({ imageUrl, videoUrl });
//   try {
//     try {
//       const newGallery = await newPost.save();
//       res
//         .status(201)
//         .json({ data: newGallery, msg: "Create  Gallery Successfully" });
//     } catch (err) {
//       return res.status(400).json({ message: err.message });
//     }
//   } catch (error) {
//     console.error("Error creating post:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
const addFiles = (req, res, next) => {
  const form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    // Check if any files are uploaded
    if (!files || !files.uploadFile || files.uploadFile.length === 0) {
      return res.status(400).send('No files uploaded');
    }
    const uploadedType = fields.uploadedType;
    console.log(uploadedType)
   
    // Access the first uploaded file
    const oldPath = files.uploadFile[0].filepath; // Correct property name is 'path'
    // Ensure oldPath is a valid string
    if (typeof oldPath !== 'string') {
      return res.status(500).send('Invalid file path == is not string');
    }

    // Construct the new path using path.join
    let newPath = path.join(__dirname, 'uploads', files.uploadFile[0].originalFilename);

    // Ensure the 'uploads' directory exists
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    try {
      let rawData = fs.readFileSync(oldPath);

    const a =  fs.writeFile(newPath, rawData, function (err) {
        if (err) {
          console.log(err);
          return res.status(500).send('Error uploading file');
        }
        if(uploadedType == 'Image'){
          try{
            //data is Image
            const galleryItem = new Gallery({
              imageUrl: newPath,
           });

           galleryItem.save();
        return res.status(200).json({data:galleryItem,message:'Image uploaded successfully'});
          }catch(err){
            return res.status(400).json({message:'erorr in uploading image'});
          }
        }

        if(uploadedType == 'Video'){
          try{
            //data is Video
            const galleryItem = new Gallery({
              videoUrl: newPath,
           });
 
            galleryItem.save();
            return res.status(200).json({data:galleryItem,message:'video uploaded successfully'});
          }catch(err){
            return res.status(400).json({message:'erorr in uploading video'});
          }
        }
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('Error reading file');
    }
  });
};
const getAllImagesAndVideos = async (req, res) => {
  try {
    const getImage = await Gallery.find({ imageUrl: { $exists: true } });

    const getVideos = await Gallery.find({ videoUrl: { $exists: true } });
    return res.status(200).json({ data: {getImage,getVideos} });
  } catch (err) {
    return res.status(500).json({ message: "error in getAllImages " });
  }
};

// const getAllVideos = async (req, res) => {
//   try {
//     const getVideos = await Gallery.find({ videoUrl: { $exists: true } });
//     return res.status(200).json({ data: getVideos });
//   } catch (err) {
//     return res.status(500).json({ message: "error in getAllVideos " });
//   }
// };

//delete  select file images or videos
const deleteSelectedFile = async(req,res)=>{
  try {
    const selectedFileIds = req.body.selectedFileIds;
 
    if (!Array.isArray(selectedFileIds)) {
      return res.status(400).json({ message:'Invalid selectedEventIds format'});
    }
 
    const deletedFiles = await Gallery.deleteMany({ _id: { $in: selectedFileIds } });
 
   return res.status(200).json({ message: 'Deleted sucessfully', data: deletedFiles });
  } catch (err) {
    console.log(err.message)
  return res.status(500).json({ message: err.message });
  }
}
module.exports = { addFiles, getAllImagesAndVideos,deleteSelectedFile };
