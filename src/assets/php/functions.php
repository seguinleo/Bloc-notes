<?php
$key = `YOUR_KEY`;
function encrypt_data($plaintext, $key) {
    $key = base64_decode($key);
    $ivlen = openssl_cipher_iv_length($cipher="AES-256-GCM");
    $iv = openssl_random_pseudo_bytes($ivlen);
    $ciphertext = openssl_encrypt($plaintext, $cipher, $key, 0, $iv, $tag);
    return base64_encode($ciphertext . '::' . $iv . '::' . $tag);
}
function decrypt_data($ciphertext, $key) {
    $key = base64_decode($key);
    list($ciphertext, $iv, $tag) = array_pad(explode('::', base64_decode($ciphertext), 3),3,null);
    $plaintext = openssl_decrypt($ciphertext, 'AES-256-GCM', $key, 0, $iv, $tag);
    return $plaintext;
}