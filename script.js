document.addEventListener('DOMContentLoaded', function() {
    const WhatsappNumber = document.getElementById('wmobileno');
    const MobileNumber = document.getElementById('mobileno');
    const whatsappradioYes = document.getElementById('radio0');
    const whatsappradioNo = document.getElementById('radio1');
    const errorwMobileno = document.getElementById('errorwMobileno');
    const waContainer = document.getElementById('wa-container');
    const dobInput = document.getElementById('dob');
    const ageError = document.getElementById('ageError');
    const registrationForm = document.getElementById('registrationForm');
    const sendOtpButton = document.getElementById('sendOtp');
    const otpInput = document.getElementById('otp');

    function whatsappsame() {
        if (whatsappradioYes.checked) {
            errorwMobileno.style.display = 'none';
            waContainer.style.display = 'none'; // Hide the entire container
            WhatsappNumber.value = ''; // Clear WhatsApp number when hiding
        } else {
            waContainer.style.display = 'flex';
        }
    }

    function validateNumberInput(event) {
        const input = event.target;
        if (input.value.length > 10) {
            input.value = input.value.slice(0, 10); // Limit to 10 characters
        }
    }

    function validateDOB() {
        const dobValue = new Date(dobInput.value);
        const today = new Date();
        let age = today.getFullYear() - dobValue.getFullYear();
        const monthDiff = today.getMonth() - dobValue.getMonth();
        const dayDiff = today.getDate() - dobValue.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        if (age < 14) {
            ageError.style.display = 'block';
            return false;
        } else {
            ageError.style.display = 'none';
            return true;
        }
    }

    function sendOtp() {
        const phoneNumber = `+91${MobileNumber.value}`;

        fetch('/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('OTP sent successfully');
                otpInput.focus();
            } else {
                alert('Error sending OTP');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function validateOtp() {
        const enteredOtp = otpInput.value;

        fetch('/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ otp: enteredOtp })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('OTP verified successfully');
                registrationForm.submit();
            } else {
                alert('Invalid OTP');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Attach event listeners
    sendOtpButton.addEventListener('click', sendOtp);
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateDOB()) {
            validateOtp();
        }
    });

    document.querySelectorAll('input[name="sameNumber"]').forEach(radio => {
        radio.addEventListener('change', whatsappsame);
    });
    MobileNumber.addEventListener('input', whatsappsame);
    WhatsappNumber.addEventListener('input', whatsappsame);
    MobileNumber.addEventListener('input', validateNumberInput);
    WhatsappNumber.addEventListener('input', validateNumberInput);
});
