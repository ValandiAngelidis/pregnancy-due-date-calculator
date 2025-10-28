# 🧮 Pregnancy Due Date Calculator

A lightweight **WordPress plugin** that allows users to calculate their **expected delivery date (EDD)** based on the **last menstrual period (LMP)**.  
Built for speed, simplicity, and full compatibility with any WordPress theme. **Now with Gutenberg Block support!**

---

### 🌟 Features
- 🔹 Instantly calculates the expected due date based on user input  
- 🔹 **Gutenberg Block** with customizable appearance settings
- 🔹 **Shortcode** for backward compatibility and theme flexibility
- 🔹 Lightweight front-end logic in vanilla JavaScript  
- 🔹 Mobile-friendly and responsive design  
- 🔹 **Multilingual support** - Fully translated into 17 languages
- 🔹 **RTL support** for Arabic and Hebrew
- 🔹 Compatible with TranslatePress, WPML, and Polylang
- 🔹 Zero dependencies — works with any WordPress setup  

---

### 💡 Shortcode Usage
Add this shortcode anywhere in your content:

```text
[pregnancy_due_date_calculator]
```

**Advanced shortcode with attributes:**
```text
[pregnancy_due_date_calculator 
    backgroundColor="#f8f9fa" 
    textColor="#333333" 
    maxWidth="500" 
    showLanguageToggle="false" 
    showProgressBar="true" 
    showNote="true"]
```

---

### 🧩 Gutenberg Block Integration

Version 2.0 introduces a **Gutenberg Block** version of the Pregnancy Due Date Calculator.

#### 📍 How to Use
1. Open the **WordPress Block Editor** (Gutenberg)
2. Click the **"+"** button to add a new block
3. Search for **"Pregnancy"** or find it under **Widgets**
4. Select **"Pregnancy Due Date Calculator"**
5. Customize the appearance using the **Block Settings** panel

#### 🎨 Customization Options
- **Display Settings:**
  - Show/hide language toggle
  - Show/hide progress bar
  - Show/hide disclaimer note
  - Show/hide weeks count
  - Block alignment (left, center, right)

- **Styling Options:**
  - Background color
  - Text color  
  - Border radius (0-50px)
  - Padding (0-100px)
  - Maximum width (300-1200px)

#### 🌍 Translation Support
The plugin includes **translation support** for the following 17 languages:

| Language | Locale Code | Status | RTL Support |
|----------|-------------|--------|-------------|
| 🇩🇪 German | `de_DE` | ✅ Complete | No |
| 🇪🇸 Spanish | `es_ES` | ✅ Complete | No |
| 🇫🇷 French | `fr_FR` | ✅ Complete | No |
| 🇮🇹 Italian | `it_IT` | ✅ Complete | No |
| 🇬🇷 Greek | `el` | ✅ Complete | No |
| 🇨🇳 Chinese (Simplified) | `zh_CN` | ✅ Complete | No |
| 🇯🇵 Japanese | `ja` | ✅ Complete | No |
| 🇸🇦 Arabic | `ar` | ✅ Complete | Yes |
| 🇧🇷 Portuguese (Brazil) | `pt_BR` | ✅ Complete | No |
| 🇳🇱 Dutch (Netherlands) | `nl_NL` | ✅ Complete | No |
| 🇵🇱 Polish (Poland) | `pl_PL` | ✅ Complete | No |
| 🇷🇺 Russian | `ru_RU` | ✅ Complete | No |
| 🇹🇷 Turkish | `tr_TR` | ✅ Complete | No |
| 🇸🇪 Swedish | `sv_SE` | ✅ Complete | No |
| 🇰🇷 Korean | `ko_KR` | ✅ Complete | No |
| 🇮🇳 Hindi | `hi_IN` | ✅ Complete | No |
| 🇮🇱 Hebrew | `he_IL` | ✅ Complete | Yes |

**How to Use Translations:**
1. **WordPress Native Method:**
   - Go to **Settings → General**
   - Set **Site Language** to your preferred language
   - The calculator will automatically display in that language

2. **Translation Plugin Method:**
   - **TranslatePress** - Visual translation with real-time preview
   - **WPML** - Professional translation management
   - **Polylang** - Free multilingual plugin
   - All three plugins are fully compatible with this calculator

**Translation Files:**
All translation files are located in `/languages/` directory:
- `.pot` file - Template for creating new translations
- `.po` files - Editable translation files (open with Poedit)
- `.mo` files - Compiled binary files (used by WordPress)

**Need Another Language?**
The plugin is translation-ready! You can create translations for any language:
1. Use **Poedit** to open `/languages/pregnancy-due-date-calculator.pot`
2. Create a new translation for your language
3. Save as `pregnancy-due-date-calculator-{locale}.po` and `.mo`
4. Upload to the `/languages/` folder

For detailed translation instructions, see [TRANSLATION.md](TRANSLATION.md)

#### 🧩 Gutenberg Block Integration (continued)

