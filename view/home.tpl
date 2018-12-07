<div class="container">

	<div class="file_upload">
		<form name="upload_form" action="<?=PREFOLDER?>/home/uploadFile" method="post" enctype="multipart/form-data">
		<?php
			$accept = "";
			$allowTypes = json_decode($allowTypes);
			for($i=0;$i<count($allowTypes);$i++){
				$accept .= ".".$allowTypes[$i];
				if($i != count($allowTypes)-1) $accept .= ",";
			}
		?>
			<input type="file" name="files[]" id="filesInput" multiple="multiple" accept="<?=$accept?>">
			<input type="button" disabled="disabled" id="uploadAll" value="Upload All">
		</form>

		<div class="preUploads">
		<div class="count_files">(<span>0</span> / <?=$max_count_files?>)</div>
		<div class="max_size"><span>Max size - <?=$max_upload_file_view?></span></div>
			<div class="tabs">
				<div>Preview</div>
				<div>Name</div>
				<div>Size</div>
				<div>Upload</div>
				<div>Actions</div>
			</div>
			<div class="rows"></div>
		</div>

	</div>
	<script>
		var max_upload_file = <?=$max_upload_file?>;
		var max_count_files = <?=$max_count_files?>;
	</script>
</div>