<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "landing-fnb".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'landing-fnb'),

    'flavors' => array (
  'landing-fnb' => 
  array (
    'label' => 'KOPI SENJA — F&B',
    'brand_name' => 'KOPI SENJA',
    'brand_tagline' => 'Kafe & tempat bersantai',
    'brand_initials' => 'KS',
    'accent' => '#a16207',
    'category' => 'kuliner',
    'home' => 'landings.fnb',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Menu',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Landing',
              'to' => '/landings/fnb',
              'icon' => 'Home',
            ),
            1 => 
            array (
              'label' => 'Dashboard',
              'to' => '/dashboard',
              'icon' => 'LayoutDashboard',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
          ),
        ),
      ),
    ),
  ),
),
];
