import get from "lodash.get";

export default function getTokenId (user) {
    return get(user, "services.fcm.token", null);
}
