import {MongoClient} from "mongodb";

import {MONGODB_URL} from "../config";

export default MongoClient.connect(MONGODB_URL, {
    replSet: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
});
