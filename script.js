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

/* Additional DOM elements for new features */
const languageSelector = document.getElementById("languageSelector");
const webSearchEnabled = document.getElementById("webSearchEnabled");

/* Show initial placeholder until user selects a category */
const t = getTranslations("en"); // Default to English initially
productsContainer.innerHTML = `
  <div class="placeholder-message">
    ${t.selectCategory}
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
  const t = getTranslations(getCurrentLanguage());

  if (products.length === 0) {
    productsContainer.innerHTML = `
      <div class="placeholder-message">
        ${t.noProductsFound}
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
            <div class="category">${
              t.categories[product.category] || formatCategory(product.category)
            }</div>
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
   LANGUAGE & RTL SUPPORT
   =========================================== */

/* Language configurations */
const languages = {
  en: { name: "English", dir: "ltr" },
  ar: { name: "العربية", dir: "rtl" },
  he: { name: "עברית", dir: "rtl" },
  fr: { name: "Français", dir: "ltr" },
  es: { name: "Español", dir: "ltr" },
};

/* Change language and text direction */
function changeLanguage(langCode) {
  const lang = languages[langCode];
  if (!lang) return;

  document.documentElement.lang = langCode;
  document.documentElement.dir = lang.dir;

  // Save language preference
  localStorage.setItem("lorealLanguage", langCode);

  // Update all UI texts based on language
  updateAllTexts(langCode);

  console.log(`Language changed to: ${lang.name} (${lang.dir})`);
}

