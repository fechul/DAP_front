$(document).ready(function() {
    // 파일 타입 체크
    $('#fileSelect').on('change', function(e) {
        var selectFile = this.value;
        if(selectFile.slice(selectFile.indexOf(".") + 1).toLowerCase() != 'csv') {
            alert('csv 파일을 업로드해주세요.');
            // 입력 값 초기화
        }
    });


    // 파일 업로드 
    $("#submitData").submit(function(e) {
        e.preventDefault(); 
        var formData = new FormData($(this)[0]);
        //console.log(formData.get('fileSelect'));
        $.ajax({
            url: window.location.pathname, // url 변경!   
            type: 'POST',
            data: formData,
            success: function (data) {
                //alert(data)
                console.log('sumit success');
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });
});