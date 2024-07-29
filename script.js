resetBtn = document.getElementById('reset')

resetBtn.addEventListener("click", function() {
    document.getElementById('form-message').value = ''
    document.getElementById('form-email').value = ''
    document.getElementById('form-name').value = ''
})