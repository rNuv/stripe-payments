"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStripeCheckoutSessions = void 0;
const _1 = require("./");
async function createStripeCheckoutSessions(line_items) {
    const url = process.env.WEBAPP_URL;
    const session = await _1.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/failed`,
    });
    return session;
}
exports.createStripeCheckoutSessions = createStripeCheckoutSessions;
//# sourceMappingURL=checkout.js.map