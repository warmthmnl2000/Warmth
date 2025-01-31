const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
    // Toggle mobile menu visibility
    document.body.classList.toggle("show-mobile-menu");
});

// Close menu when the close button is clicked
menuCloseButton.addEventListener("click", () => menuOpenButton.click ());

// Initialize Swiper
const swiper = new Swiper('.slider-wrapper', {
    loop: true,
 
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
 
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  function showProductDetails(productId) {
    const modal = document.getElementById('product-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalSalePrice = document.getElementById('modal-sale-price');
    const modalOriginalPrice = document.getElementById('modal-original-price');
    const modalDescription = document.getElementById('modal-description');

    let productDetails = {};
    if (productId === 'product1') {
        productDetails = {
            imgSrc: 'seta.png',
            title: 'Cozy Glow',
            description: 'Sand Candle Set A (6oz, 100g, + 1 Essential Oil)',
            salePrice: '₱170',
            originalPrice: '₱200',
        };
    } else if (productId === 'product2') {
        productDetails = {
            imgSrc: 'setb.png',
            title: 'Tranquil Haven',
            description: 'Sand Candle Set B  (9oz, 150g, + 1 Essential Oil)',
            salePrice: '₱221',
            originalPrice: '₱245',
        };
    } else if (productId === 'product3') {
        productDetails = {
            imgSrc: 'set c.png',
            title: 'Serene Retreat',
            description: 'Sand Candle Set C (10oz, 200g, + 1 Essential Oil)',
            salePrice: '₱255',
            originalPrice: '₱273',
        };
    }

    modalImg.src = productDetails.imgSrc;
    modalTitle.textContent = productDetails.title;
    modalSalePrice.textContent = productDetails.salePrice;
    modalOriginalPrice.textContent = productDetails.originalPrice;
    modalDescription.textContent = productDetails.description;

    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.style.display = 'none';
}

function decreaseQuantity() {
    const quantity = document.getElementById('quantity-value');
    let currentValue = parseInt(quantity.value, 10); // Use input field's value
    if (currentValue > 1) {
        quantity.value = currentValue - 1; // Update input field value
    }
}

function increaseQuantity() {
    const quantity = document.getElementById('quantity-value');
    let currentValue = parseInt(quantity.value, 10); // Use input field's value
    quantity.value = currentValue + 1; // Update input field value
}

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section-content");

  // Add click event to nav links
  navLinks.forEach(link => {
      link.addEventListener("click", function (e) {
          e.preventDefault(); // Prevent default anchor behavior
          const targetId = link.getAttribute("href").substring(1); // Get section ID
          const targetSection = document.getElementById(targetId);

          // Scroll to the section
          targetSection.scrollIntoView({ behavior: "smooth" });

          // Highlight the section (add animation)
          sections.forEach(section => section.classList.remove("active")); // Reset others
          targetSection.querySelector(".section-content").classList.add("active");
      });
  });

  // Add animation when scrolling into view (Intersection Observer)
  const observerOptions = {
      threshold: 0.3 // Trigger when 30% of the section is visible
  };

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add("active");
          }
      });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
});

// Open the Sign-In Section (Full Page Overlay)
document.querySelector('.sign-in-btn').addEventListener('click', function() {
    document.querySelector('.sign-in-section').style.display = 'flex';
});

// Close the Sign-In Section (Full Page Overlay)
document.querySelector('.close-btn').addEventListener('click', function() {
    document.querySelector('.sign-in-section').style.display = 'none';
});

// Show Privacy Statement Modal (When Privacy Policy is clicked)
function showPrivacyStatement() {
    alert("Privacy Policy: We value your privacy and will never share your personal information.");
}

// Handle the Sign-In Form Submission
document.querySelector('#sign-in-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // You can add form validation and logic here (e.g., check captcha, email, etc.)
    alert('Sign-In Successful');
    document.querySelector('.sign-in-section').style.display = 'none'; // Close after submission
});

