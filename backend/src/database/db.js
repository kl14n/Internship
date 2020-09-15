//MongoDB wrapper
const config = require('src/config/config.json');
const mongoose = require('mongoose');
const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    Account: require('src/models/account.model'),
    RefreshToken: require('src/models/refresh-token.model'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}