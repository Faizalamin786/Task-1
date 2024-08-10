const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const { sendMail } = require('../mail/sendMail');

// Function to generate a random password
function generatePassword(firstName, lastName, number) {
  const numPart = typeof number === 'string' ? number.slice(4, 8) : '';
  const password = `${firstName.slice(0, 2)}${lastName.slice(-2)}${numPart}`;
  return password;
}

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // Limit file size to 50MB
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, number } = req.body;
    const password = generatePassword(firstname, lastname, number);
    const newUser = new User({ firstname, lastname, email, number, password });
    await newUser.save();
    sendMail(email, "Welcome to our page", `Hi ${firstname} ${lastname}, thank you for registering with number ${number}! Your password is: ${password}`);
    res.status(201).json({
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      number: newUser.number,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { firstname, password } = req.body;

  try {
    const user = await User.findOne({ firstname });
    if (!user) {
      console.log(`User with firstname ${firstname} not found.`);
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.password !== password) {
      console.log('Invalid credentials.');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const userData = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      number: user.number,
    };
    res.status(200).json({ message: 'Login successful', user: userData });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update user bio
router.post('/user/updateBio', async (req, res) => {
  const { email, bio } = req.body;

  try {
    const user = await User.findOneAndUpdate({ email }, { bio }, { new: true });
    if (!user) {
      console.log(`User with email ${email} not found.`);
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'Bio updated successfully' });
  } catch (err) {
    console.error('Error updating bio:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Upload profile image route
router.post('/uploadProfileImage', upload.single('profileImage'), async (req, res) => {
  try {
    const { firstname } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or file is too large.' });
    }

    const user = await User.findOne({ firstname });

    if (!user) {
      console.log(`User with firstname ${firstname} not found.`);
      return res.status(404).json({ error: 'User not found' });
    }

    user.profileImage = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };

    await user.save();
    res.status(200).json({ message: 'Profile image uploaded successfully' });
  } catch (err) {
    console.error('Error uploading profile image:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get profile image by user ID
router.get('/profile-image/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.profileImage || !user.profileImage.data) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.set('Content-Type', user.profileImage.contentType);
    res.send(user.profileImage.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload multiple videos route



router.post('/uploadVideos', upload.array('videos', 5), async (req, res) => { // Limit to 5 videos at once
  try {
    const { firstname } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded or files are too large.' });
    }

    const user = await User.findOne({ firstname });

    if (!user) {
      console.log(`User with firstname ${firstname} not found.`);
      return res.status(404).json({ error: 'User not found' });
    }

    req.files.forEach(file => {
      user.videos.push({
        data: file.buffer,
        contentType: file.mimetype
      });
    });

    await user.save();
    res.status(200).json({ message: 'Videos uploaded successfully' });
  } catch (err) {
    console.error('Error uploading videos:', err.message);
    res.status(500).json({ error: err.message });
  }
});



router.get('/users', async (req, res) => {
  try {
    const users = await User.find().lean();
    res.setHeader('Content-Length', users.length); // Setting Content-Length header for progress tracking
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get profile image by user ID
router.get('/profile-image/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.profileImage || !user.profileImage.data) return res.status(404).json({ error: 'Image not found' });

    res.set('Content-Type', user.profileImage.contentType);
    res.send(user.profileImage.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get video by user ID and video index
router.get('/video/:userId/:videoIndex', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const videoIndex = parseInt(req.params.videoIndex, 10);
    if (!user || !user.videos || !user.videos[videoIndex] || !user.videos[videoIndex].data) return res.status(404).json({ error: 'Video not found' });

    res.set('Content-Type', user.videos[videoIndex].contentType);
    res.send(user.videos[videoIndex].data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ger all the cideo

router.get('/videos/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const [firstname, lastname] = username.split('-');

    const user = await User.findOne({ firstname, lastname });

    if (!user || !user.videos || user.videos.length === 0) {
      return res.status(404).json({ error: 'User or videos not found' });
    }

    // Encode video data as base64
    const videos = user.videos.map(video => ({
      ...video,
      data: video.data.toString('base64'),
      contentType: video.contentType
    }));

    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






module.exports = router;
