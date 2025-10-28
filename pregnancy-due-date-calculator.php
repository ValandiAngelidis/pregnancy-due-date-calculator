<?php
/**
 * Plugin Name: Pregnancy Due Date Calculator
 * Plugin URI: https://valandiangelidis.com
 * Description: Adds a shortcode [pregnancy_due_date_calculator] to display a pregnancy due date calculator with full multilingual support for 17 languages and Gutenberg block integration.
 * Version: 2.1.1
 * Author: Valandi Angelidis
 * Author URI: https://valandiangelidis.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: pregnancy-due-date-calculator
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * 
 * @package PregnancyDueDateCalculator
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) exit;

// Exit if WordPress not loaded
if (!defined('WPINC')) die;

// Define plugin constants
define('PREGNANCY_CALC_VERSION', '2.1.1');
define('PREGNANCY_CALC_MIN_PHP', '7.4');
define('PREGNANCY_CALC_MIN_WP', '5.8');

class PregnancyDueDateCalculator {
    
    private $plugin_url;
    private $plugin_path;
    private $version;
    
    function __construct() {
        // Check minimum PHP version
        if (version_compare(PHP_VERSION, PREGNANCY_CALC_MIN_PHP, '<')) {
            add_action('admin_notices', [$this, 'php_version_notice']);
            return;
        }
        
        // Check minimum WordPress version
        global $wp_version;
        if (version_compare($wp_version, PREGNANCY_CALC_MIN_WP, '<')) {
            add_action('admin_notices', [$this, 'wp_version_notice']);
            return;
        }
        
        $this->plugin_url = plugin_dir_url(__FILE__);
        $this->plugin_path = plugin_dir_path(__FILE__);
        $this->version = PREGNANCY_CALC_VERSION;
        
        // Load translations
        add_action('plugins_loaded', [$this, 'load_textdomain']);
        
        // Initialize hooks
        add_action('init', [$this, 'init']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend_assets']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_block_editor_assets']);
    }
    
    /**
     * Display admin notice for insufficient PHP version
     * @since 2.1.0
     */
    function php_version_notice() {
        echo '<div class="notice notice-error"><p>';
        echo sprintf(
            esc_html__('Pregnancy Due Date Calculator requires PHP %s or higher. You are running PHP %s. Please upgrade PHP to use this plugin.', 'pregnancy-due-date-calculator'),
            PREGNANCY_CALC_MIN_PHP,
            PHP_VERSION
        );
        echo '</p></div>';
    }
    
    /**
     * Display admin notice for insufficient WordPress version
     * @since 2.1.0
     */
    function wp_version_notice() {
        echo '<div class="notice notice-error"><p>';
        echo sprintf(
            esc_html__('Pregnancy Due Date Calculator requires WordPress %s or higher. You are running WordPress %s. Please upgrade WordPress to use this plugin.', 'pregnancy-due-date-calculator'),
            PREGNANCY_CALC_MIN_WP,
            $GLOBALS['wp_version']
        );
        echo '</p></div>';
    }
    
    /**
     * Load plugin translations
     * Enables support for TranslatePress, WPML, Polylang, and WordPress core translations
     * Includes automatic fallback to ensure .mo files are loaded
     * 
     * @since 1.0.0
     * @since 2.1.0 Added error logging
     */
    function load_textdomain() {
        $locale = apply_filters('plugin_locale', determine_locale(), 'pregnancy-due-date-calculator');
        
        // Load plugin text domain
        $loaded = load_plugin_textdomain(
            'pregnancy-due-date-calculator',
            false,
            dirname(plugin_basename(__FILE__)) . '/languages'
        );
        
        if (!$loaded) {
            $this->log_warning('Primary translation loading failed', [
                'locale' => $locale
            ]);
            
            // Try manual loading
            $mofile = dirname(__FILE__) . '/languages/pregnancy-due-date-calculator-' . $locale . '.mo';
            
            if (file_exists($mofile)) {
                $manual_loaded = load_textdomain('pregnancy-due-date-calculator', $mofile);
                if ($manual_loaded) {
                    $this->log_info('Translation loaded manually', [
                        'locale' => $locale,
                        'file' => $mofile
                    ]);
                } else {
                    $this->log_error('Manual translation loading failed', [
                        'locale' => $locale,
                        'file' => $mofile
                    ]);
                }
            } else {
                $this->log_warning('Translation file not found', [
                    'locale' => $locale,
                    'expected_file' => $mofile
                ]);
            }
        } else {
            $this->log_info('Translation loaded successfully', [
                'locale' => $locale
            ]);
        }
    }
    
    /**
     * Initialize plugin - register shortcode and block
     */
    function init() {
        // Register shortcode for backward compatibility
        add_shortcode('pregnancy_due_date_calculator', [$this, 'render_shortcode']);
        
        // Register Gutenberg block
        $this->register_block();
        
        // Register all scripts and styles
        $this->register_assets();
    }
    
    /**
     * Register all plugin assets (scripts and styles)
     * Uses wp_register_* functions following WordPress best practices
     * Includes translation strings passed to JavaScript
     * Supports minified assets in production
     * 
     * @since 1.0.0
     * @since 2.1.0 Added minified asset support
     */
    function register_assets() {
        // Determine if we should use minified versions
        $suffix = (defined('SCRIPT_DEBUG') && SCRIPT_DEBUG) ? '' : '.min';
        
        // Frontend style - check if minified version exists
        $style_file = 'assets/style' . $suffix . '.css';
        if (!file_exists($this->plugin_path . $style_file)) {
            $style_file = 'assets/style.css'; // Fallback to non-minified
            $this->log_info('Using non-minified style.css (minified version not found)');
        }
        
        wp_register_style(
            'pregnancy-ddc-style',
            $this->plugin_url . $style_file,
            [],
            filemtime($this->plugin_path . $style_file)
        );
        
        // Frontend script - check if minified version exists
        $script_file = 'assets/script' . $suffix . '.js';
        if (!file_exists($this->plugin_path . $script_file)) {
            $script_file = 'assets/script.js'; // Fallback to non-minified
            $this->log_info('Using non-minified script.js (minified version not found)');
        }
        
        wp_register_script(
            'pregnancy-ddc-script',
            $this->plugin_url . $script_file,
            [],
            filemtime($this->plugin_path . $script_file),
            true
        );
        
        // Log registration status
        if (!wp_script_is('pregnancy-ddc-script', 'registered')) {
            $this->log_error('Failed to register frontend script');
        }
        if (!wp_style_is('pregnancy-ddc-style', 'registered')) {
            $this->log_error('Failed to register frontend style');
        }
        
        // Pass translations to JavaScript for multilingual support
        // Uses caching for improved performance
        wp_localize_script(
            'pregnancy-ddc-script',
            'pregnancyCalculatorI18n',
            $this->get_translation_data()
        );
        
        // Block editor assets - only for Gutenberg
        if (file_exists($this->plugin_path . 'assets/block.js')) {
            // Block editor script - check if minified version exists
            $block_file = 'assets/block' . $suffix . '.js';
            if (!file_exists($this->plugin_path . $block_file)) {
                $block_file = 'assets/block.js'; // Fallback to non-minified
                $this->log_info('Using non-minified block.js (minified version not found)');
            }
            
            wp_register_script(
                'pregnancy-ddc-block-editor',
                $this->plugin_url . $block_file,
                ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n'],
                filemtime($this->plugin_path . $block_file),
                true
            );
            
            // Log registration status
            if (!wp_script_is('pregnancy-ddc-block-editor', 'registered')) {
                $this->log_error('Failed to register block editor script');
            }
            
            // Set up translations for block editor
            wp_set_script_translations(
                'pregnancy-ddc-block-editor',
                'pregnancy-due-date-calculator',
                $this->plugin_path . 'languages'
            );
            
            // Also pass locale for debugging
            wp_localize_script(
                'pregnancy-ddc-block-editor',
                'pregnancyCalculatorBlockI18n',
                [
                    'locale' => determine_locale()
                ]
            );
        }
        
        // Block editor style - check if minified version exists
        if (file_exists($this->plugin_path . 'assets/editor.css')) {
            $editor_style_file = 'assets/editor' . $suffix . '.css';
            if (!file_exists($this->plugin_path . $editor_style_file)) {
                $editor_style_file = 'assets/editor.css'; // Fallback to non-minified
                $this->log_info('Using non-minified editor.css (minified version not found)');
            }
            
            wp_register_style(
                'pregnancy-ddc-block-editor-style',
                $this->plugin_url . $editor_style_file,
                ['wp-edit-blocks'],
                filemtime($this->plugin_path . $editor_style_file)
            );
            
            // Log registration status
            if (!wp_style_is('pregnancy-ddc-block-editor-style', 'registered')) {
                $this->log_error('Failed to register block editor style');
            }
        }
    }
    
    /**
     * Enqueue frontend assets for shortcode and block front-end display
     * Only enqueues when calculator is actually used on the page
     */
    function enqueue_frontend_assets() {
        // Assets are enqueued in render functions when actually needed
        // This prevents unnecessary loading on pages without the calculator
    }
    
    /**
     * Enqueue block editor assets for Gutenberg interface
     * Only loads in the block editor admin interface
     */
    function enqueue_block_editor_assets() {
        // Enqueue block registration script
        if (wp_script_is('pregnancy-ddc-block-editor', 'registered')) {
            wp_enqueue_script('pregnancy-ddc-block-editor');
            
            // Force reload translations for this script
            global $wp_scripts;
            if (isset($wp_scripts->registered['pregnancy-ddc-block-editor'])) {
                $script = $wp_scripts->registered['pregnancy-ddc-block-editor'];
                wp_set_script_translations('pregnancy-ddc-block-editor', 'pregnancy-due-date-calculator', $this->plugin_path . 'languages');
            }
        }
        
        // Enqueue block editor styles
        if (wp_style_is('pregnancy-ddc-block-editor-style', 'registered')) {
            wp_enqueue_style('pregnancy-ddc-block-editor-style');
        }
    }

    /**
     * Register Gutenberg block with all attributes and server-side rendering
     * Block namespace: pregnancy/due-date-calculator
     */
    function register_block() {
        register_block_type('pregnancy/due-date-calculator', [
            'render_callback' => [$this, 'render_block'],
            'attributes' => [
                // Display toggles
                'showProgressBar' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'showNote' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'showWeeksCount' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                // Styling options
                'backgroundColor' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'textColor' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'borderRadius' => [
                    'type' => 'number',
                    'default' => 0
                ],
                'padding' => [
                    'type' => 'number',
                    'default' => 20
                ],
                // Layout options
                'maxWidth' => [
                    'type' => 'number',
                    'default' => 600
                ],
                'alignment' => [
                    'type' => 'string',
                    'default' => 'center'
                ],
                // Title section
                'customTitleText' => [
                    'type' => 'string',
                    'default' => __('Find Your Estimated Due Date', 'pregnancy-due-date-calculator')
                ],
                'titleAlignment' => [
                    'type' => 'string',
                    'default' => 'center'
                ],
                'titleColor' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'titleFontFamily' => [
                    'type' => 'string',
                    'default' => 'System UI'
                ],
                // Subtitle section
                'customSubtitleText' => [
                    'type' => 'string',
                    'default' => __('Enter the first day of your last menstrual period to calculate your estimated due date.', 'pregnancy-due-date-calculator')
                ],
                'subtitleAlignment' => [
                    'type' => 'string',
                    'default' => 'center'
                ],
                'subtitleColor' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'subtitleFontFamily' => [
                    'type' => 'string',
                    'default' => 'System UI'
                ],
                // Labels and controls
                'labelColor' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'dropdownStyle' => [
                    'type' => 'string',
                    'default' => 'light'
                ],
                'dropdownBgColor' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'buttonBgColor' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'buttonTextColor' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'progressFillColor' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'progressTextColor' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'weeksCountColor' => [
                    'type' => 'string',
                    'default' => ''
                ],
                // Form labels
                'labelDay' => [
                    'type' => 'string',
                    'default' => __('Day', 'pregnancy-due-date-calculator')
                ],
                'labelMonth' => [
                    'type' => 'string',
                    'default' => __('Month', 'pregnancy-due-date-calculator')
                ],
                'labelYear' => [
                    'type' => 'string',
                    'default' => __('Year', 'pregnancy-due-date-calculator')
                ],
                // Placeholder texts
                'placeholderDay' => [
                    'type' => 'string',
                    'default' => __('Select Day', 'pregnancy-due-date-calculator')
                ],
                'placeholderMonth' => [
                    'type' => 'string',
                    'default' => __('Select Month', 'pregnancy-due-date-calculator')
                ],
                'placeholderYear' => [
                    'type' => 'string',
                    'default' => __('Select Year', 'pregnancy-due-date-calculator')
                ],
                // Month names
                'monthJan' => ['type' => 'string', 'default' => __('January', 'pregnancy-due-date-calculator')],
                'monthFeb' => ['type' => 'string', 'default' => __('February', 'pregnancy-due-date-calculator')],
                'monthMar' => ['type' => 'string', 'default' => __('March', 'pregnancy-due-date-calculator')],
                'monthApr' => ['type' => 'string', 'default' => __('April', 'pregnancy-due-date-calculator')],
                'monthMay' => ['type' => 'string', 'default' => __('May', 'pregnancy-due-date-calculator')],
                'monthJun' => ['type' => 'string', 'default' => __('June', 'pregnancy-due-date-calculator')],
                'monthJul' => ['type' => 'string', 'default' => __('July', 'pregnancy-due-date-calculator')],
                'monthAug' => ['type' => 'string', 'default' => __('August', 'pregnancy-due-date-calculator')],
                'monthSep' => ['type' => 'string', 'default' => __('September', 'pregnancy-due-date-calculator')],
                'monthOct' => ['type' => 'string', 'default' => __('October', 'pregnancy-due-date-calculator')],
                'monthNov' => ['type' => 'string', 'default' => __('November', 'pregnancy-due-date-calculator')],
                'monthDec' => ['type' => 'string', 'default' => __('December', 'pregnancy-due-date-calculator')],
                // Custom note text
                'customNoteText' => [
                    'type' => 'string',
                    'default' => __('These are estimates only. For personalized advice, consult your clinician.', 'pregnancy-due-date-calculator')
                ],
                // Note section styling
                'noteBgColor' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'noteTextColor' => [
                    'type' => 'string',
                    'default' => ''
                ],
                // Validation message
                'validationMessage' => [
                    'type' => 'string',
                    'default' => __('Please select a day, month, and year.', 'pregnancy-due-date-calculator')
                ],
                // Button styling
                'buttonMargin' => [
                    'type' => 'number',
                    'default' => 0
                ],
                'buttonBorderRadius' => [
                    'type' => 'number',
                    'default' => 4
                ],
                'buttonShadow' => [
                    'type' => 'string',
                    'default' => 'none'
                ],
                'buttonHoverBgColor' => [
                    'type' => 'string',
                    'default' => ''
                ]
            ]
        ]);
    }

    /**
     * Server-side render callback for Gutenberg block
     * Processes block attributes and generates HTML with inline styles and data attributes
     * Enqueues frontend assets only when block is actually used
     * 
     * @param array $attributes Block attributes from Gutenberg editor
     * @return string Generated HTML for the calculator
     */
    /**
     * Render the pregnancy calculator block/shortcode
     * Generates HTML output with all customization options
     * 
     * @since 1.0.0
     * @since 2.1.0 Added error handling
     * @param array $attributes Block/shortcode attributes
     * @return string Generated HTML for the calculator
     */
    function render_block($attributes) {
        try {
            // Verify assets are registered
            if (!wp_style_is('pregnancy-ddc-style', 'registered')) {
                $this->log_error('Frontend style not registered when rendering block');
                return '<p>' . esc_html__('Calculator failed to load. Please check plugin installation.', 'pregnancy-due-date-calculator') . '</p>';
            }
            
            // Enqueue frontend assets since block is being rendered
            wp_enqueue_style('pregnancy-ddc-style');
            wp_enqueue_script('pregnancy-ddc-script');
        
        // Extract attributes with defaults - ensures backward compatibility
        // ✅ Sanitize all color attributes before use
        $background_color       = $this->sanitize_hex_color($attributes['backgroundColor'] ?? '');
        $text_color             = $this->sanitize_hex_color($attributes['textColor'] ?? '');
        $title_color            = $this->sanitize_hex_color($attributes['titleColor'] ?? '');
        $subtitle_color         = $this->sanitize_hex_color($attributes['subtitleColor'] ?? '');
        $label_color            = $this->sanitize_hex_color($attributes['labelColor'] ?? '');
        $button_bg_color        = $this->sanitize_hex_color($attributes['buttonBgColor'] ?? '');
        $button_text_color      = $this->sanitize_hex_color($attributes['buttonTextColor'] ?? '');
        $button_hover_bg_color  = $this->sanitize_hex_color($attributes['buttonHoverBgColor'] ?? '');
        $progress_fill_color    = $this->sanitize_hex_color($attributes['progressFillColor'] ?? '');
        $progress_text_color    = $this->sanitize_hex_color($attributes['progressTextColor'] ?? '');
        $weeks_count_color      = $this->sanitize_hex_color($attributes['weeksCountColor'] ?? '');
        $note_bg_color          = $this->sanitize_hex_color($attributes['noteBgColor'] ?? '');
        $note_text_color        = $this->sanitize_hex_color($attributes['noteTextColor'] ?? '');
        $dropdown_bg_color      = $this->sanitize_hex_color($attributes['dropdownBgColor'] ?? '');
        
        // Non-color attributes
        $border_radius = isset($attributes['borderRadius']) ? $attributes['borderRadius'] : 0;
        $padding = isset($attributes['padding']) ? $attributes['padding'] : 20;
        $max_width = isset($attributes['maxWidth']) ? $attributes['maxWidth'] : 600;
        $alignment = isset($attributes['alignment']) ? $attributes['alignment'] : 'center';
        $show_progress_bar = isset($attributes['showProgressBar']) ? $attributes['showProgressBar'] : true;
        $show_note = isset($attributes['showNote']) ? $attributes['showNote'] : true;
        $show_weeks_count = isset($attributes['showWeeksCount']) ? $attributes['showWeeksCount'] : true;
        
        // Title section attributes - use translated defaults if not set
        $custom_title_text = isset($attributes['customTitleText']) && $attributes['customTitleText'] !== '' 
            ? $attributes['customTitleText'] 
            : __('Find Your Estimated Due Date', 'pregnancy-due-date-calculator');
        $title_alignment = isset($attributes['titleAlignment']) ? $attributes['titleAlignment'] : 'center';
        $title_font_family = isset($attributes['titleFontFamily']) ? $attributes['titleFontFamily'] : 'System UI';
        
        // Subtitle section attributes - use translated defaults if not set
        $custom_subtitle_text = isset($attributes['customSubtitleText']) && $attributes['customSubtitleText'] !== '' 
            ? $attributes['customSubtitleText'] 
            : __('Enter the first day of your last menstrual period to calculate your estimated due date.', 'pregnancy-due-date-calculator');
        $subtitle_alignment = isset($attributes['subtitleAlignment']) ? $attributes['subtitleAlignment'] : 'center';
        $subtitle_font_family = isset($attributes['subtitleFontFamily']) ? $attributes['subtitleFamilyFamily'] : 'System UI';
        
        // Control styling attributes
        $dropdown_style = isset($attributes['dropdownStyle']) ? $attributes['dropdownStyle'] : 'light';
        
        // Form label attributes - use translated defaults if not set or empty
        $label_day = (!empty($attributes['labelDay'])) ? $attributes['labelDay'] : __('Day', 'pregnancy-due-date-calculator');
        $label_month = (!empty($attributes['labelMonth'])) ? $attributes['labelMonth'] : __('Month', 'pregnancy-due-date-calculator');
        $label_year = (!empty($attributes['labelYear'])) ? $attributes['labelYear'] : __('Year', 'pregnancy-due-date-calculator');
        
        // Placeholder attributes - use translated defaults if not set or empty
        $placeholder_day = (!empty($attributes['placeholderDay'])) ? $attributes['placeholderDay'] : __('Select Day', 'pregnancy-due-date-calculator');
        $placeholder_month = (!empty($attributes['placeholderMonth'])) ? $attributes['placeholderMonth'] : __('Select Month', 'pregnancy-due-date-calculator');
        $placeholder_year = (!empty($attributes['placeholderYear'])) ? $attributes['placeholderYear'] : __('Select Year', 'pregnancy-due-date-calculator');
        
        // Month name attributes - use translated defaults if not set or empty
        $month_names = [
            (!empty($attributes['monthJan'])) ? $attributes['monthJan'] : __('January', 'pregnancy-due-date-calculator'),
            (!empty($attributes['monthFeb'])) ? $attributes['monthFeb'] : __('February', 'pregnancy-due-date-calculator'),
            (!empty($attributes['monthMar'])) ? $attributes['monthMar'] : __('March', 'pregnancy-due-date-calculator'),
            (!empty($attributes['monthApr'])) ? $attributes['monthApr'] : __('April', 'pregnancy-due-date-calculator'),
            (!empty($attributes['monthMay'])) ? $attributes['monthMay'] : __('May', 'pregnancy-due-date-calculator'),
            (!empty($attributes['monthJun'])) ? $attributes['monthJun'] : __('June', 'pregnancy-due-date-calculator'),
            (!empty($attributes['monthJul'])) ? $attributes['monthJul'] : __('July', 'pregnancy-due-date-calculator'),
            (!empty($attributes['monthAug'])) ? $attributes['monthAug'] : __('August', 'pregnancy-due-date-calculator'),
            (!empty($attributes['monthSep'])) ? $attributes['monthSep'] : __('September', 'pregnancy-due-date-calculator'),
            (!empty($attributes['monthOct'])) ? $attributes['monthOct'] : __('October', 'pregnancy-due-date-calculator'),
            (!empty($attributes['monthNov'])) ? $attributes['monthNov'] : __('November', 'pregnancy-due-date-calculator'),
            (!empty($attributes['monthDec'])) ? $attributes['monthDec'] : __('December', 'pregnancy-due-date-calculator')
        ];
        
        // Button styling attributes
        $button_margin = isset($attributes['buttonMargin']) ? $attributes['buttonMargin'] : 0;
        $button_border_radius = isset($attributes['buttonBorderRadius']) ? $attributes['buttonBorderRadius'] : 4;
        $button_shadow = isset($attributes['buttonShadow']) ? $attributes['buttonShadow'] : 'none';
        
        // Note section attributes - use translated defaults if not set
        $custom_note_text = (!empty($attributes['customNoteText'])) ? $attributes['customNoteText'] : __('These are estimates only. For personalized advice, consult your clinician.', 'pregnancy-due-date-calculator');
        
        // Validation message - use translated default if not set
        $validation_message = (!empty($attributes['validationMessage'])) ? $attributes['validationMessage'] : __('Please select a day, month, and year.', 'pregnancy-due-date-calculator');
        
        // Generate inline styles for visual customization
        $styles = [];
        if ($background_color) $styles[] = 'background-color: ' . esc_attr($background_color);
        if ($border_radius) $styles[] = 'border-radius: ' . esc_attr($border_radius) . 'px';
        if ($padding) $styles[] = 'padding: ' . esc_attr($padding) . 'px';
        if ($max_width) $styles[] = 'max-width: ' . esc_attr($max_width) . 'px';
        
        // Add alignment styling - use margin to control horizontal positioning with !important
        // Note: width is controlled by max-width, not set to 100%, to allow alignment
        if ($alignment === 'center') {
            $styles[] = 'margin-left: auto !important';
            $styles[] = 'margin-right: auto !important';
        } elseif ($alignment === 'right') {
            $styles[] = 'margin-left: auto !important';
            $styles[] = 'margin-right: 0 !important';
        } else { // left alignment
            $styles[] = 'margin-left: 0 !important';
            $styles[] = 'margin-right: auto !important';
        }
        
        $inline_styles = !empty($styles) ? 'style="' . implode('; ', $styles) . '"' : '';
        
        // Remove alignment class - we handle alignment with margin logic
        $alignment_class = '';
        
        // Generate individual element styles
        $title_styles = [];
        if ($title_color) $title_styles[] = 'color: ' . esc_attr($title_color);
        if ($title_font_family) $title_styles[] = 'font-family: ' . esc_attr($title_font_family);
        if ($title_alignment) $title_styles[] = 'text-align: ' . esc_attr($title_alignment);
        $title_style = !empty($title_styles) ? 'style="' . implode('; ', $title_styles) . '"' : '';
        
        $subtitle_styles = [];
        if ($subtitle_color) $subtitle_styles[] = 'color: ' . esc_attr($subtitle_color);
        if ($subtitle_font_family) $subtitle_styles[] = 'font-family: ' . esc_attr($subtitle_font_family);
        if ($subtitle_alignment) $subtitle_styles[] = 'text-align: ' . esc_attr($subtitle_alignment);
        $subtitle_style = !empty($subtitle_styles) ? 'style="' . implode('; ', $subtitle_styles) . '"' : '';
        
        $label_style = $label_color ? 'style="color: ' . esc_attr($label_color) . '"' : '';
        
        $button_styles = [];
        if ($button_bg_color) $button_styles[] = 'background-color: ' . esc_attr($button_bg_color);
        if ($button_text_color) $button_styles[] = 'color: ' . esc_attr($button_text_color);
        if ($button_margin) $button_styles[] = 'margin: ' . esc_attr($button_margin) . 'px 0';
        if ($button_border_radius) $button_styles[] = 'border-radius: ' . esc_attr($button_border_radius) . 'px';
        
        // Add button shadow based on selection
        if ($button_shadow === 'light') {
            $button_styles[] = 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)';
        } elseif ($button_shadow === 'medium') {
            $button_styles[] = 'box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15)';
        } elseif ($button_shadow === 'deep') {
            $button_styles[] = 'box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2)';
        }
        
        $button_style = !empty($button_styles) ? 'style="' . implode('; ', $button_styles) . '"' : '';
        
        $progress_text_style = $progress_text_color ? 'style="color: ' . esc_attr($progress_text_color) . '"' : '';
        
        // Generate text color style for fallback text elements
        $text_color_style = $text_color ? 'style="color: ' . esc_attr($text_color) . '"' : '';
        
        // Pass custom text and styling to JavaScript via data attributes
        $custom_data_attributes = [
            'data-custom-title="' . esc_attr($custom_title_text) . '"',
            'data-custom-subtitle="' . esc_attr($custom_subtitle_text) . '"',
            'data-progress-fill-color="' . esc_attr($progress_fill_color) . '"',
            'data-progress-text-color="' . esc_attr($progress_text_color) . '"',
            'data-weeks-count-color="' . esc_attr($weeks_count_color) . '"',
            'data-label-day="' . esc_attr($label_day) . '"',
            'data-label-month="' . esc_attr($label_month) . '"',
            'data-label-year="' . esc_attr($label_year) . '"',
            'data-placeholder-day="' . esc_attr($placeholder_day) . '"',
            'data-placeholder-month="' . esc_attr($placeholder_month) . '"',
            'data-placeholder-year="' . esc_attr($placeholder_year) . '"',
            'data-month-names="' . esc_attr(json_encode($month_names)) . '"',
            'data-custom-note="' . esc_attr($custom_note_text) . '"',
            'data-note-bg-color="' . esc_attr($note_bg_color) . '"',
            'data-note-text-color="' . esc_attr($note_text_color) . '"',
            'data-dropdown-style="' . esc_attr($dropdown_style) . '"',
            'data-dropdown-bg-color="' . esc_attr($dropdown_bg_color) . '"',
            'data-validation-message="' . esc_attr($validation_message) . '"'
        ];
        
        // Generate data attributes for JavaScript configuration
        // These attributes tell the frontend script how to behave
        $data_attributes = array_merge([
            'data-show-progress-bar="' . ($show_progress_bar ? 'true' : 'false') . '"',
            'data-show-note="' . ($show_note ? 'true' : 'false') . '"',
            'data-show-weeks-count="' . ($show_weeks_count ? 'true' : 'false') . '"',
            'data-alignment="' . esc_attr($alignment) . '"'
        ], $custom_data_attributes);
        
        // Generate calculator HTML
        ob_start(); ?>
        <div class="pregnancy-calculator<?php echo $alignment_class; ?>" <?php echo $inline_styles; ?> <?php echo implode(' ', $data_attributes); ?>>
            <header>
                <h2 id="title" <?php echo $title_style; ?>><?php echo esc_html($custom_title_text); ?></h2>
                <p id="subtitle" <?php echo $subtitle_style; ?>><?php echo esc_html($custom_subtitle_text); ?></p>
            </header>

            <form id="pregnancy-form" novalidate>
                <div class="form-grid">
                    <label <?php echo $label_style; ?>><span id="label-day"><?php echo esc_html($label_day); ?></span>
                        <select id="lmp-day"></select>
                    </label>
                    <label <?php echo $label_style; ?>><span id="label-month"><?php echo esc_html($label_month); ?></span>
                        <select id="lmp-month"></select>
                    </label>
                    <label <?php echo $label_style; ?>><span id="label-year"><?php echo esc_html($label_year); ?></span>
                        <select id="lmp-year"></select>
                    </label>
                </div>
                <button type="submit" id="btn-calc" <?php echo $button_style; ?>>
                    <?php echo esc_html($attributes['customCalculateButtonText'] ?? __('Calculate Due Date', 'pregnancy-due-date-calculator')); ?>
                </button>
            </form>

            <div id="pregnancy-results" class="results"></div>
            
            <!-- Dynamic sections controlled by JavaScript based on data attributes -->
            <div id="pregnancy-progress" class="progress-section" style="display: none;">
                <div class="progress-bar">
                    <div class="progress-fill" style="<?php echo $progress_fill_color ? 'background-color: ' . esc_attr($progress_fill_color) : ''; ?>"></div>
                </div>
                <p class="progress-text" <?php echo $progress_text_style; ?>></p>
            </div>
            
            <div id="pregnancy-note" class="note-section" style="display: none;">
                <p class="note-text" <?php echo $text_color_style; ?>></p>
            </div>
        </div>
        
        <?php if ($button_hover_bg_color): ?>
        <style>
            #btn-calc:hover {
                background-color: <?php echo esc_attr($button_hover_bg_color); ?> !important;
            }
        </style>
        <?php endif; ?>
        
        <?php
        return ob_get_clean();
            
        } catch (Exception $e) {
            $this->log_error('Block rendering failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return '<p>' . esc_html__('Calculator failed to load. Please try again later.', 'pregnancy-due-date-calculator') . '</p>';
        }
    }

    /**
     * Shortcode render function for backward compatibility
     * Supports all the same attributes as the Gutenberg block
     * Usage: [pregnancy_due_date_calculator showLanguageToggle="false" backgroundColor="#f0f0f0"]
     * 
     * @param array $atts Shortcode attributes
     * @return string Generated HTML for the calculator
     */
    function render_shortcode($atts = []) {
        // Enqueue frontend assets since shortcode is being rendered
        wp_enqueue_style('pregnancy-ddc-style');
        wp_enqueue_script('pregnancy-ddc-script');
        
        // Parse shortcode attributes with defaults matching block attributes
        $attributes = shortcode_atts([
            'backgroundColor' => '',
            'textColor' => '',
            'borderRadius' => 0,
            'padding' => 20,
            'maxWidth' => 600,
            'alignment' => 'center',
            'showProgressBar' => true,
            'showNote' => true,
            'showWeeksCount' => true,
            // Title section
            'customTitleText' => '',
            'titleAlignment' => 'center',
            'titleColor' => '',
            'titleFontFamily' => 'System UI',
            // Subtitle section
            'customSubtitleText' => '',
            'subtitleAlignment' => 'center',
            'subtitleColor' => '',
            'subtitleFontFamily' => 'System UI',
            // Controls styling
            'labelColor' => '',
            'buttonBgColor' => '',
            'buttonTextColor' => '',
            'progressFillColor' => '',
            'progressTextColor' => ''
        ], $atts);
        
        // Convert string booleans to actual booleans for proper processing
        $attributes['showProgressBar'] = filter_var($attributes['showProgressBar'], FILTER_VALIDATE_BOOLEAN);
        $attributes['showNote'] = filter_var($attributes['showNote'], FILTER_VALIDATE_BOOLEAN);
        $attributes['showWeeksCount'] = filter_var($attributes['showWeeksCount'], FILTER_VALIDATE_BOOLEAN);
        
        // Reuse the block render function to ensure consistency
        return $this->render_block($attributes);
    }
    
    /**
     * Sanitize hex color value
     * Ensures color is valid hex format with or without # prefix
     * 
     * @since 2.1.0
     * @param string $color Hex color value (e.g., "#FF0000" or "FF0000")
     * @return string Sanitized hex color with # prefix, or empty string if invalid
     * 
     * @example
     * $safe_color = $this->sanitize_hex_color('#FF0000'); // Returns: #FF0000
     * $safe_color = $this->sanitize_hex_color('FF0000');  // Returns: #FF0000
     * $safe_color = $this->sanitize_hex_color('red');     // Returns: (empty)
     */
    private function sanitize_hex_color($color) {
        if (empty($color)) {
            return '';
        }
        
        // Remove # if present
        $color = ltrim($color, '#');
        
        // Validate hex color (3 or 6 characters)
        if (preg_match('/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $color)) {
            return '#' . $color;
        }
        
        return '';
    }
    
    /**
     * Log error message to WordPress debug log
     * DISABLED FOR PRODUCTION - Logging removed for performance
     * 
     * @since 2.1.0
     * @param string $message Error message
     * @param array $context Additional context data
     */
    private function log_error($message, $context = []) {
        // Logging disabled for production release
        // To enable for debugging, uncomment the code below:
        /*
        if (defined('WP_DEBUG') && WP_DEBUG && defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
            $log_message = sprintf(
                '[Pregnancy Calculator v%s] %s',
                $this->version,
                $message
            );
            
            if (!empty($context)) {
                $log_message .= ' | Context: ' . wp_json_encode($context);
            }
            
            error_log($log_message);
        }
        */
    }
    
    /**
     * Log info message
     * DISABLED FOR PRODUCTION - Logging removed for performance
     * 
     * @since 2.1.0
     * @param string $message Info message
     * @param array $context Additional context
     */
    private function log_info($message, $context = []) {
        // Logging disabled for production release
    }
    
    /**
     * Log warning message
     * DISABLED FOR PRODUCTION - Logging removed for performance
     * 
     * @since 2.1.0
     * @param string $message Warning message
     * @param array $context Additional context
     */
    private function log_warning($message, $context = []) {
        // Logging disabled for production release
    }
    
    /**
     * Clear cached translation data
     * Called when plugin is updated or translations change
     * 
     * @since 2.1.0
     */
    public function clear_translation_cache() {
        global $wpdb;
        
        // Delete all pregnancy calculator transients
        $wpdb->query(
            "DELETE FROM $wpdb->options 
            WHERE option_name LIKE '_transient_pregnancy_calc_i18n_%' 
            OR option_name LIKE '_transient_timeout_pregnancy_calc_i18n_%'"
        );
        
        $this->log_info('Translation cache cleared');
    }
    
    /**
     * Get translation data with caching
     * Caches translation strings to improve performance
     * 
     * @since 2.1.0
     * @return array Translation data for current locale
     */
    private function get_translation_data() {
        $locale = determine_locale();
        $cache_key = 'pregnancy_calc_i18n_' . $locale . '_' . $this->version;
        
        // Try to get cached data
        $cached = get_transient($cache_key);
        if ($cached !== false && is_array($cached)) {
            $this->log_info('Using cached translation data', ['locale' => $locale]);
            return $cached;
        }
        
        // Build translation array
        $data = [
            'locale' => $locale,
            // Button and labels
            'calculateButton' => __('Calculate Due Date', 'pregnancy-due-date-calculator'),
            'title' => __('Pregnancy Due Date Calculator', 'pregnancy-due-date-calculator'),
            'subtitle' => __('Enter the first day of your last menstrual period', 'pregnancy-due-date-calculator'),
            'day' => __('Day', 'pregnancy-due-date-calculator'),
            'month' => __('Month', 'pregnancy-due-date-calculator'),
            'year' => __('Year', 'pregnancy-due-date-calculator'),
            // Placeholders
            'placeholderDay' => __('Select Day', 'pregnancy-due-date-calculator'),
            'placeholderMonth' => __('Select Month', 'pregnancy-due-date-calculator'),
            'placeholderYear' => __('Select Year', 'pregnancy-due-date-calculator'),
            // Month names
            'january' => __('January', 'pregnancy-due-date-calculator'),
            'february' => __('February', 'pregnancy-due-date-calculator'),
            'march' => __('March', 'pregnancy-due-date-calculator'),
            'april' => __('April', 'pregnancy-due-date-calculator'),
            'may' => __('May', 'pregnancy-due-date-calculator'),
            'june' => __('June', 'pregnancy-due-date-calculator'),
            'july' => __('July', 'pregnancy-due-date-calculator'),
            'august' => __('August', 'pregnancy-due-date-calculator'),
            'september' => __('September', 'pregnancy-due-date-calculator'),
            'october' => __('October', 'pregnancy-due-date-calculator'),
            'november' => __('November', 'pregnancy-due-date-calculator'),
            'december' => __('December', 'pregnancy-due-date-calculator'),
            // Results
            'dueDate' => __('Your Estimated Due Date:', 'pregnancy-due-date-calculator'),
            'due' => __('Estimated Due Date', 'pregnancy-due-date-calculator'),
            'stages' => __('Important Stages', 'pregnancy-due-date-calculator'),
            'lastCycle' => __('Last Menstrual Period:', 'pregnancy-due-date-calculator'),
            'conception' => __('Conception Date:', 'pregnancy-due-date-calculator'),
            't1' => __('First Trimester Begins:', 'pregnancy-due-date-calculator'),
            't2' => __('Second Trimester Begins:', 'pregnancy-due-date-calculator'),
            't3' => __('Third Trimester Begins:', 'pregnancy-due-date-calculator'),
            // Progress
            'weeksPregnant' => __('Weeks Pregnant:', 'pregnancy-due-date-calculator'),
            'progress' => __('Pregnancy Progress', 'pregnancy-due-date-calculator'),
            'left' => __('Time remaining:', 'pregnancy-due-date-calculator'),
            'months' => __('months', 'pregnancy-due-date-calculator'),
            'days' => __('days', 'pregnancy-due-date-calculator'),
            'week' => __('week', 'pregnancy-due-date-calculator'),
            'weeks' => __('weeks', 'pregnancy-due-date-calculator'),
            // Validation
            'invalidDate' => __('Invalid date selected', 'pregnancy-due-date-calculator'),
            'validationMessage' => __('Please select a day, month, and year.', 'pregnancy-due-date-calculator'),
            'customNote' => __('These are estimates only. For personalized advice, consult your clinician.', 'pregnancy-due-date-calculator')
        ];
        
        // Cache for 1 day
        set_transient($cache_key, $data, DAY_IN_SECONDS);
        
        $this->log_info('Translation data cached', ['locale' => $locale]);
        
        return $data;
    }
}

