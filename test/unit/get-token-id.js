import {expect} from "chai";

import getTokenId from "steps/get-token-id";

describe("`getTokenId` function", () => {

    it("get the token", () => {
        const user = {
            services: {
                fcm: {
                    token: "fcm-token"
                }
            }
        };
        const ret = getTokenId(user);
        expect(ret).to.deep.equal("fcm-token");
    });

    it("if the token is not present, returns `null`", () => {
        const user = {
            services: {}
        };
        const ret = getTokenId(user);
        expect(ret).to.equal(null);
    });

});
