// =========================================================
// ⚙️ ตั้งค่าผู้ออกบัตร (แก้ไขตรงนี้เมื่อมีการเปลี่ยนผู้ออกบัตร)
// =========================================================
const ISSUER_SETTINGS = {
  signaturePath: "img/ลายเซ็น.png",
  fullName: "(นางสาวแรมรุ้ง วรวัธ)",
  fullNameEng: "(Miss Ramrung Worawat)",
  position: "อธิบดีกรมพัฒนาสังคมและสวัสดิการ",
  positionEng: "Director-General",
};
// =========================================================

// เพิ่ม CSS สำหรับทำช่องข้อความให้แก้ไขได้ และป้องกันการลบจนช่องหายไป
const style = document.createElement("style");
style.innerHTML = `
  .editable-text {
      outline: none;
      transition: all 0.2s;
      border-bottom: 1px dashed #ffb8d2;
      cursor: text;
      display: inline-block;
      min-width: 30px;
      text-align: center;
  }
  .editable-text:empty:before {
      content: "...."; /* ถ้าลบจนหมด จะขึ้นจุดไข่ปลาให้คลิกได้ */
      color: #ccc;
  }
  .editable-text:focus {
      border-bottom: 1px dashed #f94c8b;
      background-color: #fff0f5;
  }
  @media print {
      .editable-text {
          border-bottom: none !important;
          background-color: transparent !important;
      }
      .editable-text:empty:before {
          content: ""; /* ตอนปรินต์ ถ้าช่องว่างให้ซ่อนจุดไข่ปลาไปเลย */
      }
  }
`;
document.head.appendChild(style);

function handleImageUpload(event, index) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgElement = document.getElementById(`img-preview-${index}`);
      const wrapperElement = document.getElementById(`photo-wrapper-${index}`);

      imgElement.src = e.target.result;
      imgElement.style.display = "block";
      wrapperElement.style.border = "none";

      let selectedUsers = JSON.parse(
        localStorage.getItem("cardSystem_selectedUsers") || "[]",
      );
      if (selectedUsers[index]) {
        selectedUsers[index].img = e.target.result;
        localStorage.setItem(
          "cardSystem_selectedUsers",
          JSON.stringify(selectedUsers),
        );
      }
    };
    reader.readAsDataURL(file);
  }
}

