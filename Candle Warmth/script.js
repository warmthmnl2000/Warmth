const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
    // Toggle mobile menu visibility
    document.body.classList.toggle("show-mobile-menu");
});

// Close menu when the close button is clicked
menuCloseButton.addEventListener("click", () => menuOpenButton.click ());

// Scrolling down of header/navbar hide
document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("header");
    let lastScrollY = window.scrollY;
    let isHidden = false;
   
    window.addEventListener("scroll", function () {
        let currentScrollY = window.scrollY;
        const contactSection = document.querySelector("#contact");
        const productSection = document.querySelector("#product");
        const aboutSection = document.querySelector("#about");
       
        if (currentScrollY < lastScrollY) {
            header.style.transform = "translateY(0)"; // Show navbar when scrolling up
            header.style.transition = "transform 0.3s ease-in-out";
            isHidden = false;
        } else if (!isHidden && (isInView(contactSection) || isInView(productSection) || isInView(aboutSection))) {
            header.style.transform = "translateY(-100%)"; // Smooth hide navbar when scrolling down
            header.style.transition = "transform 0.6s ease-in-out";
            isHidden = true;
        }
       
        lastScrollY = currentScrollY;
    });
   
    function isInView(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= window.innerHeight && rect.bottom >= 0;
    }
});

// Get DOM Elements
const cartContainer = document.getElementById('cart-container');
const cartCloseButton = document.getElementById('cart-close-button');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartIcon = document.getElementById('cart-icon');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartItemCount = document.querySelector('.cart-item-count');
let cart = [];

// Function to toggle cart visibility
function toggleCart() {
    cartContainer.classList.toggle('show');
}

// Event listeners for Add to Cart buttons
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const productName = e.target.getAttribute('data-name');
        const productPrice = e.target.getAttribute('data-price');
        const productImage = e.target.getAttribute('data-image');
       
        // Add product to cart
        const existingProduct = cart.find(item => item.name === productName);
        if (existingProduct) {
            existingProduct.quantity += 1;  // If product already in cart, increase quantity
        } else {
            cart.push({ name: productName, price: parseFloat(productPrice), image: productImage, quantity: 1 });
        }

        // Update cart icon item count
        cartItemCount.textContent = cart.length;

        // Update cart modal
        updateCartModal();

        // Show cart with slide animation
        cartContainer.classList.add('show');
    });
});

// Function to update the cart modal
function updateCartModal() {
    cartItemsContainer.innerHTML = '';  // Clear current cart items

    let total = 0;
    cart.forEach((item, index) => {
        // Create a new cart item
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
    <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>₱${item.price}</p>
    </div>
    <div class="cart-item-quantity">
        <button class="quantity-decrease" data-index="${index}">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-increase" data-index="${index}">+</button>
    </div>
    <button class="remove-item" data-index="${index}">Remove</button>
`;
        cartItemsContainer.appendChild(cartItem);

        total += item.price * item.quantity;
    });

    // Update the total price
    cartTotal.textContent = `₱${total.toFixed(2)}`;

    // Add event listeners for remove buttons
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cart.splice(index, 1); // Remove item from cart
            updateCartModal(); // Re-render the cart modal
            cartItemCount.textContent = cart.length; // Update the cart count
        });
    });

    // Add event listeners for quantity buttons
    const quantityIncreaseButtons = document.querySelectorAll('.quantity-increase');
    const quantityDecreaseButtons = document.querySelectorAll('.quantity-decrease');

    quantityIncreaseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cart[index].quantity += 1; // Increase quantity
            updateCartModal(); // Re-render the cart modal
        });
    });

    quantityDecreaseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1; // Decrease quantity
                updateCartModal(); // Re-render the cart modal
            }
        });
    });
}

// Event listeners to toggle cart visibility
cartIcon.addEventListener('click', toggleCart);
cartCloseButton.addEventListener('click', toggleCart);

// Checkout Modal & Payment Handling
const checkoutButton = document.getElementById('checkout-button');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutCloseButton = document.getElementById('checkout-close-button');
const checkoutItemsContainer = document.getElementById('checkout-items');
const paymentMethodSelect = document.getElementById('payment-method');
const gcashQR = document.getElementById('gcash-qr');
const checkoutTotal = document.getElementById('checkout-total');
const locationInput = document.getElementById('location');
const shippingCostSpan = document.getElementById('shipping-cost');
const confirmOrderButton = document.getElementById('confirm-order');

// Show the checkout modal
checkoutButton.addEventListener('click', () => {
    checkoutModal.classList.add('show');
    updateCheckoutModal();
});

// Close the checkout modal
checkoutCloseButton.addEventListener('click', () => {
    checkoutModal.classList.remove('show');
});

// Update Checkout Modal with Cart Items (Auto-total Update)
function updateCheckoutModal() {
    checkoutItemsContainer.innerHTML = '';  // Clear current checkout items

    let total = 0;
    cart.forEach(item => {
        const checkoutItem = document.createElement('div');
        checkoutItem.classList.add('cart-item');
        checkoutItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₱${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
            </div>
        `;
        checkoutItemsContainer.appendChild(checkoutItem);

        total += item.price * item.quantity;
    });

    // Get shipping cost based on location
    const shippingCost = getShippingCost(locationInput.value.trim());
    shippingCostSpan.textContent = `₱${shippingCost}`;
   
    // Update total with shipping cost
    checkoutTotal.textContent = `₱${(total + shippingCost).toFixed(2)}`;
}

