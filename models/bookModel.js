ratings: [{
  userId: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}],
rating: {
  type: Number,
  default: 0
},  