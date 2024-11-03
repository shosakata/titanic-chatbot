"use strict";
$(document).ready(function() {

  let selectedFile = null; // uploaded file

  $('#csv-upload-trigger').click(function (event) {
    event.preventDefault();
    $('#csv-upload').click();
  });

  // choosing CSV file
  $('#csv-upload').change(function (event) {
        selectedFile = event.target.files[0];
        $('#uploaded-file').append(
            '<div class="space-y-2">'+
            '<div class="overflow-auto">'+
            '<div class="flex gap-2 overflow-auto pt-2">'+
            '<div class="relative flex h-[64px] cursor-pointer items-center space-x-4 rounded-xl hover:opacity-50">'+
            
            '<img alt="File image" width="56" height="56" decoding="async" ' +
            'class="rounded" src="./static/images/csv.png"' +
            'style="color: transparent; min-width: 56px; min-height: 56px; max-height: 56px; max-width: 56px;">'+

            '<svg id="delete-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bg-muted-foreground border-primary absolute right-[-6px] top-[-2px] flex size-5 cursor-pointer items-center justify-center rounded-full border-DEFAULT text-[10px] hover:border-red-500 hover:bg-white hover:text-red-500">'+
            '<path d="M18 6l-12 12"></path>'+
            '<path d="M6 6l12 12"></path>'+
            '</svg></div></div></div></div>'

        );
        $('#input-type').text("CSV")
  });

  // choosing database
  $('#database-trigger').click(function (event) {

    $('#uploaded-file').append(
        '<div class="space-y-2">'+
        '<div class="overflow-auto">'+
        '<div class="flex gap-2 overflow-auto pt-2">'+
        '<div class="relative flex h-[64px] cursor-pointer items-center space-x-4 rounded-xl hover:opacity-50">'+
        
        '<img alt="File image" width="56" height="56" decoding="async" ' +
        'class="rounded" src="./static/images/database.png"' +
        
        'style="color: transparent; min-width: 56px; min-height: 56px; max-height: 56px; max-width: 56px;">'+

        '<svg id="delete-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bg-muted-foreground border-primary absolute right-[-6px] top-[-2px] flex size-5 cursor-pointer items-center justify-center rounded-full border-DEFAULT text-[10px] hover:border-red-500 hover:bg-white hover:text-red-500">'+
        '<path d="M18 6l-12 12"></path>'+
        '<path d="M6 6l12 12"></path>'+
        '</svg></div></div></div></div>'

    );
    $('#input-type').text("Database")
  });


  
  // clicking delete button
  $(document).on('click', '#delete-icon', function (event) {

      var uploadedFileElement = document.getElementById('uploaded-file');
      
      if (uploadedFileElement) {

          // Delete child element
          while (uploadedFileElement.firstChild) {
              uploadedFileElement.removeChild(uploadedFileElement.firstChild);
          }
          
          // // Delete data-file attribute
          selectedFile = null;

          $('#csv-upload').val(''); 
          $('#input-type').text("text")
      } else {
          console.log("Uploaded file element not found");
      }
      
  });



  // Event listener for the Generate button
  $('#generate-icon').click(function() {
    if ($(this).hasClass('cursor-not-allowed')) {
      event.preventDefault(); // Prevent default action
      return; // Nullify process
      }

    const newText = document.querySelector('textarea').value;
    const doneList = doneTextList(); 
    const inputType = document.getElementById('input-type').textContent

    // clear input
    document.getElementById('generate-icon').classList.add('cursor-not-allowed', 'opacity-50');
    document.getElementById('input-field').value = '';
    document.getElementById('input-field').style.height = "40px"
    if (inputType !== "text") {
      delete_icon();
    }


    generateTextGet(newText, doneList, inputType, selectedFile);
    
  });
});

function doneTextList() {

  const pageInfoValue = document.getElementById('page-info').textContent;
  const hiddenTextId = `hidden-text${pageInfoValue}`;
  var hiddenTextValues = [];
  const hiddenTextElements = document.querySelectorAll(`#${hiddenTextId} .original-text`);

  hiddenTextElements.forEach(element => {
      hiddenTextValues.push(element.textContent);
  });

  return hiddenTextValues

}


