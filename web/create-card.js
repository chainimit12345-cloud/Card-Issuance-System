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
    if (message) {
      document.getElementById("alertModalText").innerHTML = message;
    }
    document.getElementById("alertModal").classList.add("show");
  }

  const closeAlertBtn = document.getElementById("closeAlertBtn");
  if (closeAlertBtn) {
    closeAlertBtn.addEventListener("click", () => {
      document.getElementById("alertModal").classList.remove("show");
    });
  }

  const DATABASE_FILE = "ข้อมูล อพม.สกลนคร/data01.xlsx";

  const subDistrictMap = {
    เมืองสกลนคร: [
      "ธาตุเชิงชุม",
      "ขมิ้น",
      "งิ้วด่อน",
      "โนนหอม",
      "เชียงเครือ",
      "ท่าแร่",
      "ม่วงลาย",
      "ดงชน",
      "ห้วยยาง",
      "พังขว้าง",
      "ดงมะไฟ",
      "ธาตุนาเวง",
      "เหล่าปอแดง",
      "หนองลาด",
      "ฮางโฮง",
      "โคกก่อง",
    ],
    กุสุมาลย์: ["กุสุมาลย์", "นาโพธิ์", "นาเพียง", "โพธิไพศาล", "อุ่มจาน"],
    กุดบาก: ["กุดบาก", "กุดไฮ", "นาม่อง"],
    พรรณานิคม: [
      "พรรณา",
      "วังยาง",
      "พอกน้อย",
      "นาหัวบ่อ",
      "นาใน",
      "ไร่",
      "ช้างมิ่ง",
      "บะฮี",
      "เชิงชุม",
      "สว่าง",
    ],
    พังโคน: ["พังโคน", "แร่", "ม่วงไข่", "ไฮหย่อง", "ต้นผึ้ง"],
    วาริชภูมิ: ["วาริชภูมิ", "ปลาโหล", "หนองลาด", "คำบ่อ", "ค้อเขียว"],
    นิคมน้ำอูน: ["หนองปลิง", "นิคมน้ำอูน", "สุวรรณคาม", "หนองบัว"],
    วานรนิวาส: [
      "วานรนิวาส",
      "เดื่อศรีคันไชย",
      "ขัวก่าย",
      "หนองสนม",
      "คูสะคาม",
      "ธาตุ",
      "หนองแวง",
      "ศรีวิชัย",
      "นาซอ",
      "อินทร์แปลง",
      "นาคำ",
      "คอนสวรรค์",
      "กุดเรือคำ",
      "หนองแวงใต้",
    ],
    คำตากล้า: ["คำตากล้า", "หนองบัวสิม", "นาแต้", "แพด"],
    บ้านม่วง: [
      "ม่วง",
      "มาย",
      "ดงหม้อทอง",
      "ดงเหนือ",
      "ดงหม้อทองใต้",
      "ห้วยหลัว",
      "โนนสะอาด",
      "หนองกวั่ง",
      "บ่อแก้ว",
    ],
    อากาศอำนวย: [
      "อากาศ",
      "โพนแพง",
      "วาใหญ่",
      "โพนงาม",
      "ท่าก้อน",
      "นาฮี",
      "บะหว้า",
      "สามัคคีพัฒนา",
    ],
    สว่างแดนดิน: [
      "สว่างแดนดิน",
      "คำสะอาด",
      "บ้านต้าย",
      "บงเหนือ",
      "โพนสูง",
      "โคกสี",
      "หนองหลวง",
      "บงใต้",
      "ค้อใต้",
      "พันนา",
      "แวง",
      "ทรายมูล",
      "ตาลโกน",
      "ตาลเนิ้ง",
      "ธาตุทอง",
      "บ้านถ่อน",
    ],
    ส่องดาว: ["ส่องดาว", "ท่าศิลา", "วัฒนา", "ปทุมวาปี"],
    เต่างอย: ["เต่างอย", "บึงทวาย", "นาตาล", "จันทร์เพ็ญ"],
    โคกศรีสุพรรณ: ["ตองโขบ", "เหล่าโพนค้อ", "ด่านม่วงคำ", "แมดนาท่ม"],
    เจริญศิลป์: ["บ้านเหล่า", "เจริญศิลป์", "ทุ่งแก", "โคกศิลา", "หนองแปน"],
    โพนนาแก้ว: ["บ้านโพน", "นาแก้ว", "นาตงวัฒนา", "บ้านแป้น", "เชียงสือ"],
    ภูพาน: ["สร้างค้อ", "หลุบเลา", "โคกภู", "กกปลาซิว"],
  };

  let allUserData = [];
  let filteredData = [];
  let currentPage = 1;
  const itemsPerPage = 30;
  const selectedUsersMap = new Map();

  function attachCheckboxEvents() {
    const checkboxes = document.querySelectorAll(".user-checkbox");
    const selectAllBtn = document.getElementById("selectAll");

    checkboxes.forEach((cb) => {
      cb.addEventListener("change", (e) => {
        const uniqueId = cb.getAttribute("data-uid");
        if (cb.checked) {
          cb.closest(".list-item").classList.add("selected");
          selectedUsersMap.set(uniqueId, {
            name: cb.getAttribute("data-name"),
            empId: cb.getAttribute("data-emp"),
            dept: cb.getAttribute("data-dept"),
            idCard: cb.getAttribute("data-idcard"),
            img: cb.getAttribute("data-img"),
          });
        } else {
          cb.closest(".list-item").classList.remove("selected");
          selectedUsersMap.delete(uniqueId);
        }
        updateSelectedCountUI();
        updateSelectAllState();
      });
    });

    if (selectAllBtn) {
      selectAllBtn.addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        checkboxes.forEach((cb) => {
          cb.checked = isChecked;
          const uniqueId = cb.getAttribute("data-uid");
          if (isChecked) {
            cb.closest(".list-item").classList.add("selected");
            selectedUsersMap.set(uniqueId, {
              name: cb.getAttribute("data-name"),
              empId: cb.getAttribute("data-emp"),
              dept: cb.getAttribute("data-dept"),
              idCard: cb.getAttribute("data-idcard"),
              img: cb.getAttribute("data-img"),
            });
          } else {
            cb.closest(".list-item").classList.remove("selected");
            selectedUsersMap.delete(uniqueId);
          }
        });
        updateSelectedCountUI();
      });
    }
    updateSelectAllState();
  }

  function updateSelectAllState() {
    const checkboxes = document.querySelectorAll(".user-checkbox");
    const selectAllBtn = document.getElementById("selectAll");
    if (!selectAllBtn || checkboxes.length === 0) return;
    const allChecked = Array.from(checkboxes).every((cb) => cb.checked);
    selectAllBtn.checked = allChecked;
  }

  function updateSelectedCountUI() {
    document.getElementById("selectedCountNum").innerText =
      selectedUsersMap.size;
  }

  document.getElementById("clearBtn").addEventListener("click", () => {
    selectedUsersMap.clear();
    const checkboxes = document.querySelectorAll(".user-checkbox");
    checkboxes.forEach((cb) => {
      cb.checked = false;
      cb.closest(".list-item").classList.remove("selected");
    });
    updateSelectAllState();
    updateSelectedCountUI();
  });

  function renderPagination(totalItems, totalPages) {
    const paginationContainer = document.getElementById("paginationControls");
    if (totalPages <= 1) {
      paginationContainer.innerHTML = "";
      return;
    }

    let html = "";
    html += `<button class="page-btn" onclick="window.changePage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}><i class="fa-solid fa-chevron-left"></i></button>`;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

    for (let i = startPage; i <= endPage; i++) {
      if (i === currentPage) {
        html += `<button class="page-btn active">${i}</button>`;
      } else {
        html += `<button class="page-btn" onclick="window.changePage(${i})">${i}</button>`;
      }
    }
    html += `<button class="page-btn" onclick="window.changePage(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}><i class="fa-solid fa-chevron-right"></i></button>`;
    paginationContainer.innerHTML = html;
  }

  window.changePage = function (page) {
    currentPage = page;
    renderTable(filteredData);
  };

  function renderTable(dataArray) {
    const userList = document.getElementById("userList");
    const totalItemsCountLabel = document.getElementById("totalUserCount");

    if (dataArray.length === 0) {
      userList.innerHTML = `<div class="loading-state">ไม่พบข้อมูลผู้รับบัตรที่ค้นหา</div>`;
      totalItemsCountLabel.innerText = 0;
      renderPagination(0, 0);
      return;
    }

    const totalItems = dataArray.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = dataArray.slice(startIndex, endIndex);

    let tableHTML = `
            <div class="list-header">
                <input type="checkbox" id="selectAll">
                <div>รหัส / ทะเบียน</div>
                <div>เลขบัตรประชาชน</div>
                <div>ชื่อ - สกุล</div>
                <div>ตำบล</div>
                <div>อำเภอ</div>
            </div>
        `;

    pageData.forEach((user) => {
      let iconHtml = "";
      if (user.img && user.img.trim() !== "") {
        iconHtml = `<div class="user-icon-box" style="overflow: hidden; border: 1px solid #ddd; background: white;"><img src="${user.img}" style="width: 100%; height: 100%; object-fit: cover;"></div>`;
      } else if (user.isFemale) {
        iconHtml = `<div class="user-icon-box female"><i class="fa-solid fa-person-dress"></i></div>`;
      } else if (user.isMale) {
        iconHtml = `<div class="user-icon-box male"><i class="fa-solid fa-person"></i></div>`;
      } else {
        iconHtml = `<div class="user-icon-box neutral"><i class="fa-solid fa-user"></i></div>`;
      }

      let subDistText =
        user.subDistrict && user.subDistrict !== "-"
          ? `ต.${user.subDistrict}`
          : "-";
      let distText =
        user.district && user.district !== "-" ? `อ.${user.district}` : "-";

      const isChecked = selectedUsersMap.has(user.uid) ? "checked" : "";
      const isSelectedClass = selectedUsersMap.has(user.uid) ? "selected" : "";

      tableHTML += `
                <div class="list-item ${isSelectedClass}">
                    <input type="checkbox" class="user-checkbox" ${isChecked}
                        data-uid="${user.uid}"
                        data-name="${user.fullName}" 
                        data-emp="${user.regId}" 
                        data-dept="${user.district}" 
                        data-idcard="${user.idCard}" 
                        data-img="${user.img || ""}">
                    
                    <div style="color: var(--text-gray); font-weight: 500;">${user.regId}</div>
                    <div>${user.idCard}</div>

                    <div class="user-col" style="display: flex; align-items: center; gap: 10px;">
                        ${iconHtml}
                        <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500;">
                            ${user.fullName}
                        </span>
                    </div>
                    
                    <div style="color: var(--text-gray);">${subDistText}</div>
                    <div>${distText}</div>
                </div>
            `;
    });

    userList.innerHTML = tableHTML;
    totalItemsCountLabel.innerText = totalItems;
    renderPagination(totalItems, totalPages);
    attachCheckboxEvents();
  }

  function filterData() {
    let districtFilter = document.getElementById("districtFilter").value;
    const subDistrictFilter =
      document.getElementById("subDistrictFilter").value;
    const searchName = document
      .getElementById("searchName")
      .value.toLowerCase();
    const searchRegId = document
      .getElementById("searchRegId")
      .value.toLowerCase();
    const searchIdCard = document
      .getElementById("searchIdCard")
      .value.toLowerCase();

    if (districtFilter === "เมือง" || districtFilter === "อำเภอเมือง") {
      districtFilter = "เมืองสกลนคร";
    }

    filteredData = allUserData.filter((user) => {
      let matchDistrict = true;
      if (districtFilter !== "ทั้งหมด")
        matchDistrict = user.district.includes(districtFilter);

      let matchSubDistrict = true;
      if (subDistrictFilter !== "ทั้งหมด")
        matchSubDistrict = user.subDistrict.includes(subDistrictFilter);

      let matchName = true;
      if (searchName !== "")
        matchName = user.fullName.toLowerCase().includes(searchName);

      let matchRegId = true;
      if (searchRegId !== "")
        matchRegId = user.regId.toLowerCase().includes(searchRegId);

      let matchIdCard = true;
      if (searchIdCard !== "")
        matchIdCard = user.idCard.toLowerCase().includes(searchIdCard);

      return (
        matchDistrict &&
        matchSubDistrict &&
        matchName &&
        matchRegId &&
        matchIdCard
      );
    });

    currentPage = 1;
    renderTable(filteredData);
  }

  document
    .getElementById("districtFilter")
    .addEventListener("change", function () {
      let district = this.value;
      if (district === "เมือง" || district === "อำเภอเมือง") {
        district = "เมืองสกลนคร";
      }

      const subDistrictFilter = document.getElementById("subDistrictFilter");
      subDistrictFilter.innerHTML = '<option value="ทั้งหมด">ทั้งหมด</option>';

      if (subDistrictMap[district]) {
        subDistrictMap[district].forEach((sub) => {
          const option = document.createElement("option");
          option.value = sub;
          option.textContent = sub;
          subDistrictFilter.appendChild(option);
        });
      }
      filterData();
    });

  // 💡 ลบ eventListener ที่ผูกติดกับปุ่ม filterBtn ออกแล้ว
  document
    .getElementById("subDistrictFilter")
    .addEventListener("change", filterData);
  document.getElementById("searchName").addEventListener("input", filterData);
  document.getElementById("searchRegId").addEventListener("input", filterData);
  document.getElementById("searchIdCard").addEventListener("input", filterData);

  async function autoLoadExcelData() {
    allUserData = [];
    let indexCounter = 0;

    try {
      let response;
      try {
        response = await fetch(DATABASE_FILE);
        if (!response.ok) throw new Error("Not Found");
      } catch (err) {
        console.warn(`ไม่พบไฟล์ฐานข้อมูล: ${DATABASE_FILE}`);
      }

      if (response && response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: "A",
            defval: "",
          });

          if (jsonData && jsonData.length > 0) {
            jsonData.forEach((row) => {
              let colG = (row.G || "").toString().trim();
              let regId = (row.C || "").toString().trim();
              let idCard = (row.D || "").toString().trim();

              const isHeader =
                !colG ||
                colG === "ชื่อ" ||
                colG === "ชื่อตัว" ||
                colG.includes("ชื่อ") ||
                colG.toLowerCase().includes("firstname") ||
                idCard.toLowerCase() === "idcard" ||
                regId.toLowerCase() === "registerno";

              if (isHeader) return;

              let prefix = (row.F || "").toString().trim();
              let firstName = colG;
              let lastName = (row.H || "").toString().trim();
              let subDistrict = (row.R || "").toString().trim();
              let district = (row.S || "").toString().trim();

              if (!district || district === "") {
                district = sheetName.trim();
              }

              district = district
                .replace(/^อ\./, "")
                .replace(/^อำเภอ/, "")
                .trim();

              if (district === "เมือง") {
                district = "เมืองสกลนคร";
              }

              if (!district || district === "") district = "-";
              if (!subDistrict || subDistrict === "") subDistrict = "-";
              if (!idCard || idCard === "") idCard = "-";
              if (!regId || regId === "") regId = "-";

              let fullName = `${prefix}${firstName} ${lastName}`.trim();
              if (fullName === "" || fullName === prefix) fullName = "-";

              let isFemale =
                prefix.includes("นาง") ||
                prefix.includes("น.ส.") ||
                prefix.includes("ด.ญ.") ||
                prefix.includes("หญิง");
              let isMale =
                prefix.includes("นาย") ||
                prefix.includes("ด.ช.") ||
                prefix.includes("ชาย");

              if (fullName !== "-" && firstName !== "") {
                indexCounter++;
                allUserData.push({
                  uid: `excel_${indexCounter}_${idCard}`,
                  fullName: fullName,
                  prefix: prefix,
                  regId: regId,
                  idCard: idCard,
                  district: district,
                  subDistrict: subDistrict,
                  isFemale: isFemale,
                  isMale: isMale,
                  img: "",
                });
              }
            });
          }
        });
      }

      if (allUserData.length > 0) {
        filteredData = [...allUserData];
        renderTable(filteredData);
      } else {
        document.getElementById("userList").innerHTML = `
                    <div class="loading-state" style="color: #f94c8b;">
                        ไม่พบข้อมูลในระบบ หรือไม่พบไฟล์ <b>${DATABASE_FILE}</b> ครับ
                    </div>`;
      }
    } catch (error) {
      console.error(error);
    }
  }

  autoLoadExcelData();

  document.getElementById("previewBtn").addEventListener("click", (e) => {
    e.preventDefault();
    const selectedUsers = Array.from(selectedUsersMap.values());

    if (selectedUsers.length === 0) {
      showCustomAlert("กรุณาเลือกผู้รับบัตรอย่างน้อย 1 คนครับ");
      return;
    }

    localStorage.setItem(
      "cardSystem_selectedUsers",
      JSON.stringify(selectedUsers),
    );
    window.location.href = "preview-card.html";
  });
});
