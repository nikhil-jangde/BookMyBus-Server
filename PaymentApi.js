const express = require('express');
const router = express.Router();
const { District, Trips, Buses, userSchema } = require('./Models.js'); // Import your models
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.
const stripe = require('stripe')('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');

const tripSchema = new mongoose.Schema({
  busName: String,
  StartDate: Date,
  from: String,
  to: String,
  seatBooked: [String],
  busOwnerID: String,
  startTime: String,
  endTime: String,
  busFare: Number,
  passengers: [
    {
      name: String,
      age: String,
      gender: String,
      seatNo: String,
    },
  ],
});



router.post('/create-checkout-session', async (req, res) => {
    const { amount, currency, data } = req.body;

    function generateRandomTicketNumber(prefix, length) {
      const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
      const paddedNumber = randomNumber.toString().padStart(length, '0');
      return `${prefix}${paddedNumber}`;
    }
    
    const ticketNo = generateRandomTicketNumber('TKTBMB', 8);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: 'BookMyBus' }, // Customize this
            unit_amount: Math.round(1 * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/Tickets',
      cancel_url: 'http://localhost:3000/Passengers',
    });
        const user = await userSchema.findOne({ _id: data.userID });

        const currentDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const tripData = {
        TicketNo:ticketNo,
        busName: data.busName,
        duration:data.duration,
        StartDate: data.StartDate,
        EndDate:data.EndDate,
        from: data.from,
        to: data.to,
        rating:data.rating,
        seatBooked: data.seatBooked,
        busOwnerID: data.busOwnerID,
        startTime: data.startTime,
        endTime: data.endTime,
        busFare: data.busFare,
        passengers: data.passengers,
        bookingdate: currentDate,
        boarding:data.boarding,
        dropping:data.dropping
      };

      console.log(tripData);

      user.trips.push(tripData);
      await user.save();
    res.json({ sessionId: session.id });
  });

// router.post('/create-checkout-session', async (req, res) => {
//   const { amount, currency, data } = req.body;

//   try {
//     // The code to create a Stripe session and handle payment
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency,
//             product_data: { name: 'BookMyBus' }, // Customize this
//             unit_amount: Math.round(1 * 100), // Convert amount to cents
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: 'http://localhost:3000/Buses',
//       cancel_url: 'http://localhost:3000/Passengers',
//     });

//     // If payment is successful, add the trip data to the user's trips
//     // Assuming you have a user object with the provided userID
//     const user = await userSchema.findOne({ _id: data.userID });

//       const tripData = {
//         busName: data.busName,
//         StartDate: data.StartDate,
//         from: data.from,
//         to: data.to,
//         seatBooked: data.seatBooked,
//         busOwnerID: data.busOwnerID,
//         startTime: data.startTime,
//         endTime: data.endTime,
//         busFare: data.busFare,
//         passengers: data.passengers,
//       };

//       console.log(tripData);

//       user.trips.push(tripData);
//       await user.save();
    


//     res.json({ sessionId: session.id }); // Return the session ID to the client
//   } catch (error) {
//     // Handle any errors that occur during the payment process
//     console.error('Error making the Axios request:', error);
//     res.status(500).send('Payment failed'); // Adjust the response status or message as needed
//   }
// });




module.exports = router;