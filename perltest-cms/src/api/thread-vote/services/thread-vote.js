'use strict';

/**
 * thread-vote service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::thread-vote.thread-vote');
