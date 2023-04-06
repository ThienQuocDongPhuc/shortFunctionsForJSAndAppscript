function createFieldToId(idOrName, type, withButton, ask, details, selectCommand) {
  withButton = withButton || 0;
  ask = ask || 0;
  details = details || [];
  selectCommand = selectCommand || '';
  // type gồm có 'select', 'radio', 'checkbox', 'text', 'number', 'date';
  // withButton có hai thuộc tính 0 (không có nút) và 1 (có thêm nút add và remove)
  // ask có hai thuộc tính 0 (nhấn remove thì xóa không cần hỏi) và 1 (nhấn remove thỉ hỏi trước khi xóa)

  var parent = document.getElementById(idOrName);
  var n = parent.childElementCount;

  // Create a container element to hold the input and the button
  var container = document.createElement('div');
  container.classList.add('input-row', 'container'+idOrName+n);
  parent.appendChild(container);

  if (type === 'text' || type === 'number' || type === 'date') {
    var newField = document.createElement('input');
    newField.id = idOrName+'Detail'+n;
    newField.type = type;
    newField.name = idOrName + 's';
    newField.placeholder = idOrName.charAt(0).toUpperCase() + idOrName.slice(1);
    container.appendChild(newField);
  } else if (type === 'select') {
    const newField = document.createElement('select');
    newField.id = idOrName+'Detail'+n;
    newField.name = idOrName + 's';
    container.appendChild(newField);
    if (selectCommand!=''){
      const option = document.createElement('option');
      option.text = selectCommand;
      option.value = selectCommand;
      option.disabled = true;
      option.selected = true;
      newField.add(option);
    }
    for (let detail of details) {
      const option = document.createElement('option');
      option.text = detail;
      option.value = detail;
      newField.add(option);
    }
  } else if (type === 'radio' || type === 'checkbox') {
    for (let detail of details) {
      const newField = document.createElement('input');
      newField.id = idOrName + detail;
      newField.type = type;
      newField.name = idOrName+'Detail'+n;
      newField.value = detail;
      container.appendChild(newField);
      const label = document.createElement('label');
      label.htmlFor = idOrName + detail;
      label.textContent = detail;
      container.appendChild(label);
    }
  }

  if (withButton == 1){
    // Create and add the "add" button
    var addBtn = document.createElement('button');
    addBtn.classList.add('add-btn');
    if (selectCommand != '') {
      addBtn.id = 'add'+ask+'1';
    } else {
      addBtn.id = 'add'+ask;
    }

    addBtn.type = 'button';
    addBtn.textContent = 'Add';
    addBtn.onclick = function() {
      createFieldToId(idOrName, type, withButton, ask, details, selectCommand);
    };
    container.appendChild(addBtn);

    if (n!=0){
      var removeBtn = document.createElement('button');
      removeBtn.classList.add('remove-btn');
      removeBtn.id = 'remove';
      removeBtn.type = 'button';
      removeBtn.textContent = 'Remove';
      removeBtn.onclick = function() {
        if (ask == 1) {
          // Hỏi người dùng trước khi xóa
          var confirmDelete = confirm('Are you sure you want to delete ' + name + '?');            
        }
        if (ask == 0) {
          // Xóa luôn không cần hỏi han gì
          confirmDelete = true;
        }

        if (confirmDelete) {
          container.parentNode.removeChild(container);
        }      
      };
      container.appendChild(removeBtn);
    }
  }
}

function assignDataToElement(selectElement, x) {
  // Nếu element đang là kiểu SELECT
  if (selectElement.tagName.toLowerCase() === 'select') {
    const options = selectElement.options;
    for (let j = 0; j < options.length; j++) {
      const option = options[j];
      if (option.text === x) {
        option.selected = true;
        break;
      }
    }
  } else {
    if (selectElement) {
      // Nếu element đang là kiểu DATE
      if (selectElement.type === "date") {
        try {
          var parts = x.split("-");
          if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
            var tempvalue = parts[2] + "-" + parts[1] + "-" + parts[0];
            selectElement.value = tempvalue;
          }
        } catch {
          // Do nothing
        }

        try {
          var parts = x.split("/");
          if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
            var tempvalue = parts[2] + "-" + parts[1] + "-" + parts[0];
            selectElement.value = tempvalue;
          }
        } catch (error){
          // Do nothing
        }
      } else {
        // Nếu element đang là kiểu TEXT / NUMBER
        try {
          selectElement.value = x;
        } catch (error){
          // Do nothing
        }
      }
    }
  }
}