/**
 * Initialize the plugin
 * 
 * @since 1.0.0
 */
new PregnancyDueDateCalculator();

/**
 * Plugin activation hook
 * Runs when plugin is activated
 * 
 * @since 2.1.0
 */
function pregnancy_calculator_activate() {
    // Check PHP version
    if (version_compare(PHP_VERSION, PREGNANCY_CALC_MIN_PHP, '<')) {
        deactivate_plugins(plugin_basename(__FILE__));
        wp_die(
            sprintf(
                esc_html__('Pregnancy Due Date Calculator requires PHP %s or higher. You are running PHP %s.', 'pregnancy-due-date-calculator'),
                PREGNANCY_CALC_MIN_PHP,
                PHP_VERSION
            )
        );
    }
    
    // Check WordPress version
    global $wp_version;
    if (version_compare($wp_version, PREGNANCY_CALC_MIN_WP, '<')) {
        deactivate_plugins(plugin_basename(__FILE__));
        wp_die(
            sprintf(
                esc_html__('Pregnancy Due Date Calculator requires WordPress %s or higher. You are running WordPress %s.', 'pregnancy-due-date-calculator'),
                PREGNANCY_CALC_MIN_WP,
                $wp_version
            )
        );
    }
    
    // Create a temporary instance to clear cache
    $plugin = new PregnancyDueDateCalculator();
    $plugin->clear_translation_cache();
    
    // Flush rewrite rules
    flush_rewrite_rules();
    
    // Save plugin version and activation time
    update_option('pregnancy_calculator_version', PREGNANCY_CALC_VERSION);
    update_option('pregnancy_calculator_activated', time());
}
register_activation_hook(__FILE__, 'pregnancy_calculator_activate');

/**
 * Plugin deactivation hook
 * Runs when plugin is deactivated
 * 
 * @since 2.1.0
 */
function pregnancy_calculator_deactivate() {
    // Create a temporary instance to clear cache
    $plugin = new PregnancyDueDateCalculator();
    $plugin->clear_translation_cache();
    
    // Flush rewrite rules
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'pregnancy_calculator_deactivate');
