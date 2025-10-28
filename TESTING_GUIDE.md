# Quick Testing Guide - Translation Implementation

## 🚀 Immediate Test (5 minutes)

### Test 1: WordPress Native Language Switch

**Note:** The plugin now includes pre-compiled translations for 17 languages. No compilation needed for bundled languages!

1. **Test with Any Bundled Language**
   - Available languages: Arabic, Chinese, Dutch, French, German, Greek, Hebrew, Hindi, Italian, Japanese, Korean, Polish, Portuguese (Brazil), Russian, Spanish, Swedish, Turkish
   - All `.mo` and `.json` files are pre-compiled and ready to use

2. **Switch WordPress Language**
   - Go to WordPress Admin Dashboard
   - Navigate to **Settings → General**
   - Find "Site Language" dropdown
   - Select any language (e.g., **"Deutsch"** for German, **"Español"** for Spanish, **"Français"** for French)
   - Click **"Save Changes"**

3. **Test Calculator**
   - Go to any page with the calculator block
   - Verify all text displays in the selected language:
     - Title, labels (Day, Month, Year)
     - Placeholders and dropdown options
     - All 12 month names
     - Calculate button text
     - Validation messages
     - Result display text

4. **Switch Between Languages**
   - Return to Settings → General → Site Language
   - Try different languages to verify translations
   - Calculator text should change immediately after saving

### Test 2: TranslatePress (Visual Translation)

1. **Install TranslatePress**
   ```
   - Plugins → Add New
   - Search "TranslatePress"
   - Install "TranslatePress - Translate Multilingual sites"
   - Activate
   ```

2. **Add Languages**
   ```
   - Settings → TranslatePress
   - Add new language (e.g., Spanish - es_ES)
   - Click "Save Changes"
   ```

3. **Translate Calculator**
   ```
   - Visit page with calculator
   - Click "Translate Page" in admin bar
   - Switch to Spanish at top
   - Click any calculator text to translate
   - Example translations:
     * "Find Your Estimated Due Date" → "Encuentra tu Fecha Estimada de Parto"
     * "Day" → "Día"
     * "Month" → "Mes"
     * "Year" → "Año"
   - TranslatePress saves automatically
   ```

4. **Test Language Switcher**
   ```
   - Add TranslatePress language switcher widget
   - Switch between English and Spanish
   - Verify calculator text changes
   ```

### Test 3: WPML (If Available)

1. **Install WPML** (Requires license)
   ```
   - Upload WPML plugin
   - Activate WPML Multilingual CMS
   - Activate WPML String Translation
   ```

2. **Configure Languages**
   ```
   - WPML → Languages
   - Add Spanish, French, etc.
   - Set default language
   ```

3. **Translate Strings**
   ```
   - WPML → String Translation
   - Search: "pregnancy-due-date-calculator"
   - Filter: Show strings from this domain
   - Plugin includes 17 pre-translated languages
   - Add translations for additional languages as needed
   - Mark as "Translation is complete"
   ```

4. **Test**
   ```
   - Use WPML language switcher
   - Verify calculator displays in selected language
   ```

## 🔍 What to Test

### Frontend Tests
- [ ] Title text changes language
- [ ] Subtitle text changes language
- [ ] Form labels (Day, Month, Year) translate
- [ ] Dropdown placeholders translate
- [ ] All 12 month names translate
- [ ] Calculate button text translates
- [ ] Validation message translates
- [ ] Disclaimer note translates
- [ ] Result text ("Your Estimated Due Date:") translates
- [ ] "Weeks Pregnant:" translates
- [ ] "Pregnancy Progress" translates
- [ ] Week/weeks singular/plural work correctly

### Gutenberg Editor Tests
- [ ] Block controls still work
- [ ] Custom text overrides still work
- [ ] Color pickers functional
- [ ] Font family selectors work
- [ ] All 40+ attributes remain functional
- [ ] Preview shows translated text (if language set)

### Customization Tests
- [ ] Custom title text overrides translation
- [ ] Custom month names override translation
- [ ] Custom labels override translation
- [ ] Custom placeholders override translation
- [ ] Custom validation message overrides translation
- [ ] Custom note text overrides translation

### RTL Tests (Arabic/Hebrew)
- [ ] Layout flips to right-to-left
- [ ] Text aligns correctly
- [ ] Dropdowns work in RTL
- [ ] Button appears on correct side
- [ ] Progress bar flows correctly

## 🐛 Common Issues & Quick Fixes

### Issue: Translations Don't Appear

**Fix 1: Clear Cache**
```bash
# WordPress cache
wp cache flush

# Or in Admin:
# Delete cache files if using caching plugin
```

**Fix 2: Verify Language Files Exist**
```
Check that both files exist in /languages/:
- pregnancy-due-date-calculator-[locale].mo
- pregnancy-due-date-calculator-[locale]-[hash].json

Example for German (de_DE):
- pregnancy-due-date-calculator-de_DE.mo
- pregnancy-due-date-calculator-de_DE-2ae0e65a8f4b45bd3ce393d95bb4c31f.json
```

**Fix 3: Check File Location**
```
Verify files are at:
/wp-content/plugins/pregnancy-due-date-calculator-main/languages/

NOT at:
/wp-content/languages/plugins/
```