function assignDataTo(option, idOrName, values) {
  // Option có hai loại là 'id' hoặc 'name'
  // idOrName: nhập id hoặc name tương ứng

  if (option == 'name') {
    const elements = document.getElementsByName(idOrName);
    const y = values; // Dùng cho kiểu radio
    for (let i = 0; i < elements.length; i++) {
      const selectElement = elements[i];
      const x = values[i];

      // Nếu element[i] là kiểu RADIO
      if (selectElement.tagName.toLowerCase() === 'input' && selectElement.type === 'radio') {
        selectElement.checked = false;
        if (selectElement.value === y) {
          selectElement.checked = true;
        } // Nếu element[i] là kiểu CHECKBOX
      } else {
        if (selectElement.tagName.toLowerCase() === 'input' && selectElement.type === 'checkbox') {
          selectElement.checked = false;
          for (let j = 0; j < values.length; j++){
            if (selectElement.value === values[j]) {
              selectElement.checked = true;
            }
          }
        } else {
          // Nếu element[i] là kiểu TEXT / NUMBER / DATE / SELECT
          assignDataToElement(selectElement, x);
        }
      } 
    }
  } else {
    if (option == 'id') {
      const selectElement = document.getElementById(idOrName);
      const x = values;
      assignDataToElement(selectElement, x);
    }
  }
}

function resetValuesFromFieldId(id) {
  const parent = document.getElementById(id);
  var type = parent.children[0].children[0].type;
  // Chuyển select-one thành select cho phù hợp hàm assignDataToElement
  if (type === 'select-one'){type = 'select'}

  const n = parent.childElementCount;
  for (var i = 1; i < n; i++){
    var container = parent.getElementsByClassName('container'+id+i)[0];
    container.parentNode.removeChild(container);
  }

   if (type === 'radio' || type === 'checkbox') {
    var selectElements = document.getElementsByName(id + 'Detail'+'0');
    for (var i = 0; i < selectElements.length; i++) {
      selectElements[i].checked = false;
    }
  } else {
    var selectElement = document.getElementById(id + 'Detail'+'0');
    if (type === 'select') {
      selectElement.selectedIndex = 0;
    } else {
      selectElement.value = "";
    }
  }
}

function assignValuesToFieldId(id, values){
  resetValuesFromFieldId(id);
  var parent = document.getElementById(id);
  var type = parent.children[0].children[0].type;
  var withButton = 0;
  var ask = 0;
  var selectCommand = '';

  // Chuyển select-one thành select cho phù hợp hàm assignDataToElement
  if (type === 'select-one'){type = 'select'}

  // Lấy withButton và ask
  if (type === 'radio' || type === 'checkbox') {
    try {
      var idBtn = parent.children[0].lastElementChild.id;
      if (idBtn === 'add1' || idBtn === 'add11') {
        withButton = 1;
        ask = 1;
      } else if (idBtn === 'add0' || idBtn === 'add01') {
        withButton = 1;
        ask = 0;
      }
    } catch (error) {
      // Do nothing
    }
  } else {
    try {
      var idBtn = parent.children[0].children[1].id;
      if (idBtn === 'add1' || idBtn === 'add11') {
        withButton = 1;
        ask = 1;
      } else if (idBtn === 'add0' || idBtn === 'add01') {
        withButton = 1;
        ask = 0;
      }
    } catch (error) {
      // Do nothing
    }
  }

  // Lấy details và selectCommand
  var details = [];
  if (type === 'select'){
    var selectElement = parent.children[0].children[0];
    try {
      var idBtn = parent.children[0].children[1].id;
      if (idBtn === 'add01' || idBtn === 'add11') {
        selectCommand = selectElement.options[0].text;
      }
    } catch (error) {
      // Do nothing
    }

    const n = selectElement.options.length;
    if (selectCommand === '') {
      for (let i = 0; i < n; i++) {
        details.push(selectElement.options[i].text);
      }
    } else {
      for (let i = 1; i < n; i++) {
        details.push(selectElement.options[i].text);
      }
    }
  } else if (type === 'radio' || type === 'checkbox') {
    var elements = document.getElementsByName(id+'Detail'+'0');
    const n = elements.length;
    for (let i = 0; i < n; i++) {
      details.push(elements[i].value);
    }
  }

  if (Array.isArray(values)) {
    if (type != 'checkbox' || withButton === 1){
      for (var i = 0; i<values.length; i++){
        // createFieldTo(option, id, 'text');
        if (type!='radio' && type!='checkbox'){
          assignDataTo('id', id+'Detail'+i, values[i]);
        } else {
          assignDataTo('name', id+'Detail'+i, values[i]);
        }

        if (i!=values.length-1) {
          createFieldToId(id, type, withButton, ask, details, selectCommand);
        }
      }
    } else {
      assignDataTo('name', id+'Detail'+'0', values);
    }
  } else {
    if (type!='radio' && type!='checkbox') {
      assignDataTo('id', id+'Detail'+'0', values);
    } else {
      assignDataTo('name', id+'Detail'+'0', values);
    }
  }
}

