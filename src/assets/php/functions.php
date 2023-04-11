<?php
function encrypt_data($plaintext, $one_key) {
  $salt = openssl_random_pseudo_bytes(32);
  $key = hash_pbkdf2('sha256', $one_key, $salt, 10000, 32);
  $iv = openssl_random_pseudo_bytes(32);
  $ciphertext = openssl_encrypt($plaintext, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);
  $encrypted_data = base64_encode($ciphertext . '::' . $salt . '::' . $iv . '::' . $tag);
  return $encrypted_data;
}
function decrypt_data($encrypted_data, $one_key) {
  $decoded_data = base64_decode($encrypted_data);
  list($ciphertext, $salt, $iv, $tag) = explode('::', $decoded_data);
  $key = hash_pbkdf2('sha256', $one_key, $salt, 10000, 32);
  $plaintext = openssl_decrypt($ciphertext, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);
  return $plaintext;
}
