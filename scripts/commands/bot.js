const axios = require("axios");

const githubApiUrl = "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/api.json";
const randomResponses = ["কোন একটি সমস্যা হইচে, একটু পর আবার চেষ্টা করুন 🥲"];

module.exports.config = {
  name: "btt",
  version: "5.0.0",
  permission: 0,
  credits: "JOY",
  description: "AI reply system using dynamic API from GitHub JSON",
  prefix: false,
  category: "chat",
  usages: "[bot/bট/bby or question]",
  cooldowns: 2,
};

// =========================
// LOAD API URL FROM GITHUB
// =========================
async function getApiUrl() {
  try {
    const res = await axios.get(githubApiUrl, { headers: { "Cache-Control": "no-cache" } });
    return res.data?.api || null;
  } catch (err) {
    console.error("❌ GitHub API Load Error:", err.message);
    return null;
  }
}

// =========================
// CALL API FUNCTION
// =========================
async function callApi(params = {}) {
  const apiUrl = await getApiUrl();
  if (!apiUrl) return null;

  try {
    const res = await axios.get(`${apiUrl}/sim`, { params });
    return res.data;
  } catch (err) {
    console.error("❌ API Error:", err.message);
    return null;
  }
}

function getRandomResponse() {
  return randomResponses[Math.floor(Math.random() * randomResponses.length)];
}

// =========================
// SEND ANSWER FUNCTION
// =========================
async function sendAnswer(api, threadID, messageID, question) {
  const res = await callApi({ text: question });
  const msg = res?.response || res?.answer || res?.data?.msg || getRandomResponse();

  return new Promise(resolve => {
    api.sendMessage(msg, threadID, (err, info) => {
      if (err) return;
      global.client.handleReply.push({
        name: module.exports.config.name,
        type: "reply",
        messageID: info.messageID,
        author: threadID
      });
      resolve(info);
    }, messageID);
  });
}

// =========================
// COMMAND HANDLER
// =========================
module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const input = args.join(" ").trim();
  if (!input) return;

  const [cmd, ...rest] = args;
  const content = rest.join(" ").trim();

  // ---------- TEACH ----------
  if (cmd === "teach") {
    const [ask, ans] = content.split(" - ");
    if (!ask || !ans)
      return api.sendMessage("❌ Format: .bot teach প্রশ্ন - উত্তর", threadID, messageID);

    const apiUrl = await getApiUrl();
    if (!apiUrl) return api.sendMessage("❌ API not found in GitHub JSON", threadID, messageID);

    try {
      await axios.get(`${apiUrl}/sim`, { params: { teach: `${ask}|${ans}` } });
      return api.sendMessage(`✅ Teach Added!\n💬 ASK: ${ask}\n💬 ANS: ${ans}`, threadID, messageID);
    } catch {
      return api.sendMessage("⚠️ Teach পাঠানো যায়নি, পরে চেষ্টা করুন", threadID, messageID);
    }
  }

  // ---------- KEYINFO ----------
  if (cmd === "keyinfo") {
    if (!content)
      return api.sendMessage("❌ Format: .bot keyinfo ask", threadID, messageID);

    const apiUrl = await getApiUrl();
    if (!apiUrl) return api.sendMessage("❌ API not found in GitHub JSON", threadID, messageID);

    try {
      const res = await axios.get(`${apiUrl}/sim`, { params: { list: "" } });
      const data = res.data;

      if (!Array.isArray(data))
        return api.sendMessage("❌ Couldn't get key list", threadID, messageID);

      const found = data.find(item => item.ask?.toLowerCase() === content.toLowerCase());
      if (!found)
        return api.sendMessage(`❌ No data found for "${content}"`, threadID, messageID);

      const list = found.answer?.map((a, i) => `${i + 1}. ${a}`).join("\n") || "❌ No answers found";
      return api.sendMessage(`📚 Answers for "${content}":\n${list}`, threadID, messageID);
    } catch {
      return api.sendMessage("⚠️ Keyinfo আনতে সমস্যা হয়েছে", threadID, messageID);
    }
  }

  // ---------- HELP ----------
  if (cmd === "help") {
    const msg = `BOT COMMAND HELP  

•—» .bot teach ask - answer  
•—» .bot keyinfo ask  

💬 শুধু 'bot' বা 'বট' লিখে যেকোন প্রশ্ন করো!`;
    return api.sendMessage(msg, threadID, messageID);
  }

  // ---------- NORMAL CHAT ----------
  await sendAnswer(api, threadID, messageID, input);
};

