(function() {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, ColorPalette } = wp.blockEditor;
    const { PanelBody, ToggleControl, RangeControl, SelectControl, TextControl } = wp.components;
    const { __ } = wp.i18n;
    const { createElement: el } = wp.element;

    registerBlockType('pregnancy/due-date-calculator', {
        title: __('Pregnancy Due Date Calculator', 'pregnancy-due-date-calculator'),
        description: __('A calculator to determine pregnancy due dates with Greek and English support.', 'pregnancy-due-date-calculator'),
        category: 'widgets',
        icon: 'calendar-alt',
        keywords: [
            __('pregnancy', 'pregnancy-due-date-calculator'),
            __('due date', 'pregnancy-due-date-calculator'),
            __('calculator', 'pregnancy-due-date-calculator')
        ],
        attributes: {
            backgroundColor: {
                type: 'string',
                default: ''
            },
            textColor: {
                type: 'string',
                default: ''
            },
            borderRadius: {
                type: 'number',
                default: 0
            },
            padding: {
                type: 'number',
                default: 20
            },
            maxWidth: {
                type: 'number',
                default: 600
            },
            alignment: {
                type: 'string',
                default: 'center'
            },
            showProgressBar: {
                type: 'boolean',
                default: true
            },
            showNote: {
                type: 'boolean',
                default: true
            },
            showWeeksCount: {
                type: 'boolean',
                default: true
            },
            // Title section
            customTitleText: {
                type: 'string'
                // Default handled by PHP server-side for proper i18n
            },
            titleAlignment: {
                type: 'string',
                default: 'center'
            },
            titleColor: {
                type: 'string',
                default: ''
            },
            titleFontFamily: {
                type: 'string',
                default: 'System UI'
            },
            // Subtitle section
            customSubtitleText: {
                type: 'string'
                // Default handled by PHP server-side for proper i18n
            },
            subtitleAlignment: {
                type: 'string',
                default: 'center'
            },
            subtitleColor: {
                type: 'string',
                default: ''
            },
            subtitleFontFamily: {
                type: 'string',
                default: 'System UI'
            },
            // Controls styling
            labelColor: {
                type: 'string',
                default: ''
            },
            dropdownStyle: {
                type: 'string',
                default: 'light'
            },
            dropdownBgColor: {
                type: 'string',
                default: ''
            },
            buttonBgColor: {
                type: 'string',
                default: ''
            },
            buttonTextColor: {
                type: 'string',
                default: ''
            },
            progressFillColor: {
                type: 'string',
                default: ''
            },
            progressTextColor: {
                type: 'string',
                default: ''
            },
            weeksCountColor: {
                type: 'string',
                default: ''
            },
            // Form labels
            labelDay: {
                type: 'string'
                // Default handled by PHP server-side for proper i18n
            },
            labelMonth: {
                type: 'string'
                // Default handled by PHP server-side for proper i18n
            },
            labelYear: {
                type: 'string'
                // Default handled by PHP server-side for proper i18n
            },
            // Placeholder texts
            placeholderDay: {
                type: 'string'
                // Default handled by PHP server-side for proper i18n
            },
            placeholderMonth: {
                type: 'string'
                // Default handled by PHP server-side for proper i18n
            },
            placeholderYear: {
                type: 'string'
                // Default handled by PHP server-side for proper i18n
            },
            // Month names - defaults handled by PHP for i18n
            monthJan: { type: 'string' },
            monthFeb: { type: 'string' },
            monthMar: { type: 'string' },
            monthApr: { type: 'string' },
            monthMay: { type: 'string' },
            monthJun: { type: 'string' },
            monthJul: { type: 'string' },
            monthAug: { type: 'string' },
            monthSep: { type: 'string' },
            monthOct: { type: 'string' },
            monthNov: { type: 'string' },
            monthDec: { type: 'string' },
            // Note section
            customNoteText: {
                type: 'string'
                // Default handled by PHP server-side for proper i18n
            },
            noteBgColor: {
                type: 'string',
                default: ''
            },
            noteTextColor: {
                type: 'string',
                default: ''
            },
            // Validation message
            validationMessage: {
                type: 'string'
                // Default handled by PHP server-side for proper i18n
            },
            // Button styling
            buttonMargin: {
                type: 'number',
                default: 0
            },
            buttonBorderRadius: {
                type: 'number',
                default: 4
            },
            buttonShadow: {
                type: 'string',
                default: 'none'
            },
            buttonHoverBgColor: {
                type: 'string',
                default: ''
            }
        },

        edit: function(props) {
            const { attributes, setAttributes } = props;
            const {
                backgroundColor,
                textColor,
                borderRadius,
                padding,
                maxWidth,
                alignment,
                showProgressBar,
                showNote,
                showWeeksCount,
                // Title section
                customTitleText,
                titleAlignment,
                titleColor,
                titleFontFamily,
                // Subtitle section
                customSubtitleText,
                subtitleAlignment,
                subtitleColor,
                subtitleFontFamily,
                // Controls styling
                labelColor,
                dropdownStyle,
                dropdownBgColor,
                buttonBgColor,
                buttonTextColor,
                progressFillColor,
                progressTextColor,
                weeksCountColor,
                // Form labels
                labelDay,
                labelMonth,
                labelYear,
                // Placeholder texts
                placeholderDay,
                placeholderMonth,
                placeholderYear,
                // Month names
                monthJan, monthFeb, monthMar, monthApr, monthMay, monthJun,
                monthJul, monthAug, monthSep, monthOct, monthNov, monthDec,
                // Note section
                customNoteText,
                noteBgColor,
                noteTextColor,
                // Validation message
                validationMessage,
                // Button styling
                buttonMargin,
                buttonBorderRadius,
                buttonShadow,
                buttonHoverBgColor
            } = attributes;

            // Color options for the palette
            const colors = [
                { name: 'White', color: '#ffffff' },
                { name: 'Light Gray', color: '#f8f9fa' },
                { name: 'Light Blue', color: '#e3f2fd' },
                { name: 'Light Pink', color: '#fce4ec' },
                { name: 'Light Green', color: '#e8f5e8' },
                { name: 'Dark Blue', color: '#1976d2' },
                { name: 'Dark Gray', color: '#424242' },
                { name: 'Black', color: '#000000' }
            ];

            // Font family options
            const fontFamilies = [
                { label: 'System UI', value: 'System UI' },
                { label: 'Poppins', value: 'Poppins, sans-serif' },
                { label: 'Open Sans', value: 'Open Sans, sans-serif' },
                { label: 'Arial', value: 'Arial, sans-serif' },
                { label: 'Georgia', value: 'Georgia, serif' }
            ];

            // Alignment options
            const alignmentOptions = [
                { label: __('Left', 'pregnancy-due-date-calculator'), value: 'left' },
                { label: __('Center', 'pregnancy-due-date-calculator'), value: 'center' },
                { label: __('Right', 'pregnancy-due-date-calculator'), value: 'right' }
            ];

            // Preview styles - use maxWidth and margin for alignment (no width: 100%)
            const previewStyles = {
                backgroundColor: backgroundColor || '#f8f9fa',
                borderRadius: borderRadius + 'px',
                padding: padding + 'px',
                maxWidth: maxWidth + 'px',
                marginLeft: alignment === 'center' ? 'auto' : (alignment === 'right' ? 'auto' : '0'),
                marginRight: alignment === 'center' ? 'auto' : (alignment === 'right' ? '0' : 'auto'),
                border: '1px solid #ddd',
                fontFamily: 'Arial, sans-serif'
            };

            // Text color styles for preview elements
            const textColorStyles = textColor ? { color: textColor } : { color: '#333333' };

            return [
                // Inspector Controls (sidebar settings)
                el(InspectorControls, {},
                    // Title Section
                    el(PanelBody, {
                        title: __('Title Section', 'pregnancy-due-date-calculator'),
                        initialOpen: false
                    },
                        el('p', { style: { margin: '0 0 10px 0', fontWeight: 'bold' } }, __('Custom Title Text', 'pregnancy-due-date-calculator')),
                        el('input', {
                            type: 'text',
                            value: customTitleText,
                            placeholder: __('Find Your Estimated Due Date', 'pregnancy-due-date-calculator'),
                            onChange: function(event) {
                                setAttributes({ customTitleText: event.target.value });
                            },
                            style: { width: '100%', padding: '8px', marginBottom: '15px' }
                        }),
                        el(SelectControl, {
                            label: __('Title Alignment', 'pregnancy-due-date-calculator'),
                            value: titleAlignment,
                            options: alignmentOptions,
                            onChange: function(value) {
                                setAttributes({ titleAlignment: value });
                            }
                        }),
                        el(SelectControl, {
                            label: __('Title Font Family', 'pregnancy-due-date-calculator'),
                            value: titleFontFamily,
                            options: fontFamilies,
                            onChange: function(value) {
                                setAttributes({ titleFontFamily: value });
                            }
                        }),
                        el('p', { style: { marginBottom: '10px', fontWeight: 'bold' } }, __('Title Color', 'pregnancy-due-date-calculator')),
                        el(ColorPalette, {
                            colors: colors,
                            value: titleColor,
                            onChange: function(color) {
                                setAttributes({ titleColor: color || '' });
                            }
                        })
                    ),

                    // Subtitle Section
                    el(PanelBody, {
                        title: __('Subtitle Section', 'pregnancy-due-date-calculator'),
                        initialOpen: false
                    },
                        el('p', { style: { margin: '0 0 10px 0', fontWeight: 'bold' } }, __('Custom Subtitle Text', 'pregnancy-due-date-calculator')),
                        el('input', {
                            type: 'text',
                            value: customSubtitleText,
                            placeholder: __('Enter the first day of your last menstrual period to calculate your estimated due date.', 'pregnancy-due-date-calculator'),
                            onChange: function(event) {
                                setAttributes({ customSubtitleText: event.target.value });
                            },
                            style: { width: '100%', padding: '8px', marginBottom: '15px' }
                        }),
                        el(SelectControl, {
                            label: __('Subtitle Alignment', 'pregnancy-due-date-calculator'),
                            value: subtitleAlignment,
                            options: alignmentOptions,
                            onChange: function(value) {
                                setAttributes({ subtitleAlignment: value });
                            }
                        }),
                        el(SelectControl, {
                            label: __('Subtitle Font Family', 'pregnancy-due-date-calculator'),
                            value: subtitleFontFamily,
                            options: fontFamilies,
                            onChange: function(value) {
                                setAttributes({ subtitleFontFamily: value });
                            }
                        }),
                        el('p', { style: { marginBottom: '10px', fontWeight: 'bold' } }, __('Subtitle Color', 'pregnancy-due-date-calculator')),
                        el(ColorPalette, {
                            colors: colors,
                            value: subtitleColor,
                            onChange: function(color) {
                                setAttributes({ subtitleColor: color || '' });
                            }
                        })
                    ),

                    el(PanelBody, {
                        title: __('Display Settings', 'pregnancy-due-date-calculator'),
                        initialOpen: true
                    },
                        el(SelectControl, {
                            label: __('Alignment', 'pregnancy-due-date-calculator'),
                            value: alignment,
                            options: alignmentOptions,
                            onChange: function(value) {
                                setAttributes({ alignment: value });
                            }
                        }),
                        el(ToggleControl, {
                            label: __('Show Progress Bar', 'pregnancy-due-date-calculator'),
                            help: __('Display pregnancy progress bar with percentage.', 'pregnancy-due-date-calculator'),
                            checked: showProgressBar,
                            onChange: function(value) {
                                setAttributes({ showProgressBar: value });
                            }
                        }),
                        el(ToggleControl, {
                            label: __('Show Weeks Count', 'pregnancy-due-date-calculator'),
                            help: __('Display remaining weeks and days in progress section.', 'pregnancy-due-date-calculator'),
                            checked: showWeeksCount,
                            onChange: function(value) {
                                setAttributes({ showWeeksCount: value });
                            }
                        }),
                        el(ToggleControl, {
                            label: __('Show Disclaimer Note', 'pregnancy-due-date-calculator'),
                            help: __('Display disclaimer text about estimates.', 'pregnancy-due-date-calculator'),
                            checked: showNote,
                            onChange: function(value) {
                                setAttributes({ showNote: value });
                            }
                        })
                    ),
                    el(PanelBody, {
                        title: __('Styling', 'pregnancy-due-date-calculator'),
                        initialOpen: false
                    },
                        el('p', { style: { marginBottom: '10px', fontWeight: 'bold' } }, __('Background Color', 'pregnancy-due-date-calculator')),
                        el(ColorPalette, {
                            colors: colors,
                            value: backgroundColor,
                            onChange: function(color) {
                                setAttributes({ backgroundColor: color || '' });
                            }
                        }),
                        el('p', { style: { marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' } }, __('Text Color', 'pregnancy-due-date-calculator')),
                        el(ColorPalette, {
                            colors: colors,
                            value: textColor,
                            onChange: function(color) {
                                setAttributes({ textColor: color || '' });
                            }
                        }),
                        el(RangeControl, {
                            label: __('Border Radius (px)', 'pregnancy-due-date-calculator'),
                            value: borderRadius,
                            onChange: function(value) {
                                setAttributes({ borderRadius: value });
                            },
                            min: 0,
                            max: 50
                        }),
                        el(RangeControl, {
                            label: __('Padding (px)', 'pregnancy-due-date-calculator'),
                            value: padding,
                            onChange: function(value) {
                                setAttributes({ padding: value });
                            },
                            min: 0,
                            max: 100
                        }),
                        el(RangeControl, {
                            label: __('Max Width (px)', 'pregnancy-due-date-calculator'),
                            value: maxWidth,
                            onChange: function(value) {
                                setAttributes({ maxWidth: value });
                            },
                            min: 300,
                            max: 1200
                        })
                    ),

                    // Controls Styling
                    el(PanelBody, {
                        title: __('Controls Styling', 'pregnancy-due-date-calculator'),
                        initialOpen: false
                    },
                        el('p', { style: { marginBottom: '10px', fontWeight: 'bold' } }, __('Label Color', 'pregnancy-due-date-calculator')),
                        el(ColorPalette, {
                            colors: colors,
                            value: labelColor,
                            onChange: function(color) {
                                setAttributes({ labelColor: color || '' });
                            }
                        }),
                        el('p', { style: { marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' } }, __('Dropdown Style', 'pregnancy-due-date-calculator')),
                        el(SelectControl, {
                            value: dropdownStyle,
                            options: [
                                { label: __('Light', 'pregnancy-due-date-calculator'), value: 'light' },
                                { label: __('Dark', 'pregnancy-due-date-calculator'), value: 'dark' }
                            ],
                            onChange: function(value) {
                                setAttributes({ dropdownStyle: value });
                            }
                        }),
                        el('p', { style: { marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' } }, __('Dropdown Background Color', 'pregnancy-due-date-calculator')),
                        el(ColorPalette, {
                            colors: colors,
                            value: dropdownBgColor,
                            onChange: function(color) {
                                setAttributes({ dropdownBgColor: color || '' });
                            }
                        })
                    ),

                    // Progress Bar Styles
                    el(PanelBody, {
                        title: __('Progress Bar Styles', 'pregnancy-due-date-calculator'),
                        initialOpen: false
                    },
                        el('p', { style: { marginBottom: '10px', fontWeight: 'bold' } }, __('Progress Bar Fill Color', 'pregnancy-due-date-calculator')),
                        el(ColorPalette, {
                            colors: colors,
                            value: progressFillColor,
                            onChange: function(color) {
                                setAttributes({ progressFillColor: color || '' });
                            }
                        }),
                        el('p', { style: { marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' } }, __('Progress Text Color', 'pregnancy-due-date-calculator')),
                        el(ColorPalette, {
                            colors: colors,
                            value: progressTextColor,
                            onChange: function(color) {
                                setAttributes({ progressTextColor: color || '' });
                            }
                        }),
                        el('p', { style: { marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' } }, __('Weeks Count Color', 'pregnancy-due-date-calculator')),
                        el(ColorPalette, {
                            colors: colors,
                            value: weeksCountColor,
                            onChange: function(color) {
                                setAttributes({ weeksCountColor: color || '' });
                            }
                        })
                    ),

                    // Button Styles
                    el(PanelBody, {
                        title: __('Button Styles', 'pregnancy-due-date-calculator'),
                        initialOpen: false
                    },
                        el('p', { style: { marginBottom: '10px', fontWeight: 'bold' } }, __('Button Background Color', 'pregnancy-due-date-calculator')),
                        el(ColorPalette, {
                            colors: colors,
                            value: buttonBgColor,
                            onChange: function(color) {
                                setAttributes({ buttonBgColor: color || '' });
                            }
                        }),
                        el('p', { style: { marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' } }, __('Button Text Color', 'pregnancy-due-date-calculator')),
                        el(ColorPalette, {
                            colors: colors,
                            value: buttonTextColor,
                            onChange: function(color) {
                                setAttributes({ buttonTextColor: color || '' });
                            }
                        }),
                        el('p', { style: { marginBottom: '10px', marginTop: '20px', fontWeight: 'bold' } }, __('Button Hover Background Color', 'pregnancy-due-date-calculator')),
                        el(ColorPalette, {
                            colors: colors,
                            value: buttonHoverBgColor,
                            onChange: function(color) {
                                setAttributes({ buttonHoverBgColor: color || '' });
                            }
                        }),
                        el(RangeControl, {
                            label: __('Button Margin (px)', 'pregnancy-due-date-calculator'),
                            value: buttonMargin,
                            onChange: function(value) {
                                setAttributes({ buttonMargin: value });
                            },
                            min: 0,
                            max: 50
                        }),
                        el(RangeControl, {
                            label: __('Button Border Radius (px)', 'pregnancy-due-date-calculator'),
                            value: buttonBorderRadius,
                            onChange: function(value) {
                                setAttributes({ buttonBorderRadius: value });
                            },
                            min: 0,
                            max: 50
                        }),
                        el(SelectControl, {
                            label: __('Button Shadow', 'pregnancy-due-date-calculator'),
                            value: buttonShadow,
                            options: [
                                { label: __('None', 'pregnancy-due-date-calculator'), value: 'none' },
                                { label: __('Light', 'pregnancy-due-date-calculator'), value: 'light' },
                                { label: __('Medium', 'pregnancy-due-date-calculator'), value: 'medium' },
                                { label: __('Deep', 'pregnancy-due-date-calculator'), value: 'deep' }
                            ],
                            onChange: function(value) {
                                setAttributes({ buttonShadow: value });
                            }
                        })
                    ),

                    // Form Labels Section
                    el(PanelBody, {
                        title: __('Form Labels', 'pregnancy-due-date-calculator'),
                        initialOpen: false
                    },
                        el('p', { style: { margin: '0 0 10px 0', fontWeight: 'bold' } }, __('Day Label', 'pregnancy-due-date-calculator')),
                        el('input', {
                            type: 'text',
                            value: labelDay,
                            placeholder: __('Day', 'pregnancy-due-date-calculator'),
                            onChange: function(event) {
                                setAttributes({ labelDay: event.target.value });
                            },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        }),
                        el('p', { style: { margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'normal', color: '#666' } }, __('Day Placeholder', 'pregnancy-due-date-calculator')),
                        el('input', {
                            type: 'text',
                            value: placeholderDay,
                            placeholder: __('Select Day', 'pregnancy-due-date-calculator'),
                            onChange: function(event) {
                                setAttributes({ placeholderDay: event.target.value });
                            },
                            style: { width: '100%', padding: '8px', marginBottom: '15px' }
                        }),
                        el('p', { style: { margin: '0 0 10px 0', fontWeight: 'bold' } }, __('Month Label', 'pregnancy-due-date-calculator')),
                        el('input', {
                            type: 'text',
                            value: labelMonth,
                            placeholder: __('Month', 'pregnancy-due-date-calculator'),
                            onChange: function(event) {
                                setAttributes({ labelMonth: event.target.value });
                            },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        }),
                        el('p', { style: { margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'normal', color: '#666' } }, __('Month Placeholder', 'pregnancy-due-date-calculator')),
                        el('input', {
                            type: 'text',
                            value: placeholderMonth,
                            placeholder: __('Select Month', 'pregnancy-due-date-calculator'),
                            onChange: function(event) {
                                setAttributes({ placeholderMonth: event.target.value });
                            },
                            style: { width: '100%', padding: '8px', marginBottom: '15px' }
                        }),
                        el('p', { style: { margin: '0 0 10px 0', fontWeight: 'bold' } }, __('Year Label', 'pregnancy-due-date-calculator')),
                        el('input', {
                            type: 'text',
                            value: labelYear,
                            placeholder: __('Year', 'pregnancy-due-date-calculator'),
                            onChange: function(event) {
                                setAttributes({ labelYear: event.target.value });
                            },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        }),
                        el('p', { style: { margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'normal', color: '#666' } }, __('Year Placeholder', 'pregnancy-due-date-calculator')),
                        el('input', {
                            type: 'text',
                            value: placeholderYear,
                            placeholder: __('Select Year', 'pregnancy-due-date-calculator'),
                            onChange: function(event) {
                                setAttributes({ placeholderYear: event.target.value });
                            },
                            style: { width: '100%', padding: '8px', marginBottom: '15px' }
                        }),
                        el('p', { style: { margin: '15px 0 10px 0', fontWeight: 'bold', borderTop: '1px solid #ddd', paddingTop: '15px' } }, __('Custom Month Names', 'pregnancy-due-date-calculator')),
                        el('input', {
                            type: 'text',
                            value: monthJan,
                            placeholder: __('January', 'pregnancy-due-date-calculator'),
                            onChange: function(event) { setAttributes({ monthJan: event.target.value }); },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        }),
                        el('input', {
                            type: 'text',
                            value: monthFeb,
                            placeholder: __('February', 'pregnancy-due-date-calculator'),
                            onChange: function(event) { setAttributes({ monthFeb: event.target.value }); },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        }),
                        el('input', {
                            type: 'text',
                            value: monthMar,
                            placeholder: __('March', 'pregnancy-due-date-calculator'),
                            onChange: function(event) { setAttributes({ monthMar: event.target.value }); },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        }),
                        el('input', {
                            type: 'text',
                            value: monthApr,
                            placeholder: __('April', 'pregnancy-due-date-calculator'),
                            onChange: function(event) { setAttributes({ monthApr: event.target.value }); },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        }),
                        el('input', {
                            type: 'text',
                            value: monthMay,
                            placeholder: __('May', 'pregnancy-due-date-calculator'),
                            onChange: function(event) { setAttributes({ monthMay: event.target.value }); },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        }),
                        el('input', {
                            type: 'text',
                            value: monthJun,
                            placeholder: __('June', 'pregnancy-due-date-calculator'),
                            onChange: function(event) { setAttributes({ monthJun: event.target.value }); },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        }),
                        el('input', {
                            type: 'text',
                            value: monthJul,
                            placeholder: __('July', 'pregnancy-due-date-calculator'),
                            onChange: function(event) { setAttributes({ monthJul: event.target.value }); },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        }),
                        el('input', {
                            type: 'text',
                            value: monthAug,
                            placeholder: __('August', 'pregnancy-due-date-calculator'),
                            onChange: function(event) { setAttributes({ monthAug: event.target.value }); },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        }),
                        el('input', {
                            type: 'text',
                            value: monthSep,
                            placeholder: __('September', 'pregnancy-due-date-calculator'),
                            onChange: function(event) { setAttributes({ monthSep: event.target.value }); },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        }),
                        el('input', {
                            type: 'text',
                            value: monthOct,
                            placeholder: __('October', 'pregnancy-due-date-calculator'),
                            onChange: function(event) { setAttributes({ monthOct: event.target.value }); },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        }),
                        el('input', {
                            type: 'text',
                            value: monthNov,
                            placeholder: __('November', 'pregnancy-due-date-calculator'),
                            onChange: function(event) { setAttributes({ monthNov: event.target.value }); },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        }),
                        el('input', {
                            type: 'text',
                            value: monthDec,
                            placeholder: __('December', 'pregnancy-due-date-calculator'),
                            onChange: function(event) { setAttributes({ monthDec: event.target.value }); },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        })
                    ),

                    // Note Section
                    el(PanelBody, {
                        title: __('Note Section', 'pregnancy-due-date-calculator'),
                        initialOpen: false
                    },
                        el('p', { style: { margin: '0 0 10px 0', fontWeight: 'bold' } }, __('Custom Note Text', 'pregnancy-due-date-calculator')),
                        el('textarea', {
                            value: customNoteText,
                            placeholder: __('These are estimates only. For personalized advice, consult your clinician.', 'pregnancy-due-date-calculator'),
                            onChange: function(event) {
                                setAttributes({ customNoteText: event.target.value });
                            },
                            style: { width: '100%', padding: '8px', marginBottom: '15px', minHeight: '80px', resize: 'vertical' }
                        }),
                        el('p', { style: { margin: '0 0 5px 0', fontWeight: 'bold' } }, __('Note Background Color', 'pregnancy-due-date-calculator')),
                        el(ColorPalette, {
                            colors: colors,
                            value: noteBgColor,
                            onChange: function(color) {
                                setAttributes({ noteBgColor: color });
                            }
                        }),
                        el('p', { style: { margin: '15px 0 5px 0', fontWeight: 'bold' } }, __('Note Text Color', 'pregnancy-due-date-calculator')),
                        el(ColorPalette, {
                            colors: colors,
                            value: noteTextColor,
                            onChange: function(color) {
                                setAttributes({ noteTextColor: color });
                            }
                        }),
                        el('p', { style: { margin: '15px 0 10px 0', fontWeight: 'bold' } }, __('Validation Message', 'pregnancy-due-date-calculator')),
                        el('input', {
                            type: 'text',
                            value: validationMessage,
                            placeholder: __('Please select a day, month, and year.', 'pregnancy-due-date-calculator'),
                            onChange: function(event) {
                                setAttributes({ validationMessage: event.target.value });
                            },
                            style: { width: '100%', padding: '8px', marginBottom: '10px' }
                        })
                    )
                ),

                // Block preview in editor
                el('div', {
                    className: 'pregnancy-calculator-block-preview',
                    style: previewStyles
                },
                    el('div', { style: { textAlign: titleAlignment || 'center', marginBottom: '20px' } },
                        el('h3', { 
                            style: { 
                                margin: '0 0 10px 0', 
                                fontSize: '1.5em',
                                color: titleColor || '#333333',
                                fontFamily: titleFontFamily || 'System UI'
                            } 
                        }, customTitleText || __('Find Your Estimated Due Date', 'pregnancy-due-date-calculator')),
                        el('p', { 
                            style: { 
                                margin: '0', 
                                fontSize: '0.9em',
                                color: subtitleColor || '#666',
                                fontFamily: subtitleFontFamily || 'System UI',
                                textAlign: subtitleAlignment || 'center'
                            } 
                        }, customSubtitleText || __('Enter the first day of your last menstrual period to calculate your estimated due date.', 'pregnancy-due-date-calculator'))
                    ),

                    el('div', { style: { marginBottom: '20px' } },
                        el('div', { 
                            style: { 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(3, 1fr)', 
                                gap: '15px',
                                marginBottom: '20px'
                            } 
                        },
                            el('div', {},
                                el('label', { 
                                    style: { 
                                        display: 'block', 
                                        marginBottom: '5px', 
                                        fontSize: '0.9em', 
                                        fontWeight: 'bold',
                                        color: labelColor || '#333333'
                                    } 
                                }, labelDay || __('Day', 'pregnancy-due-date-calculator')),
                                el('select', { 
                                    style: { 
                                        width: '100%', 
                                        padding: '8px', 
                                        borderRadius: '4px', 
                                        border: '1px solid #ccc',
                                        backgroundColor: dropdownBgColor || (dropdownStyle === 'dark' ? '#2c3e50' : '#fff'),
                                        color: dropdownStyle === 'dark' ? '#fff' : '#333'
                                    },
                                    disabled: true 
                                },
                                    el('option', {}, placeholderDay || __('Select day', 'pregnancy-due-date-calculator'))
                                )
                            ),
                            el('div', {},
                                el('label', { 
                                    style: { 
                                        display: 'block', 
                                        marginBottom: '5px', 
                                        fontSize: '0.9em', 
                                        fontWeight: 'bold',
                                        color: labelColor || '#333333'
                                    } 
                                }, labelMonth || __('Month', 'pregnancy-due-date-calculator')),
                                el('select', { 
                                    style: { 
                                        width: '100%', 
                                        padding: '8px', 
                                        borderRadius: '4px', 
                                        border: '1px solid #ccc',
                                        backgroundColor: dropdownBgColor || (dropdownStyle === 'dark' ? '#2c3e50' : '#fff'),
                                        color: dropdownStyle === 'dark' ? '#fff' : '#333'
                                    },
                                    disabled: true 
                                },
                                    el('option', {}, placeholderMonth || __('Select month', 'pregnancy-due-date-calculator'))
                                )
                            ),
                            el('div', {},
                                el('label', { 
                                    style: { 
                                        display: 'block', 
                                        marginBottom: '5px', 
                                        fontSize: '0.9em', 
                                        fontWeight: 'bold',
                                        color: labelColor || '#333333'
                                    } 
                                }, labelYear || __('Year', 'pregnancy-due-date-calculator')),
                                el('select', { 
                                    style: { 
                                        width: '100%', 
                                        padding: '8px', 
                                        borderRadius: '4px', 
                                        border: '1px solid #ccc',
                                        backgroundColor: dropdownBgColor || (dropdownStyle === 'dark' ? '#2c3e50' : '#fff'),
                                        color: dropdownStyle === 'dark' ? '#fff' : '#333'
                                    },
                                    disabled: true 
                                },
                                    el('option', {}, placeholderYear || __('Select year', 'pregnancy-due-date-calculator'))
                                )
                            )
                        ),
                        el('button', {
                            type: 'button',
                            style: {
                                backgroundColor: buttonBgColor || '#007cba',
                                color: buttonTextColor || '#fff',
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: buttonBorderRadius + 'px',
                                fontSize: '1em',
                                cursor: 'not-allowed',
                                width: '100%',
                                opacity: 0.7,
                                margin: buttonMargin + 'px 0',
                                boxShadow: buttonShadow === 'light' ? '0 2px 4px rgba(0, 0, 0, 0.1)' :
                                           buttonShadow === 'medium' ? '0 4px 8px rgba(0, 0, 0, 0.15)' :
                                           buttonShadow === 'deep' ? '0 8px 16px rgba(0, 0, 0, 0.2)' : 'none',
                                transition: 'background-color 0.3s ease'
                            },
                            onMouseEnter: function(e) {
                                if (buttonHoverBgColor) {
                                    e.target.style.backgroundColor = buttonHoverBgColor;
                                }
                            },
                            onMouseLeave: function(e) {
                                e.target.style.backgroundColor = buttonBgColor || '#007cba';
                            },
                            disabled: true
                        }, __('Calculate Due Date', 'pregnancy-due-date-calculator'))
                    ),

                    el('div', { 
                        style: { 
                            padding: '15px',
                            backgroundColor: 'rgba(0, 124, 186, 0.1)',
                            borderRadius: '4px',
                            textAlign: 'center',
                            fontSize: '0.9em',
                            color: textColor || '#666'
                        } 
                    }, __('Results will appear here after calculation', 'pregnancy-due-date-calculator')),

                    // Show progress bar preview if enabled
                    showProgressBar && el('div', { 
                        style: { 
                            marginTop: '20px',
                            padding: '15px',
                            backgroundColor: 'rgba(0, 124, 186, 0.05)',
                            borderRadius: '4px',
                            border: '1px dashed #007cba'
                        } 
                    },
                        el('div', { 
                            style: { 
                                height: '8px',
                                backgroundColor: '#e0e0e0',
                                borderRadius: '4px',
                                marginBottom: '10px',
                                overflow: 'hidden'
                            }
                        },
                            el('div', {
                                style: {
                                    width: '60%',
                                    height: '100%',
                                    backgroundColor: progressFillColor || '#007cba',
                                    borderRadius: '4px'
                                }
                            })
                        ),
                        el('p', { 
                            style: { 
                                margin: '0', 
                                textAlign: 'center', 
                                fontSize: '0.9em',
                                color: progressTextColor || '#666'
                            } 
                        }, __('Progress bar preview', 'pregnancy-due-date-calculator'))
                    ),

                    // Show note preview if enabled
                    showNote && el('div', { 
                        style: { 
                            marginTop: '15px',
                            padding: '10px',
                            backgroundColor: noteBgColor || 'rgba(255, 193, 7, 0.1)',
                            borderRadius: '4px',
                            border: '1px dashed #ffc107'
                        } 
                    },
                        el('p', { 
                            style: { 
                                margin: '0', 
                                fontSize: '0.8em',
                                fontStyle: 'italic',
                                color: noteTextColor || textColor || '#666'
                            } 
                        }, customNoteText || __('These are estimates only. For personalized advice, consult your clinician.', 'pregnancy-due-date-calculator'))
                    )
                )
            ];
        },

        save: function() {
            // Return null since this is a dynamic block rendered server-side
            return null;
        }
    });
})();