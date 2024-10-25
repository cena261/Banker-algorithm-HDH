//Tạo bảng
function columnTable(ch, tableName, tableId, divId) { //Tạo bảng có các cột 

  var resource = document.getElementById("numResource").value;

  var myTableDiv = document.getElementById(divId);
 
  var title = document.createElement('P');
  title.appendChild(document.createTextNode(tableName));
  myTableDiv.appendChild(title);

  var table = document.createElement('TABLE');
  table.id = tableId;

  var tableBody = document.createElement('TBODY');
  table.appendChild(tableBody);

  for (let i = 1; i <= resource; i++) {
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);

    var td = document.createElement('TD');

    td.appendChild(document.createTextNode("Resource " + String.fromCharCode("A".charCodeAt(0) + (i - 1))));
    tr.appendChild(td);

    var td = document.createElement('TD');
    var input = document.createElement("input");
    input.type = "text";
    input.id = ch + i;
    td.appendChild(input);

    tr.appendChild(td);
  }

  myTableDiv.appendChild(table);
}

function gridTable(ch, tableName, tableId, divId) { //Tạo bảng dạng lưới để nhập dữ liệu vào

  var process = document.getElementById("numProcess").value;
  var resource = document.getElementById("numResource").value;

  var myTableDiv = document.getElementById(divId);

  var title = document.createElement('P');
  title.appendChild(document.createTextNode(tableName));
  myTableDiv.appendChild(title);

  var table = document.createElement('TABLE');
  table.id = tableId;

  var tableBody = document.createElement('TBODY');
  table.appendChild(tableBody);

  for (let i = 0; i <= process; i++) {
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);

    for (let j = 0; j <= resource; j++) {
      var td = document.createElement('TD');

      if (i == 0 && j == 0) { //Góc trên cùng bên trái để Reource/Process
        td.appendChild(document.createTextNode("Resource /\nProcess"));
      }
      else if (i == 0) { //Dòng đầu tiên để hiển thị các tài nguyên
        td.appendChild(document.createTextNode(String.fromCharCode("A".charCodeAt(0) + (j - 1))));
      }
      else if (j == 0) { //Cột đầu tiên để hiển thị các tiến trình
        td.appendChild(document.createTextNode("P" + (i - 1)));
      }
      else { //Các ô còn lại để nhập dữ liệu
        var input = document.createElement("input");
        input.type = "text";
        input.id = ch + i + j;
        td.appendChild(input);
      }
      tr.appendChild(td);
    }
  }
  myTableDiv.appendChild(table); //Thêm bảng vào div
}

function safeSequenceTable(ch, tableName, tableId, divId) {//Tạo bảng chuỗi an toàn

  var process = document.getElementById("numProcess").value;

  var myTableDiv = document.getElementById(divId);

  var title = document.createElement('P');
  title.appendChild(document.createTextNode(tableName));
  myTableDiv.appendChild(title);

  var table = document.createElement('TABLE');
  table.id = tableId;

  var tableBody = document.createElement('TBODY');
  table.appendChild(tableBody);

  var tr = document.createElement('TR');
  tableBody.appendChild(tr);

  for (let i = 1; i <= process; i++) {

    var td = document.createElement('TD');

    var input = document.createElement("input");
    input.type = "text";
    input.id = ch + i;
    td.appendChild(input);

    tr.appendChild(td);
  }

  myTableDiv.appendChild(table);
}

function createTables() { //Tạo bảng

  //event.preventDefault();
  var process = document.getElementById("numProcess").value;
  var resource = document.getElementById("numResource").value;

  if (!process) {
    alert('Nhập số lượng tiến trình')
    return;
  }

  if (!resource) {
    alert('Nhập loại tài nguyên')
    return;
  }

  columnTable('r', 'Bảng tài nguyên', 'resourceTable', 'allTables');
  gridTable('a', 'Bảng cấp phát (Allocation)', 'allocationTable', 'allTables');
  gridTable('m', 'Bảng Max', 'maximumTable', 'allTables');

  document.getElementById("createTables").disabled = true;
  document.getElementById("findNeed").disabled = false;

}

