document.addEventListener("DOMContentLoaded", () => {
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      localStorage.setItem(
        "cardSystem_sidebar",
        sidebar.classList.contains("collapsed") ? "collapsed" : "expanded",
      );
    });
  }

  function showCustomAlert(message) {
    document.getElementById("alertModalText").innerHTML = message;
    document.getElementById("alertModal").classList.add("show");
  }
  document.getElementById("closeAlertBtn").addEventListener("click", () => {
    document.getElementById("alertModal").classList.remove("show");
  });

  function showCustomConfirm(message, onConfirm) {
    document.getElementById("confirmModalText").innerHTML = message;
    const modal = document.getElementById("confirmModal");
    modal.classList.add("show");

    const okBtn = document.getElementById("okConfirmBtn");
    const cancelBtn = document.getElementById("cancelConfirmBtn");

    const newOkBtn = okBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOkBtn, okBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    newCancelBtn.addEventListener("click", () => {
      modal.classList.remove("show");
    });
    newOkBtn.addEventListener("click", () => {
      modal.classList.remove("show");
      onConfirm();
    });
  }

  window.photos = {};

  const cardCountInput = document.getElementById("cardCount");
  const btnGenerateForms = document.getElementById("btnGenerateForms");
  const formsContainer = document.getElementById("formsContainer");
  const formActions = document.getElementById("formActions");

  // 💡 ฟังก์ชันเรนเดอร์แบบฟอร์ม 2 ภาษา
  function renderForms(count) {
    formsContainer.innerHTML = "";
    window.photos = {};

    // ตรวจสอบว่าผู้ใช้เลือกประเภทบัตรแบบไหน
    const cardTypeElement = document.querySelector(
      'input[name="cardType"]:checked',
    );
    const cardType = cardTypeElement ? cardTypeElement.value : "domestic";

    for (let i = 1; i <= count; i++) {
      let formFieldsHTML = "";

      // ถ้าเป็นแบบในประเทศ
      if (cardType === "domestic") {
        formFieldsHTML = `
                    <div class="form-group col-2">
                        <label>คำนำหน้า <span class="req">*</span></label>
                        <select class="form-control" id="prefix_${i}" required>
                            <option value="นาย">นาย</option>
                            <option value="นาง">นาง</option>
                            <option value="นางสาว">นางสาว</option>
                        </select>
                    </div>
                    <div class="form-group col-5">
                        <label>ชื่อ <span class="req">*</span></label>
                        <input type="text" class="form-control" id="fname_${i}" placeholder="ชื่อ" required />
                    </div>
                    <div class="form-group col-5">
                        <label>นามสกุล <span class="req">*</span></label>
                        <input type="text" class="form-control" id="lname_${i}" placeholder="นามสกุล" required />
                    </div>
                    <div class="form-group col-6">
                        <label>เลขบัตรประจำตัวประชาชน <span class="req">*</span></label>
                        <input type="text" class="form-control idcard-input" id="idcard_${i}" maxlength="17" placeholder="X XXXX XXXXX XX X" required />
                    </div>
                    
                    <div class="form-group col-6">
                        <label>เลขทะเบียนที่ <span class="req">*</span></label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="text" class="form-control" id="regId_${i}" placeholder="ใส่เลขทะเบียน เช่น 47471300" required style="flex: 1;" />
                            <span style="font-size: 20px; color: var(--text-gray);">/</span>
                            <input type="text" class="form-control" id="regYear_${i}" placeholder="พ.ศ." required style="width: 80px; text-align: center;" maxlength="4" />
                        </div>
                    </div>
                `;
      }
      // ถ้าเป็นแบบต่างประเทศ (ภาษาอังกฤษ)
      else {
        formFieldsHTML = `
                    <div class="form-group col-2">
                        <label>Prefix <span class="req">*</span></label>
                        <select class="form-control" id="prefix_${i}" required>
                            <option value="Mr.">Mr.</option>
                            <option value="Mrs.">Mrs.</option>
                            <option value="Miss">Miss</option>
                        </select>
                    </div>
                    <div class="form-group col-5">
                        <label>Name (English) <span class="req">*</span></label>
                        <input type="text" class="form-control" id="fname_${i}" placeholder="Volunteer" required />
                    </div>
                    <div class="form-group col-5">
                        <label>Surname (English) <span class="req">*</span></label>
                        <input type="text" class="form-control" id="lname_${i}" placeholder="Thailand" required />
                    </div>
                    <div class="form-group col-6">
                        <label>Passport No. <span class="req">*</span></label>
                        <input type="text" class="form-control" id="passport_${i}" placeholder="D111111" required />
                    </div>
                    <div class="form-group col-6">
                        <label>Address (City/Country) <span class="req">*</span></label>
                        <input type="text" class="form-control" id="address_${i}" placeholder="Berlin Germany" required />
                    </div>
                    
                    <div class="form-group col-12">
                        <label>Number (เลขทะเบียนที่) <span class="req">*</span></label>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="text" class="form-control" id="regId_${i}" placeholder="0001" required style="flex: 1;" />
                            <span style="font-size: 20px; color: var(--text-gray);">/</span>
                            <input type="text" class="form-control" id="regYear_${i}" placeholder="Year" required style="width: 80px; text-align: center;" maxlength="4" />
                        </div>
                    </div>
                `;
      }

      const formHTML = `
                <div class="user-form-block" style="border: 1px solid var(--border-color); padding: 25px; border-radius: 12px; margin-bottom: 25px; background: #fff;">
                    <h4 style="color: var(--primary-pink); margin-bottom: 20px; font-size: 16px; border-bottom: 1px dashed #eee; padding-bottom: 10px;">
                        <i class="fa-solid fa-user-pen"></i> ข้อมูลคนที่ ${i} 
                        <span style="font-size:12px; color:#888; font-weight:normal; margin-left: 10px;">${cardType === "domestic" ? "" : ""}</span>
                    </h4>
                    
                    <div class="form-grid">
                        ${formFieldsHTML}
                    </div>

                    <div class="photo-upload-section" style="margin-top: 20px;">
                        <div class="photo-preview">
                            <i class="fa-solid fa-user" style="font-size: 40px" id="photoPlaceholder_${i}"></i>
                            <img id="photoPreviewImg_${i}" src="" alt="Preview" />
                        </div>
                        <div class="upload-box" onclick="document.getElementById('photoInput_${i}').click()">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                            <p>คลิกเพื่อเลือกรูปภาพคนที่ ${i}</p>
                            <span>รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 2 MB</span>
                            <input type="file" id="photoInput_${i}" accept="image/png, image/jpeg" style="display: none" onchange="handlePhotoUpload(event, ${i})" />
                        </div>
                    </div>
                </div>
            `;
      formsContainer.insertAdjacentHTML("beforeend", formHTML);
    }
    formActions.style.display = "flex";
  }

  renderForms(1);

  // เปลี่ยนประเภทบัตรปุ๊บ สั่งสร้างฟอร์มใหม่ทันที
  document.querySelectorAll('input[name="cardType"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const count = parseInt(cardCountInput.value) || 1;
      renderForms(count);
    });
  });

  if (btnGenerateForms) {
    btnGenerateForms.addEventListener("click", () => {
      const count = parseInt(cardCountInput.value);
      if (count > 0 && count <= 50) {
        renderForms(count);
      } else {
        showCustomAlert("กรุณาระบุจำนวนระหว่าง 1 ถึง 50 ใบ");
      }
    });
  }

  window.handlePhotoUpload = function (event, index) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showCustomAlert("ขนาดไฟล์รูปภาพใหญ่เกิน 2 MB ครับ");
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById(`photoPreviewImg_${index}`).src =
          e.target.result;
        document.getElementById(`photoPreviewImg_${index}`).style.display =
          "block";
        document.getElementById(`photoPlaceholder_${index}`).style.display =
          "none";
        window.photos[index] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  if (formsContainer) {
    formsContainer.addEventListener("input", function (e) {
      if (e.target.classList.contains("idcard-input")) {
        let inputStr = e.target.value.replace(/\D/g, "");
        let formatted = "";
        if (inputStr.length > 0) formatted += inputStr.substring(0, 1);
        if (inputStr.length > 1) formatted += " " + inputStr.substring(1, 5);
        if (inputStr.length > 5) formatted += " " + inputStr.substring(5, 10);
        if (inputStr.length > 10) formatted += " " + inputStr.substring(10, 12);
        if (inputStr.length > 12) formatted += " " + inputStr.substring(12, 13);
        e.target.value = formatted;
      }
    });
  }

  function getUsersData() {
    let usersArray = [];
    const count = parseInt(cardCountInput.value) || 1;
    const cardTypeElement = document.querySelector(
      'input[name="cardType"]:checked',
    );
    const cardType = cardTypeElement ? cardTypeElement.value : "domestic";

    let incompleteUsers = [];
    let invalidIdCardUsers = [];

    for (let i = 1; i <= count; i++) {
      const prefix = document.getElementById(`prefix_${i}`).value;
      const fname = document.getElementById(`fname_${i}`).value.trim();
      const lname = document.getElementById(`lname_${i}`).value.trim();
      
      const baseRegId = document.getElementById(`regId_${i}`).value.trim();
      const regYear = document.getElementById(`regYear_${i}`).value.trim();
      const regId = baseRegId ? baseRegId + "/" + regYear : "";

      const photo = window.photos[i] || "";

      let idcard = "";
      let passport = "";
      let address = "";

      if (cardType === "domestic") {
        idcard = document.getElementById(`idcard_${i}`).value.trim();
        if (!fname || !lname || !idcard || !regId) {
          incompleteUsers.push(i);
          continue;
        }
        if (idcard.length < 17) {
          invalidIdCardUsers.push(i);
          continue;
        }
      } else {
        passport = document.getElementById(`passport_${i}`).value.trim();
        address = document.getElementById(`address_${i}`).value.trim();
        if (!fname || !lname || !passport || !address || !regId) {
          incompleteUsers.push(i);
          continue;
        }
      }

      const fullName = `${prefix}${fname} ${lname}`;

      usersArray.push({
        uid: "temp_" + Date.now() + "_" + i,
        cardType: cardType,
        name: fullName,
        fullName: fullName,
        prefix: prefix,
        fname: fname,
        lname: lname,
        idCard: idcard,
        passport: passport,
        address: address,
        empId: regId,
        regId: regId,
        district: "-",
        subDistrict: "-",
        img: photo,
      });
    }

    if (incompleteUsers.length > 0 || invalidIdCardUsers.length > 0) {
      let errorMsg = `<div style="background-color: #fff1f0; border: 1px solid #ffccc7; border-radius: 12px; padding: 15px; text-align: left; width: 100%; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">`;

      if (incompleteUsers.length > 0) {
        errorMsg += `
                    <div style="color: #cf1322; font-size: 14px; display: flex; align-items: flex-start; gap: 8px; margin-bottom: ${invalidIdCardUsers.length > 0 ? "12px" : "0"};">
                        <div><span style="font-weight: 600;">กรอกข้อมูลไม่ครบ:</span><br><span style="color: #444; font-size: 13px;">คนที่ ${incompleteUsers.join(", ")}</span></div>
                    </div>`;
      }
      if (invalidIdCardUsers.length > 0) {
        errorMsg += `
                    <div style="color: #cf1322; font-size: 14px; display: flex; align-items: flex-start; gap: 8px;">
                        <div><span style="font-weight: 600;">เลขบัตรไม่ครบ 13 หลัก:</span><br><span style="color: #444; font-size: 13px;">คนที่ ${invalidIdCardUsers.join(", ")}</span></div>
                    </div>`;
      }

      errorMsg += "</div>";
      showCustomAlert(errorMsg);
      return null;
    }
    return usersArray;
  }

  const btnPrintNow = document.getElementById("btnPrintNow");
  if (btnPrintNow) {
    btnPrintNow.addEventListener("click", () => {
      const users = getUsersData();
      if (users && users.length > 0) {
        localStorage.setItem("cardSystem_selectedUsers", JSON.stringify(users));
        window.location.href = "preview-card.html";
      }
    });
  }

  const btnReset = document.getElementById("btnReset");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      showCustomConfirm(
        "คุณต้องการล้างข้อมูลที่กรอกไว้ทั้งหมดใช่หรือไม่?",
        () => {
          const count = parseInt(cardCountInput.value) || 1;
          renderForms(count);
        },
      );
    });
  }
});