document.addEventListener("DOMContentLoaded", () => {
  // 1. ระบบ Sidebar 
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      // บันทึกสถานะลง LocalStorage
      if (sidebar.classList.contains("collapsed")) {
        localStorage.setItem("cardSystem_sidebar", "collapsed");
      } else {
        localStorage.setItem("cardSystem_sidebar", "expanded");
      }
    });
  }

  // 2. ระบบตั้งค่าข้อมูลผู้ออกบัตร
  const uploadInput = document.getElementById("signatureUpload");
  const previewImg = document.getElementById("signaturePreview");
  const noSigText = document.getElementById("noSigText");
  const nameInput = document.getElementById("issuerName");
  const posInput = document.getElementById("issuerPosition");
  
  const localStorageKey = "opm_issuerSettings";

  // โหลดข้อมูลเดิมมาแสดง
  let saved = JSON.parse(localStorage.getItem(localStorageKey) || "{}");
  nameInput.value = saved.issuerName !== undefined ? saved.issuerName : "(นางสาวแรมรุ้ง วรวัธ)";
  posInput.value = saved.issuerPosition !== undefined ? saved.issuerPosition : "อธิบดีกรมพัฒนาสังคมและสวัสดิการ";

  // ดึงรูปล่าสุดมาแสดงแบบถาวร
  if (saved.signatureImg && saved.signatureImg.trim() !== "") {
    previewImg.setAttribute("src", saved.signatureImg);
    previewImg.style.display = "block";
    noSigText.style.display = "none";
  }

  // เมื่อเลือกรูปภาพใหม่ (เพิ่มระบบบีบอัดรูปภาพอัตโนมัติ ป้องกันความจำเต็ม)
  if (uploadInput) {
    uploadInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          
          const img = new Image();
          img.onload = function() {
            // สร้าง Canvas เพื่อทำการย่อขนาดรูป
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 600; // กำหนดความกว้างสูงสุดของลายเซ็น
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            
            // แปลงกลับเป็นรูปภาพที่ถูกบีบอัดแล้ว
            const compressedDataUrl = canvas.toDataURL("image/png", 0.9);
            
            // แสดงตัวอย่างบนหน้าจอ
            previewImg.setAttribute("src", compressedDataUrl);
            previewImg.style.display = "block";
            noSigText.style.display = "none";
          };
          img.src = evt.target.result;

        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ฟังก์ชันลบรูปลายเซ็นทิ้ง
  window.deleteSignature = function () {
    if (confirm("คุณต้องการลบรูปลายเซ็นออกใช่หรือไม่?")) {
      previewImg.removeAttribute("src");
      previewImg.style.display = "none";
      noSigText.style.display = "block";
      uploadInput.value = "";

      let currentSettings = JSON.parse(localStorage.getItem(localStorageKey) || "{}");
      currentSettings.signatureImg = "";
      localStorage.setItem(localStorageKey, JSON.stringify(currentSettings));
    }
  };

  // ฟังก์ชันบันทึกข้อมูล
  window.saveSettings = function () {
    let currentSrc = previewImg.getAttribute("src");
    
    // เคลียร์ค่าว่างหากไม่มีรูป
    if (!currentSrc || currentSrc === window.location.href) {
        currentSrc = "";
    }

    const data = {
      issuerName: nameInput.value.trim(),
      issuerPosition: posInput.value.trim(),
      signatureImg: currentSrc,
    };

    try {
      // ทำการบันทึกลงระบบ
      localStorage.setItem(localStorageKey, JSON.stringify(data));
      
      // แสดง Modal บันทึกสำเร็จ
      const modal = document.getElementById('successModal');
      if (modal) {
        modal.classList.add('show');
      } else {
        alert("✅ บันทึกข้อมูลสำเร็จ!");
      }
    } catch (error) {
      alert("❌ เกิดข้อผิดพลาด! ขนาดรูปภาพอาจจะยังใหญ่เกินไป กรุณาลองใช้รูปอื่นครับ");
      console.error("Storage Error:", error);
    }
  };

  // ฟังก์ชันปิด Modal แจ้งเตือน
  window.closeSuccessModal = function() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('show');
  };
});