The block is fully compatible with popular WordPress translation plugins:
- **TranslatePress** - Automatic visual translation
- **WPML** - Professional multilingual sites
- **Polylang** - Free multilingual plugin

*Note: The built-in language switcher can be disabled in block settings when using external translation plugins.*

#### 🔧 Developer Notes
- Block namespace: `pregnancy/due-date-calculator`
- Server-side rendering ensures consistency with shortcode
- Block attributes are passed as `data-*` attributes for JavaScript configuration
- Uses WordPress block best practices with proper asset registration

---

### ⚙️ How It Works
1. The **shortcode/block** registers a front-end form via PHP
2. **JavaScript** (`/assets/script.js`) performs date calculation and updates UI dynamically
3. **CSS** (`/assets/style.css`) ensures responsive design across all devices
4. Scripts and styles use **WordPress best practices** with proper versioning

---

### 📦 Installation
1. Download or clone this repository
2. Upload the folder to `/wp-content/plugins/` on your WordPress site
3. Activate **"Pregnancy Due Date Calculator"** from WordPress Dashboard → Plugins
4. Use either:
   - **Gutenberg Block:** Add "Pregnancy Due Date Calculator" block in the editor
   - **Shortcode:** `[pregnancy_due_date_calculator]` in any post, page, or widget

---

### 📁 Final Plugin Structure
```
pregnancy-due-date-calculator-main/
 ┣ assets/
 ┃ ┣ script.js                 # Frontend calculation logic
 ┃ ┣ style.css                 # Frontend styling
 ┃ ┣ block.js                  # Gutenberg block registration
 ┃ ┗ editor.css                # Block editor preview styling
 ┣ languages/
 ┃ ┣ pregnancy-due-date-calculator.pot      # Translation template
 ┃ ┣ pregnancy-due-date-calculator-de_DE.po # German translation
 ┃ ┣ pregnancy-due-date-calculator-de_DE.mo # German compiled
 ┃ ┣ pregnancy-due-date-calculator-es_ES.po # Spanish translation
 ┃ ┣ pregnancy-due-date-calculator-es_ES.mo # Spanish compiled
 ┃ ┣ pregnancy-due-date-calculator-fr_FR.po # French translation
 ┃ ┣ pregnancy-due-date-calculator-fr_FR.mo # French compiled
 ┃ ┣ pregnancy-due-date-calculator-it_IT.po # Italian translation
 ┃ ┣ pregnancy-due-date-calculator-it_IT.mo # Italian compiled
 ┃ ┣ pregnancy-due-date-calculator-el.po    # Greek translation
 ┃ ┣ pregnancy-due-date-calculator-el.mo    # Greek compiled
 ┃ ┣ pregnancy-due-date-calculator-zh_CN.po # Chinese translation
 ┃ ┣ pregnancy-due-date-calculator-zh_CN.mo # Chinese compiled
 ┃ ┣ pregnancy-due-date-calculator-ja.po    # Japanese translation
 ┃ ┣ pregnancy-due-date-calculator-ja.mo    # Japanese compiled
 ┃ ┣ pregnancy-due-date-calculator-ar.po    # Arabic translation
 ┃ ┗ pregnancy-due-date-calculator-ar.mo    # Arabic compiled
 ┣ pregnancy-due-date-calculator.php  # Main plugin file
 ┣ README.md                   # Documentation
 ┣ TRANSLATION.md              # Translation guide
 ┣ TRANSLATION_SUMMARY.md      # Translation implementation details
 ┗ TESTING_GUIDE.md            # Testing instructions
```

#### 📋 File Descriptions
- **`pregnancy-due-date-calculator.php`** - Main plugin file with block registration, shortcode, asset management, and i18n
- **`assets/script.js`** - Frontend JavaScript for date calculations and UI interactions
- **`assets/style.css`** - Frontend CSS for responsive design and styling
- **`assets/block.js`** - Gutenberg block registration and editor interface
- **`assets/editor.css`** - Block editor preview styling (admin only)
- **`languages/*.po`** - Translation files (editable with Poedit)
- **`languages/*.mo`** - Compiled translation files (binary)
- **`languages/*.pot`** - Translation template for creating new languages

---

### 📊 Version History
- **v2.1.1** - Extended multilingual support to 17 languages with complete translations (added Portuguese, Dutch, Polish, Russian, Turkish, Swedish, Korean, Hindi, Hebrew)
- **v2.1.0** - Added complete multilingual support with 8 languages (German, Spanish, French, Italian, Greek, Chinese, Japanese, Arabic)
- **v2.0.0** - Added Gutenberg Block support with full customization options
- **v1.1.0** - Initial shortcode implementation with Greek/English support

---

### 🖼️ Demo Preview
*Screenshot and demo GIF can be added here*

---

## 👨‍💻 Author

**Valandi Angelidis**  
🌐 [Official Website](https://valandiangelidis.com)  
💼 [GitHub](https://github.com/ValandiAngelidis)  
📧 Email: info@valandiangelidis.com  

---

⭐ **If you find this plugin useful, please give it a star — it helps others discover it and supports continued development!**
