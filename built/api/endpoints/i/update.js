"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const cafy_1 = require("cafy");
const user_1 = require("../../models/user");
const user_2 = require("../../models/user");
const user_3 = require("../../serializers/user");
const event_1 = require("../../event");
const conf_1 = require("../../../conf");
/**
 * Update myself
 *
 * @param {any} params
 * @param {any} user
 * @param {any} _
 * @param {boolean} isSecure
 * @return {Promise<any>}
 */
module.exports = async (params, user, _, isSecure) => new Promise(async (res, rej) => {
    // Get 'name' parameter
    const [name, nameErr] = cafy_1.default(params.name).optional.string().pipe(user_2.isValidName).$;
    if (nameErr)
        return rej('invalid name param');
    if (name)
        user.name = name;
    // Get 'description' parameter
    const [description, descriptionErr] = cafy_1.default(params.description).optional.nullable.string().pipe(user_2.isValidDescription).$;
    if (descriptionErr)
        return rej('invalid description param');
    if (description !== undefined)
        user.description = description;
    // Get 'location' parameter
    const [location, locationErr] = cafy_1.default(params.location).optional.nullable.string().pipe(user_2.isValidLocation).$;
    if (locationErr)
        return rej('invalid location param');
    if (location !== undefined)
        user.profile.location = location;
    // Get 'birthday' parameter
    const [birthday, birthdayErr] = cafy_1.default(params.birthday).optional.nullable.string().pipe(user_2.isValidBirthday).$;
    if (birthdayErr)
        return rej('invalid birthday param');
    if (birthday !== undefined)
        user.profile.birthday = birthday;
    // Get 'avatar_id' parameter
    const [avatarId, avatarIdErr] = cafy_1.default(params.avatar_id).optional.id().$;
    if (avatarIdErr)
        return rej('invalid avatar_id param');
    if (avatarId)
        user.avatar_id = avatarId;
    // Get 'banner_id' parameter
    const [bannerId, bannerIdErr] = cafy_1.default(params.banner_id).optional.id().$;
    if (bannerIdErr)
        return rej('invalid banner_id param');
    if (bannerId)
        user.banner_id = bannerId;
    await user_1.default.update(user._id, {
        $set: {
            name: user.name,
            description: user.description,
            avatar_id: user.avatar_id,
            banner_id: user.banner_id,
            profile: user.profile
        }
    });
    // Serialize
    const iObj = await user_3.default(user, user, {
        detail: true,
        includeSecrets: isSecure
    });
    // Send response
    res(iObj);
    // Publish i updated event
    event_1.default(user._id, 'i_updated', iObj);
    // Update search index
    if (conf_1.default.elasticsearch.enable) {
        const es = require('../../../db/elasticsearch');
        es.index({
            index: 'misskey',
            type: 'user',
            id: user._id.toString(),
            body: {
                name: user.name,
                bio: user.bio
            }
        });
    }
});
