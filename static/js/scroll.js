$(document).ready(function() {
    $('#go-to-bottom').click(function() {
        var container = document.getElementById('qa-area');
        var scrollToBottom = () => {
            container.scrollTop = container.scrollHeight;
        };
        scrollToBottom()
    });
    $('#go-to-top').click(function() {
        var container = document.getElementById('qa-area');
        var scrollToTop = () => {
            container.scrollTop = 0;
        };
        scrollToTop()
    });
});