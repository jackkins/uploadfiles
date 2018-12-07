<?php

/**
* 
*/
class ControllerHome extends MainController{
	
	function __construct($argument=null)
	{
		# code...
	}
	
	public function index($get){
		if(!empty($get['action'])){
			if(method_exists($this,$get['action'])){
				if($_POST){
					$this->$get['action']();
				}
				else{
					$this->loadController("header");
					$this->$get['action']();
					$this->loadController("footer");
				}
			}
		}
		else{
			if($_POST){
				$this->viewpage();
			}
			else{
				$this->loadController("header");
				$this->viewpage();
				$this->loadController("footer");
			}
		}
	}
	private function viewpage(){
		$data = array();
		$data['max_upload_file'] = max_upload_file;
		$data['allowTypes'] = allowTypes;
		$data['max_count_files'] = max_count_files;
		$data['max_upload_file_view'] = $this->convertToReadableSize(max_upload_file);
		$this->outputcontent("home",$data);
	}
	
	public function uploadFile(){
		$json = array("error"=>false);
		if($_POST){
			if($_FILES){
				$this->db_connect();

				$file = $_FILES['file'];
				$date = date("Y-m-d H:i:s");

				$basename = $this->getFileName($file['name']);
				$hashname = md5($basename.$date.rand("1","100"));

				$filename = DIR."/uploads/".$hashname.".".$this->getFileExt($file['name']);

				if(move_uploaded_file($file['tmp_name'],$filename)){
					$this->db->insert("files",array($basename,$hashname.".".$this->getFileExt($file['name']),$file['size'],$this->getFileExt($file['name']),$date),array("name","filename","size","ext","date_add"));
					$json['message'] = "Ok";
				}
				else{
					$json['error'] = true;
					$json['message'] = "Error upload";
				}
			}
			else{
				$json['error'] = true;
				$json['message'] = "File Error";
			}
		}
		else{
			$json['error'] = true;
			$json['message'] = "Bad request";
		}
		echo json_encode($json);
	}

	private function getFileExt($path){
		return pathinfo($path, PATHINFO_EXTENSION);
	}
	private function getFileName($path){
		return basename($path, ".".$this->getFileExt($path));
	}
	private function convertToReadableSize($size){
	  $base = log($size) / log(1024);
	  $suffix = array("", "KB", "MB", "GB", "TB");
	  $f_base = floor($base);
	  return round(pow(1024, $base - floor($base)), 1) . " ".$suffix[$f_base];
	}

}