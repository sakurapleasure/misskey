"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const mongo = require("mongodb");
const deepcopy = require("deepcopy");
const post_reaction_1 = require("../models/post-reaction");
const user_1 = require("./user");
/**
 * Serialize a reaction
 *
 * @param {any} reaction
 * @param {any} me?
 * @return {Promise<any>}
 */
exports.default = (reaction, me) => new Promise(async (resolve, reject) => {
    let _reaction;
    // Populate the reaction if 'reaction' is ID
    if (mongo.ObjectID.prototype.isPrototypeOf(reaction)) {
        _reaction = await post_reaction_1.default.findOne({
            _id: reaction
        });
    }
    else if (typeof reaction === 'string') {
        _reaction = await post_reaction_1.default.findOne({
            _id: new mongo.ObjectID(reaction)
        });
    }
    else {
        _reaction = deepcopy(reaction);
    }
    // Rename _id to id
    _reaction.id = _reaction._id;
    delete _reaction._id;
    // Populate user
    _reaction.user = await user_1.default(_reaction.user_id, me);
    resolve(_reaction);
});
