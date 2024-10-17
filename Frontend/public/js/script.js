// DOM elements
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const roleSelect = document.getElementById('activityType');
const loginButton = document.getElementById('loginBtn');

const formError = document.getElementById('formError'); // New error container above the form
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const roleError = document.getElementById('roleError');
const messageOutput = document.getElementById('message');

// Toggle password visibility
const togglePassword = document.getElementById('togglePassword');

// Set initial icon state based on password input type
if (passwordInput.getAttribute('type') === 'password') {
    togglePassword.classList.add('fa-eye-slash'); // Default to fa-eye-slash
}

// Toggle password visibility when the icon is clicked
togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle the eye icon class
    if (type === 'password') {
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash');
    } else {
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
    }
});

// Function to capitalize names
function capitalizeName(name) {
    return name.split(' ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
}

// Function to enable or disable the login button
function checkFormFields() {
    const usernameValue = usernameInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const roleValue = roleSelect.value;

    // Clear previous error messages
    usernameError.textContent = "";
    passwordError.textContent = "";
    roleError.textContent = "";

    // Validate each field and display error messages accordingly
    let isValid = true;

    if (usernameValue === "") {
        usernameError.textContent = "ERROR: this field cannot be empty!!";
        usernameError.style.display = "block"; // Show error message
        isValid = false;
    }

    if (passwordValue === "") {
        passwordError.textContent = "ERROR: this field cannot be empty!!";
        passwordError.style.display = "block"; // Show error message
        isValid = false;
    }

    if (roleValue === "") {
        roleError.textContent = "ERROR: role must be selected!!";
        roleError.style.display = "block" // Show error message
        isValid = false;
    }

    // Enable the button only if all fields are filled and valid
    loginButton.disabled = !isValid;
}

// Event listeners for form field changes
usernameInput.addEventListener('input', checkFormFields);
passwordInput.addEventListener('input', checkFormFields);
roleSelect.addEventListener('change', checkFormFields);

// Function to submit login
function submitLogin() {
    // Clear previous error messages
    formError.style.display = 'none'; // Hide any previous form errors

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleSelect.value;

    // If errors exist, stop form submission
    if (username === "" || password === "" || role === "") {
        checkFormFields(); // Revalidate and show error messages
        return; // Prevent form submission if any fields are still invalid
    }

    // Proceed with API call only if fields are filled
    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': 'TU0fe067fbe14babb1b2438c0eae217171aa3ce1b41f8267fd1fd18bd6ac0d0219f49c2a0184137b3ebacdf7556f797cd3'
        },
        body: JSON.stringify({ "UserName": username, "PassWord": password })
    })
    .then(response => response.json())
    .then(data => {
        // Clear previous results and errors
        messageOutput.innerHTML = "";
        formError.style.display = 'none'; // Ensure previous error messages are hidden
        roleError.style.display = 'none';

        // Handle incorrect username or password
        if (data.status === false) {
            formError.textContent = "ERROR: Username or password is incorrect!!";
            formError.style.display = 'block';
            return;
        }

        // Check if the role selected matches the type returned by the API
        if (!(data.type === "student" && role === "Student")) {
            roleError.textContent = "ERROR: role doesn't match!!";
            roleError.style.display = 'block';
            return;
        }

        // Capitalize the English name before displaying it
        const capitalizedEnglishName = capitalizeName(data.displayname_en);

        // Display successful login data
        messageOutput.innerHTML = `
        <div style="text-align: center; font-weight: bold; margin-bottom: 10px;">Login Success!!</div>
        <div style="text-align: left;">
            Username: ${data.username} <br>
            ชื่อ-นามสกุล (ภาษาไทย): ${data.displayname_th} <br>
            ชื่อ-นามสกุล (ภาษาอังกฤษ): ${capitalizedEnglishName} <br>
            ประเภทของผู้ใช้งาน: ${data.type} <br>
            สถานภาพ: ${data.tu_status} <br>
            คณะ: ${data.department} <br>
            สาขา: ${data.faculty} <br>
            อีเมล: ${data.email} <br>
        </div>
        `;
    })
    .catch(error => console.error('Error:', error));
}
