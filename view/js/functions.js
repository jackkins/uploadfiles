function setLocation(curLoc){
    try {
      history.pushState(null, null, curLoc);
      return;
    } catch(e) {}
    location.hash = '#' + curLoc;
}


function getFileName(name){
	newname = "";
	_spliter = name.split(".");
	for(j=0;j<_spliter.length-1;j++){
		if(j!=0) newname += ".";
		newname += _spliter[j];
	}
	return newname;
}
function getFileExt(name){
	_spliter = name.split(".");
	return _spliter[_spliter.length-1];
}
function getFileSize(size){
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (size == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
   return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function readImg(file,_t){
	var fileType = file["type"];
	var ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
	var image = "";
	if ($.inArray(fileType, ValidImageTypes) < 0){
		
	}
	else{

		var reader = new FileReader();
	    reader.onload = function(e){
	    	_t.find(".file_icon img").attr("src",e.target.result);
	    }
	    reader.readAsDataURL(file);
	}
}

$(document).ready(function(){
	var files = new Array();

	var canceled = false;

    var files_list = $(".preUploads .rows");
    var current_request = null;

    var uploadAll_i = 0;
    var uploadetFiles = 0;


	$("body").on('click','a',function(e){
			e.preventDefault();
			page = $(this).attr("href");
			$.ajax({
				xhr: function(){
				    var xhr = new window.XMLHttpRequest();
				    //Upload progress
				    xhr.upload.addEventListener("progress", function(evt){
				      if (evt.lengthComputable) {
				        var percentComplete = evt.loaded / evt.total;
				        //Do something with upload progress
				        //console.log("up", percentComplete);
				      }
				    }, false);
				    //Download progress
				    xhr.addEventListener("progress", function(evt){
				      if (evt.lengthComputable) {
				        var percentComplete = evt.loaded / evt.total;
				        //Do something with download progress
				        //console.log("down", evt.loaded / 600000);
				      }
				    }, false);
				    return xhr;
				},
				url:page,
				type:"post",
				datatype:"html",
				data:{'1':'1'},
				success:function(data){
					$("#content-page").html(data);
					setLocation(page);
				}
			})
	}).on('change','#filesInput',function(e){
		var form = $(this).closest("form");
		var _currentUploads = new Array();
		var _length = 0;
		if((files.length + $(this)[0].files.length) > max_count_files) {
			alert("The maximum number of files to upload - "+max_count_files);
			_length = max_count_files - files.length;
		}
		else _length = $(this)[0].files.length;



		for(f=0;f<_length;f++){
			if($(this)[0].files[f].size > max_upload_file){
				alert($(this)[0].files[f].name+"("+getFileSize($(this)[0].files[f].size)+") max size - "+getFileSize(max_upload_file));
			}
			else{
				files.push($(this)[0].files[f]);
				_currentUploads.push($(this)[0].files[f]);
			}
		}

		for(i=0;i<_currentUploads.length;i++){			

			files_list.append("<div class='item' data-i='"+i+"'><div class='file_icon'><img src='./images/file.png'></div><div>"+getFileName(_currentUploads[i].name)+"</div><div>"+getFileSize(_currentUploads[i].size)+"</div><div class='status'>0%</div><div><button class='js-upload'>Upload</button><button class='js-remove'>Remove</button><button class='js-cancel'>Cancel</button></div><div class='loading'></div></div>");
			_t = $(".item").last();
			readImg(_currentUploads[i],_t);
		}

		$(".count_files span").text(files.length);

		uploadAllBtn();

		//fd.append("files",files);
	}).on("click",".js-upload",function(e){
		e.preventDefault();
		uploadFile($(this));

	}).on("click",".js-remove",function(e){
		e.preventDefault();
		_line = $(this).closest(".item");
		_i = _line.index();
		files.splice(_i,1);
		_line.remove();
		uploadAllBtn();
	}).on('click','.js-cancel',function(e){
		e.preventDefault();
		_line = $(this).closest(".item");
		_i = _line.index();
		canceled = true;
		current_request.abort();
		current_request = null;
		_line.find(".loading").css({"width":"0%"});
		_line.find(".status").text("0%");
	}).on('click','#uploadAll',function(e){
		e.preventDefault();
		if(files.length > 0) uploadAll();
	})


	function uploadAllBtn(){
		if(files.length > 0 && files.length != uploadetFiles) $("#uploadAll").removeAttr("disabled");
		else $("#uploadAll").attr("disabled","disabled");
	}
	function uploadFile(_this,all = false){
		var fd = new FormData();
		_line = _this.closest(".item");
		_i = _line.index();

		fd.append("file",files[_i]);
		fd.append("run","1");
		current_request = $.ajax({
			url: $("form[name='upload_form']").attr("action"),
			data: fd,
			type: "post",
			datatype: "json",
			processData: false,
	        contentType: false,
	        beforeSend: function(){
	        	files_list.find(".js-upload, .js-remove").each(function(){
	        		$(this).attr("disabled","disabled");
	        	});
				_this.parent().find(".js-upload, .js-remove").each(function(){
					$(this).hide();
				});
				_this.siblings(".js-cancel").show();
	        },
	        xhr: function () {
		        var xhr = new window.XMLHttpRequest();
		        xhr.upload.addEventListener("progress", function (evt) {
		            if (evt.lengthComputable) {
		                var percentComplete = evt.loaded / evt.total;

		                temp_percent = percentComplete * 100;

		                percentComplete_e = temp_percent.toFixed(1) +"%";

		                _line.find(".status").text(percentComplete_e);
		                _line.find(".loading").css({"width":percentComplete_e});
		                if(percentComplete === 1) _line.find(".status").text("Complete");

		                //percent.css("width",percentComplete_e).text(percentComplete_e);
		                
		            }
		        }, false);
		        xhr.addEventListener("progress", function (evt) {
		            if (evt.lengthComputable) {
		                var percentComplete = evt.loaded / evt.total;

		                temp_percent = percentComplete * 100;

		                percentComplete_e = temp_percent.toFixed(1) +"%";

		                _line.find(".status").text(percentComplete_e);
		                _line.find(".loading").css({"width":percentComplete_e});

		                if(percentComplete === 1) _line.find(".status").text("Complete");
		                //percent.css("width",percentComplete_e).text(percentComplete_e);
		                
		            }
		        }, false);
		        return xhr;
		    },
	        success:function(data){
	        	fr = new FormData();
	        	_this.parent().find(".js-upload, .js-remove, .js-cancel").each(function(){
	        		$(this).remove();
	        	});

	        	uploadetFiles++;

	        	uploadAllBtn();

	        	if(all){
		        	uploadAll_i++;		        	
		        	uploadAll();
		        }
	        },
	        complete:function(){
	        	_this.siblings(".js-cancel").hide();
	        	files_list.find(".js-upload, .js-remove").each(function(){
		    		$(this).removeAttr("disabled");
		    	});
	        	if(canceled){
	        		files_list.find(".js-upload, .js-remove").each(function(){
			    		$(this).show().removeAttr("disabled");
			    	});
					
			    	canceled = false;
	        	}
	        }
		})
	}

	function uploadAll(){
		console.log(uploadetFiles);
		_item = $(".item").eq(uploadAll_i).find(".js-upload");
		if(_item.length > 0) uploadFile(_item,true);
		else if(uploadetFiles < files.length){
			uploadAll_i++;
			uploadAll();
		}
	}
})