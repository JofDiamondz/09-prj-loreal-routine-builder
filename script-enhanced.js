/* ===========================================
   L'Oréal Product-Aware Routine Builder
   =========================================== */

// Global variables for application state
let allProducts = [];
let selectedProducts = [];
let chatHistory = [];

/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productSearch = document.getElementById("productSearch");
const productsContainer = document.getElementById("productsContainer");
const selectedProductsList = document.getElementById("selectedProductsList");
const generateRoutineBtn = document.getElementById("generateRoutine");
const clearAllBtn = document.getElementById("clearAllBtn");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");

// Modal elements
const productModal = document.getElementById("productModal");
const modalClose = document.getElementById("modalClose");
const modalProductImage = document.getElementById("modalProductImage");
const modalProductName = document.getElementById("modalProductName");
const modalProductBrand = document.getElementById("modalProductBrand");
const modalProductCategory = document.getElementById("modalProductCategory");
const modalProductDescription = document.getElementById(
  "modalProductDescription"
);
const modalSelectBtn = document.getElementById("modalSelectBtn");

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category above to view products
  </div>
`;

/* ===========================================
   PRODUCT DATA & DISPLAY FUNCTIONS
   =========================================== */

/* Load product data from JSON file */
async function loadProducts() {
  try {
    const response = await fetch("products.json");
    const data = await response.json();
    allProducts = data.products;
    return allProducts;
  } catch (error) {
    console.error("Error loading products:", error);
    displayError("Failed to load products. Please refresh the page.");
    return [];
  }
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  if (products.length === 0) {
    productsContainer.innerHTML = `
      <div class="placeholder-message">
        No products found matching your criteria
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = products
    .map((product) => {
      const isSelected = selectedProducts.some((p) => p.id === product.id);
      return `
        <div class="product-card ${isSelected ? "selected" : ""}" 
             data-product-id="${product.id}"
             onclick="toggleProductSelection(${product.id})"
             ondblclick="showProductModal(${product.id})">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-info">
            <div class="brand">${product.brand}</div>
            <h3>${product.name}</h3>
            <div class="category">${formatCategory(product.category)}</div>
          </div>
        </div>
      `;
    })
    .join("");
}

/* Format category name for display */
function formatCategory(category) {
  return category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/* Filter products based on category and search term */
function filterProducts() {
  const selectedCategory = categoryFilter.value;
  const searchTerm = productSearch.value.toLowerCase().trim();

  let filteredProducts = allProducts;

  // Filter by category if selected
  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === selectedCategory
    );
  }

  // Filter by search term if provided
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
  }

  displayProducts(filteredProducts);
}

/* ===========================================
   PRODUCT SELECTION MANAGEMENT
   =========================================== */

/* Toggle product selection */
function toggleProductSelection(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const existingIndex = selectedProducts.findIndex((p) => p.id === productId);

  if (existingIndex === -1) {
    // Add product to selection
    selectedProducts.push(product);
    addChatMessage("system", `✨ Added "${product.name}" to your routine`);
  } else {
    // Remove product from selection
    selectedProducts.splice(existingIndex, 1);
    addChatMessage("system", `🗑️ Removed "${product.name}" from your routine`);
  }

  updateSelectedProductsDisplay();
  saveToLocalStorage();

  // Update product card visual state
  filterProducts();
}

/* Update the selected products display */
function updateSelectedProductsDisplay() {
  if (selectedProducts.length === 0) {
    selectedProductsList.innerHTML = `
      <div class="placeholder-message" style="font-size: 16px; color: #999; text-align: center; width: 100%;">
        No products selected yet. Click on products above to add them to your routine.
      </div>
    `;
    generateRoutineBtn.disabled = true;
    clearAllBtn.style.display = "none";
    return;
  }

  selectedProductsList.innerHTML = selectedProducts
    .map(
      (product) => `
      <div class="selected-product-item">
        <span>${product.name}</span>
        <button class="remove-btn" onclick="toggleProductSelection(${product.id})" title="Remove from routine">
          ×
        </button>
      </div>
    `
    )
    .join("");

  generateRoutineBtn.disabled = false;
  clearAllBtn.style.display = "inline-block";
}

/* Clear all selected products */
function clearAllProducts() {
  selectedProducts = [];
  updateSelectedProductsDisplay();
  saveToLocalStorage();
  filterProducts();
  addChatMessage("system", "🧹 Cleared all products from your routine");
}

/* ===========================================
   PRODUCT MODAL FUNCTIONALITY
   =========================================== */

/* Show product detail modal */
function showProductModal(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  modalProductImage.src = product.image;
  modalProductImage.alt = product.name;
  modalProductName.textContent = product.name;
  modalProductBrand.textContent = product.brand;
  modalProductCategory.textContent = formatCategory(product.category);
  modalProductDescription.textContent = product.description;

  const isSelected = selectedProducts.some((p) => p.id === productId);
  modalSelectBtn.innerHTML = isSelected
    ? '<i class="fa-solid fa-check"></i> Added to Routine'
    : '<i class="fa-solid fa-plus"></i> Add to My Routine';
  modalSelectBtn.disabled = isSelected;
  modalSelectBtn.onclick = () => {
    if (!isSelected) {
      toggleProductSelection(productId);
      closeProductModal();
    }
  };

  productModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

/* Close product modal */
function closeProductModal() {
  productModal.classList.remove("active");
  document.body.style.overflow = "auto";
}

/* ===========================================
   CHAT & AI INTEGRATION
   =========================================== */

/* Add message to chat window */
function addChatMessage(type, content) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${type}`;
  messageDiv.textContent = content;
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Show loading indicator */
function showLoadingIndicator() {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "loading-indicator";
  loadingDiv.innerHTML = `
    <span>L'Oréal Assistant is thinking</span>
    <div class="loading-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  chatWindow.appendChild(loadingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return loadingDiv;
}