function getDataFromFieldId(id) {
  var parent = document.getElementById(id);
  var type = parent.children[0].children[0].type;
  var withButton = 0;

  // Chuyển select-one thành select cho phù hợp hàm assignDataToElement
  if (type === 'select-one'){type = 'select'}
  const n = parent.childElementCount;

  // Lấy withButton
  if (type === 'radio' || type === 'checkbox') {
    try {
      var idBtn = parent.children[0].lastElementChild.id;
      if (idBtn === 'add1' || idBtn === 'add11' || idBtn === 'add0' || idBtn === 'add01') {
        withButton = 1;
      }
    } catch (error) {
      // Do nothing
    }
  } else {
    try {
      var idBtn = parent.children[0].children[1].id;
      if (idBtn === 'add1' || idBtn === 'add11' || idBtn === 'add0' || idBtn === 'add01') {
        withButton = 1;
      }
    } catch (error) {
      // Do nothing
    }
  }

  function getDataById(id, type) {
    if (type != 'radio' && type != 'checkbox') {
      var selectElement = document.getElementById(id);
      return selectElement.value;
    } else {
      var selectElement = document.getElementsByName(id);
      if (type === 'radio'){
        for (var i = 0; i < selectElement.length; i++) {
          if (selectElement[i].checked) {
            return selectElement[i].value;
          }
        }
      } else if (type === 'checkbox') {
        var array = [];
        for (var i = 0; i < selectElement.length; i++) {
          if (selectElement[i].checked) {
            array.push(selectElement[i].value);                  
          }
        }
        return array;
      }
    }
    return null;
  }

  var array = [];
  if (withButton === 0) {
    return getDataById(id + 'Detail' + '0', type);
  } else if (withButton === 1) {
    for (var i = 0; i < n; i++) {
      array.push(getDataById(id + 'Detail' + i, type));
    }
    return array;
  }
}

// function addOrUpdate() {
//   dataHTMLUpdate = {
//     demo1a: getDataFromFieldId('demo1a'),
//     demo2a: getDataFromFieldId('demo2a'),
//     demo3a: getDataFromFieldId('demo3a'),
//     demo4a: getDataFromFieldId('demo4a'),
//     demo5a: getDataFromFieldId('demo5a'),
//     demo6a: getDataFromFieldId('demo6a'),

//     demo1b: getDataFromFieldId('demo1b'),
//     demo2b: getDataFromFieldId('demo2b'),
//     demo3b: getDataFromFieldId('demo3b'),
//     demo4b: getDataFromFieldId('demo4b'),
//     demo5b: getDataFromFieldId('demo5b'),
//     demo6b: getDataFromFieldId('demo6b'),
//   };

//   google.script.run.addDataToGoogleSheet(dataHTMLUpdate);

//   resetValuesFromFieldId('demo1a');
//   resetValuesFromFieldId('demo2a');
//   resetValuesFromFieldId('demo3a');
//   resetValuesFromFieldId('demo4a');
//   resetValuesFromFieldId('demo5a');
//   resetValuesFromFieldId('demo6a');

