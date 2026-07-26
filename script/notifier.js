const axios = require("axios");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;


async function sendTelegramMessage(jobs) {

    if (!jobs.length) {
        return;
    }


    let message = "🚨 New RM Portal Jobs Found\n\n";


    jobs.forEach((job, index) => {

        message +=
`${index + 1}. ${job.title}

Company: ${job.company}
Location: ${job.location}
Type: ${job.type}
CTC: ${job.ctc}
Status: ${job.status}
Apply Before: ${job.applicationWindow}

-------------------------

`;

    });


    await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
            chat_id: CHAT_ID,
            text: message
        }
    );


    console.log("Telegram notification sent ✅");
}


module.exports = sendTelegramMessage;