// Event listener for location input change
locationInput.addEventListener('input', updateCheckoutModal); // Update checkout modal when location input changes

// Calculate Shipping Cost Based on Location (Updated with Philippine Locations)
function getShippingCost(location) {
    // Default shipping cost is 0 until a location is entered
    if (!location) {
        return 0; // Default to 0 shipping cost if no location
    }

    // Define shipping costs based on location
    const locationRanges = {
        // Free Shipping (₱0) – Metro Manila & Nearby Areas
        'Select': 0, 'Parañaque': 0, 'Las Piñas': 0, 
       
        // ₱36 Shipping
        'Pasig': 36, 'Taguig': 36, 'Manila': 36, 'Bacoor': 36, 'Imus': 36,
        'Mandaluyong': 36, 'Quezon City': 36, 'Pasay': 36,

        // ₱50 Shipping – Nearby Provinces
        'Dasmariñas': 50, 'General Trias': 50, 'Kawit': 50, 'Rosario': 50,
        'San Pedro': 50, 'Biñan': 50, 'Santa Rosa': 50, 'Cabuyao': 50, 'Calamba': 50,
        'Meycauayan': 50, 'Marilao': 50, 'Bocaue': 50, 'Balagtas': 50, 'Santa Maria': 50, 'Malolos': 50, 'San Jose del Monte': 50,
        'Cainta': 50, 'Antipolo': 50, 'Taytay': 50, 'San Mateo': 50, 'Rodriguez': 50, 'Angono': 50,

        // ₱100 Shipping – Mid-Distance Provinces
        'Lipa': 100, 'Batangas City': 100, 'Santo Tomas': 100, 'Nasugbu': 100, 'Tanauan': 100,
        'San Fernando (Pampanga)': 100, 'Angeles': 100, 'Mabalacat': 100, 'Guagua': 100,
        'Tarlac City': 100, 'Capas': 100, 'Concepcion': 100, 'Paniqui': 100,
        'Cabanatuan': 100, 'Gapan': 100, 'Palayan': 100, 'San Jose City': 100,
        'Olongapo': 100, 'Subic': 100, 'Iba': 100,

        // ₱150 Shipping – Farther Provinces
        'Dagupan': 150, 'Alaminos': 150, 'Urdaneta': 150, 'Lingayen': 150,
        'San Fernando (La Union)': 150, 'Agoo': 150, 'Bauang': 150, 'Rosario (La Union)': 150,
        'Balanga': 150, 'Mariveles': 150, 'Orani': 150, 'Dinalupihan': 150,
        'Lucena': 150, 'Tayabas': 150, 'Sariaya': 150, 'Candelaria': 150,

        // ₱200 Shipping – Remote & Island Areas
        'Laoag': 200, 'Batac': 200, 'Pagudpud': 200,
        'Vigan': 200, 'Candon': 200, 'Narvacan': 200,
        'Legazpi': 200, 'Naga': 200, 'Sorsogon': 200, 'Masbate': 200, 'Virac': 200, 'Daet': 200,
        'Puerto Princesa': 250, 'El Nido': 250, 'Coron': 250, 'Brooke’s Point': 250,
        'Cebu City': 250, 'Iloilo': 250, 'Bacolod': 250, 'Dumaguete': 250, 'Tacloban': 250, 'Bohol': 250, 'Boracay': 250,
        'Davao City': 300, 'Cagayan de Oro': 300, 'Zamboanga': 300, 'Butuan': 300, 'General Santos': 300, 'Surigao': 300, 'Cotabato': 300,
    };

    // Check if location exists in the locationRanges object
    return locationRanges[location] !== undefined ? locationRanges[location] : 300;
}

