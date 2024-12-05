# Voicy.jp Audio Downloader

A small tool to download audio files from voicy.jp
What it does:

- Download all the .ts files that are parts of the whole voicy audio
- Concate them into a single file
- Convert it to MP3

## Installation

- Install Docker
- At the root of this project folder, run this command to build the container

```bash
docker build -t voicy-downloader .
```

- Run the container with:

```bash
docker run -p 3000:3000 voicy-downloader
```

- Then the app will be ready at localhost:3000

## Screenshots

![App Screenshot](https://voicy-audio-files.s3.ap-northeast-1.amazonaws.com/Screenshot+2024-12-05+at+15.21.07.png)

## Donate to author

If you find this useful for you, you can consider donating to the author:

Paypay:\
[![Paypal](https://i2.wp.com/www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif?zoom=2&w=720&ssl=1)](http://paypal.com/paypalme/dansharisan)

Bitcoin:\
bc1qldp7pr7hkwgtpa632ql8psxw63ar4sam52yvxa

Algorand:\
DXQBZMC6Q26CUGFO7HA6P6ARU35EPTQVXNUAEICI2URH6K3HRSH7MR5RG4