//   resetValuesFromFieldId('demo1b');
//   resetValuesFromFieldId('demo2b');
//   resetValuesFromFieldId('demo3b');
//   resetValuesFromFieldId('demo4b');
//   resetValuesFromFieldId('demo5b');
//   resetValuesFromFieldId('demo6b');
// }

function googleScriptRun(funcName, ...args) {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)
      [funcName](...args);
  });
}

// // Xử lý hàm trong đây
// (async () => {
//   const selectData = await googleScriptRun("dataList", "Sheet 1", 1, 1);
//   const radioData = await googleScriptRun("dataList", "Sheet 1", 1, 2);
//   createFieldToId('demo1a', 'text');
//   createFieldToId('demo2a', 'number');
//   createFieldToId('demo3a', 'date');
//   createFieldToId('demo4a', 'select',   withButton=0, ask=0, details=selectData, selectCommand='Chọn đi');
//   createFieldToId('demo5a', 'radio',    withButton=0, ask=0, details=radioData);
//   createFieldToId('demo6a', 'checkbox', withButton=0, ask=0, details=radioData);

//   createFieldToId('demo1b', 'text',     withButton=1, ask=1);
//   createFieldToId('demo2b', 'number',   withButton=1, ask=1);
//   createFieldToId('demo3b', 'date',     withButton=1, ask=1);
//   createFieldToId('demo4b', 'select',   withButton=1, ask=1, details=selectData, selectCommand='Chọn đi');
//   createFieldToId('demo5b', 'radio',    withButton=1, ask=1, details=radioData);
//   createFieldToId('demo6b', 'checkbox', withButton=1, ask=1, details=radioData);

//   assignValuesToFieldId('demo1a', values='a');
//   assignValuesToFieldId('demo2a', values=1);
//   assignValuesToFieldId('demo3a', values='26/10/1992');
//   assignValuesToFieldId('demo4a', values='Option 2');
//   assignValuesToFieldId('demo5a', values='Choice 4');
//   assignValuesToFieldId('demo6a', values=['Choice 4', 'Choice 2']);

//   assignValuesToFieldId('demo1b', values=['a', 'b', 'c']);
//   assignValuesToFieldId('demo2b', values=[1, 2, 3]);
//   assignValuesToFieldId('demo3b', values=['26/10/1922', '30-04-1975', '20/11/2023']);
//   assignValuesToFieldId('demo4b', values=['Option 2', 'Option 5', 'Option 3']);
//   assignValuesToFieldId('demo5b', values=['Choice 4', 'Choice 1', 'Choice 3']);
//   assignValuesToFieldId('demo6b', values=[['Choice 4', 'Choice 1', 'Choice 3'], ['Choice 5', 'Choice 1'], ['Choice 4', 'Choice 2', 'Choice 3']]);

//   // resetValuesFromFieldId('demo1a');
//   // resetValuesFromFieldId('demo2a');
//   // resetValuesFromFieldId('demo3a');
//   // resetValuesFromFieldId('demo4a');
//   // resetValuesFromFieldId('demo5a');
//   // resetValuesFromFieldId('demo6a');

//   // resetValuesFromFieldId('demo1b');
//   // resetValuesFromFieldId('demo2b');
//   // resetValuesFromFieldId('demo3b');
//   // resetValuesFromFieldId('demo4b');
//   // resetValuesFromFieldId('demo5b');
//   // resetValuesFromFieldId('demo6b');

//   console.log(getDataFromFieldId('demo1a'));
//   console.log(getDataFromFieldId('demo2a'));
//   console.log(getDataFromFieldId('demo3a'));
//   console.log(getDataFromFieldId('demo4a'));
//   console.log(getDataFromFieldId('demo5a'));
//   console.log(getDataFromFieldId('demo6a'));

//   console.log(getDataFromFieldId('demo1b'));
//   console.log(getDataFromFieldId('demo2b'));
//   console.log(getDataFromFieldId('demo3b'));
//   console.log(getDataFromFieldId('demo4b'));
//   console.log(getDataFromFieldId('demo5b'));
//   console.log(getDataFromFieldId('demo6b'));
// })();
