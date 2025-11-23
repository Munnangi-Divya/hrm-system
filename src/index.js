const express = require('express');
const cors = require('cors');
require('dotenv').config();
const init = require('./migrations/init');

init();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/logs', require('./routes/logs'));

app.listen(process.env.PORT, () => {});