function isValid() { //Kiểm tra dữ liệu nhập vào có hợp lệ không

  var process = document.getElementById("numProcess").value;
  var resource = document.getElementById("numResource").value;

  for (var i = 1; i <= resource; i++) {
    var res = document.getElementById('r' + i).value; 

    if (!res) {
      return false;
    }

    var allocate1 = 0;

    for (var j = 1; j <= process; j++) {
      allocate1 += Number(document.getElementById('a' + j + i).value);
      var max = document.getElementById('m' + j + i).value;
      var allocate2 = document.getElementById('a' + j + i).value;

      if (!allocate2 || !max) {
        return false;
      }

      if (max < allocate2)
        return false;
    }

    if (allocate1 > res)
      return false;
  }

  return true;
}
//Tim need
function calculateNeed() {

  var process = document.getElementById("numProcess").value;
  var resource = document.getElementById("numResource").value;

  for (var i = 1; i <= process; i++) {

    for (var j = 1; j <= resource; j++) {

      var max = document.getElementById('m' + i + j).value;
      var allocate = document.getElementById('a' + i + j).value;
      document.getElementById('n' + i + j).value = max - allocate;
      document.getElementById('n' + i + j).disabled = true;
    }
  }

}

function findNeed() {

  var process = document.getElementById("numProcess").value;
  var resource = document.getElementById("numResource").value;

  if (!isValid()) {
    alert('Nhập dữ liệu không hợp lệ')
    reset();
  }

  gridTable('n', 'Bảng Need', 'needTable', 'allTables');
  calculateNeed();

  var ele = document.getElementById('allTables'); 

  for (var i = 1; i <= process; i++) {
    var data = document.createElement('h2');
    data.id = 'needData' + i;

    let str = 'Need (P' + (i-1) + ') = '; 
    str += "Max (";

    for (var j = 1; j <= resource; j++) {
      str += document.getElementById('m' + i + j).value;
      if (j != resource)
        str += ","
      else
        str += ") - ";
    }

    str += "Allocation (";

    for (var j = 1; j <= resource; j++) {
      str += document.getElementById('a' + i + j).value;
      if (j != resource)
        str += ","
      else
        str += ") = (";
    }

    for (var j = 1; j <= resource; j++) {
      str += document.getElementById('n' + i + j).value;
      if (j != resource)
        str += ","
      else
        str += ")";
    }

    data.appendChild(document.createTextNode(str));
    ele.appendChild(data);
  }

  document.getElementById("findNeed").disabled = true;
  document.getElementById("findAvailable").disabled = false;

}
// Tìm available
function calculateAvailable() {

  var process = document.getElementById("numProcess").value;
  var resource = document.getElementById("numResource").value;

  for (var i = 1; i <= resource; i++) {
    var res = document.getElementById('r' + i).value;
    var allocate = 0;

    for (var j = 1; j <= process; j++) {
      allocate += Number(document.getElementById('a' + j + i).value);
    }

    document.getElementById('av' + i).value = res - allocate;
    document.getElementById('av' + i).disabled = true;
  }

}

function findAvailable() {

  var process = document.getElementById("numProcess").value;
  var resource = document.getElementById("numResource").value;

  if (!isValid()) {
    alert(' Dữ liệu không hợp lệ');
    reset();
  }

  columnTable('av', 'Bảng tài nguyên sẵn có (Available)', 'availableTable', 'allTables');
  calculateAvailable();

  var ele = document.getElementById('allTables');

  for (var j = 1; j <= resource; j++) {
    var data = document.createElement('h2');
    data.id = 'availData' + j;

    let str = 'Available (Resource ' + String.fromCharCode("A".charCodeAt(0) + (j - 1)) + ') = Tổng (';
    str += document.getElementById('r' + j).value + ") - Đã cấp phát (";

    for (var i = 1; i <= process; i++) {
      str += document.getElementById('a' + i + j).value;
      if (i != process)
        str += " + "
      else
        str += ") = ";
    }

    str += document.getElementById('av' + j).value;
    data.appendChild(document.createTextNode(str));
    ele.appendChild(data);
  }

  document.getElementById("findAvailable").disabled = true;
  document.getElementById("safeSequence").disabled = false;
}

