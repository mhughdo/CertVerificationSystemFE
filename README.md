# Certificate Verification System

## Run Locally

Clone the project

```bash
  git clone git@github.com:mhughdo/CertVerificationSystemFE.git
```

Go to the project directory

```bash
  cd CertVerificationSystemFE
```

Install dependencies

```bash
  npm install or yarn install
```

Copy contracts to /src/contracts folder

Start the server

```bash
  npm run dev or yarn dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file

`INFURA_PROJECT_ID (optional if you run project locally)`

`S3_BUCKET`

`NEXT_PUBLIC_S3_BUCKET`

`accessKeyId`

`AWSSecretKey`

`MAIL_GUN_API_KEY`

`MAIL_GUN_DOMAIN`

## Tech Stack

This project is built using Esbuild. I'm too lazy to optimize my code so i use it to make project build process much
faster

**Client:** Nextjs, ChakraUI, AWS S3, TailwindCSS, TypeScript

**Server:** Solidity

## Demo

https://uet-cert-verification.netlify.app/

## Screenshots

![App Screenshot](https://user-images.githubusercontent.com/15611134/115985552-949f8a00-a5d6-11eb-9918-653f77f915fa.png)

## Authors and Acknowledgement

- [@mhughdo](https://www.github.com/mughdo) for everything.
