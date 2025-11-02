const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "help",
  version: "2.1.0",
  permission: 0,
  credits: "Joy Ahmed",
  description: "সব কমান্ড এবং বট তথ্য দেখায়",
  prefix: true,
  category: "system",
  usages: "[command name]",
  cooldowns: 5
};

// ছোট বক্স স্টাইল ফাংশন
function smallBox(text) {
  return `╭╼|━━━━━━━━━━━━━━|╾╮\n${text}\n╰╼|━━━━━━━━━━━━━━|╾╯`;
}

module.exports.run = async function ({ api, event, args }) {
  const commandList = global.client.commands;
  const prefix = global.config.PREFIX || ".";
  let msg = "";

  if (args[0]) {
    const name = args[0].toLowerCase();
    const command = commandList.get(name);

    if (!command) {
      return api.sendMessage(
        smallBox("❌ এই নামে কোনো কমান্ড নেই!"),
        event.threadID,
        event.messageID
      );
    }

    msg += smallBox(`⌨️ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝: ${name}`);
    msg += "\n\n";

    msg += `📄 𝐃𝐞𝐬𝐜: ${command.config.description || "নেই"}\n`;
    msg += `📂 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲: ${command.config.category || "Unknown"}\n`;
    msg += `📌 𝐔𝐬𝐚𝐠𝐞: ${prefix}${command.config.name} ${command.config.usages || ""}\n`;
    msg += `⏱️ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧: ${command.config.cooldowns || 3}s\n`;
    msg += `👤 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧: ${command.config.permission}\n`;

    return api.sendMessage(msg, event.threadID, event.messageID);
  }

  // সব কমান্ড ক্যাটাগরি অনুযায়ী আলাদা করা
  const categories = {};
  commandList.forEach((command) => {
    const cat = command.config.category || "Unknown";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(command.config.name);
  });

  msg += smallBox(`🤖 𝐇𝐞𝐥𝐩 𝐌𝐞𝐧𝐮 — ${global.config.BOTNAME || "Merai Bot"}`);
  msg += "\n\n";

  for (const cat in categories) {
    msg += smallBox(`📁 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲: ${cat.toUpperCase()}`);
    msg += `\n➤ ${categories[cat].sort().join(", ")}\n\n`;
  }

  msg += smallBox("👑 𝐁𝐨𝐭 𝐀𝐝𝐦𝐢𝐧 𝐈𝐧𝐟𝐨") + "\n\n";

  msg += `👤 𝐎𝐰𝐧𝐞𝐫: SUMON ISLAM\n`;
  msg += `📞 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩: wa.me/8801975257710\n`;
  msg += `🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤: https://www.facebook.com/profile.php?id=61583072616904\n`;
  msg += `⚙️ 𝐏𝐫𝐞𝐟𝐢𝐱: ${prefix}\n`;
  msg += `📦 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: 2.1.0\n`;
  msg += `📊 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${commandList.size}\n`;

  const ownerUID = "61583072616904";
  const avatarURL = `https://graph.facebook.com/${ownerUID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const path = __dirname + `/cache/help_owner.jpg`;

  try {
    const res = await axios.get(avatarURL, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));

    return api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(path)
      },
      event.threadID,
      () => fs.unlinkSync(path),
      event.messageID
    );

  } catch (e) {
    console.error(e);
    return api.sendMessage(
      msg + "\n⚠️ অ্যাডমিন প্রোফাইল লোড হয়নি।",
      event.threadID,
      event.messageID
    );
  }
};
