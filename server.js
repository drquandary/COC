// Simple development server for Cradle of Civilization
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from public directory
app.use(express.static('public'));

// Serve source files from src directory
app.use('/src', express.static('src'));

// Handle client-side routing - serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🏛️ Cradle of Civilization server running on http://localhost:${PORT}`);
    console.log('📱 Mobile-friendly URL: http://your-ip-address:' + PORT);
    console.log('🚀 Ready to start your ancient diplomacy game!');
});