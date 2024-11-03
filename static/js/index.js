document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('input-field');
    const icon = document.getElementById('generate-icon');

    if (textarea && icon) {
        textarea.addEventListener('input', function () {
            if (textarea.value.trim() === "") {
                icon.classList.add('cursor-not-allowed', 'opacity-50');
            } else {
                icon.classList.remove('cursor-not-allowed', 'opacity-50');
            }
        });
    } else {
        console.error('Ask something');
    }
});

// Display the dropup-list
$(document).ready(function () {
    // Display or not
    $('#dropup-button').click(function (event) {
        event.stopPropagation();
        $('.dropup-content').toggle();
    });

    // Close the dropup once clicking
    $(document).click(function () {
        $('.dropup-content').hide();
    });
});



function closeDiv() {
    const agendaArea = document.getElementById("agenda-area");
    const closeButton = document.getElementById("agenda-close-button");
    

    if (closeButton.style.transform === "rotate(180deg)") {
        // close-process
        agendaArea.style.minWidth = "0px";
        agendaArea.style.maxWidth = "0px";
        agendaArea.style.width = "0px";
        agendaArea.style.opacity = "0";
        agendaArea.style.visibility = "hidden";
        closeButton.style.transform = "rotate(0deg)";
        
      } else {
        // open-process
        agendaArea.style.minWidth = "350px";
        agendaArea.style.maxWidth = "350px";
        agendaArea.style.width = "350px";
        agendaArea.style.opacity = "1";
        agendaArea.style.visibility = "visible";
        closeButton.style.transform = "rotate(180deg)";
      }
      
}

// Copy text
$(document).ready(function() {
    $(document).on('click', '.qa-assist button', function() {
        let assist_index = $(this).closest('.qa-assist').index('.qa-assist') ;

        const pageInfoValue = document.getElementById('page-info').textContent;
        const hiddenTextId = `hidden-text${pageInfoValue}`;

        const assistTexts = document.querySelectorAll('#'+hiddenTextId+' .original-text.assist');
        const secondUserText = assistTexts[assist_index].textContent;

        navigator.clipboard.writeText(secondUserText);
        
        // tick mark change
        const button = $(this);
        const originalSVG = button.html();
        
        button.html(`
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cursor-pointer hover:opacity-50">
                <path d="M20 6L9 17l-5-5"></path>
            </svg>
        `);

        setTimeout(() => {
            button.html(originalSVG);
        }, 1000);

    });
});

function adjustHeight(textarea) {
    textarea.style.height="40px"
    if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
    }
}
