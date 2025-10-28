# Translation Guide for Pregnancy Due Date Calculator

## Overview
The Pregnancy Due Date Calculator plugin v2.1.1 is fully translation-ready and ships with complete translations for 17 locales via the WordPress i18n system.

**Bundled Languages (Ready to Use):**
- Arabic (ar)
- Chinese Simplified (zh_CN)
- Dutch (nl_NL)
- English (fallback)
- French (fr_FR)
- German (de_DE)
- Greek (el)
- Hebrew (he_IL)
- Hindi (hi_IN)
- Italian (it_IT)
- Japanese (ja)
- Korean (ko_KR)
- Polish (pl_PL)
- Portuguese (Brazil) (pt_BR)
- Russian (ru_RU)
- Spanish (es_ES)
- Swedish (sv_SE)
- Turkish (tr_TR)

## Translation Methods

### Method 1: Using Poedit (Recommended for Manual Translation)

1. **Install Poedit**
   - Download from https://poedit.net/
   - Install on your computer

2. **Create New Translation**
   - Open Poedit
   - Click "File" → "New from POT/PO file"
   - Select `languages/pregnancy-due-date-calculator.pot`
   - Choose your target language (e.g., German)
   - Save as `pregnancy-due-date-calculator-de_DE.po` in the `/languages` folder

3. **Translate Strings**
   - Translate each English string in Poedit
   - Poedit automatically generates the `.mo` file when you save
   - Both `.po` and `.mo` files are created

4. **Upload to WordPress**
   - Upload both `.po` and `.mo` files to `/wp-content/plugins/pregnancy-due-date-calculator-main/languages/`

### Method 2: Using WP-CLI (Automated)

```bash
# Navigate to your WordPress root directory
cd /path/to/wordpress

# Generate .pot file (if needed)
wp i18n make-pot wp-content/plugins/pregnancy-due-date-calculator-main wp-content/plugins/pregnancy-due-date-calculator-main/languages/pregnancy-due-date-calculator.pot

# Create German translation
wp i18n make-po wp-content/plugins/pregnancy-due-date-calculator-main/languages/pregnancy-due-date-calculator.pot wp-content/plugins/pregnancy-due-date-calculator-main/languages/pregnancy-due-date-calculator-de_DE.po

# Compile .mo file
wp i18n make-mo wp-content/plugins/pregnancy-due-date-calculator-main/languages
```

### Method 3: Using TranslatePress (Visual Translation)

1. **Install TranslatePress**
   - Go to WordPress Admin → Plugins → Add New
   - Search for "TranslatePress"
   - Install and activate

2. **Configure Languages**
   - Go to Settings → TranslatePress
   - Add your target languages (e.g., German, Spanish, Hindi)
   - Click "Save Changes"

3. **Translate Visually**
   - Visit a page with the calculator
   - Click "Translate Page" in the admin bar
   - Switch to your target language
   - Click on any text to translate it in real-time
   - TranslatePress automatically saves translations

### Method 4: Using WPML

1. **Install WPML**
   - Purchase and download from https://wpml.org/
   - Upload and activate in WordPress

2. **Setup Languages**
   - Go to WPML → Languages
   - Add your target languages
   - Set default language

3. **String Translation**
   - Go to WPML → String Translation
   - Search for "pregnancy-due-date-calculator"
   - Translate any strings that differ from the bundled versions
   - Click "Translation is complete"

### Method 5: Using Polylang

1. **Install Polylang**
   - Go to Plugins → Add New
   - Search for "Polylang"
   - Install and activate

2. **Add Languages**
   - Go to Settings → Languages
   - Add your target languages
   - Save changes

3. **Translate Strings**
   - Go to Languages → Strings translation
   - Find "pregnancy-due-date-calculator" strings
   - Add or override translations for each language
   - Save

## Testing Translations

### Test WordPress Native Translation

1. **Change WordPress Language**
   - Go to Settings → General
   - Set "Site Language" to your target language (e.g., Deutsch)
   - Click "Save Changes"

