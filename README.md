# BMS-Monitor

An App to monitor data from BMS
This App is scafolded on top of the svelte-ts of the `electron-vite` package

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Prerequisites

- [Nodejs](https://nodejs.org/zh-tw/download/) v18

## Recommanded setups

- [pnpm](https://pnpm.io/zh-TW/) - a package manager that is much faster than npm

## Project Setup

### Environment

change file `.env.example` to `.env` and replace the setting values

```bash
# this is the email you want to send with
MAIN_VITE_EMAIL_USER
# look up how to generate a smtp password
MAIN_VITE_EMAIL_PASSWORD
# the email you want to send the notifications to
MAIN_VITE_EMAIL_TARGET
```

### Install

```bash
$ npm install
#or
$ pnpm install
```

### Development

```bash
$ npm run dev
#or
$ pnpm run dev
```

### Build

```bash
# For windows
$ pnpm run build:win

# For macOS
$ pnpm run build:mac

# For Linux
$ pnpm run build:linux
```

## Packages

### Dev Dependencies

- [electron-vite](https://evite.netlify.app/) - for building desktop app and improve development time

- [svelte](https://svelte.dev/) - an easy to learn reactive frontend compiler(framework)

- [tailwindcss & daisyui](https://daisyui.com/) - css and component framework to make UI prettier

- [@iconify/svelte & @iconify/icons-heroicons](https://heroicons.com/) - support for offline icon usage with svelte

- **Typescript**

### Dependencies

- [winston](https://www.npmjs.com/package/winston) - formatting messages and logging

- [modbus-serial & serialport](https://www.npmjs.com/package/modbus-serial) - for communicating with serialports and parsing binary [Buffers](https://nodejs.org/api/buffer.html) to numbers

- [nodemailer](https://nodemailer.com/about/) - for emailing

- [electron-store](https://www.npmjs.com/package/electron-store) - simple storage for app configurations and modbus protocols

- [layercake](https://layercake.graphics/guide) - chart library for `svelte`

## Folder Structure

`main` folder consists of logics and API registrations for native functionalities such as serialport, smtp emailer, and logger

`renderer` folder is where the UI exists. `index.html` is the entry point of page. This app works like a SPA.

`renderer/src/App.svelte` is the layout of the app
`renderer/src/routes/Router.svelte` registers components as pages

```
+-- 📜.env - runtime environment variables
+-- 📜*.[js/ts/json/yml] - configurations for different packages
+-- 📂build - some static assets to be built in the app
+-- 📂dist - the output folder of built application
+-- 📂out - folder of builds in development mode
+-- 📂logs - error and info logs
|
+-- 📂src
|   +-- 📂main - backend context
|   +-- 📂preload - bridge between native(backend) context and frontend context
|   +-- 📂renderer - the frontend context
```
