const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Error connecting to database:', err));

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: false // Make it completely optional
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  fullname: String,
  issuedBooks: [{
    bookID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Library'
    },
    issueDate: Date,
    returnDate: Date,
    hasRead: {
      type: Boolean,
      default: false
    }
  }],
  cover: String,
  pdf: String,
  bookID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library'
  },
  picture: String,
  numberOfIssuedBooks: Number,
  signedIn: Boolean,
  isAdmin: {
    type: Boolean,
    default: false
  },
  readingProgress: {
    type: Map,
    of: Number,
    default: {}
  }
}, {
  timestamps: true
});

// Only validate password during user registration/update
userSchema.pre('save', function(next) {
  // Skip validation if this is not a new user or password is not being modified
  if (!this.isNew && !this.isModified('password')) {
    return next();
  }

  // Only check password for new non-Google users
  if (this.isNew && !this.googleId && !this.password) {
    const err = new Error('Password is required for new non-Google users');
    err.name = 'ValidationError';
    return next(err);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
