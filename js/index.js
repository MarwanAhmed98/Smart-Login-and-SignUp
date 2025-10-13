const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginFormContainer = document.getElementById('login-form-container');
const signupFormContainer = document.getElementById('signup-form-container');
const otpFormContainer = document.getElementById('otp-form-container');
const forgotEmailFormContainer = document.getElementById('forgot-email-form-container');
const verifyForgetCodeContainer = document.getElementById('verify-forget-code-container');
const resetPasswordContainer = document.getElementById('reset-password-container');
const dashboardContainer = document.getElementById('dashboard-container');
const formTitle = document.getElementById('form-title');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const otpForm = document.getElementById('otp-form');
const forgotEmailForm = document.getElementById('forgot-email-form');
const verifyForgetCodeForm = document.getElementById('verify-forget-code-form');
const resetPasswordForm = document.getElementById('reset-password-form');
const messageBox = document.getElementById('message-box');
const toggleButtons = document.getElementById('toggle-buttons');
const dashboardUsername = document.getElementById('dashboard-username');
const dashboardEmail = document.getElementById('dashboard-email');
const dashboardPhone = document.getElementById('dashboard-phone');
const logoutBtn = document.getElementById('logout-btn');
const username = document.getElementById('signup-username');
const email = document.getElementById('signup-email');
const password = document.getElementById('signup-password');
const confirmPassword = document.getElementById('signup-confirmPassword');
const phone = document.getElementById('signup-phone');
const gender = document.getElementById('signup-gender');
const forgotEmailInput = document.getElementById('forgot-email');
const forgotOtpEmailInput = document.getElementById('forgot-otp-email');
const forgotOtpInput = document.getElementById('forgot-otp-input');
const resetEmailInput = document.getElementById('reset-email');
const resetOtpHidden = document.getElementById('reset-otp-hidden');
const resetPasswordInput = document.getElementById('reset-password');
const resetConfirmPasswordInput = document.getElementById('reset-confirmPassword');
let UserDataa;
let tempUserEmail = '';
/**
 * @param {string} type 'success' or 'error'
* @param {string} text The message content
*/
function displayMessage(type, text) {
    messageBox.textContent = text;
    messageBox.className = '';
    messageBox.classList.add(type === 'error' ? 'msg-error' : 'msg-success');
    messageBox.style.display = 'block';
    // Clear message after 4 seconds
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 6000);
}

// Hides all forms/dashboard containers.
function hideAllContainers() {
    loginFormContainer.classList.add('hidden');
    signupFormContainer.classList.add('hidden');
    otpFormContainer.classList.add('hidden');
    dashboardContainer.classList.add('hidden');
    forgotEmailFormContainer.classList.add('hidden');
    verifyForgetCodeContainer.classList.add('hidden');
    resetPasswordContainer.classList.add('hidden');
    messageBox.style.display = 'none';
}
/**
* @param {Event} e
*/
function showLogin(e) {
    if (e) e.preventDefault();
    hideAllContainers();

    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginFormContainer.classList.remove('hidden');

    formTitle.textContent = "Login Form";
    toggleButtons.style.display = 'flex';
    formTitle.style.display = 'block';
}
/**
* @param {Event} e
*/
function showSignup(e) {
    if (e) e.preventDefault();
    hideAllContainers();

    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupFormContainer.classList.remove('hidden');

    formTitle.textContent = "Signup Form";
    toggleButtons.style.display = 'flex';
    formTitle.style.display = 'block';
}

//Show OTP Confirmation
function showOtpConfirmation() {
    hideAllContainers();
    signupTab.classList.remove('active');
    loginTab.classList.remove('active');
    otpFormContainer.classList.remove('hidden');

    formTitle.textContent = "Verify Your Account";
    toggleButtons.style.display = 'none';
    formTitle.style.display = 'block';
    const signupEmail = document.getElementById('signup-email').value;
    if (signupEmail) {
        document.getElementById('otp-email').value = signupEmail;
        document.getElementById('otp-input').value = '';
    } else {
        showSignup();
    }
}
// Show Dashboard
function showDashboard() {
    hideAllContainers();

    dashboardContainer.classList.remove('hidden');
    formTitle.style.display = 'none';
    toggleButtons.style.display = 'none';
}
/**
 * @param {Event} e
 */
