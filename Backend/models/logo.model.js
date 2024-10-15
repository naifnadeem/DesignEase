// models/logo.model.js
import mongoose from "mongoose";

const LogoSchema = new mongoose.Schema({
  name: String,
  image: String,
  elements: Array,
  layers: Array,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const Logo = mongoose.model('Logo', LogoSchema);

export default Logo;