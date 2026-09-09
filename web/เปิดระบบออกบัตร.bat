@echo off
chcp 65001 >nul
echo กำลังเปิดระบบออกบัตร...

:: ค้นหาที่อยู่ของ Google Chrome ในเครื่อง
set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist %CHROME% set CHROME="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if not exist %CHROME% set CHROME="C:\Users\%USERNAME%\AppData\Local\Google\Chrome\Application\chrome.exe"

:: ตรวจสอบว่าเจอ Chrome ไหม
if not exist %CHROME% (
    echo [เกิดข้อผิดพลาด] หาโปรแกรม Google Chrome ในเครื่องไม่เจอครับ!
    echo กรุณาติดตั้ง Chrome หรือตรวจสอบที่อยู่ไฟล์
    pause
    exit
)

:: สั่งเปิดหน้าเว็บพร้อมทะลุกำแพง CORS
start "" %CHROME% --allow-file-access-from-files --user-data-dir="%temp%\CardSystemApp" "%~dp0index.html"

exit