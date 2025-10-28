<?php
/**
 * Uninstall script for Pregnancy Due Date Calculator
 * 
 * Runs when plugin is deleted via WordPress admin
 * Cleans up all plugin data from database
 * 
 * @package PregnancyDueDateCalculator
 * @since 2.1.0
 */

// Exit if uninstall not called from WordPress
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

/**
 * Delete plugin options from database
 */
function pregnancy_calculator_uninstall() {
    // Delete plugin version option
    delete_option('pregnancy_calculator_version');
    delete_option('pregnancy_calculator_activated');
    
    // Delete all transient caches
    global $wpdb;
    $wpdb->query(
        "DELETE FROM $wpdb->options 
        WHERE option_name LIKE '_transient_pregnancy_calc_i18n_%' 
        OR option_name LIKE '_transient_timeout_pregnancy_calc_i18n_%'"
    );
    
    // For multisite installations
    if (is_multisite()) {
        // Get all blogs
        $blog_ids = $wpdb->get_col("SELECT blog_id FROM $wpdb->blogs");
        
        foreach ($blog_ids as $blog_id) {
            switch_to_blog($blog_id);
            
            // Delete options for this blog
            delete_option('pregnancy_calculator_version');
            delete_option('pregnancy_calculator_activated');
            
            // Delete transients for this blog
            $wpdb->query(
                "DELETE FROM $wpdb->options 
                WHERE option_name LIKE '_transient_pregnancy_calc_i18n_%' 
                OR option_name LIKE '_transient_timeout_pregnancy_calc_i18n_%'"
            );
            
            restore_current_blog();
        }
        
        // Delete network-wide options if any
        delete_site_option('pregnancy_calculator_network_version');
    }
    
    // Clear any scheduled cron jobs (if we add any in the future)
    wp_clear_scheduled_hook('pregnancy_calculator_daily_cleanup');
}

// Run uninstall function
pregnancy_calculator_uninstall();