function showForgotEmail(e) {
    if (e) e.preventDefault();
    hideAllContainers();

    formTitle.textContent = "Forgot Password";
    formTitle.style.display = 'block';
    toggleButtons.style.display = 'none';
    forgotEmailFormContainer.classList.remove('hidden');
}
function showVerifyCode() {
    hideAllContainers();

    formTitle.textContent = "Verify Reset Code";
    formTitle.style.display = 'block';
    toggleButtons.style.display = 'none';
    verifyForgetCodeContainer.classList.remove('hidden');

    // Pre-populate email for the user
    forgotOtpEmailInput.value = tempUserEmail;
    forgotOtpInput.value = '';
}
function showResetPassword(otp) {
    hideAllContainers();

    formTitle.textContent = "Reset Password";
    formTitle.style.display = 'block';
    toggleButtons.style.display = 'none';
    resetPasswordContainer.classList.remove('hidden');

    // Pre-populate email and set hidden OTP
    resetEmailInput.value = tempUserEmail;
    resetOtpHidden.value = otp;
    resetPasswordInput.value = '';
    resetConfirmPasswordInput.value = '';
}
// --- Event Listeners ---
loginTab.addEventListener('click', showLogin);
signupTab.addEventListener('click', showSignup);
document.addEventListener('DOMContentLoaded', () => showSignup());
// 1. SIGNUP Form Submission (Now goes to OTP)
async function signup() {
    try {
        let response = await fetch('https://thetically-impressible-arla.ngrok-free.dev/auth/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: username.value,
                email: email.value,
                password: password.value,
                confirmPassword: confirmPassword.value,
                phone: phone.value,
                gender: gender.value,
            })
        });

        let data = await response.json();
        console.log("Response:", data);

        if (response.ok) {
            showOtpConfirmation();
            document.getElementById("otp-email").value = email.value;

            displayMessage('success', data.message || "Signup successful! Please verify your email with the OTP.");
        } else {
            displayMessage('error', data.err_message);
        }

    } catch (error) {
        console.error("Error:", error);
        displayMessage('error', "Something went wrong. Try again later!");
    }
}
// 2. OTP Form Submission (New Handler)
async function ConfirOTPAccount() {
    const otpEmail = document.getElementById("otp-email").value;
    const otpCode = document.getElementById("otp-input").value;

    try {
        let response = await fetch('https://thetically-impressible-arla.ngrok-free.dev/auth/confirm-email', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: otpEmail,
                otp: otpCode
            })
        });

        let data = await response.json();
        console.log("OTP Response:", data);

        if (response.ok) {
            showLogin(null);
            displayMessage('success', data.message || "Email verified successfully!");
            loginForm.querySelector('#login-email').value = otpEmail;
            loginForm.querySelector('#login-password').value = password.value;

        } else {
            displayMessage('error', data.err_message || "Invalid OTP!");
        }

    } catch (error) {
        console.error("Error:", error);
        displayMessage('error', "Something went wrong. Try again!");
    }
}
// Resend OTP Handler
async function ResendOTP() {
    const otpEmail = document.getElementById("otp-email").value;
    try {
        let response = await fetch('https://thetically-impressible-arla.ngrok-free.dev/auth/resend-otp', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: otpEmail,
            })
        });

        let data = await response.json();
        console.log("OTP Response:", data);

        if (response.ok) {
            displayMessage('success', data.message || "A new mock OTP has been 'resent'");

        } else {
            displayMessage('error', data.message || "Invalid OTP!");
        }

    } catch (error) {
        console.error("Error:", error);
        displayMessage('error', "Something went wrong. Try again!");
    }
}
// 3. LOGIN Form Submission
async function LoginForm() {
    const Loginemail = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    try {
        let response = await fetch("https://thetically-impressible-arla.ngrok-free.dev/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: Loginemail,
                password: password
            })
        })
        let data = await response.json();
        console.log("Login Response:", data);
        if (response.ok) {
            displayMessage('success', data.message || "Login Successful!");
            localStorage.setItem("userToken", data.access_Token);
            console.log("Token Saved:", data.access_Token);
            showDashboard();
            GetProfile();
        }
        else {
            displayMessage('error', data.message || "Login failed. Please check your credentials.");
        }
    }
    catch (error) {
        console.error("Error:", error);
        displayMessage('error', data.err_message);
    }
}
async function GetProfile() {
    try {
        let token = localStorage.getItem("userToken");
        let response = await fetch("https://thetically-impressible-arla.ngrok-free.dev/users/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
                "ngrok-skip-browser-warning": "true"
            }
        });

        let data = await response.json();
        UserDataa = data.user;
        dashboardUsername.textContent = UserDataa.fullName;
        dashboardEmail.textContent = UserDataa.email;
        dashboardPhone.textContent = UserDataa.phone;
        displayMessage('success', "Welcome back, " + UserDataa.fullName + "!");
        console.log("Profile Response:", data.user);

    } catch (error) {
        console.error("Error:", error);
    }
}
// 4. Send Forgot Password OTP
async function SendForgotPasswordOTP() {
    tempUserEmail = forgotEmailInput.value.trim();
    try {
        let response = await fetch('https://thetically-impressible-arla.ngrok-free.dev/auth/forgot-password', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: tempUserEmail
            })
        });

        let data = await response.json();
        console.log("Forgot Password Send OTP Response:", data);

        if (response.ok) {
            showVerifyCode();
            displayMessage('success', data.message || "Reset code sent! Please check your email.");
        } else {
            displayMessage('error', data.err_message || "Email not found or failed to send code.");
        }
    } catch (error) {
        console.error("Error:", error);
        displayMessage('error', "Something went wrong. Try again!");
    }
}
// 5. Verify Forgot Password Code
async function VerifyForgotPasswordCode() {
    const forgotOtpEmail = forgotOtpEmailInput.value;
    const otpCode = forgotOtpInput.value;
    try {
        // Mock API call to verify OTP
        let response = await fetch('https://thetically-impressible-arla.ngrok-free.dev/auth/verify-forget-code', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: forgotOtpEmail,
                otp: otpCode
            })
        });

        let data = await response.json();
        console.log("Verify Forgot Code Response:", data);

        if (response.ok) {
            showResetPassword(otpCode); // Pass the verified OTP to the next step
            displayMessage('success', data.message || "Code verified. Please set your new password.");
        } else {
            displayMessage('error', data.err_message || "Invalid or expired code!");
        }

    } catch (error) {
        console.error("Error:", error);
        displayMessage('error', "Something went wrong. Try again!");
    }
}
// Helper function for resending OTP
async function fetchResendOTP(email) {
    try {
        let response = await fetch('https://thetically-impressible-arla.ngrok-free.dev/auth/resend-otp', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        let data = await response.json();
        console.log("Resend OTP Response:", data);

        if (response.ok) {
            displayMessage('success', data.message || "A new reset code has been 'resent'.");
        } else {
            displayMessage('error', data.err_message || "Failed to resend code!");
        }
    } catch (error) {
        console.error("Error:", error);
        displayMessage('error', "Something went wrong. Try again!");
    }
}
// 6. Reset Password
async function ResetUserPassword() {
    const resetEmail = resetEmailInput.value;
    const resetOtp = resetOtpHidden.value;
    const newPassword = resetPasswordInput.value;
    const confirmNewPassword = resetConfirmPasswordInput.value;
    if (newPassword !== confirmNewPassword) {
        return displayMessage('error', "New password and confirmation do not match.");
    }
    try {
        let response = await fetch('https://thetically-impressible-arla.ngrok-free.dev/auth/reset-password', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: resetEmail,
                otp: resetOtp,
                password: newPassword,
                confirmPassword: confirmNewPassword
            })
        });

        let data = await response.json();
        console.log("Reset Password Response:", data);

        if (response.ok) {
            showLogin(null);
            displayMessage('success', data.message || "Password successfully reset! You can now log in with your new password.");
            loginForm.querySelector('#login-email').value = resetEmail;
            loginForm.querySelector('#login-password').value = newPassword;
        } else {
            displayMessage('error', data.err_message || "Password reset failed. Please try the process again.");
        }

    } catch (error) {
        console.error("Error:", error);
        displayMessage('error', "Something went wrong during password reset. Try again!");
    }
}
// 7. LOGOUT Handler
async function Logout() {
    try {
        let token = localStorage.getItem("userToken");

        let response = await fetch("https://thetically-impressible-arla.ngrok-free.dev/users/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
                "ngrok-skip-browser-warning": "true"
            },
            body: JSON.stringify({
                flag: "signout"
            })
        });

        let data = await response.json();
        console.log("Logout Response:", data);

        if (response.ok) {
            localStorage.removeItem("userToken");
            console.log("User logged out!");
            showLogin(null);
            displayMessage('success', data.message || "Logged out successfully.");
        }
        else {
            displayMessage('error', data.err_message || "Logput failed. Try again.");
        }

    } catch (error) {
        console.error("Error:", error);
    }
}


