	var Items = {
　　　　	name: "",
　　　　	isCheck: "false",
		isDelete: "false"
	};

	var objArray = [];
	
	var subArray = [];
	
	var submit_flag = true;
	
	var delete_flag = true;
	
	function addElement() {
		submit_flag = true;
		var item = Object.create(Items);
		
		var v = document.getElementById("myTextarea").value;
		item.name = v
		objArray.push(item);
		var body = '<table><tr><th>#</th><th>Name</th></tr>'
		
		for (i = 0; i < objArray.length; i++) {
			var index = i+1;
            body += '<tr>';
            body += '<td>' + index.toString(10) + '</td>';
			//body += '<td>' + '<input type="checkbox" id=\"cb' + i.toString(10) + '\" onclick="isChecked(this);">' + '</td>';
            body += '<td>' + objArray[i].name + '</td>';
			//body += '<td>' + objArray[i].isDelete + '</td>';
			//body += '<td>' + '<input type="button" id=\"btn' + i.toString(10) + '\" onclick="isDeleted(this);">' + '</td>';
            body += '</tr>';
		}
		
        body += '</table></body></html>';
		
		document.getElementById("object_list").innerHTML = body;
		document.getElementById("myTextarea").value = '';
	}
	
	function submit() {
		if (submit_flag == true) {
		submit_flag = false;
		subArray = objArray;
		objArray = [];
		var body = '<table><tr><th>#</th><th>Check Box</th><th>Name</th><th>Delete</th></tr>'
		
		for (i = 0; i < subArray.length; i++) {
			var index = i+1;
            body += '<tr>';
            body += '<td>' + index.toString(10) + '</td>';
			body += '<td>' + '<input type="checkbox" id=\"cb' + i.toString(10) + '\" onclick="isChecked(this);">' + '</td>';
            body += '<td>' + subArray[i].name + '</td>';
			body += '<td>' + '<input type="button" id=\"btn' + i.toString(10) + '\" onclick="isDeleted(this);">' + '</td>';
            body += '</tr>';
		}
		
        body += '</table></body></html>';
		
		document.getElementById("object_list").innerHTML = body;
		}
	}
	
	function finalSheet() {
		var myDate=new Date();
		var final_sheet = '<html><head></head><style>html{background-position:center top;background-repeat:no-repeat;width:800px;margin:auto;}table, th, td {border: 1px solid black;border-collapse: collapse;}th, td {padding: 5px;}th {text-align: center;}</style><body><h1>计划完成统计表</h1><h4>' + myDate + '</h2>'
		var body = '<table><tr><th>#</th><th>Name</th><th>Done</th></tr>'
		
		var i = 0;
		var index = 1;
		var showtext = "";
		while (i < subArray.length) {
			if (subArray[i].isDelete != "true" ) {
				if (subArray[i].isCheck == "true") {
					showtext = "√";
				}else {
					showtext = "×";
				}
				body += '<tr>';
				body += '<td>' + index.toString(10) + '</td>';
				body += '<td>' + subArray[i].name + '</td>';
				body += '<td>' + showtext + '</td>';
				body += '</tr>';
				index++;
			}
			i++;
		}
		
        body += '</table></body></html>';
		document.getElementById("object_list").innerHTML = body;
		
		final_sheet += body
		download('计划完成统计表.html', final_sheet)
		
	}
	
	function clearText() {
		document.getElementById("myTextarea").value = '';
	}
	
	function clearContents(element) {
		element.value = '';
	}
	
	function isChecked(element) {
		var id_str = element.id
		id_str = id_str.replace("cb","");
		var id_num = parseInt(id_str)
		if (element.checked == true){
			subArray[id_num].isCheck = "true";
		} else {
			subArray[id_num].isCheck = "false";
		}
	}
	
	function isDeleted(element) {
		var id_str = element.id
		id_str = id_str.replace("btn","");
		var id_num = parseInt(id_str)
		
		if (delete_flag == true) {
		delete_flag = false;
		subArray[id_num].isDelete = "true";
		element.value="×"
		} else {
		delete_flag = true;
		subArray[id_num].isDelete = "false";
		element.value=""
		}
	}
	
	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}