/* Complete translations for all UI elements */
function getTranslations(langCode) {
  const translations = {
    en: {
      // Page title and main headings
      pageTitle: "L'Oréal Routine Builder",
      productSelection: "Product Selection",
      selectedProductsTitle: "Selected Products",
      chatTitle: "Let's Build Your Routine",

      // Navigation and controls
      categorySelect: "Choose a Category",
      search: "Search products by name or keyword...",
      chat: "Ask me about products or routines…",

      // Buttons
      generateRoutine: "✨ Generate My Routine",
      generateRoutineGenerating: "✨ Generating...",
      clearAll: "Clear All",
      addToRoutine: "Add to My Routine",
      addedToRoutine: "Added to Routine",
      removeFromRoutine: "Remove from routine",

      // Categories
      categories: {
        cleanser: "Face Cleanser",
        moisturizer: "Moisturizer",
        skincare: "Skincare & Serums",
        suncare: "Suncare",
        makeup: "Makeup",
        haircare: "Hair Care",
        "hair color": "Hair Color",
        "hair styling": "Hair Styling",
        "men's grooming": "Men's Grooming",
        fragrance: "Fragrance",
      },

      // Messages
      noProductsSelected:
        "No products selected yet. Click on products above to add them to your routine.",
      noProductsFound: "No products found matching your criteria",
      selectCategory: "Select a category above to view products",
      addedProduct: 'Added "{product}" to your routine',
      removedProduct: 'Removed "{product}" from your routine',
      clearedAll: "Cleared all products from your routine",
      selectAtLeastOne:
        "Please select at least one product to generate a routine",
      errorGenerating:
        "Sorry, there was an error generating your routine. Please try again.",
      errorChat: "Sorry, I encountered an error. Please try asking again.",

      // Web search
      webSearchEnabled:
        "Real-time product updates enabled (experimental feature)",
      webSearchDisabled: "Using local product database",
      searchingWeb: 'Searching for "{query}" with real-time updates...',
      searchComplete: "Search completed with latest product information",

      // Welcome message
      welcome: `✨ Welcome to L'Oréal's Smart Routine Builder! I'm here to help you create the perfect beauty routine.

🔸 Browse products by category or search by name
🔸 Click products to add them to your routine  
🔸 Double-click for detailed product information
🔸 Generate a personalized routine when ready
🔸 Ask me any questions about your products!

How can I assist you today?`,
    },
    ar: {
      pageTitle: "منشئ روتين لوريال",
      productSelection: "اختيار المنتجات",
      selectedProductsTitle: "المنتجات المختارة",
      chatTitle: "دعنا نبني روتينك",

      categorySelect: "اختر فئة",
      search: "ابحث عن المنتجات بالاسم أو الكلمة المفتاحية...",
      chat: "اسألني عن المنتجات أو الروتين...",

      generateRoutine: "✨ إنشاء روتيني",
      generateRoutineGenerating: "✨ جاري الإنشاء...",
      clearAll: "مسح الكل",
      addToRoutine: "إضافة إلى روتيني",
      addedToRoutine: "تمت الإضافة للروتين",
      removeFromRoutine: "إزالة من الروتين",

      categories: {
        cleanser: "منظف الوجه",
        moisturizer: "مرطب",
        skincare: "العناية بالبشرة والسيروم",
        suncare: "واقي الشمس",
        makeup: "مكياج",
        haircare: "العناية بالشعر",
        "hair color": "صبغة الشعر",
        "hair styling": "تصفيف الشعر",
        "men's grooming": "العناية بالرجال",
        fragrance: "العطور",
      },

      noProductsSelected:
        "لم يتم اختيار أي منتجات بعد. انقر على المنتجات أعلاه لإضافتها إلى روتينك.",
      noProductsFound: "لم يتم العثور على منتجات تطابق معاييرك",
      selectCategory: "اختر فئة أعلاه لعرض المنتجات",
      addedProduct: 'تمت إضافة "{product}" إلى روتينك',
      removedProduct: 'تمت إزالة "{product}" من روتينك',
      clearedAll: "تم مسح جميع المنتجات من روتينك",
      selectAtLeastOne: "يرجى اختيار منتج واحد على الأقل لإنشاء روتين",
      errorGenerating:
        "عذراً، حدث خطأ في إنشاء روتينك. يرجى المحاولة مرة أخرى.",
      errorChat: "عذراً، واجهت خطأ. يرجى المحاولة مرة أخرى.",

      webSearchEnabled: "تم تفعيل التحديثات الفورية للمنتجات (ميزة تجريبية)",
      webSearchDisabled: "استخدام قاعدة البيانات المحلية للمنتجات",
      searchingWeb: 'البحث عن "{query}" مع التحديثات الفورية...',
      searchComplete: "اكتمل البحث مع أحدث معلومات المنتجات",

      welcome: `✨ مرحباً بك في منشئ الروتين الذكي من لوريال! أنا هنا لمساعدتك في إنشاء روتين الجمال المثالي.

🔸 تصفح المنتجات حسب الفئة أو ابحث بالاسم
🔸 انقر على المنتجات لإضافتها إلى روتينك
🔸 انقر نقراً مزدوجاً للحصول على معلومات مفصلة عن المنتج
🔸 أنشئ روتيناً مخصصاً عندما تكون جاهزاً
🔸 اسألني أي أسئلة عن منتجاتك!

كيف يمكنني مساعدتك اليوم؟`,
    },
    he: {
      pageTitle: "בונה השגרה של לוריאל",
      productSelection: "בחירת מוצרים",
      selectedProductsTitle: "מוצרים נבחרים",
      chatTitle: "בואו נבנה את השגרה שלך",

      categorySelect: "בחר קטגוריה",
      search: "חפש מוצרים לפי שם או מילת מפתח...",
      chat: "שאל אותי על מוצרים או שגרות...",

      generateRoutine: "✨ צור את השגרה שלי",
      generateRoutineGenerating: "✨ יוצר...",
      clearAll: "נקה הכל",
      addToRoutine: "הוסף לשגרה שלי",
      addedToRoutine: "נוסף לשגרה",
      removeFromRoutine: "הסר מהשגרה",

      categories: {
        cleanser: "מנקה פנים",
        moisturizer: "קרם לחות",
        skincare: "טיפוח עור וסרום",
        suncare: "קרם הגנה",
        makeup: "איפור",
        haircare: "טיפוח שיער",
        "hair color": "צבע שיער",
        "hair styling": "עיצוב שיער",
        "men's grooming": "טיפוח גברים",
        fragrance: "בושם",
      },

      noProductsSelected:
        "עדיין לא נבחרו מוצרים. לחץ על מוצרים למעלה כדי להוסיף אותם לשגרה שלך.",
      noProductsFound: "לא נמצאו מוצרים התואמים את הקריטריונים שלך",
      selectCategory: "בחר קטגוריה למעלה כדי לצפות במוצרים",
      addedProduct: 'נוסף "{product}" לשגרה שלך',
      removedProduct: 'הוסר "{product}" מהשגרה שלך',
      clearedAll: "נוקו כל המוצרים מהשגרה שלך",
      selectAtLeastOne: "אנא בחר לפחות מוצר אחד כדי ליצור שגרה",
      errorGenerating: "מצטער, הייתה שגיאה ביצירת השגרה שלך. אנא נסה שוב.",
      errorChat: "מצטער, נתקלתי בשגיאה. אנא נסה לשאול שוב.",

      webSearchEnabled: "עדכונים בזמן אמת של מוצרים מופעלים (תכונה ניסיונית)",
      webSearchDisabled: "שימוש במסד נתונים מקומי של מוצרים",
      searchingWeb: 'מחפש "{query}" עם עדכונים בזמן אמת...',
      searchComplete: "החיפוש הושלם עם המידע העדכני ביותר על המוצרים",

      welcome: `✨ ברוכים הבאים לבונה השגרה החכם של לוריאל! אני כאן כדי לעזור לך ליצור את שגרת היופי המושלמת.

🔸 עיין במוצרים לפי קטגוריה או חפש לפי שם
🔸 לחץ על מוצרים כדי להוסיף אותם לשגרה שלך
🔸 לחץ לחיצה כפולה למידע מפורט על המוצר
🔸 צור שגרה מותאמת אישית כשאתה מוכן
🔸 שאל אותי כל שאלה על המוצרים שלך!

איך אני יכול לעזור לך היום?`,
    },
    fr: {
      pageTitle: "Créateur de Routine L'Oréal",
      productSelection: "Sélection de Produits",
      selectedProductsTitle: "Produits Sélectionnés",
      chatTitle: "Créons Votre Routine",

      categorySelect: "Choisir une catégorie",
      search: "Rechercher des produits par nom ou mot-clé...",
      chat: "Demandez-moi des produits ou des routines...",

      generateRoutine: "✨ Générer Ma Routine",
      generateRoutineGenerating: "✨ Génération...",
      clearAll: "Tout Effacer",
      addToRoutine: "Ajouter à Ma Routine",
      addedToRoutine: "Ajouté à la Routine",
      removeFromRoutine: "Retirer de la routine",

      categories: {
        cleanser: "Nettoyant Visage",
        moisturizer: "Hydratant",
        skincare: "Soins de la Peau et Sérums",
        suncare: "Protection Solaire",
        makeup: "Maquillage",
        haircare: "Soins Capillaires",
        "hair color": "Coloration Cheveux",
        "hair styling": "Coiffage Cheveux",
        "men's grooming": "Soins Homme",
        fragrance: "Parfum",
      },

      noProductsSelected:
        "Aucun produit sélectionné pour le moment. Cliquez sur les produits ci-dessus pour les ajouter à votre routine.",
      noProductsFound: "Aucun produit trouvé correspondant à vos critères",
      selectCategory:
        "Sélectionnez une catégorie ci-dessus pour voir les produits",
      addedProduct: 'Ajouté "{product}" à votre routine',
      removedProduct: 'Retiré "{product}" de votre routine',
      clearedAll: "Effacé tous les produits de votre routine",
      selectAtLeastOne:
        "Veuillez sélectionner au moins un produit pour générer une routine",
      errorGenerating:
        "Désolé, il y a eu une erreur lors de la génération de votre routine. Veuillez réessayer.",
      errorChat: "Désolé, j'ai rencontré une erreur. Veuillez réessayer.",

      webSearchEnabled:
        "Mises à jour des produits en temps réel activées (fonctionnalité expérimentale)",
      webSearchDisabled:
        "Utilisation de la base de données locale des produits",
      searchingWeb:
        'Recherche de "{query}" avec des mises à jour en temps réel...',
      searchComplete:
        "Recherche terminée avec les dernières informations produits",

      welcome: `✨ Bienvenue dans le Créateur de Routine Intelligent de L'Oréal ! Je suis là pour vous aider à créer la routine beauté parfaite.

🔸 Parcourez les produits par catégorie ou recherchez par nom
🔸 Cliquez sur les produits pour les ajouter à votre routine
🔸 Double-cliquez pour des informations détaillées sur le produit
🔸 Générez une routine personnalisée quand vous êtes prêt
🔸 Posez-moi toute question sur vos produits !

Comment puis-je vous aider aujourd'hui ?`,
    },
    es: {
      pageTitle: "Creador de Rutina L'Oréal",
      productSelection: "Selección de Productos",
      selectedProductsTitle: "Productos Seleccionados",
      chatTitle: "Creemos Tu Rutina",

      categorySelect: "Elegir una categoría",
      search: "Buscar productos por nombre o palabra clave...",
      chat: "Pregúntame sobre productos o rutinas...",

      generateRoutine: "✨ Generar Mi Rutina",
      generateRoutineGenerating: "✨ Generando...",
      clearAll: "Limpiar Todo",
      addToRoutine: "Añadir a Mi Rutina",
      addedToRoutine: "Añadido a la Rutina",
      removeFromRoutine: "Quitar de la rutina",

      categories: {
        cleanser: "Limpiador Facial",
        moisturizer: "Hidratante",
        skincare: "Cuidado de la Piel y Sueros",
        suncare: "Protector Solar",
        makeup: "Maquillaje",
        haircare: "Cuidado Capilar",
        "hair color": "Color de Cabello",
        "hair styling": "Peinado",
        "men's grooming": "Cuidado Masculino",
        fragrance: "Fragancia",
      },

      noProductsSelected:
        "Aún no hay productos seleccionados. Haz clic en los productos de arriba para añadirlos a tu rutina.",
      noProductsFound:
        "No se encontraron productos que coincidan con tus criterios",
      selectCategory: "Selecciona una categoría arriba para ver productos",
      addedProduct: 'Añadido "{product}" a tu rutina',
      removedProduct: 'Quitado "{product}" de tu rutina',
      clearedAll: "Limpiados todos los productos de tu rutina",
      selectAtLeastOne:
        "Por favor selecciona al menos un producto para generar una rutina",
      errorGenerating:
        "Lo siento, hubo un error generando tu rutina. Por favor inténtalo de nuevo.",
      errorChat: "Lo siento, encontré un error. Por favor pregunta de nuevo.",

      webSearchEnabled:
        "Actualizaciones de productos en tiempo real habilitadas (función experimental)",
      webSearchDisabled: "Usando base de datos local de productos",
      searchingWeb: 'Buscando "{query}" con actualizaciones en tiempo real...',
      searchComplete:
        "Búsqueda completada con la información más reciente de productos",

      welcome: `✨ ¡Bienvenido al Creador de Rutina Inteligente de L'Oréal! Estoy aquí para ayudarte a crear la rutina de belleza perfecta.

🔸 Navega productos por categoría o busca por nombre
🔸 Haz clic en productos para añadirlos a tu rutina
🔸 Doble clic para información detallada del producto
🔸 Genera una rutina personalizada cuando estés listo
🔸 ¡Pregúntame cualquier cosa sobre tus productos!

¿Cómo puedo ayudarte hoy?`,
    },
  };

  return translations[langCode] || translations.en;
}

