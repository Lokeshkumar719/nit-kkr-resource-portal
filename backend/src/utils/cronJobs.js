const cron = require('node-cron');
const Mentor = require('../models/Mentor');

const setupCronJobs = () => {
  // Run on June 1st every year at 00:00 (Midnight)
  // Format: second(opt) minute hour dayOfMonth month dayOfWeek
  cron.schedule('0 0 1 6 *', async () => {
    console.log('[CRON] Starting annual mentor promotion script...');
    try {
      const currentYear = new Date().getFullYear();
      
      // 1. Promote 4th Years to Alumni
      const fourthYears = await Mentor.find({ currentYear: '4th Year' });
      for (const mentor of fourthYears) {
        mentor.currentYear = 'Alumni';
        // Calculate batch: e.g. if graduating in 2026, batch is 2022-2026
        mentor.batch = `${currentYear - 4}-${currentYear}`;
        await mentor.save();
      }
      console.log(`[CRON] Promoted ${fourthYears.length} '4th Year' mentors to 'Alumni' (Batch: ${currentYear - 4}-${currentYear}).`);

      // 2. Promote 3rd Years to 4th Years
      const result3to4 = await Mentor.updateMany(
        { currentYear: '3rd Year' },
        { $set: { currentYear: '4th Year' } }
      );
      console.log(`[CRON] Promoted ${result3to4.modifiedCount} '3rd Year' mentors to '4th Year'.`);

      // 3. Promote 2nd Years to 3rd Years
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
