const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "join",
  eventType: ["log:subscribe"],
  version: "1.3.2",
  credits: "Joy Ahmed (modified by ChatGPT)",
  description: "Send welcome message with image, only name (no tag, no ID)",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "axios": ""
  }
};

module.exports.onLoad = async function () {
  const dir = path.join(__dirname, "cache", "joinGif");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

async function downloadImage(url, filepath) {
  const writer = fs.createWriteStream(filepath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream"
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;
  const botID = api.getCurrentUserID();

  const currentTime = new Date().toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka",
    hour12: true,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });

  const botPicUrl = "https://graph.facebook.com/100001435123762/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  const botPicPath = path.join(__dirname, "cache", "joinGif", "bot_join.jpg");

  const driveImageUrl = "https://drive.google.com/uc?export=download&id=1UsliCw3v-qR8V6_fqpuYbPplRKGXIiq8";
  const welcomeImagePath = path.join(__dirname, "cache", "joinGif", "welcome.jpg");

  // BOT joined group
  if (event.logMessageData.addedParticipants.some(user => user.userFbId === botID)) {
    if (!fs.existsSync(botPicPath)) {
      try {
        await downloadImage(botPicUrl, botPicPath);
      } catch (e) {
        console.error("Bot profile download error:", e);
      }
    }

    await api.changeNickname(`[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || "BOT"}`, threadID, botID);

    const botJoinMsg =
`✅ 𝐁𝐨𝐭 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!

╭╼|━━━━━━━━━━━━━━|╾╮
👑 𝗔𝗱𝗺𝗶𝗻: 𝐕𝐏𝐍 𝐊𝐈𝐍𝐆 𝐒𝐔𝐌𝐎𝐍
🌐 𝗡𝗮𝗺𝗲: 𝐌𝐃 𝐒𝐔𝐌𝐎𝐍 𝐈𝐒𝐋𝐀𝐌
📧 𝗘𝗺𝗮𝗶𝗹: mdsumonislam124@gmail.com
📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: +8801975257710
✈️ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: https://t.me/sumonvpn
🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: fb.com/61583072616904
⏰ 𝗧𝗶𝗺𝗲: ${currentTime}
╰╼|━━━━━━━━━━━━━━|╾╯`;

    return api.sendMessage({
      body: botJoinMsg,
      attachment: fs.createReadStream(botPicPath)
    }, threadID);
  }

  // OTHER USERS joined group
  try {
    const addedUsers = event.logMessageData.addedParticipants;

    if (!fs.existsSync(welcomeImagePath)) {
      try {
        await downloadImage(driveImageUrl, welcomeImagePath);
      } catch (e) {
        console.error("Welcome image download error:", e);
      }
    }

    let threadInfo = {};
    try {
      threadInfo = await api.getThreadInfo(threadID);
    } catch (e) {
      console.error("Failed to get thread info:", e);
    }

    const groupName = threadInfo.threadName || "Unknown Group";
    const memberCount = threadInfo.participantIDs ? threadInfo.participantIDs.length : 0;

    // Only show names, no ID, no tag
    let nameList = [];
    addedUsers.forEach(user => {
      if (user.userFbId !== event.author) {
        nameList.push(`${user.fullName}`);
      }
    });

    const welcomeMsg = `
╭─❍❍❍───────────╮
│ 🦋 𝓦𝓮𝓵𝓬𝓸𝓶𝓮 𝓝𝓮𝔀 𝓢𝓽𝓪𝓻 🦋 │
╰─❍❍❍───────────╯

✨🌸❝ 𝓝𝓮𝔀 𝓜𝓮𝓶𝓫𝓮𝓻 ❞🌸✨  

${nameList.join("\n")}

🏷️ 𝓖𝓻𝓸𝓾𝓹: "${groupName}"

👥 𝓣𝓸𝓽𝓪𝓵 𝓜𝓮𝓶𝓫𝓮𝓻𝓼: ${memberCount}

⏰ 𝓣𝓲𝓶𝓮: ${currentTime}

╭╼|━━━━━━━━━━━━━━|╾╮
🤖 𝐅𝐫𝐨𝐦 𝐕𝐩𝐧 𝐊𝐢𝐧𝐠 𝐒𝐮𝐦𝐨𝐧
╰╼|━━━━━━━━━━━━━━|╾╯
`;

    return api.sendMessage({
      body: welcomeMsg,
      attachment: fs.createReadStream(welcomeImagePath)
    }, threadID);

  } catch (error) {
    console.error("Join error:", error);
  }
};
