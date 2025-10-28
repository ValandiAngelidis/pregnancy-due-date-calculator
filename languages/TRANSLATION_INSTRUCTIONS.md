# Translation Instructions for Remaining 6 Languages

## Current Status
- ✅ Complete: Portuguese (pt_BR), Dutch (nl_NL), Polish (pl_PL)
- 🔧 Framework Ready: Russian (ru_RU), Turkish (tr_TR), Swedish (sv_SE), Korean (ko_KR), Hindi (hi_IN), Hebrew (he_IL)

## Option 1: Using Poedit (Recommended)

Poedit is a free, professional translation editor that makes translating .po files easy and accurate.

### Steps:
1. **Download Poedit**: https://poedit.net/download
2. **Install Poedit** on your computer
3. **Open each .po file** in Poedit:
   - `pregnancy-due-date-calculator-ru_RU.po`
   - `pregnancy-due-date-calculator-tr_TR.po`
   - `pregnancy-due-date-calculator-sv_SE.po`
   - `pregnancy-due-date-calculator-ko_KR.po`
   - `pregnancy-due-date-calculator-hi_IN.po`
   - `pregnancy-due-date-calculator-he_IL.po`

4. **Translate strings** - Poedit shows:
   - Original English text on the left
   - Translation field on the right
   - Context and notes below

5. **Use Pre-Translation** (Poedit Pro feature):
   - Tools → Pre-translate
   - Uses translation memory and machine translation
   - Review and correct auto-translations

6. **Save** - Poedit automatically:
   - Compiles the .mo file
   - Validates syntax
   - Saves your progress

7. **Regenerate JSON** after saving:
   ```powershell
   cd "c:\Users\ellin\Local Sites\aurorachord\app\public\wp-content\plugins\pregnancy-due-date-calculator-main\languages"
   
   wp i18n make-json pregnancy-due-date-calculator-ru_RU.po --no-purge
   wp i18n make-json pregnancy-due-date-calculator-tr_TR.po --no-purge
   wp i18n make-json pregnancy-due-date-calculator-sv_SE.po --no-purge
   wp i18n make-json pregnancy-due-date-calculator-ko_KR.po --no-purge
   wp i18n make-json pregnancy-due-date-calculator-hi_IN.po --no-purge
   wp i18n make-json pregnancy-due-date-calculator-he_IL.po --no-purge
   ```

## Option 2: Professional Translation Services

For high-quality translations, consider:

1. **GlotPress** (WordPress.org community translations)
   - Upload plugin to WordPress.org
   - Community translators can contribute
   - Free and collaborative

2. **Translation Agencies**
   - Gengo: https://gengo.com/
   - One Hour Translation: https://www.onehourtranslation.com/
   - Professional quality guaranteed

3. **Freelance Translators** (Fiverr, Upwork)
   - Provide the 6 .po files
   - Request native speakers
   - Cost-effective for small projects

## Option 3: Machine Translation + Human Review

Use AI translation as a starting point, then have native speakers review:

### Using ChatGPT/Claude:
1. Extract English strings from .po file
2. Ask AI to translate to target language
3. Paste translations back into .po file
4. Have native speaker review for accuracy
5. Pay special attention to:
   - Medical terminology
   - Date formats
   - Cultural sensitivities

## Important Translation Notes

### Medical Terminology
- "Last Menstrual Period (LMP)" - use medically accurate terms
- "Trimester" - ensure correct medical terminology
- "Due Date" vs "Estimated Due Date" - distinction matters

### Date Formats
- Some languages use different date orders (DD/MM/YYYY vs MM/DD/YYYY)
- Month names should be in native language

### RTL Languages (Hebrew)
- Hebrew reads right-to-left
- WordPress handles RTL automatically
- Test the calculator in RTL mode after translation

### Plural Forms
Each language has different plural rules:
- Russian: 3 forms (nplurals=3)
- Turkish: 2 forms (nplurals=2)
- Swedish: 2 forms (nplurals=2)
- Korean: 1 form (nplurals=1) - no plurals
- Hindi: 2 forms (nplurals=2)
- Hebrew: 2 forms (nplurals=2)

## Strings to Translate (Total: ~100)

### Core Calculator Strings
- "Pregnancy Due Date Calculator"
- "Find Your Estimated Due Date"
- "Enter the first day of your last menstrual period"
- "Day", "Month", "Year"
- "Select Day", "Select Month", "Select Year"
- "Calculate Due Date"

### Month Names (12)
- January through December

### Result Messages
- "Your Estimated Due Date:"
- "Estimated Due Date"
- "Last Menstrual Period:"
- "Conception Date:"
- "First Trimester Begins:"
- "Second Trimester Begins:"
- "Third Trimester Begins:"
- "Important Stages"

### Progress Messages
- "Weeks Pregnant:"
- "Pregnancy Progress"
- "Time remaining:"
- "week", "weeks"
- "months", "days"

### Validation Messages
- "Invalid date selected"
- "Please select a day, month, and year."
- "These are estimates only. For personalized advice, consult your clinician."

## Testing After Translation

1. **Change WordPress language**:
   - Settings → General → Site Language
   - Select translated language

2. **Test calculator**:
   - Add calculator block/shortcode to a page
   - Verify all text appears in target language
   - Test form functionality
   - Check error messages

3. **RTL Testing** (Hebrew):
   - Verify text flows right-to-left
   - Check form element alignment
   - Ensure buttons and inputs are properly positioned

## Quick Translation Command Reference

```powershell
# Navigate to languages directory
cd "c:\Users\ellin\Local Sites\aurorachord\app\public\wp-content\plugins\pregnancy-due-date-calculator-main\languages"

# Compile .mo file after editing .po
msgfmt -o pregnancy-due-date-calculator-LOCALE.mo pregnancy-due-date-calculator-LOCALE.po

# Generate .json file for Gutenberg
wp i18n make-json pregnancy-due-date-calculator-LOCALE.po --no-purge

# Validate .po file
msgfmt --check pregnancy-due-date-calculator-LOCALE.po

# View translation statistics
msgfmt --statistics pregnancy-due-date-calculator-LOCALE.po
```

## Need Help?

- **Poedit Documentation**: https://poedit.net/trac/wiki/Doc
- **WordPress i18n**: https://developer.wordpress.org/plugins/internationalization/
- **Gettext Manual**: https://www.gnu.org/software/gettext/manual/

## Translation Quality Checklist

- [ ] All strings translated (no empty msgstr)
- [ ] Medical terms are accurate
- [ ] Tone is professional and reassuring
- [ ] Date formats appropriate for locale
- [ ] Plural forms handled correctly
- [ ] Special characters display correctly
- [ ] .mo file compiles without errors
- [ ] .json file generated successfully
- [ ] Tested in WordPress with target language
- [ ] Native speaker reviewed (if possible)

---

**Remember**: The framework files are already set up correctly. You just need to fill in the translations!