/* Update all UI texts for different languages */
function updateAllTexts(langCode) {
  const t = getTranslations(langCode);

  // Update input placeholders
  if (productSearch) productSearch.placeholder = t.search;
  if (userInput) userInput.placeholder = t.chat;

  // Update page title
  document.title = t.pageTitle;

  // Update category selector
  const firstOption = categoryFilter?.querySelector("option[disabled]");
  if (firstOption) firstOption.textContent = t.categorySelect;

  // Update category options
  const categoryOptions = categoryFilter?.querySelectorAll(
    "option:not([disabled])"
  );
  if (categoryOptions) {
    categoryOptions.forEach((option) => {
      const categoryValue = option.value;
      if (categoryValue && t.categories[categoryValue]) {
        option.textContent = t.categories[categoryValue];
      }
    });
  }

  // Update section titles
  const selectedProductsH2 = document.querySelector(".selected-products h2");
  if (selectedProductsH2) {
    selectedProductsH2.textContent = t.selectedProductsTitle;
  }

  const chatH2 = document.querySelector(".chatbox h2");
  if (chatH2) {
    chatH2.textContent = t.chatTitle;
  }

  // Update button texts
  if (generateRoutineBtn) {
    if (
      generateRoutineBtn.disabled &&
      generateRoutineBtn.textContent.includes("...")
    ) {
      generateRoutineBtn.textContent = t.generateRoutineGenerating;
    } else {
      generateRoutineBtn.textContent = t.generateRoutine;
    }
  }

  if (clearAllBtn) {
    clearAllBtn.textContent = t.clearAll;
  }

  // Update modal button if it exists
  const modalSelectBtn = document.getElementById("modalSelectBtn");
  if (modalSelectBtn) {
    const isSelected =
      modalSelectBtn.textContent.includes("Added") ||
      modalSelectBtn.textContent.includes("تمت") ||
      modalSelectBtn.textContent.includes("נוסף") ||
      modalSelectBtn.textContent.includes("Ajouté") ||
      modalSelectBtn.textContent.includes("Añadido");
    modalSelectBtn.innerHTML = isSelected
      ? `<i class="fa-solid fa-check"></i> ${t.addedToRoutine}`
      : `<i class="fa-solid fa-plus"></i> ${t.addToRoutine}`;
  }

  // Update existing selected products display
  updateSelectedProductsDisplay();

  // Update existing placeholder messages
  updatePlaceholderMessages(t);
}

