"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const api_1 = require("./api");
const dotenv_1 = require("dotenv");
// environment variables
if (process.env.NODE_ENV !== "production") {
    dotenv_1.config();
}
// stripe initialization
exports.stripe = new stripe_1.default(process.env.STRIPE_SECRET, {
    apiVersion: "2020-03-02",
});
// express initialization
const port = process.env.PORT || 3333;
api_1.app.listen(port, () => console.log(`api available on http://localhost:${port}`));
//# sourceMappingURL=index.js.map