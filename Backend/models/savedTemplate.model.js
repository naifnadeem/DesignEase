import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  htmlContent: { 
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ""
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // This option automatically manages createdAt and updatedAt
});

// Pre-save middleware to update the 'updatedAt' field
templateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Template = mongoose.model('Template', templateSchema);

export default Template;