/* Update placeholder messages based on language */
function updatePlaceholderMessages(t) {
  // Update products container placeholder if it exists
  const placeholderMessage = productsContainer?.querySelector(
    ".placeholder-message"
  );
  if (placeholderMessage) {
    if (
      placeholderMessage.textContent.includes("Select a category") ||
      placeholderMessage.textContent.includes("اختر فئة") ||
      placeholderMessage.textContent.includes("בחר קטגוריה") ||
      placeholderMessage.textContent.includes("Sélectionnez") ||
      placeholderMessage.textContent.includes("Selecciona")
    ) {
      placeholderMessage.textContent = t.selectCategory;
    } else if (
      placeholderMessage.textContent.includes("No products found") ||
      placeholderMessage.textContent.includes("لم يتم العثور") ||
      placeholderMessage.textContent.includes("לא נמצאו") ||
      placeholderMessage.textContent.includes("Aucun produit") ||
      placeholderMessage.textContent.includes("No se encontraron")
    ) {
      placeholderMessage.textContent = t.noProductsFound;
    }
  }
}

/* Get current language setting */
function getCurrentLanguage() {
  return languageSelector ? languageSelector.value : "en";
}

/* Get language-specific routine prompts */
function getRoutinePromptInLanguage(langCode) {
  const prompts = {
    en: {
      intro:
        "Create a comprehensive skincare/beauty routine using these selected products:",
      format:
        "Please provide a COMPLETE routine with both morning and evening sections. Format your response as follows:",
      morning: "**Morning Routine:**",
      evening: "**Evening Routine:**",
      tips: "**Additional Tips:**",
      instructions: [
        "1. [Step-by-step instructions with product names in **bold**]",
        "2. [Include specific application tips]",
        "3. [Mention frequency and timing]",
      ],
      requirements: [
        "- Use **bold** formatting for product names",
        "- Provide complete morning AND evening routines",
        "- Include all selected products appropriately",
        "- Give specific application order and timing",
        "- Keep response elegant and professional",
      ],
      complete:
        "Do not truncate or cut off the routine - provide the complete response.",
    },
    ar: {
      intro:
        "أنشئ روتين شامل للعناية بالبشرة/الجمال باستخدام هذه المنتجات المختارة:",
      format:
        "يرجى تقديم روتين كامل مع قسمي الصباح والمساء. قم بتنسيق استجابتك كما يلي:",
      morning: "**روتين الصباح:**",
      evening: "**روتين المساء:**",
      tips: "**نصائح إضافية:**",
      instructions: [
        "1. [تعليمات خطوة بخطوة مع أسماء المنتجات **بخط عريض**]",
        "2. [تضمين نصائح تطبيق محددة]",
        "3. [ذكر التكرار والتوقيت]",
      ],
      requirements: [
        "- استخدم تنسيق **العريض** لأسماء المنتجات",
        "- قدم روتين صباح ومساء كاملين",
        "- تضمين جميع المنتجات المختارة بشكل مناسب",
        "- إعطاء ترتيب وتوقيت تطبيق محدد",
        "- حافظ على الاستجابة أنيقة ومهنية",
      ],
      complete: "لا تقطع أو تختصر الروتين - قدم الاستجابة الكاملة.",
    },
    he: {
      intro: "צור שגרת טיפוח עור/יופי מקיפה באמצעות המוצרים הנבחרים:",
      format: "אנא ספק שגרה מלאה עם חלקי בוקר וערב. עצב את התגובה שלך כדלקמן:",
      morning: "**שגרת בוקר:**",
      evening: "**שגרת ערב:**",
      tips: "**טיפים נוספים:**",
      instructions: [
        "1. [הוראות שלב אחר שלב עם שמות מוצרים **בכתב מודגש**]",
        "2. [כלול טיפי יישום ספציפיים]",
        "3. [ציין תדירות ועיתוי]",
      ],
      requirements: [
        "- השתמש בעיצוב **מודגש** לשמות מוצרים",
        "- ספק שגרות בוקר וערב מלאות",
        "- כלול את כל המוצרים הנבחרים באופן מתאים",
        "- תן סדר ועיתוי יישום ספציפיים",
        "- שמור על תגובה אלגנטית ומקצועית",
      ],
      complete: "אל תקטע או תקצר את השגרה - ספק את התגובה המלאה.",
    },
    fr: {
      intro:
        "Créez une routine complète de soins de la peau/beauté en utilisant ces produits sélectionnés:",
      format:
        "Veuillez fournir une routine COMPLÈTE avec les sections matin et soir. Formatez votre réponse comme suit:",
      morning: "**Routine du Matin:**",
      evening: "**Routine du Soir:**",
      tips: "**Conseils Supplémentaires:**",
      instructions: [
        "1. [Instructions étape par étape avec noms de produits en **gras**]",
        "2. [Inclure des conseils d'application spécifiques]",
        "3. [Mentionner la fréquence et le timing]",
      ],
      requirements: [
        "- Utilisez le formatage **gras** pour les noms de produits",
        "- Fournissez des routines complètes matin ET soir",
        "- Incluez tous les produits sélectionnés de manière appropriée",
        "- Donnez un ordre et un timing d'application spécifiques",
        "- Gardez la réponse élégante et professionnelle",
      ],
      complete:
        "Ne tronquez pas ou ne coupez pas la routine - fournissez la réponse complète.",
    },
    es: {
      intro:
        "Crea una rutina integral de cuidado de la piel/belleza usando estos productos seleccionados:",
      format:
        "Por favor proporciona una rutina COMPLETA con secciones de mañana y noche. Formatea tu respuesta de la siguiente manera:",
      morning: "**Rutina de la Mañana:**",
      evening: "**Rutina de la Noche:**",
      tips: "**Consejos Adicionales:**",
      instructions: [
        "1. [Instrucciones paso a paso con nombres de productos en **negrita**]",
        "2. [Incluir consejos de aplicación específicos]",
        "3. [Mencionar frecuencia y timing]",
      ],
      requirements: [
        "- Usa formato **negrita** para nombres de productos",
        "- Proporciona rutinas completas de mañana Y noche",
        "- Incluye todos los productos seleccionados apropiadamente",
        "- Da orden específico de aplicación y timing",
        "- Mantén la respuesta elegante y profesional",
      ],
      complete:
        "No truncar o cortar la rutina - proporciona la respuesta completa.",
    },
  };

  return prompts[langCode] || prompts.en;
}

