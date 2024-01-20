<?php

namespace Encryption;

use Random\RandomException;

/**
 * Class Encryption
 * @package Encryption
 */
class Encryption
{
    /**
     * @return string
     */
    protected function generateSalt(): string
    {
        return random_bytes(16);
    }

    /**
     * @param string $password
     * @param string $salt
     * @return string
     */
    protected function deriveKey(string $password, string $salt): string
    {
        return hash('sha256', $password . $salt, true);
    }

    /**
     * @return string
     * @throws RandomException
     */
    protected function generateIV(): string
    {
        return random_bytes(12);
    }

    /**
     * @param string $plaintext
     * @param string $password
     * @return string
     * @throws RandomException
     */
    public function encryptData(string $plaintext, string $password): string
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
     * @param string $ciphertext
     * @param string $password
     * @return string
     */
    public function decryptData(string $ciphertext, string $password): string
    {
        $salt = base64_decode(substr($ciphertext, 0, 24), true);
        $ciphertext = substr($ciphertext, 24);
        $one_key = $this->deriveKey($password, $salt);
        $iv = base64_decode(substr($ciphertext, 0, 16), true);
        $ciphertext = base64_decode(substr($ciphertext, 16), true);
        $tag = substr($ciphertext, strlen($ciphertext) - 16);
        $ciphertext = substr($ciphertext, 0, strlen($ciphertext) - 16);
        return openssl_decrypt(
            $ciphertext,
            'aes-256-gcm',
            $one_key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );
    }
}