2. **Verify Plugin Text (17 Locales available out of the box)**
   - Visit a page with the calculator block
   - All text should now appear in the selected language
   - Check dropdown labels, button text, validation messages

### Test with Translation Plugins

1. **With TranslatePress**
   - Use language switcher on frontend
   - Verify all calculator text translates
   - Check that custom labels respect translations

2. **With WPML**
   - Switch language using WPML language switcher
   - Test calculator on different language pages
   - Verify string translations apply

3. **With Polylang**
   - Use Polylang language switcher widget
   - Navigate to translated pages
   - Confirm calculator displays in correct language

## Translatable Strings

The plugin contains these translatable elements:

**Form Labels:**
- Find Your Estimated Due Date
- Enter the first day of your last menstrual period...
- Day, Month, Year
- Select Day, Select Month, Select Year

**Month Names:**
- January through December (all 12 months)

**Messages:**
- Please select a day, month, and year.
- These are estimates only. For personalized advice, consult your clinician.
- Calculate Due Date
- Your Estimated Due Date:
- Weeks Pregnant:
- Pregnancy Progress
- Invalid date selected

## File Structure

```
/languages/
├── pregnancy-due-date-calculator.pot     # Template file (don't edit)
├── pregnancy-due-date-calculator-de_DE.po # German translation (editable)
├── pregnancy-due-date-calculator-de_DE.mo # German compiled (auto-generated)
├── pregnancy-due-date-calculator-es_ES.po # Spanish translation
├── pregnancy-due-date-calculator-es_ES.mo # Spanish compiled
└── ... (other languages)
```

## Common Issues & Solutions

### Translations Not Appearing

1. **Clear WordPress Cache**
   ```bash
   # If using WP-CLI
   wp cache flush
   ```

2. **Regenerate .mo Files**
   - Re-save your .po file in Poedit
   - Or run: `wp i18n make-mo wp-content/plugins/pregnancy-due-date-calculator-main/languages`
   - After updating translations, regenerate the JavaScript catalogs with `wp i18n make-json languages --no-purge`

3. **Check File Permissions**
   - Ensure .mo files are readable (644 permissions)
   - Verify files are in correct `/languages/` folder

4. **Verify Text Domain**
   - All translatable strings use: `pregnancy-due-date-calculator`
   - Check plugin header has: `Text Domain: pregnancy-due-date-calculator`

### Plugin Not Detecting Language

1. **Check WordPress Language Setting**
   - Settings → General → Site Language must match the locale code
   - Example: If using Brazilian Portuguese, set Site Language to "Português do Brasil"

2. **Check Locale Code**
   - File must match WordPress locale
   - German: `de_DE` not just `de`
   - Spanish: `es_ES` not `es`
   - Greek: `el` (not `el_GR`)

3. **Verify load_plugin_textdomain()**
   - Check `pregnancy-due-date-calculator.php` line ~20
   - Must be in `plugins_loaded` hook

## RTL Language Support

For Right-to-Left languages (Arabic, Hebrew):

1. WordPress automatically applies RTL CSS when language is set
2. Calculator layout will flip to RTL
3. No additional configuration needed

## Contributing Translations

To contribute translations to the plugin:

1. Create `.po` and `.mo` files for your language
2. Test thoroughly with WordPress in that language
3. Submit via GitHub or plugin support forum
4. Include both `.po` and `.mo` files

## Support

For translation issues:
- Check WordPress language is properly set
- Verify .mo file exists in `/languages/` folder
- Clear all caches (WordPress, browser, CDN)
- Test with default WordPress theme first

## Resources

- **Poedit:** https://poedit.net/
- **WP-CLI i18n:** https://developer.wordpress.org/cli/commands/i18n/
- **TranslatePress:** https://wordpress.org/plugins/translatepress-multilingual/
- **WPML:** https://wpml.org/
- **Polylang:** https://wordpress.org/plugins/polylang/
- **WordPress i18n Documentation:** https://developer.wordpress.org/plugins/internationalization/