### Issue: Only Some Strings Translate

**Fix: Check Text Domain**
```php
// All __() calls must have same text domain:
__('text', 'pregnancy-due-date-calculator')

// NOT:
__('text', 'other-domain')
__('text') // Missing domain
```

### Issue: Block Editor Not Translating

**Fix: Check wp_set_script_translations()**
```php
// Must be called AFTER wp_enqueue_script()
wp_enqueue_script('pregnancy-ddc-block', ...);
wp_set_script_translations('pregnancy-ddc-block', 'pregnancy-due-date-calculator');
```

### Issue: German File Not Loading

**Fix: Verify Locale Code**
```
WordPress uses: de_DE (not de)
File must be: pregnancy-due-date-calculator-de_DE.mo
NOT: pregnancy-due-date-calculator-de.mo
```

## 📊 Test Checklist

### Pre-Translation Tests
- [ ] Plugin activates without errors
- [ ] Calculator displays correctly in English
- [ ] All dropdowns work
- [ ] Calculate button functions
- [ ] Results display correctly
- [ ] Validation works
- [ ] Gutenberg block editable

### Bundled Translation Tests (17 Languages)
- [ ] WordPress language switched to test locale
- [ ] All calculator strings display in selected language
- [ ] Calculator remains fully functional
- [ ] Date calculation still accurate
- [ ] Custom overrides still work
- [ ] Test multiple languages: German, Spanish, French, etc.

### TranslatePress Tests
- [ ] Plugin installed and configured
- [ ] Language added successfully
- [ ] Visual translation interface works
- [ ] Translated strings saved
- [ ] Language switcher works
- [ ] Calculator text changes on switch

### WPML Tests (If available)
- [ ] String translation module active
- [ ] Strings found in translation table
- [ ] 17 bundled languages load automatically
- [ ] Additional languages can be added via WPML
- [ ] Language switcher works
- [ ] Calculator displays in selected language

### Polylang Tests (If available)
- [ ] Languages added in settings
- [ ] String translation finds plugin strings
- [ ] Translations added for each language
- [ ] Language switcher widget works
- [ ] Calculator text changes per language

### RTL Language Tests
- [ ] Site language set to Arabic or Hebrew
- [ ] Calculator layout flips to RTL
- [ ] Text alignment correct
- [ ] Dropdowns work properly
- [ ] All functionality intact

## 🎯 Success Criteria

Translation implementation is successful when:

✅ **WordPress Language Switch**
- Changing site language in Settings → General updates calculator text
- 17 languages bundled and ready to use immediately
- All translatable strings display in selected language
- Functionality remains 100% intact

✅ **Translation Plugin Compatibility**
- TranslatePress can visually translate all calculator strings
- WPML string translation finds and translates all strings
- Polylang string translation works with calculator

✅ **Custom Overrides**
- Gutenberg block custom text overrides translations
- Shortcode attributes override translations
- User customization always takes precedence

✅ **Developer Experience**
- .pot file contains all translatable strings
- .po files can be edited in Poedit
- .mo files load correctly in WordPress
- Text domain consistent throughout

✅ **User Experience**
- Calculator works identically in all languages
- Date calculations remain accurate
- Validation works in all languages
- No broken layouts in RTL languages

## 📝 Quick Test Report Template

Copy this to report results:

```
# Translation Test Report

Plugin: Pregnancy Due Date Calculator v2.1.1
Date: [DATE]
Tester: [NAME]

## WordPress Native Translation
- [ ] Tested language(s): [LIST LANGUAGES]
- [ ] Site language switched successfully
- [ ] Calculator displays in selected language(s)
- [ ] All strings translated: YES / NO / PARTIAL
- [ ] Functionality intact: YES / NO
- [ ] Issues found: [DESCRIBE]

## TranslatePress
- [ ] Plugin installed and configured
- [ ] Spanish language added
- [ ] Visual translation tested
- [ ] Language switching works
- [ ] Issues found: [DESCRIBE]

## WPML (if tested)
- [ ] String translation module active
- [ ] All strings found in translation table
- [ ] French translations added
- [ ] Language switching works
- [ ] Issues found: [DESCRIBE]

## RTL Testing (if tested)
- [ ] Arabic/Hebrew language set
- [ ] Layout flips to RTL
- [ ] Text alignment correct
- [ ] Functionality works
- [ ] Issues found: [DESCRIBE]

## Overall Result
Status: PASS / FAIL / PARTIAL
Notes: [YOUR NOTES]
```

## 🆘 Need Help?

If you encounter issues:

1. **Check TRANSLATION.md** - Full detailed guide
2. **Check TRANSLATION_SUMMARY.md** - Implementation details
3. **Verify .mo and .json files exist** - Plugin includes 17 pre-compiled languages
4. **Clear all caches** - WordPress, browser, CDN, object cache
5. **Test with default theme** - Rule out theme conflicts
6. **Check error logs** - wp-content/debug.log

## 🚀 Ready to Go Live?

Before deploying:
- [ ] Test with at least 2-3 bundled languages
- [ ] Verify RTL with Arabic and/or Hebrew
- [ ] Test on staging environment first
- [ ] Plugin includes 17 languages ready to use
- [ ] Provide language switcher for multilingual sites
- [ ] Clear all caches after deployment