/* Generate personalized routine using AI */
async function generateRoutine() {
  if (selectedProducts.length === 0) {
    addChatMessage(
      "system",
      "⚠️ Please select at least one product to generate a routine"
    );
    return;
  }

  const loadingIndicator = showLoadingIndicator();
  generateRoutineBtn.disabled = true;

  try {
    const routinePrompt = `Create a personalized skincare/beauty routine using these selected products:

${selectedProducts
  .map(
    (product) =>
      `• ${product.name} by ${product.brand} (${product.category}): ${product.description}`
  )
  .join("\n")}

Please provide:
1. A complete step-by-step routine (morning and/or evening)
2. The optimal order of application
3. Frequency recommendations for each product
4. Any special tips for maximum effectiveness
5. Compatibility notes between products

Keep the response elegant, informative, and tailored to these specific products.`;

    const response = await callOpenAI(routinePrompt, true);

    loadingIndicator.remove();
    addChatMessage("assistant", response);

    // Add routine to chat history for context
    chatHistory.push({
      role: "user",
      content: `Generate routine for: ${selectedProducts
        .map((p) => p.name)
        .join(", ")}`,
    });
    chatHistory.push({
      role: "assistant",
      content: response,
    });
  } catch (error) {
    loadingIndicator.remove();
    console.error("Error generating routine:", error);
    addChatMessage(
      "system",
      "❌ Sorry, there was an error generating your routine. Please try again."
    );
  } finally {
    generateRoutineBtn.disabled = false;
  }
}

/* Handle chat form submission */
async function handleChatSubmission(event) {
  event.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  // Add user message to chat
  addChatMessage("user", message);
  userInput.value = "";

  // Show loading indicator
  const loadingIndicator = showLoadingIndicator();

  try {
    // Prepare context with selected products and chat history
    let contextPrompt = message;

    if (selectedProducts.length > 0) {
      contextPrompt = `User's selected products:
${selectedProducts
  .map(
    (product) => `• ${product.name} by ${product.brand} (${product.category})`
  )
  .join("\n")}

User question: ${message}`;
    }

    const response = await callOpenAI(contextPrompt, false);

    loadingIndicator.remove();
    addChatMessage("assistant", response);

    // Add to chat history
    chatHistory.push({
      role: "user",
      content: message,
    });
    chatHistory.push({
      role: "assistant",
      content: response,
    });

    // Keep chat history manageable (last 10 exchanges)
    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(-20);
    }
  } catch (error) {
    loadingIndicator.remove();
    console.error("Error in chat:", error);
    addChatMessage(
      "system",
      "❌ Sorry, I encountered an error. Please try asking again."
    );
  }
}

/* Call OpenAI API through Cloudflare Worker */
async function callOpenAI(message, isRoutineGeneration = false) {
  const requestBody = {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...chatHistory,
      {
        role: "user",
        content: message,
      },
    ],
    temperature: 0.7,
    max_tokens: isRoutineGeneration ? 1000 : 500,
  };

  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/* ===========================================
   LOCAL STORAGE & PERSISTENCE
   =========================================== */

/* Save selected products to localStorage */
function saveToLocalStorage() {
  try {
    localStorage.setItem(
      "lorealSelectedProducts",
      JSON.stringify(selectedProducts)
    );
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

/* Load selected products from localStorage */
function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem("lorealSelectedProducts");
    if (saved) {
      selectedProducts = JSON.parse(saved);
      updateSelectedProductsDisplay();
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    selectedProducts = [];
  }
}

/* ===========================================
   ERROR HANDLING
   =========================================== */

/* Display error message to user */
function displayError(message) {
  productsContainer.innerHTML = `
    <div class="placeholder-message" style="color: var(--loreal-red);">
      ❌ ${message}
    </div>
  `;
}

/* ===========================================
   EVENT LISTENERS & INITIALIZATION
   =========================================== */

/* Category filter change event */
categoryFilter.addEventListener("change", filterProducts);

/* Product search input event */
productSearch.addEventListener("input", filterProducts);

/* Generate routine button click */
generateRoutineBtn.addEventListener("click", generateRoutine);

/* Clear all products button click */
clearAllBtn.addEventListener("click", clearAllProducts);

/* Chat form submission */
chatForm.addEventListener("submit", handleChatSubmission);

/* Modal close events */
modalClose.addEventListener("click", closeProductModal);
productModal.addEventListener("click", (e) => {
  if (e.target === productModal) {
    closeProductModal();
  }
});

/* Escape key to close modal */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && productModal.classList.contains("active")) {
    closeProductModal();
  }
});

/* ===========================================
   APPLICATION INITIALIZATION
   =========================================== */

/* Initialize the application */
async function initializeApp() {
  // Load products data
  await loadProducts();

  // Load saved selections from localStorage
  loadFromLocalStorage();

  // Add welcome message to chat
  addChatMessage(
    "assistant",
    `✨ Welcome to L'Oréal's Smart Routine Builder! I'm here to help you create the perfect beauty routine.

🔸 Browse products by category or search by name
🔸 Click products to add them to your routine  
🔸 Double-click for detailed product information
🔸 Generate a personalized routine when ready
🔸 Ask me any questions about your products!

How can I assist you today?`
  );

  console.log("L'Oréal Routine Builder initialized successfully");
}

/* Start the application when DOM is loaded */
document.addEventListener("DOMContentLoaded", initializeApp);
