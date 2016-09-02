import {MongoClient} from "mongodb";

import {MONGODB_URL} from "../config";

var options = {
    options: {
        replSet: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
    }
};

export default MongoClient.connect(MONGODB_URL, options);