function reset() {
  location.reload();
}
//Tìm chuỗi an toàn
function safetyAlgorithm(ch, tableName, tableId, divId) { 

  var process = document.getElementById("numProcess").value;
  var resource = document.getElementById("numResource").value;

  let completed = new Array(process); //Mảng kiểm tra tiến trình đã hoàn thành
  let sequence = new Array(process); //Mảng lưu chuỗi an toàn
  let avail = new Array(resource); //Mảng lưu tài nguyên sẵn có

  for (let i = 0; i < process; i++)
    completed[i] = 0;

  for (let i = 1; i <= resource; i++) {
    avail[i - 1] = document.getElementById('av' + i).value;
  }

  var count = 0;

  while (count < process) {

    var done = 0;
    for (let i = 1; i <= process; i++) {

      if (completed[i - 1] == 1)
        continue;

      var flag = 1;

      for (let j = 1; j <= resource; j++) {
        var need = Number(document.getElementById('n' + i + j).value);
        var available = Number(document.getElementById('av' + j).value);

        if (available < need) {
          flag = 0;
          break;
        }
      }

      if (flag == 0) { //Không thể cấp phát tài nguyên, nhảy sang tiến trình tiếp theo
        continue;
      }

      for (let j = 1; j <= resource; j++) {//Cấp phát tài nguyên
        var allocate = document.getElementById('a' + i + j).value;
        var available = document.getElementById('av' + j).value;

        document.getElementById('a' + i + j).value = 0;
        document.getElementById('a' + i + j).disabled = true;
        document.getElementById('av' + j).value = Number(allocate) + Number(available);
      }

      count++;
      sequence[count - 1] = i;

      completed[i - 1] = 1;
      done = 1;
    }

    if (done == 0) {
      return false;
    }
  }

  safeSequenceTable(ch, tableName, tableId, divId);

  for (let i = 1; i <= process; i++) {
    document.getElementById(ch + i).value = sequence[i - 1] - 1; 
    document.getElementById(ch + i).disabled = true;
  }

  var ele = document.getElementById(divId);

  for (var i = 1; i <= process; i++) {
    var data = document.createElement('h2');
    var pro = sequence[i - 1];

    let str = 'P' + (pro - 1) + ' : Need (';

    for (var j = 1; j <= resource; j++) {
      str += document.getElementById('n' + pro + j).value;
      if (j != resource)
        str += ","
      else
        str += ") <= Available (";
    }

    for (var j = 1; j <= resource; j++) {
      str += avail[j - 1];
      if (j != resource)
        str += ","
      else
        str += ") -> Available mới (";
    }

    for (var j = 1; j <= resource; j++) {
      var need = Number(document.getElementById('n' + pro + j).value);
      var max = Number(document.getElementById('m' + pro + j).value);
      avail[j - 1] = Number(avail[j - 1]) + (max - need);

      str += avail[j - 1];
      if (j != resource)
        str += ","
      else
        str += ")";
    }

    data.appendChild(document.createTextNode(str));
    ele.appendChild(data);
  }

  return true;
}

function generateSafeSeq() {

  var process = document.getElementById("numProcess").value;
  var resource = document.getElementById("numResource").value;

  for (let i = 1; i <= process; i++) {
    var data = document.getElementById('needData' + i);
    data.remove();
  }

  for (let i = 1; i <= resource; i++) {
    var data = document.getElementById('availData' + i);
    data.remove();
  }

  if (!safetyAlgorithm('safe', 'Chuỗi an toàn', 'safeSequence', 'allTables')) {
    alert('Chuỗi không an toàn');
    reset();
  }

  document.getElementById("safeSequence").disabled = true;
  document.getElementById("resourceRequest").disabled = false;
}

function getBackToPrevious() { //Tính toán lại bảng Allocation và Available, vì sau khi tính safe sequence, các giá trị đã thay đổi
  // Khi nhập dữ liệu vào thì sẽ tính toán lại bảng Allocation và Available, do đó cần hàm này để quay lại giá trị ban đầu 
  var process = document.getElementById("numProcess").value;
  var resource = document.getElementById("numResource").value;

  for (var i = 1; i <= process; i++) {

    for (var j = 1; j <= resource; j++) {

      var max = document.getElementById('m' + i + j).value;
      var need = document.getElementById('n' + i + j).value;
      document.getElementById('a' + i + j).value = max - need;
      document.getElementById('a' + i + j).disabled = false;
    }
  }

  for (var i = 1; i <= resource; i++) {
    var res = document.getElementById('r' + i).value;
    var allocate = 0;

    for (var j = 1; j <= process; j++) {
      allocate += Number(document.getElementById('a' + j + i).value);
    }

    document.getElementById('av' + i).value = res - allocate;
    document.getElementById('av' + i).disabled = true;
  }

  document.getElementById("findAvailable").disabled = true;
}
//Yêu cầu tài nguyên
function resourceRequest() {

  document.getElementById('resourceRequestPart').style.visibility = 'visible';
  document.getElementById('makeResourceRequest').style.visibility = 'visible';
  cleanChilds('makeResourceRequest');
  document.getElementById('requestProcess').value = "";
  columnTable('req', 'Bảng yêu cầu tài nguyên', 'resourceRequestTable', 'makeResourceRequest');

  getBackToPrevious();
  document.getElementById('checkSafety').disabled = false;
  document.getElementById('resourceRequest').disabled = true;
}

