// Show/Hide Sign In and Sign Up Forms
document.getElementById("signInBtn").addEventListener("click", function() {
    document.getElementById("signInForm").style.display = "block";
    document.getElementById("signUpForm").style.display = "none";
});

document.getElementById("signUpBtn").addEventListener("click", function() {
    document.getElementById("signUpForm").style.display = "block";
    document.getElementById("signInForm").style.display = "none";
});

// Add ReCAPTCHA for Sign In and Sign Up forms
function renderCaptcha() {
    grecaptcha.render("captchaContainer", {
        sitekey: "YOUR_GOOGLE_RECAPTCHA_SITE_KEY", // Replace with your actual Google ReCAPTCHA site key
    });

    grecaptcha.render("signupCaptchaContainer", {
        sitekey: "YOUR_GOOGLE_RECAPTCHA_SITE_KEY", // Replace with your actual Google ReCAPTCHA site key
    });
}

// Form Submission Logic
document.getElementById("signInFormDetails").addEventListener("submit", function(event) {
    event.preventDefault();

    // Add email submission logic here
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Here you can make an AJAX request to your server to handle the login process
    console.log("Sign In - Email:", email, "Password:", password);
    
    // For demonstration, simulate a successful submission
    alert("Sign In successful!");
});

document.getElementById("signUpFormDetails").addEventListener("submit", function(event) {
    event.preventDefault();

    // Add email submission logic here
    const signupEmail = document.getElementById("signupEmail").value;
    const signupPassword = document.getElementById("signupPassword").value;

    // Here you can make an AJAX request to your server to handle the sign-up process
    console.log("Sign Up - Email:", signupEmail, "Password:", signupPassword);
    
    // For demonstration, simulate a successful submission
    alert("Sign Up successful!");
});

// Call the renderCaptcha function to display the captcha when the page loads
window.onload = renderCaptcha;