/* ===========================================
   WEB SEARCH INTEGRATION (EXPERIMENTAL)
   =========================================== */

/* Toggle web search functionality */
function toggleWebSearch() {
  const t = getTranslations(getCurrentLanguage());
  const isEnabled = webSearchEnabled.checked;
  localStorage.setItem("lorealWebSearchEnabled", isEnabled);

  if (isEnabled) {
    addChatMessage("system", `🌐 ${t.webSearchEnabled}`);
  } else {
    addChatMessage("system", `📱 ${t.webSearchDisabled}`);
  }
}

/* Enhanced search with web integration capability */
async function enhancedProductSearch(query) {
  const t = getTranslations(getCurrentLanguage());
  const isWebSearchEnabled = webSearchEnabled.checked;

  if (!isWebSearchEnabled) {
    return filterProducts();
  }

  // Simulate web search integration (would connect to product APIs in production)
  console.log("Web search simulation for:", query);
  addChatMessage("system", `🔍 ${t.searchingWeb.replace("{query}", query)}`);

  // For demo purposes, we'll just use local search with a delay
  setTimeout(() => {
    filterProducts();
    if (query.trim()) {
      addChatMessage("system", `✅ ${t.searchComplete}`);
    }
  }, 1000);
}

/* ===========================================
   PRODUCT SELECTION MANAGEMENT
   =========================================== */

/* Toggle product selection */
function toggleProductSelection(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const t = getTranslations(getCurrentLanguage());
  const existingIndex = selectedProducts.findIndex((p) => p.id === productId);

  if (existingIndex === -1) {
    // Add product to selection
    selectedProducts.push(product);
    addChatMessage("system", t.addedProduct.replace("{product}", product.name));
    announceToScreenReader(`Added ${product.name} to routine`);
  } else {
    // Remove product from selection
    selectedProducts.splice(existingIndex, 1);
    addChatMessage(
      "system",
      t.removedProduct.replace("{product}", product.name)
    );
    announceToScreenReader(`Removed ${product.name} from routine`);
  }

  updateSelectedProductsDisplay();
  saveToLocalStorage();
  filterProducts();
}

