const moment = require("moment-timezone");
const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "Admin",
  version: "1.0.0",
  permission: 0,
  credits: "Joy",
  description: "Shows admin's personal information",
  prefix: true,
  category: "info",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const currentTime = moment.tz("Asia/Dhaka").format("DD MMM YYYY, hh:mm:ss A");
  const imageUrl = "https://graph.facebook.com/61583072616904/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  const imgPath = __dirname + "/cache/admin_avatar.png";

  const infoText = `
╭╼|━━━━━━━━━━━━━━|╾╮
👑 𝗔𝗱𝗺𝗶𝗻: 𝙑𝙥𝙣 𝙆𝙞𝙣𝙜 𝙎𝙪𝙢𝙤𝙣
🌐 𝗡𝗮𝗺𝗲: 𝙈𝙙 𝙎𝙪𝙢𝙤𝙣 𝙄𝙨𝙡𝙖𝙢
🕋 𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝗻: 𝐈𝐬𝐥𝐚𝐦 | 🚹 𝗚𝗲𝗻𝗱𝗲𝗿: 𝘔𝘢𝘭𝘦
🎂 𝗔𝗴𝗲: 𝟭𝟲+ | 🎓 𝗪𝗼𝗿𝗸: 𝘚𝘵𝘶𝘥𝘦𝘯𝘵
🏠 𝗙𝗿𝗼𝗺: 𝙂𝙖𝙞𝙗𝙖𝙣𝙙𝙝𝙖, 𝙍𝙖𝙣𝙜𝙥𝙪𝙧
📍 𝗖𝘂𝗿𝗿𝗲𝗻𝘁: 𝙎𝙪𝙣𝙙𝙤𝙧𝙜𝙤𝙣𝙟, 𝙜𝙖𝙞𝙗𝙖𝙣𝙙𝙝𝙖
💘 𝗦𝘁𝗮𝘁𝘂𝘀: 𝙎𝙞𝙣𝙜𝙡𝙚
📧 𝗘𝗺𝗮𝗶𝗹: sumonislam124@gmail.com
📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: +8801975257710
✈️ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: https://t.me/sumonvpn
🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: fb.com/61583072616904
⏰ 𝗧𝗶𝗺𝗲: ${currentTime}
╰╼|━━━━━━━━━━━━━━|╾╯`;

  const callback = () => {
    api.sendMessage({
      body: infoText,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath));
  };

  request(encodeURI(imageUrl))
    .pipe(fs.createWriteStream(imgPath))
    .on("close", callback);
};