function generateTextGet(newText, doneList, inputType, selectedFile){

  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('new_text', newText);
  formData.append('done_list', JSON.stringify(doneList));
  formData.append('input_type', inputType);

  // fetch('http://127.0.0.1:5000/python', {
  // fetch('http://184.73.33.51:8000/python', {
  fetch('/api/data', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    outputResponse(newText, data)
    hiddenInfo(newText, data)
    generateScroll();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}


function hiddenInfo(newText, response){
  const pageInfoValue = document.getElementById('page-info').textContent;

  const hiddenTextId = `hidden-text${pageInfoValue}`;
  if (document.getElementById(hiddenTextId)) {
    var hidden_html = "";
    hidden_html += '<div class="original-text user">' +newText + '</div>';
    hidden_html += '<div class="original-text assist">' +response + '</div>';
    $("#"+hiddenTextId).append(hidden_html)
  } else {
    var hidden_html = "";
    hidden_html += '<div id="'+hiddenTextId+'">';
    hidden_html += '<div class="original-text user">' +newText + '</div>';
    hidden_html += '<div class="original-text assist">' +response + '</div>';
    hidden_html += '</div>';
    $("#hidden-text").append(hidden_html);
    $('#page-title').text(newText.slice( 0, 100 ));

    var agenda_html = '';

    const agendaId = `agenda${pageInfoValue}`;
    agenda_html += '<div class="hover:bg-accent focus:bg-accent group flex w-full cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none" tabindex="0" onclick="changePage(this)" data-value='+ pageInfoValue +'><button data-state="closed">';
    agenda_html += '<svg class="rounded-sm p-1 text-black bg-white" width="30" height="30" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" stroke-width="1.5" role="img">';
    agenda_html += '<path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="currentColor"></path>';
    agenda_html += '</svg></button>';

    agenda_html += '<div class="ml-3 flex-1 truncate text-sm font-semibold">' + newText.slice( 0, 100 ) + '</div>';

    agenda_html += '<div class="ml-2 flex space-x-2 false">';
    agenda_html += '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hover:opacity-50" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:rq:" data-state="closed">';
    agenda_html += '<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>';
    agenda_html += '<path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>';
    agenda_html += '<path d="M16 5l3 3"></path>';
    agenda_html += '</svg>';
    agenda_html += '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hover:opacity-50" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:rt:" data-state="closed" onclick="removeButton(this)">';
    agenda_html += '<path d="M4 7l16 0"></path>';
    agenda_html += '<path d="M10 11l0 6"></path>';
    agenda_html += '<path d="M14 11l0 6"></path>';
    agenda_html += '<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>';
    agenda_html += '<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>';
    agenda_html += '</svg></div></div>';

    document.getElementById('agenda').insertAdjacentHTML('afterbegin', agenda_html);
  }
}


function outputResponse(newText, response){
  var question_html = '';
  question_html += '<div class="flex w-full justify-center qa-user">';
  question_html += '<div class="relative flex w-full flex-col p-6 sm:w-[550px] sm:px-0 md:w-[650px] lg:w-[650px] xl:w-[700px]">';
  question_html += '<div class="absolute right-5 top-7 sm:right-0">';
  question_html += '<div class="text-muted-foreground flex items-center space-x-2"></div></div>';
  question_html += '<div class="space-y-3">';
  question_html += '<div class="flex items-center space-x-3"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bg-primary text-secondary border-primary rounded border-DEFAULT p-1">';
  question_html += '<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>';
  question_html += '<path d="M9 10l.01 0"></path>';
  question_html += '<path d="M15 10l.01 0"></path>';
  question_html += '<path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path>';
  question_html += '</svg>';
  question_html += '<div class="font-semibold">User</div>';
  question_html += '</div>';
  question_html += '<div class="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words">';

  question_html += newText;

  question_html += '</div></div>';
  question_html += '<div class="mt-3 flex flex-wrap gap-2"></div>';
  question_html += '</div></div>';
  

  $("#qa-area").append(question_html)

  console.log(response)

  var response_html =  String(marked.parse(response));


  var answer_html = '';
  answer_html += '<div class="flex w-full justify-center bg-secondary qa-assist">'
  answer_html += '<div class="relative flex w-full flex-col p-6 sm:w-[550px] sm:px-0 md:w-[650px] lg:w-[650px] xl:w-[700px]">'
  answer_html += '<div class="absolute right-5 top-7 sm:right-0">'
  answer_html += '<div class="text-muted-foreground flex items-center space-x-2">'
  answer_html += '<button data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cursor-pointer hover:opacity-50">'
  answer_html += '<path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"></path>'
  answer_html += '<path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"></path>'
  answer_html += '</svg></button>'

  answer_html += '</div></div>'
  answer_html += '<div class="space-y-3">'
  answer_html += '<div class="flex items-center space-x-3"><button data-state="closed"><svg class="rounded-sm p-1 text-black bg-white" width="32" height="32" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" stroke-width="1.5" role="img">'
  answer_html += '<path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="currentColor"></path>'
  answer_html += '</svg></button>'
  answer_html += '<div class="font-semibold">AI</div>'
  answer_html += '</div>'
  answer_html += '<div class="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words">'

  answer_html += response_html

  answer_html += '</div></div>'
  answer_html += '<div class="mt-3 flex flex-wrap gap-2"></div>'
  answer_html += '</div></div>'

  $("#qa-area").append(answer_html)

}


function delete_icon(){
  var uploadedFileElement = document.getElementById('uploaded-file');
          
  if (uploadedFileElement) {

      // Delete child element
      while (uploadedFileElement.firstChild) {
          uploadedFileElement.removeChild(uploadedFileElement.firstChild);
      }
      
      // Delete data-file attribute
      uploadedFileElement.removeAttribute('data-file');

      $('#csv-upload').val(''); 
      $('#input-type').text("text")
  } else {
      console.log("Uploaded file element not found");
  }
}

var generateScroll = () => {
  var answers = document.getElementsByClassName('qa-assist');
  var container = document.getElementById('qa-area');
  if (answers.length > 1) {
      var lastAnswer = answers[answers.length - 2];
      var lastAnswerBottom = lastAnswer.getBoundingClientRect().bottom - container.getBoundingClientRect().top;
      smoothScrollTo(container, lastAnswerBottom, 300); // 1000msでスクロール
  }
};

// smooth scroll function
function smoothScrollTo(element, target, duration) {
  var start = element.scrollTop;
  var change = target - start;
  var startTime = performance.now();

  function animateScroll(currentTime) {
    var elapsed = currentTime - startTime;
    var progress = Math.min(elapsed / duration, 1); // calculate progress from 0 to 1
    element.scrollTop = start + change * progress;

    if (progress < 1) {
      requestAnimationFrame(animateScroll); 
    }
  }

  requestAnimationFrame(animateScroll);
}