/* Update the selected products display */
function updateSelectedProductsDisplay() {
  const t = getTranslations(getCurrentLanguage());

  if (selectedProducts.length === 0) {
    selectedProductsList.innerHTML = `
      <div class="placeholder-message" style="font-size: 16px; color: #999; text-align: center; width: 100%;">
        ${t.noProductsSelected}
      </div>
    `;
    generateRoutineBtn.disabled = true;
    generateRoutineBtn.textContent = t.generateRoutine;
    clearAllBtn.style.display = "none";
    return;
  }

  selectedProductsList.innerHTML = selectedProducts
    .map(
      (product) => `
      <div class="selected-product-item">
        <span>${product.name}</span>
        <button class="remove-btn" onclick="toggleProductSelection(${product.id})" title="${t.removeFromRoutine}">
          ×
        </button>
      </div>
    `
    )
    .join("");

  generateRoutineBtn.disabled = false;
  generateRoutineBtn.textContent = t.generateRoutine;
  clearAllBtn.style.display = "inline-block";
  clearAllBtn.textContent = t.clearAll;
}

/* Clear all selected products */
function clearAllProducts() {
  const t = getTranslations(getCurrentLanguage());

  selectedProducts = [];
  updateSelectedProductsDisplay();
  saveToLocalStorage();
  filterProducts();
  addChatMessage("system", t.clearedAll);
}

/* ===========================================
   PRODUCT MODAL FUNCTIONALITY
   =========================================== */

