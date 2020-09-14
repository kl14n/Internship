const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connect to MongoDB.");
    }).catch(err => {
    console.error("Connection error", err);
    process.exit();
    });