function formatIdCard(idString) {
  if (!idString || idString === "-") return idString;
  let cleanId = idString.toString().replace(/\D/g, "");
  if (cleanId.length === 13) {
    return cleanId.replace(
      /(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/,
      "$1 $2 $3 $4 $5",
    );
  }
  return idString;
}

document.addEventListener("DOMContentLoaded", () => {
  const storedData = localStorage.getItem("cardSystem_selectedUsers");
  if (!storedData) {
    window.location.href = "add-user.html";
    return;
  }

  const users = JSON.parse(storedData);
  if (users.length === 0) {
    window.location.href = "add-user.html";
    return;
  }

  const displayArea = document.getElementById("cardDisplayArea");
  displayArea.innerHTML = "";

  const today = new Date();
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const day = today.getDate();
  const month = thaiMonths[today.getMonth()];
  const thaiYear = today.getFullYear() + 543;
  const engYear = today.getFullYear();

  const currentDateStr = `${day} ${month} ${thaiYear}`;
  const currentDateEngStr = `${day} / ${today.getMonth() + 1} / ${engYear}`;

  users.forEach((user, index) => {
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "card-wrapper";

    let imgSrc = user.img && user.img.trim() !== "" ? user.img : "";
    let photoBorder = imgSrc ? "none" : "1px dashed #ccc";

    // ==========================================================
    // 🌟 ลอจิกแยกส่วน ทะเบียน กับ พ.ศ. (ป้องกันการลบข้ามฝั่ง)
    // ==========================================================
    let displayEmpId =
      user.empId && user.empId !== "-" ? user.empId.toString().trim() : "";
    let frontPart = "";
    let yearPart = "";

    if (displayEmpId !== "") {
      let baseId = displayEmpId;

      if (displayEmpId.includes("/")) {
        let parts = displayEmpId.split("/");
        baseId = parts[0].trim();
        yearPart = parts[1].trim();
      }

      if (baseId.startsWith("4747")) {
        baseId = baseId.substring(4);
      }

      frontPart = `4747${baseId}`;
    } else {
      frontPart = `4747`;
    }

    let cardInnerHTML = "";

    // 💡 ถ้าเป็นแบบต่างประเทศ (ภาษาอังกฤษ)
    if (user.cardType === "international") {
      cardInnerHTML = `
            <!-- =================== ด้านหน้าบัตร (ENG) =================== -->
            <div class="card-side" style="padding: 0.35cm 0.6cm 0.35cm 0.35cm; display: flex; gap: 10px;">
                <div style="width: 2.0cm; flex-shrink: 0; display: flex; flex-direction: column; align-items: center;">
                    <div id="photo-wrapper-${index}" class="photo-upload-wrapper" onclick="document.getElementById('upload-photo-${index}').click()" style="border: ${photoBorder}; width: 2.0cm; height: 2.6cm;">
                        <img id="img-preview-${index}" src="${imgSrc}" alt="" style="display: ${imgSrc ? "block" : "none"};">
                        <div class="no-print photo-upload-overlay" style="display: ${imgSrc ? "none" : "flex"};"><i class="fa-solid fa-camera"></i></div>
                    </div>
                    <input type="file" id="upload-photo-${index}" accept="image/*" style="display: none;" onchange="handleImageUpload(event, ${index})">
                    <div style="width: 100%; text-align: center; margin-top: auto;">
                        <div style="border-bottom: 1px dashed #aaaaaa; margin-bottom: 3px;"></div>
                        <div style="font-size: 7px; color: #777;">Signature</div>
                    </div>
                </div>

                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                    <div style="text-align: center; margin-bottom: 4px;">
                        <img src="img/Seal_of_the_Ministry_of_Social_Development_and_Human_Security_(Thailand),_coloured.svg.png" alt="Logo" style="width: 20px; height: 20px; object-fit: contain; margin-bottom: 2px;">
                        <div style="font-size: 8px; font-weight: 700; color: #1a1a1a; line-height: 1.2;">Social Development and Human Security<br>Volunteer Thailand ID Card</div>
                        <div style="font-size: 6.5px; color: #555555; line-height: 1.1; margin-top: 2px;">Ministry of Social Development and Human Security</div>
                    </div>
                    
                    <div style="font-size: 8px; color: #1a1a1a; text-align: left; line-height: 1.6; margin-top: 2px;">
                        <div style="display: flex; white-space: nowrap; overflow: hidden;">
                            <span style="width: 25px; flex-shrink: 0; color: #444; font-weight: 500;">Name</span>
                            <span style="font-weight: 600; font-size: 8.5px;">${user.prefix} ${user.fname}</span>
                            <span style="margin: 0 5px 0 10px; color: #444; font-weight: 500;">Surname</span>
                            <span style="font-weight: 600; font-size: 8.5px; overflow: hidden; text-overflow: ellipsis;">${user.lname}</span>
                        </div>
                        <div style="display: flex; white-space: nowrap; overflow: hidden;">
                            <span style="width: 55px; flex-shrink: 0; color: #444; font-weight: 500;">Passport No.</span>
                            <span style="font-weight: 600; font-size: 8.5px;">${user.passport}</span>
                        </div>
                        <div style="display: flex; white-space: nowrap;">
                            <span style="width: 38px; flex-shrink: 0; color: #444; font-weight: 500;">Address</span>
                            <span style="font-weight: 600; font-size: 8.5px; overflow: hidden; text-overflow: ellipsis;">${user.address}</span>
                        </div>
                    </div>
                    
                    <!-- 🔥 ส่วนลายเซ็น (ปรับขนาดแล้ว) 🔥 -->
                    <div style="text-align: center; margin-top: auto; line-height: 1.15;">
                        <img src="${ISSUER_SETTINGS.signaturePath}" alt="ลายเซ็น" style="height: 24px; object-fit: contain; margin: 0 auto; display: block;" onerror="this.style.display='none'; document.getElementById('fallback-sign-${index}').style.display='block';">
                        <div id="fallback-sign-${index}" style="font-family: 'Brush Script MT', cursive; font-size: 14px; color: #002b5e; transform: rotate(-5deg); display: none;">Signature</div>
                        <div style="font-size: 8.5px; color: #333; margin-top: 1px; font-weight: 600;">${ISSUER_SETTINGS.fullNameEng}</div>
                        <div style="font-size: 7.5px; color: #444;">${ISSUER_SETTINGS.positionEng}</div>
                    </div>
                </div>
            </div>

            <!-- =================== ด้านหลังบัตร (ENG) =================== -->
            <div class="card-side" style="padding: 0.4cm; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                <div style="font-size: 10px; font-weight: 700; color: #1a1a1a; margin-bottom: 2px; line-height: 1.4;">Social Development and Human Security Volunteer (SDHSV)<br>Thailand ID Card</div>
                
                <div style="font-size: 10px; font-weight: 600; color: #1a1a1a; margin-bottom: 20px; margin-top: 5px;">
                    Number 
                    <span style="font-size: 12px; margin-left: 5px;">
                        <span contenteditable="true" class="editable-text" title="คลิกเพื่อแก้ไขตัวเลข">${frontPart}</span> 
                        <span style="margin: 0 1px; color: #1a1a1a; user-select: none;">/</span> 
                        <span contenteditable="true" class="editable-text" title="คลิกเพื่อแก้ไข พ.ศ.">${yearPart}</span>
                    </span>
                </div>
                
                <div style="font-size: 10px; color: #333; line-height: 1.5; margin-bottom: 20px;">
                    Department of Social Development and Welfare
                </div>
                
                <div style="margin-top: 10px; font-size: 9px; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <span style="color: #444;">Date of Issue</span>
                    <span style="color: #1a1a1a; font-weight: 600;">${currentDateEngStr}</span>
                </div>
            </div>
        `;
    }
    // 💡 ถ้าเป็นแบบในประเทศ (ภาษาไทย - แบบเดิม)
    else {
      let displayIdCard = formatIdCard(user.idCard);

      cardInnerHTML = `
            <!-- =================== ด้านหน้าบัตร (TH) =================== -->
            <div class="card-side" style="padding: 0.35cm 0.6cm 0.35cm 0.35cm; display: flex; gap: 10px;">
                <div style="width: 2.0cm; flex-shrink: 0; display: flex; flex-direction: column; align-items: center;">
                    <div id="photo-wrapper-${index}" class="photo-upload-wrapper" onclick="document.getElementById('upload-photo-${index}').click()" style="border: ${photoBorder}; width: 2.0cm; height: 2.6cm;">
                        <img id="img-preview-${index}" src="${imgSrc}" alt="" style="display: ${imgSrc ? "block" : "none"};">
                        <div class="no-print photo-upload-overlay" style="display: ${imgSrc ? "none" : "flex"};"><i class="fa-solid fa-camera"></i></div>
                    </div>
                    <input type="file" id="upload-photo-${index}" accept="image/*" style="display: none;" onchange="handleImageUpload(event, ${index})">
                    <div style="width: 100%; text-align: center; margin-top: auto;">
                        <div style="border-bottom: 1px dashed #aaaaaa; margin-bottom: 3px;"></div>
                        <div style="font-size: 7px; color: #777;">ลายมือชื่อ</div>
                    </div>
                </div>

                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                    <div style="text-align: center; margin-bottom: 4px;">
                        <img src="img/Seal_of_the_Ministry_of_Social_Development_and_Human_Security_(Thailand),_coloured.svg.png" alt="Logo" style="width: 24px; height: 24px; object-fit: contain; margin-bottom: 2px;">
                        <div style="font-size: 13px; font-weight: 700; color: #1a1a1a; line-height: 1.1;">บัตรประจำตัว</div>
                        <div style="font-size: 8px; color: #555555; white-space: nowrap; line-height: 1.1;">อาสาสมัครพัฒนาสังคมและความมั่นคงของมนุษย์</div>
                    </div>
                    
                    <div style="font-size: 8.5px; color: #1a1a1a; text-align: left; line-height: 1.5; margin-top: 3px;">
                        <div style="display: flex; white-space: nowrap; overflow: hidden;">
                            <span style="width: 42px; flex-shrink: 0; color: #666;">ชื่อ-สกุล</span>
                            <span style="font-weight: 600; font-size: 9px; overflow: hidden; text-overflow: ellipsis;">${user.name}</span>
                        </div>
                        <div style="display: flex; white-space: nowrap; overflow: hidden;">
                            <span style="width: 88px; flex-shrink: 0; color: #666;">เลขประจำตัวประชาชน</span>
                            <span style="font-weight: 600; font-size: 9px; letter-spacing: 0.2px;">${displayIdCard}</span>
                        </div>
                        <div style="display: flex; white-space: nowrap;">
                            <span style="width: 42px; flex-shrink: 0; color: #666;">จังหวัด</span>
                            <span style="font-weight: 600; font-size: 9px;">สกลนคร</span>
                        </div>
                    </div>
                    
                    <!-- 🔥 ส่วนลายเซ็น (ปรับขนาดแล้ว) 🔥 -->
                    <div style="text-align: center; margin-top: auto; line-height: 1.15;">
                        <img src="${ISSUER_SETTINGS.signaturePath}" alt="ลายเซ็น" style="height: 24px; object-fit: contain; margin: 0 auto; display: block;" onerror="this.style.display='none'; document.getElementById('fallback-sign-${index}').style.display='block';">
                        <div id="fallback-sign-${index}" style="font-family: 'Brush Script MT', cursive; font-size: 14px; color: #002b5e; transform: rotate(-5deg); display: none;">ลายมือชื่อ</div>
                        <div style="font-size: 8.5px; color: #333; margin-top: 1px; font-weight: 600;">${ISSUER_SETTINGS.fullName}</div>
                        <div style="font-size: 7.5px; color: #444;">${ISSUER_SETTINGS.position}</div>
                        <div style="font-size: 7.5px; color: #444;">ผู้ออกบัตร</div>
                    </div>
                </div>
            </div>

            <!-- =================== ด้านหลังบัตร (TH) =================== -->
            <div class="card-side" style="padding: 0.4cm; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                <div style="font-size: 13px; font-weight: 700; color: #1a1a1a; margin-bottom: 2px;">บัตรประจำตัว</div>
                <div style="font-size: 9px; color: #444; margin-bottom: 2px;">อาสาสมัครพัฒนาสังคมและความมั่นคงของมนุษย์ (อพม.)</div>
                <div style="font-size: 7.5px; color: #777; margin-bottom: 12px;">Social Development and Human Security Volunteer (SDHSV)</div>
                
                <div style="font-size: 9px; color: #666; margin-bottom: 2px;">เลขทะเบียนที่</div>
                
                <div style="font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 12px; letter-spacing: 0.5px; display: flex; justify-content: center; align-items: center;">
                    <span contenteditable="true" class="editable-text" title="คลิกเพื่อแก้ไขตัวเลข">${frontPart}</span>
                    <span style="margin: 0 1px; color: #1a1a1a; user-select: none;">/</span>
                    <span contenteditable="true" class="editable-text" title="คลิกเพื่อแก้ไข พ.ศ.">${yearPart}</span>
                </div>
                
                <div style="font-size: 9px; color: #444; line-height: 1.5; margin-bottom: 12px;">
                    กรมพัฒนาสังคมและสวัสดิการ<br>กระทรวงการพัฒนาสังคมและความมั่นคงของมนุษย์
                </div>
                
                <div style="margin-top: 4px; font-size: 9px; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <span style="color: #555555; font-weight: 500;">วันออกบัตร</span>
                    <span style="color: #1a1a1a; font-weight: 700; border-bottom: 1px dotted #aaaaaa; padding: 0 8px 2px 8px;">${currentDateStr}</span>
                </div>
            </div>
        `;
    }

    cardWrapper.innerHTML = `
        <span class="tag-front no-print">ด้านหน้า</span>
        <div class="fold-line-wrapper no-print"></div>
        <span class="tag-back no-print">ด้านหลัง</span>
        <div class="id-cards-container">
            ${cardInnerHTML}
        </div>
    `;
    displayArea.appendChild(cardWrapper);
  });

  if (document.getElementById("qty")) {
    document.getElementById("qty").value = users.length;
  }
});
