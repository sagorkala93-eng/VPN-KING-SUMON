const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "info",
  version: "1.0.0",
  permission: 0,
  credits: "Joy",
  description: "Displays personal info of the bot owner",
  prefix: true,
  category: "info",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const currentTime = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【hh:mm:ss】");

  const imageUrl = "https://graph.facebook.com/61556298365773/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  const imgPath = __dirname + "/cache/info_avatar.png";

  const infoText = `
╭╼|━━━━━━━━━━━━━━|╾╮
👤 𝗡𝗮𝗺𝗲 : 𝗩𝗣𝗡 𝗞𝗜𝗡𝗚 𝗦𝗨𝗠𝗢𝗡
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 : 𝗠𝗗 𝗦𝗨𝗠𝗢𝗡 𝗜𝗦𝗟𝗔𝗠
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
🕋 𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝗻 : 𝗜𝗦𝗟𝗔𝗠
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
🏠 𝗣𝗲𝗿𝗺𝗮𝗻𝗲𝗻𝘁 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 : 𝗚𝗔𝗜𝗕𝗔𝗡𝗗𝗛𝗔, 𝗥𝗔𝗡𝗚𝗣𝗨𝗥
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
📍 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 : 𝗦𝗨𝗡𝗗𝗢𝗥𝗚𝗢𝗡𝗝,𝗚𝗔𝗜𝗕𝗔𝗡𝗗𝗛𝗔
╰╼|━━━━━━━━━━━━━━|╾╮

╭╼|━━━━━━━━━━━━━━|╾╮
🚻 𝗚𝗲𝗻𝗱𝗲𝗿 : 𝗠𝗔𝗟𝗘
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
🎂 𝗔𝗴𝗲 : 𝟭𝟲+
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
💘 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻𝘀𝗵𝗶𝗽 : 𝗦𝗜𝗡𝗚𝗘𝗟
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
🎓 𝗪𝗼𝗿𝗸 : 𝗦𝗧𝗨𝗗𝗘𝗡𝗧
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
📧 𝗚𝗺𝗮𝗶𝗹 : sumonislam124@gmail.com
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 : wa.me/+8801975257710
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
✈️ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 : https://t.me/sumonvpn
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗟𝗶𝗻𝗸 :https://www.facebook.com/profile.php?id=61556298365773
╰╼|━━━━━━━━━━━━━━|╾╯

╭╼|━━━━━━━━━━━━━━|╾╮
⏰ 𝗧𝗶𝗺𝗲 : ${currentTime}
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
