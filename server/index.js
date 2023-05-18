const express = require('express');
const app = express();
const cors = require('cors');

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/jobs', require('./routes/api/jobs'));
app.use('/api/contacts', require('./routes/api/contacts'));
app.use('/api/boards', require('./routes/api/boards'));
app.use('/api/users', require('./routes/api/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
