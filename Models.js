const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define your Mongoose models here

const District = mongoose.model('District', {
    state: String,
    districts: [String],
  }, 'state_district');

  const tripSchema = new Schema({
    date: Date,
    from: String,
    to: String,
    busOwnerID: Number,
    startTime: Date,
    endTime: Date,
    category: String,
    seatBooked: [String],
    bus_no: String,
    amenities_list: [String],
    busFare: Number,
    busName: String,
  }, { collection: 'trips' });
  
  const Trips = mongoose.model('Trips', tripSchema);

  const Buses = mongoose.model('bus_owner',{
    name:String,
    totalSeats:Number,
    totalWindowSeatsAvailable:Number,
    rating:Number,
    animeties:[String],
    seatBooked:[String]
  },'bus_owner')

  const userSchema = new mongoose.model('users', {
    username: String,
    mobile: String,
    email: String,
    gender:String,
    since:{ type: Date, default: Date.now },
    trips: [{ type: Object }], // Assuming trip IDs are stored as strings
    transactions: [String], // Assuming transaction IDs are stored as strings
  }, 'users');
  

  const FeedbackSchema = new mongoose.model('feedback', {
    username: String,
    rating: Number,
    description: String,
    customerSince: Number
  }, 'feedback');
  

module.exports = {
  District,
  Trips,
  Buses,
  userSchema,
  FeedbackSchema
};
