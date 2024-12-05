const express = require('express');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const session = require('express-session');
const User = require('./src/models/User')
const connectDB = require('./db');
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
dotenv.config();
connectDB();

app.use(session({
    secret: 'whereismybugatti',
    resave: false,
    saveUninitialized: true,
}));

app.use(cors())
app.use(express.json());

const CLIENT_ID = '1027861994345-c31g6uoudvtqop6r7coi4lnur3clfd5n.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

let userTokens = null;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aneesnafeesimmu@gmail.com',
        pass: 'oxxzaolalhchgrbn',
    },
});

let otpStore = {};

app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    otpStore[email] = otp;

    try {
        await transporter.sendMail({
            from: 'aneesnafeesimmu@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`,
        });
        res.json({ success: true, message: 'OTP sent to your email.' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP.' });
    }
});

app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (otpStore[email] && otpStore[email] === otp) {
        delete otpStore[email];
        // res.json({ success: true, message: 'OTP verified.' });
            let user = await User.findOne({ email });

            if (user) {
                return res.status(200).json({ success: true, message: 'User already registered.' });
            }
            user = new User({ email, otpVerified: true });
            await user.save();
            console.log('User Successfully Registered');
            

            res.status(201).json({ success: true, message: 'User successfully registered.' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }
});


app.get('/auth/google', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/youtube.readonly'],
    });
    res.redirect(authUrl);
});

app.get('/check-auth', (req, res) => {
    if (req.session.userTokens) {
        res.json({ isAuthenticated: true, message: 'User is authenticated.' });
    } else {
        res.status(401).json({ isAuthenticated: false, message: 'User is not authenticated.' });
    }
});

app.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;
    console.log(code)
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        userTokens = tokens; // Save tokens
        // localStorage.setItem('token', userTokens)
        res.redirect('https://blaash-task.onrender.com/home'); 
        // res.send('Authentication successful! You can now fetch playlists.');
    } catch (error) {
        console.error('Error retrieving access token', error);
        res.status(500).send('Authentication failed');
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/playlists', async (req, res) => {
    if (!userTokens) {
        res.status(401).send('Authentication required. Please login first.');
        return;
    }
    oauth2Client.setCredentials(userTokens); // Reuse tokens
    try {
        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
        const response = await youtube.playlists.list({
            part: 'snippet,contentDetails',
            mine: true,
            auth: oauth2Client,
        });
        const playlists = response.data.items;

        if (!playlists) {
            return res.status(404).send('No playlists found.');
        }

        const playlistIds = playlists.map(playlist => playlist.id);

        const email = req.query.email;
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        user.layout = playlistIds;
        await user.save();
        console.log(user.layout)
        res.json(playlists);
    } catch (error) {
        console.error('Error fetching playlists', error);
        res.status(500).send('Failed to fetch playlists');
    }
});

// Route to get user layout
app.get('/user/layout', async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ message: 'Email parameter is required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ layout: user.layout });
    } catch (error) {
        console.error('Error fetching user layout:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/user/layout/update', async (req, res) => {
    const { email, layout } = req.body;

    if (!email || !layout) {
        return res.status(400).json({ success: false, message: 'Email and layout are required.' });
    }

    try {
        // Find the user by email and update the layout
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        user.layout = layout;
        await user.save();
        console.log(user.layout);
        res.status(200).json({ success: true, message: 'Layout updated successfully.' });
    } catch (error) {
        console.error('Error updating layout:', error);
        res.status(500).json({ success: false, message: 'Failed to update layout.' });
    }
});

app.get('/most-popular', async (req, res) => {
    if (!userTokens) {
        res.status(401).send('Authentication required. Please login first.');
        return;
    }

    oauth2Client.setCredentials(userTokens);
    try {
        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
        const response = await youtube.videos.list({
            part: 'snippet,statistics',
            chart: 'mostPopular',
            maxResults: 15, 
            regionCode: 'IN', 
        });

        // console.log(response.data.items);
        res.json(response.data.items);
    } catch (error) {
        console.error('Error fetching most popular videos', error);
        res.status(500).send('Failed to fetch most popular videos');
    }
});

app.get('/playlists/videos/:playlistId', async(req, res) => {
    const { playlistId } = req.params;
    if (!userTokens) {
        res.status(401).send('Authentication required. Please login first.');
    }
    console.log(playlistId)
    oauth2Client.setCredentials(userTokens);
    try {
        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
        const response = await youtube.playlistItems.list({
            part: 'snippet,contentDetails',
            playlistId: playlistId,
            auth: oauth2Client,
        })
        // console.log(response);
        res.json(response.data.items);
    } catch (error) {
        console.error('Error fetching playlist items', error);
        res.status(500).send('Failed to fetch playlist videos')
    }
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
