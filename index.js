var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://admin:admin1234@cluster0.zojpg.mongodb.net/curso_mean2?retryWrites=true&w=majority', {
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