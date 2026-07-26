const fs = require("fs");
const path = require("path");

const JOB_FILE = path.join(__dirname, "../data/jobs.json");

function compareJobs(newJobs) {
  let oldJobs = [];

  // Read previous jobs
  if (fs.existsSync(JOB_FILE)) {
    const data = fs.readFileSync(JOB_FILE, "utf-8");

    if (data.trim()) {
      oldJobs = JSON.parse(data);
    }
  }

  // console.log("Scraped jobs:", newJobs.length);
  // console.log("Stored jobs:", oldJobs.length);

  // Only consider open jobs for notification
  const openJobs = newJobs.filter((job) => job.status !== "Closed");
  // const openJobs = newJobs;

  // Find jobs that were never seen before
  const newFound = openJobs.filter((job) => {
    return !oldJobs.some((oldJob) => oldJob.id === job.id);
  });

  // Save latest jobs snapshot
  fs.writeFileSync(JOB_FILE, JSON.stringify(newJobs, null, 2));

  return newFound;
}

module.exports = compareJobs;
