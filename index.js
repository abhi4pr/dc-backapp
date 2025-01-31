const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes.js');
const vari = require('./variables.js');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/api', routes);

mongoose.connect(vari.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'antioxidb'
}).then(() => {
  console.log('DB connected');
})
  .catch((err) => {
    console.log(err);
  })

app.listen(vari.PORT, () => {
  console.log('server is running at ' + vari.PORT);
});