// Handle Payment Method Change
paymentMethodSelect.addEventListener('change', (e) => {
    if (e.target.value === 'GCash') {
        gcashQR.style.display = 'block';
    } else {
        gcashQR.style.display = 'none';
    }
});

// Confirm Order (Handle Checkout Confirmation)
confirmOrderButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (!location) {
        alert('Please enter your location.');
        return;
    }

    alert('Your order has been confirmed!');
    cart = []; // Clear the cart
    cartItemCount.textContent = 0;
    checkoutModal.classList.remove('show'); // Close checkout modal
});

document.getElementById("confirm-order").addEventListener("click", function() {
    const customerEmail = document.getElementById("customer-email").value;
    const customerName = document.getElementById("customer-name").value; 
    const orderDetails = cart.map(item => `${item.name} x${item.quantity} - ₱${item.price * item.quantity}`).join("\n");
    const totalAmount = document.getElementById("checkout-total").textContent;

    emailjs.send("service_kxdjq6g", "template_4tsguch", {
        customer_name: customerName,
        to_email: customerEmail,
        order_details: orderDetails,
        total_amount: totalAmount
    }, "II0yT0ppSZ8M0fCCZ")
    .then(response => {
        alert("Order confirmed! Check your email.");
        console.log("Email sent:", response);
        cart = [];
        updateCartModal();
    })
    .catch(error => {
        console.error("Error sending email:", error);
        alert("Failed to send confirmation email.");
    });
});

// Toggle between Sign Up and Sign In Forms
document.getElementById('sign-in-icon').addEventListener('click', function() {
    document.getElementById('auth-container').style.display = 'flex';
});

document.getElementById('sign-up-link').addEventListener('click', function() {
    document.getElementById('sign-in-form').style.display = 'none';
    document.getElementById('sign-up-form').style.display = 'block';
});

document.getElementById('sign-in-link').addEventListener('click', function() {
    document.getElementById('sign-up-form').style.display = 'none';
    document.getElementById('sign-in-form').style.display = 'block';
});

// Close the modal when clicked outside or on close button
document.getElementById('auth-container').addEventListener('click', function(e) {
    if (e.target === this || e.target === document.getElementById('close-btn') || e.target === document.getElementById('close-btn-sign-in')) {
        document.getElementById('auth-container').style.display = 'none';
    }
});

