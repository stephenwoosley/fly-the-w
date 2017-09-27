// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create Fact schema
var FactSchema = new Schema({
  // title is a required string
  question: {
    type: String,
    required: true
  },
  // link is a required string
  answer: {
    type: String,
    required: true
  }
});

// Create the Fact model with the FactSchema
var Fact = mongoose.model("Fact", FactSchema);

// Export the model
module.exports = Fact;