// =========================
// REPLY HANDLER
// =========================
module.exports.handleReply = async function({ api, event, handleReply }) {
  if (handleReply.author !== event.threadID) return;
  const question = event.body;
  await sendAnswer(api, event.threadID, event.messageID, question);
};

// =========================
// EVENT HANDLER
// =========================
module.exports.handleEvent = async function({ api, event, Users }) {
  try {
    const body = event.body ? event.body.toLowerCase() : "";
    const prefixes = ["বাবু", "bby", "bot", "baby", "বট"];
    const matchedPrefix = prefixes.find(p => body.startsWith(p));

    if (matchedPrefix) {
      const name = await Users.getNameUser(event.senderID);
      const contentAfterPrefix = body.replace(new RegExp(`^${matchedPrefix}\\s*`), "");

      if (!contentAfterPrefix) {
        const ran = [
          "বেশি bot Bot করলে leave নিবো কিন্তু😒😒",
‎ "শুনবো না😼 তুমি আমার বস সুমন কে প্রেম করাই দাও নাই🥺পচা তুমি🥺",
‎ "আমি আবাল দের সাথে কথা বলি না,ok😒",
‎ "এতো ডেকো না,প্রেম এ পরে যাবো তো🙈",
‎ "Bolo Babu, তুমি কি আমার বস সুমন কে ভালোবাসো? 🙈💋",
‎ "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু😑",
‎ "হ্যা বলো😒, তোমার জন্য কি করতে পারি😐😑?",
‎ "এতো ডাকছিস কেন?গালি শুনবি নাকি? 🤬",
‎ "I love you janu🥰",
‎ "আরে Bolo আমার জান ,কেমন আছো?😚",
‎ "Bot বলে অসম্মান করছি,😰😿",
‎ "Hop beda😾,Boss বল boss😼",
‎ "চুপ থাক ,নাই তো তোর দাত ভেগে দিবো কিন্তু",
‎ "আমাকে না ডেকে মেয়ে হলে বস সুমন ইনবক্সে চলে যা 🌚😂 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/profile.php?id=61556298365773",
‎ "Bot না , জানু বল জানু 😘",
‎ "বার বার Disturb করছিস কোনো😾,আমার জানুর সাথে ব্যাস্ত আছি😋",
‎ "আরে বলদ এতো ডাকিস কেন🤬",
‎ "আমাকে ডাকলে ,আমি কিন্তু কিস করে দিবো😘",
‎ "আমারে এতো ডাকিস না আমি মজা করার mood এ নাই এখন😒",
‎ "হ্যাঁ জানু , এইদিক এ আসো কিস দেই🤭 😘",
‎ "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস 😉😋🤣",
‎ "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂",
‎ "আমাকে ডেকো না,আমি বস সুমনের সাথে ব্যাস্ত আছি",
‎ "কি হলো , মিস্টেক করচ্ছিস নাকি🤣",
‎ "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
‎ "জান মেয়ে হলে বস সুমন এর ইনবক্সে চলে যাও 😍🫣💕 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/profile.php?id=61556298365773",
‎ "কালকে দেখা করিস তো একটু 😈",
‎ "হা বলো, শুনছি আমি 😏",
‎ "আর কত বার ডাকবি ,শুনছি তো",
‎ "হুম বলো কি বলবে😒",
‎ "বলো কি করতে পারি তোমার জন্য",
‎ "আমি তো অন্ধ কিছু দেখি না🐸 😎",
‎ "Bot না জানু,বল 😌",
‎ "বলো জানু 🌚",
‎ "তোর কি চোখে পড়ে না আমি ব্যাস্ত আছি😒",
‎ "হুম জান তোমার ওই খানে উম্মহ😑😘",
‎ "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
‎ "jang hanga korba😒😬",
‎ "হুম জান তোমার অইখানে উম্মমাহ😷😘",
‎ "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি..!🥰",
‎ "ভালোবাসার নামক আবলামি করতে চাইলে বস সুমন এর ইনবক্সে গুতা দিন ~🙊😘🤣 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/profile.php?id=61556298365773",
‎ "আমাকে এতো না ডেকে বস সুমন এর কে একটা গফ দে 🙄",
‎ "আমাকে এতো না ডেকছ কেন ভলো টালো বাসো নাকি🤭🙈",
‎ "🌻🌺💚-আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ-💚🌺🌻",
‎ "আমি এখন বস সুমন এর সাথে বিজি আছি আমাকে ডাকবেন না-😕😏 ধন্যবাদ-🤝🌻",
‎ "আমাকে না ডেকে আমার বস সুমন কে একটা জি এফ দাও-😽🫶🌺",
‎ "ঝাং থুমালে আইলাপিউ পেপি-💝😽",
‎ "উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈",
‎ "জান তোমার বান্ধবী রে আমার বস সুমন হাতে তুলে দিবা-🙊🙆‍♂",
‎ "আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧",
‎ "ঝাং 🫵থুমালে য়ামি রাইতে পালুপাসি উম্মম্মাহ-🌺🤤💦",
‎ "চুনা ও চুনা আমার বস সুমন এর হবু বউ রে জান্নাত কে কেউ দেকছো খুজে পাচ্ছি না😪😘😭",
‎ "স্বপ্ন তোমারে নিয়ে দেখতে চাই তুমি যদি আমার হয়ে থেকে যাও-💝🌺🌻",
‎ "জান হাঙ্গা করবা-🙊😝🌻",
‎ "জান মেয়ে হলে চিপায় আসো বস সুমন থেকে অনেক ভালোবাসা শিখছি তোমার জন্য-🙊🙈😽",
‎ "ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤🌼",
‎ "আমার বস সুমনের পক্ষ থেকে তোমারে এতো এতো ভালোবাসা-🥰😽🫶 আমার বস সাহু ইসলামে'র জন্য দোয়া করবেন-💝💚🌺🌻",
‎ "- ভালোবাসা নামক আব্লামি করতে মন চাইলে আমার বস সুমন এর ইনবক্স চলে যাও-🙊🥱👅 🌻𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 𝐋𝐈𝐍𝐊 🌻:- https://www.facebook.com/profile.php?id=61556298365773",
‎ "জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽",
‎ "কিরে প্রেম করবি তাহলে বস সুমন এর ইনবক্সে গুতা দে 😘🤌 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/profile.php?id=61556298365773",
‎ "জান আমার বস সুমন কে বিয়ে করবা-🙊😘🥳",
‎ "-আন্টি-🙆-আপনার মেয়ে-👰‍♀️-রাতে আমারে ভিদু কল দিতে বলে🫣-🥵🤤💦",
‎ "oii-🥺🥹-এক🥄 চামচ ভালোবাসা দিবা-🤏🏻🙂",
‎ "-আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস সুমন কে দান করেন-🥱🐰🍒",
‎ "-ও মিম ও মিম-😇-তুমি কেন চুরি করলা জান্নাতের ফর্সা হওয়ার ক্রীম-🌚🤧",
‎ "-অনুমতি দিলাম-𝙋𝙧𝙤𝙥𝙤𝙨𝙚 কর বস সুমন কে-🐸😾🔪",
‎ "-𝙂𝙖𝙮𝙚𝙨-🤗-যৌবনের কসম দিয়ে আমারে 𝐁𝐥𝐚𝐜𝐤𝐦𝐚𝐢𝐥 করা হচ্ছে-🥲🤦‍♂️🤧",
‎ "-𝗢𝗶𝗶 আন্টি-🙆‍♂️-তোমার মেয়ে চোখ মারে-🥺🥴🐸",
‎ "তাকাই আছো কেন চুমু দিবা-🙄🐸😘",
‎ "আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇",
‎ "-আমার গল্পে তোমার নানি সেরা-🙊🙆‍♂️🤗",
‎ "কি বেপার আপনি শ্বশুর বাড়িতে যাচ্ছেন না কেন-🤔🥱🌻",
‎ "দিনশেষে পরের 𝐁𝐎𝐖 সুন্দর-☹️🤧",
‎ "-তাবিজ কইরা হইলেও ফ্রেম এক্কান করমুই তাতে যা হই হোক-🤧🥱🌻",
‎ "-ছোটবেলা ভাবতাম বিয়ে করলে অটোমেটিক বাচ্চা হয়-🥱-ওমা এখন দেখি কাহিনী অন্যরকম-😦🙂🌻",
‎ "প্রেম করতে চাইলে বস সুমনের ইনবক্সে চলে যা 😏🐸 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/profile.php?id=61556298365773",
‎ "-আজ একটা বিন নেই বলে ফেসবুকের নাগিন-🤧-গুলোরে আমার বস সমন ধরতে পারছে না-🐸🥲",
‎ "-চুমু থাকতে তোরা বিড়ি খাস কেন বুঝা আমারে-😑😒🐸⚒️",
‎ "—যে ছেড়ে গেছে-😔-তাকে ভুলে যাও-🙂-আমার বস সুমন এর সাথে প্রেম করে তাকে দেখিয়ে দাও-🙈🐸🤗",
‎ "—হাজারো লুচ্চা লুচ্চির ভিরে-🙊🥵আমার বস সুমন এক নিস্পাপ ভালো মানুষ-🥱🤗🙆‍♂️",
‎ "-রূপের অহংকার করো না-🙂❤️চকচকে সূর্যটাও দিনশেষে অন্ধকারে পরিণত হয়-🤗💜",
‎ "সুন্দর মাইয়া মানেই-🥱আমার বস সুমন'র বউ-😽🫶আর বাকি গুলো আমার বেয়াইন-🙈🐸🤗",
‎ "এত অহংকার করে লাভ নেই-🌸মৃত্যুটা নিশ্চিত শুধু সময়টা অ'নিশ্চিত-🖤🙂",
‎ "-দিন দিন কিছু মানুষের কাছে অপ্রিয় হয়ে যাইতেছি-🙂😿🌸",
‎ "ভালোবাসার নামক আবলামি করতে চাইলে বস সুমনের ইনবক্সে গুতা দিন\nমেয়ে হলে বস সুমন ইনবক্সে চলে যা 🤭🤣😼 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/profile.php?id=61556298365773",
‎ "হুদাই আমারে শয়তানে লারে-😝😑☹️"
‎ "-𝗜 𝗟𝗢𝗩𝗘 𝗬𝗢𝗨-😽-আহারে ভাবছো তোমারে প্রোপজ করছি-🥴-থাপ্পর দিয়া কিডনী লক করে দিব-😒-ভুল পড়া বের করে দিবো-🤭🐸",
‎ "-আমি একটা দুধের শিশু-😇-🫵𝗬𝗢𝗨🐸💦",
‎ "-কতদিন হয়ে গেলো বিছনায় মুতি না-😿-মিস ইউ নেংটা কাল-🥺🤧",
‎ "-বালিকা━👸-𝐃𝐨 𝐲𝐨𝐮-🫵-বিয়া-𝐦𝐞-😽-আমি তোমাকে-😻-আম্মু হইতে সাহায্য করব-🙈🥱",
‎ "-এই আন্টির মেয়ে-🫢🙈-𝐔𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐚𝐡-😽🫶-আসলেই তো স্বাদ-🥵💦-এতো স্বাদ কেন-🤔-সেই স্বাদ-😋",
‎ "-ইস কেউ যদি বলতো-🙂-আমার শুধু তোমাকেই লাগবে-💜🌸",
‎ "-ওই বেডি তোমার বাসায় না আমার বস সুমন মেয়ে দেখতে গেছিলো-🙃-নাস্তা আনারস আর দুধ দিছো-🙄🤦‍♂️-বইন কইলেই তো হয় বয়ফ্রেন্ড আছে-🥺🤦‍♂-আমার বস সুমন কে জানে মারার কি দরকার-🙄🤧",
‎ "-একদিন সে ঠিকই ফিরে তাকাবে-😇-আর মুচকি হেসে বলবে ওর মতো আর কেউ ভালবাসেনি-🙂😅",
‎ "-হুদাই গ্রুপে আছি-🥺🐸-কেও ইনবক্সে নক দিয়ে বলে না জান তোমারে আমি অনেক ভালোবাসি-🥺🤧",
‎ "কি'রে গ্রুপে দেখি একটাও বেডি নাই-🤦‍🥱💦",
‎ "-দেশের সব কিছুই চুরি হচ্ছে-🙄-শুধু আমার বস সুমন এর মনটা ছাড়া-🥴😑😏",
‎ "-🫵তোমারে প্রচুর ভাল্লাগে-😽-সময় মতো প্রপোজ করমু বুঝছো-🔨😼-ছিট খালি রাইখো- 🥱🐸🥵",
‎ "-আজ থেকে আর কাউকে পাত্তা দিমু না -!😏-কারণ আমি ফর্সা হওয়ার ক্রিম কিনছি -!🙂🐸"
        ];
        const msg = ran[Math.floor(Math.random() * ran.length)];

        return api.sendMessage({
          body: `${name}\n\n${msg}`,
          mentions: [{ tag: name, id: event.senderID }]
        }, event.threadID, (err, info) => {
          global.client.handleReply.push({
            name: module.exports.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.threadID
          });
        }, event.messageID);
      }

      // যদি লেখা থাকে → GitHub থেকে API লিংক নিয়ে উত্তর দাও
      await sendAnswer(api, event.threadID, event.messageID, contentAfterPrefix);
    }
  } catch (err) {
    console.error("HandleEvent Error:", err);
    api.sendMessage("⚠️ কিছু একটা সমস্যা হইছে!", event.threadID, event.messageID);
  }
};