// Show the Privacy Policy Modal when clicking on the Privacy Policy link
function showPrivacyStatement() {
    document.querySelector('.privacy-modal').style.display = 'flex';
}

// Close the Privacy Policy Modal
document.querySelector('.close-privacy').addEventListener('click', function() {
    document.querySelector('.privacy-modal').style.display = 'none';
});

// Handle the I Agree button in Privacy Policy Modal
document.querySelector('.accept-privacy').addEventListener('click', function() {
    alert('Thank you for accepting our Privacy Policy!');
    document.querySelector('.privacy-modal').style.display = 'none'; // Close the modal after acceptance
});

// Example product data (replace with your actual product data)
const products = [
    { id: 1, name: "Set A", price: 170, image: document.querySelector("[onclick=\"showProductDetails('product1')\"] img").src },
    { id: 2, name: "Set B", price: 221, image: document.querySelector("[onclick=\"showProductDetails('product2')\"] img").src },
    { id: 3, name: "Set C", price: 255, image: document.querySelector("[onclick=\"showProductDetails('product3')\"] img").src },
];

const cart = [];
const cartItemsContainer = document.getElementById("cart-items");
const summarySubtotal = document.getElementById("summary-subtotal");
const summaryTotal = document.getElementById("summary-total");


// Add item to cart
function addToCart(item) {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    renderCartItems();
}

// Render cart items
function renderCartItems() {
    cartItemsContainer.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item) => {
        subtotal += item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <div class="cart-item-details">
                <img src="${item.image}" alt="${item.name}">
                <span>${item.name}</span>
            </div>
            <span>₱${item.price}</span>
            <div class="quantity-controls">
                <button class="decrease-quantity" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-quantity" data-id="${item.id}">+</button>
            </div>
            <span>₱${item.price * item.quantity}</span>
            <button class="remove-btn" data-id="${item.id}">Remove</button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    summarySubtotal.textContent = `₱${subtotal}`;
    summaryTotal.textContent = `₱${subtotal + 36}`; // Shipping fee is ₱36

    attachCartEventListeners();
}

// Event Listeners for buttons
function attachCartEventListeners() {
    document.querySelectorAll(".increase-quantity").forEach((button) => {
        button.addEventListener("click", (event) => {
            const itemId = parseInt(event.target.dataset.id, 10);
            const item = cart.find((cartItem) => cartItem.id === itemId);
            if (item) {
                item.quantity += 1;
                renderCartItems();
            }
        });
    });

    document.querySelectorAll(".decrease-quantity").forEach((button) => {
        button.addEventListener("click", (event) => {
            const itemId = parseInt(event.target.dataset.id, 10);
            const item = cart.find((cartItem) => cartItem.id === itemId);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                renderCartItems();
            }
        });
    });

    document.querySelectorAll(".remove-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const itemId = parseInt(event.target.dataset.id, 10);
            const itemIndex = cart.findIndex((cartItem) => cartItem.id === itemId);
            if (itemIndex > -1) {
                cart.splice(itemIndex, 1);
                renderCartItems();
            }
        });
    });

    document.addEventListener("DOMContentLoaded", function() {
        const cartIcon = document.querySelector(".cart-icon-btn");
        const shoppingCartPage = document.getElementById("shopping-cart-page");
        const closeCartButton = document.getElementById("close-cart-button");
        const cartCount = document.querySelector(".cart-count");
       
        let cartItemCount = 0;
       
        cartIcon.addEventListener("click", function() {
            shoppingCartPage.style.display = "block";
        });
       
        closeCartButton.addEventListener("click", function() {
            shoppingCartPage.style.display = "none";
        });
       
        document.addEventListener("click", function(event) {
            if (event.target.classList.contains("add-to-cart")) {
                cartItemCount++;
                cartCount.textContent = cartItemCount;
            }
        });
    });
}

// Example: Adding products to the cart
addToCart(products[0]); // Add the first product for testing