function checkSafeState() {

  var process = document.getElementById("numProcess").value;
  var resource = document.getElementById("numResource").value;

  var reqProcess = document.getElementById('requestProcess').value; //Tiến trình muốn yêu cầu tài nguyên
  reqProcess = Number(reqProcess) + 1; //Process chạy từ P1 -> Pn, còn index của mảng chạy từ 0 -> n-1, nên cần +1

  if (!reqProcess) {
    alert('Nhập tiến trình muốn yêu cầu tài nguyên');
    return;
  }

  if (reqProcess < 0 || reqProcess >= process) {
    alert('Tiến trình không hợp lệ');
    document.getElementById('requestProcess').value = "";
    return;
  }
//Thầy yêu cầu thêm
  var ele = document.getElementById('makeResourceRequest');

  var existingData = document.getElementById('resultOutput');
  if (existingData) {
    existingData.remove();  
  }

  var data = document.createElement('div');
  data.id = 'resultOutput'; 
  
  let str = "Quá trình kiểm tra tiến trình P" + (reqProcess - 1) + ":<br>";
  var flag = true;
  
  for (let i = 1; i <= resource; i++) {
    var request = Number(document.getElementById('req' + i).value);
    var need = Number(document.getElementById('n' + reqProcess + i).value);
    var available = Number(document.getElementById('av' + i).value);
  
    str += "Tài nguyên " + String.fromCharCode("A".charCodeAt(0) + (i - 1)) + 
           ": request = " + request + ", need = " + need + ", available = " + available + "<br>";
  
    if (request > need) {
      str += "Lỗi: request (" + request + ") lớn hơn need (" + need + ") tại tài nguyên " + 
             String.fromCharCode("A".charCodeAt(0) + (i - 1)) + ".<br>";
      flag = false;
      break;
    }
  
    if (request > available) {
      str += "Lỗi: request (" + request + ") lớn hơn available (" + available + ") tại tài nguyên " + 
             String.fromCharCode("A".charCodeAt(0) + (i - 1)) + ".<br>";
      flag = false;
      break;
    }
  }

  if (flag) {
    str += "Yêu cầu hợp lệ: request <= need và request <= available cho tất cả tài nguyên.<br>"; 
  }
  
  data.innerHTML = str;
  
  ele.appendChild(data);
  //end

  for (let i = 1; i <= resource; i++) {
    var newReq = document.getElementById('req' + i).value;
    var prevReq = document.getElementById('a' + reqProcess + i).value;

    document.getElementById('a' + reqProcess + i).value = Number(newReq) + Number(prevReq);
    //cập nhật bảng Allocation
  }

  if (!isValid()) {
    alert('Dữ liệu yêu cầu không hợp lệ');
    for (let i = 1; i <= resource; i++) {
      var newReq = document.getElementById('req' + i).value;
      var prevReq = document.getElementById('a' + reqProcess + i).value;

      document.getElementById('a' + reqProcess + i).value = Number(prevReq) - Number(newReq);
    }
    return;
  } // Kiểm tra dữ liệu yêu cầu có hợp lệ không, nếu không thì trả về giá trị ban đầu

  calculateNeed();
  calculateAvailable();

  if (!safetyAlgorithm('requestSafe', 'Chuỗi an toàn', 'requestSafeSequenceTable', 'makeResourceRequest')) {
   alert('Yêu cầu không hợp lệ, hệ thống không ở trạng thái an toàn');

    getBackToPrevious();

    for (let i = 1; i <= resource; i++) {
      var newReq = document.getElementById('req' + i).value;
      var currReq = document.getElementById('a' + reqProcess + i).value;

      document.getElementById('a' + reqProcess + i).value = Number(currReq) - Number(newReq);
    }

    calculateNeed();
    calculateAvailable();
    cleanChilds('makeResourceRequest');
    document.getElementById('requestProcess').value="";
  } //Kiểm tra xem yêu cầu có hợp lệ không, nếu không thì trả về giá trị ban đầu

  else {
    alert('Yêu cầu hợp lệ, hệ thống vẫn ở trạng thái an toàn');
    getBackToPrevious();

  }

  document.getElementById('checkSafety').disabled = true;
  document.getElementById('resourceRequest').disabled = false;
}

function cleanChilds(elementId) { //Xóa các phần tử con của một phần tử
  var element = document.getElementById(elementId); // Lấy phần tử HTML có ID là elementId

  var child = element.lastElementChild; // Lấy phần tử con cuối cùng của element
  while (child) {
    element.removeChild(child); // Xóa phần tử con cuối cùng
    child = element.lastElementChild; // Cập nhật phần tử con cuối cùng
  }
}

