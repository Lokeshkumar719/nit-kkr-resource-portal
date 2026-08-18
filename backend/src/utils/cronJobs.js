const cron = require('node-cron');
const Mentor = require('../models/Mentor');

const setupCronJobs = () => {
  cron.schedule('0 0 1 6 *', async () => {
    console.log('[CRON] Starting annual mentor promotion script...');
    try {
      const currentYear = new Date().getFullYear();

      const fourthYears = await Mentor.find({ currentYear: '4th Year' });
      for (const mentor of fourthYears) {
        mentor.currentYear = 'Alumni';

        mentor.batch = `${currentYear - 4}-${currentYear}`;
        await mentor.save();
      }
      console.log(
        `[CRON] Promoted ${fourthYears.length} '4th Year' mentors to 'Alumni' (Batch: ${currentYear - 4}-${currentYear}).`
      );

      const result3to4 = await Mentor.updateMany(
        { currentYear: '3rd Year' },
        { $set: { currentYear: '4th Year' } }
      );
      console.log(`[CRON] Promoted ${result3to4.modifiedCount} '3rd Year' mentors to '4th Year'.`);

      const result2to3 = await Mentor.updateMany(
        { currentYear: '2nd Year' },
        { $set: { currentYear: '3rd Year' } }
      );
      console.log(`[CRON] Promoted ${result2to3.modifiedCount} '2nd Year' mentors to '3rd Year'.`);

      console.log('[CRON] Annual mentor promotion script completed successfully.');
    } catch (error) {
      console.error('[CRON] Error during annual mentor promotion:', error);
    }
  });

  console.log('[CRON] Scheduled annual mentor promotion job for June 1st.');
};

module.exports = setupCronJobs;
