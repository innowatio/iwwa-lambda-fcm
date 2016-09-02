import {MongoClient} from "mongodb";

import {MONGODB_URL} from "../config";

export default MongoClient.connect(MONGODB_URL, {
    options: {
        replset: {socketOptions: {connectTimeoutMS: 5000}},
        server: {socketOptions: {connectTimeoutMS: 5000}}
    }
});
