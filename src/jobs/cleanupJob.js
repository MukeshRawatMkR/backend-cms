// Example scheduled job using node-cron
const cron = require('node-cron');
const Post = require('../models/Post');

cron.schedule('0 0 * * *', async () => {
  // Run every day at midnight
  const result = await Post.deleteMany({ expired: true });
  console.log(`${result.deletedCount} expired posts deleted.`);
});