/* Show product detail modal */
function showProductModal(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const t = getTranslations(getCurrentLanguage());

  modalProductImage.src = product.image;
  modalProductImage.alt = product.name;
  modalProductName.textContent = product.name;
  modalProductBrand.textContent = product.brand;
  modalProductCategory.textContent =
    t.categories[product.category] || formatCategory(product.category);
  modalProductDescription.textContent = product.description;

  const isSelected = selectedProducts.some((p) => p.id === productId);
  modalSelectBtn.innerHTML = isSelected
    ? `<i class="fa-solid fa-check"></i> ${t.addedToRoutine}`
    : `<i class="fa-solid fa-plus"></i> ${t.addToRoutine}`;
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

/* Enhanced chat message function with consistent list formatting */
function addChatMessage(type, content) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${type}`;

  // Always format assistant messages in a structured way
  if (type === "assistant") {
    // Check if this is a routine response first
    if (
      !content.includes("Welcome") &&
      !content.includes("مرحباً") &&
      !content.includes("ברוכים") &&
      !content.includes("Bienvenue") &&
      !content.includes("Bienvenido") &&
      (content.includes("Morning Routine") ||
        content.includes("Evening Routine") ||
        content.includes("Step 1") ||
        content.includes("Step 2") ||
        content.includes("1.") ||
        content.includes("2.") ||
        content.includes("روتين الصباح") ||
        content.includes("روتين المساء") ||
        content.includes("שגרת בוקר") ||
        content.includes("שגרת ערב") ||
        content.includes("Routine du Matin") ||
        content.includes("Routine du Soir") ||
        content.includes("Rutina de la Mañana") ||
        content.includes("Rutina de la Noche"))
    ) {
      messageDiv.innerHTML = formatRoutineResponse(content);
    } else {
      // Format regular assistant messages in list style
      messageDiv.innerHTML = formatChatMessage(content);
    }
  } else {
    messageDiv.textContent = content;
  }

  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Format regular chat messages in organized list style */
function formatChatMessage(content) {
  // Convert **text** to <strong>text</strong>
  let formattedContent = content.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );

  // Format bullet points consistently
  formattedContent = formattedContent
    // Convert existing bullet points (🔸) to structured list items
    .replace(/🔸\s*(.+)$/gm, '<div class="chat-bullet">🔸 $1</div>')
    // Convert other bullet patterns to structured list items
    .replace(/^[\s]*[•·-]\s*(.+)$/gm, '<div class="chat-bullet">• $1</div>')
    // Format numbered lists
    .replace(/^(\d+\.\s*.+)$/gm, '<div class="chat-step">$1</div>')
    // Convert line breaks to HTML
    .replace(/\n/g, "<br>")
    // Clean up multiple breaks
    .replace(/<br>\s*<br>/g, "<br>");

  return formattedContent;
}

/* Format routine responses into organized bubbles */
function formatRoutineResponse(content) {
  // First, handle bold formatting by converting **text** to <strong>text</strong>
  let formattedContent = content.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );

  // Format the entire routine content without section headers
  const processedContent = `
    <div class="routine-section">
      <div class="routine-content">${formatRoutineSection(
        formattedContent
      )}</div>
    </div>
  `;

  return processedContent;
}

/* Helper function to format individual routine sections */
function formatRoutineSection(content) {
  const currentLang = getCurrentLanguage();

  // Multi-language routine section headers to remove (since we have section bubbles)
  const headersToRemove = [
    // English
    /(Morning Routine:|Evening Routine:|AM Routine:|PM Routine:)/gi,
    // Arabic
    /(روتين الصباح:|روتين المساء:|الصباح:|المساء:)/gi,
    // Hebrew
    /(שגרת בוקר:|שגרת ערב:|בוקר:|ערב:)/gi,
    // French
    /(Routine du Matin:|Routine du Soir:|Matin:|Soir:)/gi,
    // Spanish
    /(Rutina de la Mañana:|Rutina de la Noche:|Mañana:|Noche:)/gi,
  ];

  // Multi-language tip/note headers
  const tipHeaders = [
    // English
    /(Tips?:|Notes?:|Important:|Remember:|Additional Tips:)/gi,
    // Arabic
    /(نصائح:|ملاحظات:|مهم:|تذكر:|نصائح إضافية:)/gi,
    // Hebrew
    /(טיפים:|הערות:|חשוב:|זכור:|טיפים נוספים:)/gi,
    // French
    /(Conseils:|Notes:|Important:|Rappel:|Conseils Supplémentaires:)/gi,
    // Spanish
    /(Consejos:|Notas:|Importante:|Recuerda:|Consejos Adicionales:)/gi,
  ];

  // Multi-language frequency terms
  const frequencyTerms = [
    // English
    /(Daily|Twice daily|Once daily|Weekly|2-3 times per week|Every other day)/gi,
    // Arabic
    /(يومياً|مرتين يومياً|مرة يومياً|أسبوعياً|2-3 مرات في الأسبوع|كل يوم آخر)/gi,
    // Hebrew
    /(יומי|פעמיים ביום|פעם ביום|שבועי|2-3 פעמים בשבוע|כל יום שני)/gi,
    // French
    /(Quotidien|Deux fois par jour|Une fois par jour|Hebdomadaire|2-3 fois par semaine|Un jour sur deux)/gi,
    // Spanish
    /(Diario|Dos veces al día|Una vez al día|Semanal|2-3 veces por semana|Cada dos días)/gi,
  ];

  // Multi-language timing terms
  const timingTerms = [
    // English
    /(before bed|after cleansing|wait 20 minutes|in the morning|at night)/gi,
    // Arabic
    /(قبل النوم|بعد التنظيف|انتظر 20 دقيقة|في الصباح|في الليل)/gi,
    // Hebrew
    /(לפני השינה|אחרי הניקוי|חכה 20 דקות|בבוקר|בלילה)/gi,
    // French
    /(avant le coucher|après le nettoyage|attendre 20 minutes|le matin|le soir)/gi,
    // Spanish
    /(antes de dormir|después de limpiar|esperar 20 minutos|por la mañana|por la noche)/gi,
  ];

  let processedContent = content;

  // Remove redundant headers since we have section bubbles
  headersToRemove.forEach((pattern) => {
    processedContent = processedContent.replace(pattern, "");
  });

  // Format the content with proper styling and better organization
  processedContent = processedContent
    // Format numbered step lists with proper spacing
    .replace(/(\d+\.\s.*?)(?=\d+\.|$)/gs, '<div class="routine-step">$1</div>')
    // Format bullet point lists
    .replace(/^[\s]*[•·-]\s*(.+)$/gm, '<div class="routine-bullet">• $1</div>')
    // Format product mentions with emphasis (broader pattern for multi-language)
    .replace(
      /([A-ZÀ-ÿא-ת\u0600-\u06FF][a-zA-ZÀ-ÿא-ת\u0600-\u06FF\s&'-]+(?:Cleanser|Moisturizer|Serum|Cream|Lotion|Treatment|Oil|Mask|Sunscreen|SPF|منظف|مرطب|سيروم|كريم|علاج|زيت|قناع|واقي|מנקה|לחות|סרום|קרם|טיפול|שמן|מסכה|הגנה|Nettoyant|Hydratant|Sérum|Crème|Traitement|Huile|Masque|Protection|Limpiador|Hidratante|Crema|Tratamiento|Aceite|Mascarilla|Protector))/g,
      '<span class="product-mention">$1</span>'
    );

  // Format tip headers with special styling
  tipHeaders.forEach((pattern) => {
    processedContent = processedContent.replace(
      pattern,
      '<div class="routine-tip-header">💡 $1</div>'
    );
  });

  // Format frequency mentions
  frequencyTerms.forEach((pattern) => {
    processedContent = processedContent.replace(
      pattern,
      '<span class="frequency">⏰ $1</span>'
    );
  });

  // Format timing mentions
  timingTerms.forEach((pattern) => {
    processedContent = processedContent.replace(
      pattern,
      '<span class="timing">⏱️ $1</span>'
    );
  });

  // Clean up and organize content
  processedContent = processedContent
    // Convert line breaks to HTML
    .replace(/\n/g, "<br>")
    // Clean up multiple breaks
    .replace(/<br>\s*<br>/g, "<br>")
    // Add spacing around step divs
    .replace(/(<\/div>)(<div class="routine-step">)/g, "$1<br>$2")
    // Add spacing around bullet divs
    .replace(/(<\/div>)(<div class="routine-bullet">)/g, "$1<br>$2")
    // Add spacing around tip headers
    .replace(/(<\/div>)(<div class="routine-tip-header">)/g, "$1<br><br>$2")
    .trim();

  return processedContent;
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
  const t = getTranslations(getCurrentLanguage());

  if (selectedProducts.length === 0) {
    addChatMessage("system", `⚠️ ${t.selectAtLeastOne}`);
    return;
  }

  const loadingIndicator = showLoadingIndicator();
  generateRoutineBtn.disabled = true;
  generateRoutineBtn.textContent = t.generateRoutineGenerating;

  try {
    const langCode = getCurrentLanguage();
    const prompts = getRoutinePromptInLanguage(langCode);

    const routinePrompt = `
${prompts.intro}

${selectedProducts
  .map(
    (product) =>
      `• **${product.name}** by ${product.brand} (${product.category}): ${product.description}`
  )
  .join("\n")}

Create a complete skincare routine with numbered steps. Include timing information (morning/evening) within each step instruction rather than using separate section headers.

Format your response as a numbered list with detailed instructions:

1. [First step with timing - e.g., "In the morning, apply **Product Name**..."]
2. [Second step with timing - e.g., "In the evening, use **Product Name**..."]
3. [Continue with all steps, specifying when each should be done]
4. [Include application tips and frequency within each step]
5. [Add waiting times and order information in the instructions]

${prompts.tips}
- [Compatibility notes]
- [Special considerations]
- [Frequency recommendations]

CRITICAL REQUIREMENTS:
- Use **bold** formatting for product names
- Include ALL selected products in the routine
- Specify timing (morning/evening) within each numbered step
- Do NOT use separate "Morning Routine" or "Evening Routine" headers
- Provide 6-10 detailed numbered steps total
- Include specific application tips and timing in each step
- Mention frequency (daily, twice daily, etc.) in the instructions
- Keep response elegant, professional, and COMPLETE
- Do NOT truncate, summarize, or cut off any part of the routine

Example format:
1. In the morning, cleanse your face with **Product Name**...
2. After cleansing, apply **Serum Name** and wait 2-3 minutes...
3. In the evening, remove makeup with **Product Name**...

Generate the COMPLETE routine with all details integrated into numbered steps.`;

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
    addChatMessage("system", `❌ ${t.errorGenerating}`);
  } finally {
    generateRoutineBtn.disabled = false;
    generateRoutineBtn.textContent = t.generateRoutine;
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
    const t = getTranslations(getCurrentLanguage());
    addChatMessage("system", `❌ ${t.errorChat}`);
  }
}

/* Call OpenAI API through Cloudflare Worker */
async function callOpenAI(message, isRoutineGeneration = false) {
  const currentLang = getCurrentLanguage();
  const langInstructions = {
    en: "",
    ar: " Always respond in Arabic.",
    he: " Always respond in Hebrew.",
    fr: " Always respond in French.",
    es: " Always respond in Spanish.",
  };

  const systemPromptWithLanguage =
    SYSTEM_PROMPT + (langInstructions[currentLang] || "");

  const requestBody = {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: systemPromptWithLanguage,
      },
      ...chatHistory,
      {
        role: "user",
        content: message,
      },
    ],
    temperature: 0.7,
    max_tokens: isRoutineGeneration ? 2000 : 600,
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
   PREFERENCES & SETTINGS
   =========================================== */

/* Load saved preferences */
function loadSavedPreferences() {
  // Load language preference
  const savedLanguage = localStorage.getItem("lorealLanguage") || "en";
  if (languageSelector) {
    languageSelector.value = savedLanguage;
    changeLanguage(savedLanguage);
  }

  // Load web search preference
  const webSearchPref =
    localStorage.getItem("lorealWebSearchEnabled") === "true";
  if (webSearchEnabled) {
    webSearchEnabled.checked = webSearchPref;
  }
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

/* Enhanced event listeners */
function setupEnhancedEventListeners() {
  // Check if elements exist before adding listeners
  if (languageSelector) {
    languageSelector.addEventListener("change", (e) => {
      changeLanguage(e.target.value);
    });
  }

  if (webSearchEnabled) {
    webSearchEnabled.addEventListener("change", toggleWebSearch);
  }

  // Enhanced product search with debouncing
  if (productSearch) {
    let searchTimeout;
    productSearch.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        enhancedProductSearch(productSearch.value);
      }, 300);
    });
  }

  // Add keyboard navigation
  addKeyboardNavigation();
}

/* ===========================================
   APPLICATION INITIALIZATION
   =========================================== */

/* Initialize the application */
async function initializeApp() {
  // Load products data
  await loadProducts();

  // Load saved preferences (language, web search, selections)
  loadSavedPreferences();
  loadFromLocalStorage();

  // Setup enhanced event listeners
  setupEnhancedEventListeners();

  // Setup lazy loading for images
  setupLazyLoading();

  // Add welcome message to chat
  const t = getTranslations(getCurrentLanguage());
  addChatMessage("assistant", t.welcome);

  console.log(
    "L'Oréal Routine Builder initialized successfully with enhanced features"
  );
}

/* Start the application when DOM is loaded */
document.addEventListener("DOMContentLoaded", initializeApp);

/* ===========================================
   ACCESSIBILITY ENHANCEMENTS
   =========================================== */

/* Add keyboard navigation support */
function addKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    // ESC key functionality
    if (e.key === "Escape") {
      if (productModal.classList.contains("active")) {
        closeProductModal();
      }
    }

    // Enter key on product cards
    if (e.key === "Enter" && e.target.classList.contains("product-card")) {
      const productId = parseInt(e.target.dataset.productId);
      if (e.shiftKey) {
        showProductModal(productId);
      } else {
        toggleProductSelection(productId);
      }
    }
  });
}

/* Announce changes to screen readers */
function announceToScreenReader(message) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "visually-hidden";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/* ===========================================
   PERFORMANCE OPTIMIZATIONS
   =========================================== */

/* Debounced function for better performance */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* Lazy loading for product images */
function setupLazyLoading() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}
