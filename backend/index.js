require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const Alert = require('./models/Alert');


const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer for handling file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Backend is working' });
});

// Image Upload Route
app.post('/api/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert buffer to base64 data URI
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'halisahar-connect',
      resource_type: 'image'
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', details: error.message });
  }
});

// Google Auth Route
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  console.log('Received auth request');
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log('Verified payload for:', payload.email);
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ googleId });
// List of admin emails
// List of admin emails
const adminEmails = [
  'theshubhamchowdhury01@gmail.com',
  'jyotishyadavcse@gmail.com'  // second email here
];

if (!user) {
  const isAdmin = adminEmails.includes(email);

  user = new User({
    googleId,
    email,
    name,
    photo: picture,
    role: isAdmin ? 'admin' : 'citizen',
    isVerified: isAdmin,
    isProfileComplete: isAdmin,
  });

  await user.save();
  console.log('Created new user:', email, isAdmin ? '(ADMIN)' : '');

} else {
  // Upgrade existing user if email is in admin list
  if (adminEmails.includes(email) && user.role !== 'admin') {
    user.role = 'admin';
    user.isVerified = true;
    user.isProfileComplete = true;
    await user.save();
    console.log('Upgraded existing user to admin:', email);
  }
}


    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(500).json({ message: 'Authentication failed', details: error.message });
  }
});

// Update Profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  const { name, mobile, address, wardNumber, photo, aadharPhoto } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.mobile = mobile;
    user.address = address;
    user.wardNumber = wardNumber;
    user.photo = photo || user.photo;
    user.aadharPhoto = aadharPhoto;
    user.isProfileComplete = true;
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Admin verification (Internal or protected route)
app.put('/api/admin/verify-user/:userId', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
  
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = true;
    await user.save();
    res.json({ message: 'User verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying user' });
  }
});

// Get current user details
app.get('/api/user/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Admin: Get all users
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
  try {
    const users = await User.find({ role: 'citizen' });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Admin: Verify user
app.put('/api/admin/verify-user/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error verifying user' });
  }
});

// --- Complaint Routes ---

// Create Complaint
app.post('/api/complaints', authenticateToken, async (req, res) => {
  try {
    const complaint = new Complaint({
      ...req.body,
      userId: req.user.id
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get User's Complaints
app.get('/api/complaints/me', authenticateToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= SEND PUBLIC ALERT =================
app.post('/api/admin/send-alert', authenticateToken, async (req, res) => {
  try {

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, message, ward, date, time } = req.body;

    if (!title || !message || !date || !time) {
      return res.status(400).json({ message: 'All required fields missing' });
    }

    const alert = await Alert.create({
      title,
      message,
      ward,
      date,
      time,
    });

    res.status(201).json({
      message: 'Alert sent successfully',
      alert,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= GET ALERTS FOR USERS =================
app.get('/api/alerts/:ward', async (req, res) => {
  try {
    const ward = req.params.ward;

    const alerts = await Alert.find({
      $or: [{ ward: 'all' }, { ward: ward }]
    }).sort({ createdAt: -1 });

    res.json(alerts);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// ================= ADMIN: GET ALL ALERTS =================
app.get('/api/admin/alerts', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const alerts = await Alert.find().sort({ createdAt: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// ================= ADMIN: DELETE ALERT =================
app.delete('/api/admin/alerts/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Alert.findByIdAndDelete(req.params.id);

    res.json({ message: 'Alert removed successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= ADMIN: DELETE USER =================
app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    console.log("DELETE request for ID:", req.params.id);

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      console.log("User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User removed successfully' });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Admin: Get All Complaints
app.get('/api/admin/complaints', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update Complaint Status
app.put('/api/admin/complaints/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    const { status, solutionImageUrl, resolutionNote } = req.body;
    
    const updateData = { status, solutionImageUrl, resolutionNote };
    
    // Set resolvedAt when marking as solved
    if (status === 'solved') {
      updateData.resolvedAt = new Date();
    } else {
      updateData.resolvedAt = null;
    }
    
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
