
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
require('./model/user');
require('./model/Survey');
require('./services/passport');
mongoose.connect(keys.mongoURL);






const app = express();

app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: 30*24*60*60*1000,
        keys: [keys.cookieKey]
    })
)

app.use(passport.initialize());
app.use(passport.session());


require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);
//make sure express serves react in production
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*',(req,res) =>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    })
}
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});