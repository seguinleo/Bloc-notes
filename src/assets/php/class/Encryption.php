<?php

namespace Encryption;

/**
 * Class Encryption
 * @package Encryption
 */
class Encryption
{
    /**
     * @return string
     */
    protected function generateSalt()
    {
        return openssl_random_pseudo_bytes(16);
    }

    /**
     * @param $password
     * @param $salt
     * @return string
     */
    protected function deriveKey($password, $salt)
    {
        return hash('sha256', $password . $salt, true);
    }

    /**
     * @return string
     */
    protected function generateIV()
    {
        return random_bytes(12);
    }

    /**
     * @param $plaintext
     * @param $password
     * @return string
     */
    public function encryptData($plaintext, $password)
    {
        $salt = $this->generateSalt();
        $one_key = $this->deriveKey($password, $salt);
        $iv = $this->generateIV();
        $tag = '';
        $encrypted = openssl_encrypt(
            $plaintext,
            'aes-256-gcm',
            $one_key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag,
            '',
            16
        );
        $cipherText = base64_encode($iv) . base64_encode($encrypted . $tag);
        return base64_encode($salt) . $cipherText;
    }

    /**
     * @param $ciphertext
     * @param $password
     * @return string
     */
    public function decryptData($ciphertext, $password)
    {
        $salt = base64_decode(substr($ciphertext, 0, 24), true);
        $ciphertext = substr($ciphertext, 24);
        $one_key = $this->deriveKey($password, $salt);
        $iv = base64_decode(substr($ciphertext, 0, 16), true);
        $ciphertext = base64_decode(substr($ciphertext, 16), true);
        $tag = substr($ciphertext, strlen($ciphertext) - 16);
        $ciphertext = substr($ciphertext, 0, strlen($ciphertext) - 16);
        $plaintext = openssl_decrypt(
            $ciphertext,
            'aes-256-gcm',
            $one_key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );
        return $plaintext;
    }
}
