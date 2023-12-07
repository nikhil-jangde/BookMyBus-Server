const express = require('express');
const router = express.Router();
const { District, Trips, Buses, userSchema, FeedbackSchema} = require('./Models.js'); // Import your models
const jwt = require('jsonwebtoken');
const secretKey = 'xJ@4kT#e*6Pb&8QvLm9GpZr6Jw8Xz2Rv';

router.get('/users',async(req,res)=>{
    try{
      const getusers = await userSchema.find();
     res.json(getusers)
    } catch(error){
      res.send(500).json({error:'Internal server error try after some time'})
    }
  })

  router.post('/CreateUser',async(req,res)=>{
    const { username, mobile, email,gender} = req.body;
    try {
      const existingUser = await userSchema.findOne({
        $or: [{ mobile }, { email }],
      });
      if (existingUser) {
        return res.status(201).json({ error: 'Mobile number or email already exists' });
      }
      const newUser = new userSchema(req.body);
      await newUser.save();
      res.status(200).send(newUser);
    } catch (error) {
      res.status(500).send(error);
    }
  })

  router.put('/updateuser/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUser = await userSchema.findByIdAndUpdate(userId, req.body, { new: true });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send(error);
    }
  });

router.get('/districts', async (req, res) => {
    try {
      const districts = await District.find().distinct('districts');
      res.json(districts);
     // console.log(districts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get('/get-trips', async (req, res) => {
    try {
      const Tripdata = await Trips.find();
      res.json(Tripdata);
      //console.log(Tripdata);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.post('/addtrips',async(req,res)=>{
    try {
      const newTrip = new Trips(req.body);
      await newTrip.save();
      res.status(201).send(newTrip);
    } catch (error) {
      res.status(500).send(error);
    }
  })

router.get('/get-buses', async (req, res) => {
    try {
      const BusList = await Buses.find();
      res.json(BusList);
    //  console.log(BusList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// router.get('/check-user/:mobile', async (req, res) => {
//     try {
//       const mobile = req.params.mobile;
//       const user = await userSchema.findOne({ mobile });
  
//       if (!user) {
//         return res.status(201).send('User not found');
//       }
  
//       res.status(200).json(user);
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   });

  router.post('/addFeedback',async (req,res)=>{
    try {
      const Addreview = new FeedbackSchema(req.body);
      await Addreview.save();
      res.status(200).send(Addreview);
    } catch (error) {
      res.status(500).send(error);
    }
  })


router.get('/check-user/:mobile', async (req, res) => {
  try {
    const mobile = req.params.mobile;
    const user = await userSchema.findOne({mobile});
console.log(user);
    if (!user) {
      return res.status(201).send('User not found');
    }
    else{res.status(200).json({user});}
    // Generate a JWT token with the user's data
    const tokenPayload = {
      userId: user._id,
    };

    // Generate the JWT token
    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '10d' });
     // Token expires in 10 days
    // Send the token as a response

  } catch (error) {
    res.status(500).send(error);
  }
});



// router.get('/Verify-token', (req, res) => {
//   const token = req.header('Authorization'); 
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   jwt.verify(token, secretKey, (err, decoded) => {
//     console.log(token);
//     if (err) { console.log(err);
//       return res.status(401).json({ message: 'Failed to authenticate token' });
//     }
//     const userData = decoded;
//     userSchema.findById(userData._id, (err, user) => {
//       if (err) {
//         return res.status(500).json({ message: 'Failed to fetch user data' });
//       }

//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       res.status(200).json(user);
//     });
//   });
// });



router.get('/Verify-token/:token', async (req, res) =>
{
  try {
    const userId = req.params.token;
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;