// Validate Sign-Up Form
document.getElementById('sign-up-btn').addEventListener('click', function(e) {
    e.preventDefault();
    let valid = true;

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(function(error) {
        error.style.display = 'none';
    });

    // Get form inputs
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate Name
    if (name === '') {
        document.getElementById('name-error').style.display = 'block';
        valid = false;
    }

    // Validate Email
    if (email === '') {
        document.getElementById('email-error').style.display = 'block';
        valid = false;
    }

    // Validate Password
    if (password === '') {
        document.getElementById('password-error').style.display = 'block';
        valid = false;
    }

    // Validate Confirm Password
    if (confirmPassword === '') {
        document.getElementById('confirm-password-error').style.display = 'block';
        valid = false;
    } else if (password !== confirmPassword) {
        document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
        document.getElementById('confirm-password-error').style.display = 'block';
        valid = false;
    }

    // If all fields are valid, submit the form
    if (valid) {
        signInUser(email);
    }
});

// Validate Sign-In Form
document.getElementById('sign-in-btn').addEventListener('click', function(e) {
    e.preventDefault();
    let valid = true;

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(function(error) {
        error.style.display = 'none';
    });

    // Get form inputs
    const signInEmail = document.getElementById('sign-in-email').value;
    const signInPassword = document.getElementById('sign-in-password').value;

    // Validate Email
    if (signInEmail === '') {
        document.getElementById('sign-in-email-error').style.display = 'block';
        valid = false;
    }

    // Validate Password
    if (signInPassword === '') {
        document.getElementById('sign-in-password-error').style.display = 'block';
        valid = false;
    }

    // If all fields are valid, submit the form
    if (valid) {
        signInUser(signInEmail);
    }
});

// Handle user sign-in after sign-up
function signInUser(email) {
    console.log('User signed in with email:', email);
    document.getElementById('auth-container').style.display = 'none';
}

// Close Privacy Policy popup
document.getElementById('privacy-policy-link').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('privacy-popup').style.display = 'block';
});

document.getElementById('close-privacy-btn').addEventListener('click', function() {
    document.getElementById('privacy-popup').style.display = 'none';
});


// Chatbot Section
document.addEventListener("DOMContentLoaded", function () {
    const chatbotContainer = document.querySelector(".chatbot-container");
    const chatToggle = document.getElementById("chat-toggle");
    const closeBtn = document.querySelector(".close-btn");
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
    const chatMessages = document.querySelector(".chat-body");
    const suggestedBtns = document.querySelectorAll(".suggested-btn");

    // Toggle chatbot visibility
    chatToggle.addEventListener("click", function () {
        chatbotContainer.classList.toggle("show-chat");
    });

    // Close chatbot when "X" is clicked
    closeBtn.addEventListener("click", function () {
        chatbotContainer.classList.remove("show-chat");
    });

    // Send message function
    function sendMessage(message) {
        if (message.trim() === "") return;

        const userMessage = document.createElement("div");
        userMessage.textContent = message;
        userMessage.classList.add("user-message");
        chatMessages.appendChild(userMessage);

        setTimeout(() => {
            const botResponse = document.createElement("div");
            botResponse.textContent = getBotResponse(message);
            botResponse.classList.add("bot-response");
            chatMessages.appendChild(botResponse);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 500);

        userInput.value = "";
    }

    // Get bot response
    function getBotResponse(message) {
        message = message.toLowerCase();
        const responses = {
            "what products do you have?": "We have candles available in different sizes, colors and scents.",
            "how much is shipping?": "Shipping costs depend on your location.",
            "how to place an order?": "You can place an order through our website by selecting a product and checking out.",
            "where is your shop located?": "We are located at Sparkle Wash at 407 Quirino Ave, Don Galo, Parañaque, Metro Manila.",
            "hello": "Hi there! How can I help you today?",
            "hi": "Hello there! How can I help you today?",
            "thanks": "You're welcome!",
        };
        return responses[message] || "I'm not sure about that. Please ask something else!";
    }

    // Handle send button click
    sendBtn.addEventListener("click", function () {
        sendMessage(userInput.value);
    });

    // Handle enter key press
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage(userInput.value);
        }
    });

    // Handle suggested questions
    suggestedBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            sendMessage(btn.textContent);
        });
    });
});


