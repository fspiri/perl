'use strict';

/**
 * comment-thread service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::comment-thread.comment-thread');
