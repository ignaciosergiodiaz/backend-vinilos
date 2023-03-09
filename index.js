var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

const db = 'mongodb+srv://admin:admin1234@cluster0.zojpg.mongodb.net/curso_mean?retryWrites=true&w=majority';
const dblocal = 'mongodb://localhost:27017/curso_mean';

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true

}, (err, res) => {
  if (err) {
    throw err;
  } else {
    app.listen(port, () => {
          console.log("Server listening to APIRest on " + port);
    });
  }
});

module.exports = app;