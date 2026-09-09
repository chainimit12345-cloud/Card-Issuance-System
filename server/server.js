const express = require("express");
const path = require("path");
const { exec } = require("child_process");
const os = require("os");

const app = express();

// ==========================================
// ⚙️ Configuration (ตั้งค่าระบบ)
// ==========================================
const PORT = process.env.PORT || 3000;
const WEB_DIR = path.join(__dirname, "../web");

// ==========================================
// 🛡️ Middleware & Routes
// ==========================================
// กำหนดโฟลเดอร์สำหรับให้บริการไฟล์ Static (CSS, JS, Images)
app.use(express.static(WEB_DIR));

// ส่งไฟล์ index.html เมื่อเข้าถึงหน้าแรก
app.get("/", (req, res) => {
  res.sendFile(path.join(WEB_DIR, "index.html"));
});

// ==========================================
// 🛠️ Helper Functions
// ==========================================
/**
 * ฟังก์ชันสำหรับเปิด Google Chrome อัตโนมัติ (รองรับ Windows, Mac, Linux)
 * @param {string} url - URL ที่ต้องการเปิด
 */
const openChrome = (url) => {
  const platform = os.platform();
  let command;

  if (platform === "win32") {
    command = `start chrome "${url}"`; // Windows
  } else if (platform === "darwin") {
    command = `open -a "Google Chrome" "${url}"`; // macOS
  } else {
    command = `google-chrome --no-sandbox "${url}"`; // Linux
  }

  exec(command, (err) => {
    if (err) {
      console.warn(`\n[Warn] ไม่สามารถเปิด Chrome อัตโนมัติได้`);
      console.warn(`กรุณาคลิกหรือ Copy URL นี้ไปเปิดเอง: ${url}\n`);
    }
  });
};

// ==========================================
// 🚀 Start Server
// ==========================================
const server = app.listen(PORT, () => {
  const localUrl = `http://localhost:${PORT}`;

  console.log("\n=========================================");
  console.log(` 🚀 Server is successfully running!`);
  console.log(` 📂 Directory: ${WEB_DIR}`);
  console.log(` 🌐 Local URL: ${localUrl}`);
  console.log("=========================================\n");
  console.log("กำลังเปิด Google Chrome ให้โดยอัตโนมัติ...");
  console.log("💡 กด [ Ctrl + C ] ใน Terminal เพื่อปิด Server\n");

  openChrome(localUrl);
});

// ดักจับ Error กรณีที่ Port ถูกใช้งานอยู่แล้ว
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\n[Error] ไม่สามารถเริ่ม Server ได้ เนื่องจาก Port ${PORT} ถูกใช้งานอยู่`,
    );
    console.error(
      `โปรดปิดโปรแกรมอื่นที่ใช้ Port นี้ หรือเปลี่ยนเลข Port แล้วลองใหม่\n`,
    );
  } else {
    console.error(`\n[Error] เกิดข้อผิดพลาด: ${err.message}\n`);
  }
});
