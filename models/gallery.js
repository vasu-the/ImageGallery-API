const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  //   imageUrl:  [
  //     {
  //     url: String,
  //     count:Number,
  //   }
  // ],
  imageUrl: {
    type: String,
    required: false,
  },
  videoUrl: {
    type: String,
    required: false,
  },
  // selected: {
  //   type: Boolean,
  //   required: false,
  // }
});

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
