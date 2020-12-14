// Modules
const {app, BrowserWindow, webContents, session} = require('electron');
const colors = require('colors');
const bcrypt = require('bcrypt');
const windowStateKeeper = require('electron-window-state');

console.log('Checking ready: '+ app.isReady());
setTimeout(() => {
  console.log('Checking ready: '+ app.isReady());
}, 3000);

bcrypt.hash('myPlaintextPassword', 10, function(err, hash) {
  console.log("my pass hash is: ", colors.rainbow(hash));
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, secondaryWindow, thirdWindow

// Create a new BrowserWindow when `app` is ready 
function createWindow () {
  let winState = windowStateKeeper({
    defaultHeight: 800, defaultWidth: 1000
  })

  let defaultSes = session.defaultSession;
  // let customSes = session.fromPartition('persist:part1')

  mainWindow = new BrowserWindow({
    width: winState.width, height: winState.height,
    x: winState.x, y:winState.y,
    minWidth: 500, minHeight: 300,
    webPreferences: { nodeIntegration: true },
    // frame: false,
    show: false
  })

  secondaryWindow = new BrowserWindow({
    width: 340, height: 300,
    x:600, y:100,
    webPreferences: { nodeIntegration: true },
    // parent: mainWindow,
    // modal: true,
    show: false
  })

  thirdWindow = new BrowserWindow({
    width: 700, height: 500,
    x:750, y:250,
    webPreferences: { 
      nodeIntegration: true, 
      partition: 'persist:part1'
    },
  })

  let ses = mainWindow.webContents.session;
  let ses3 = thirdWindow.webContents.session;
  
  // console.log('main window session: ', ses)
  console.log('compare ses1 ses3: ', Object.is(ses, ses3))
  console.log('compare ses1 default ses: ', Object.is(ses, defaultSes))
  // console.log('compare custom and default ses: ', Object.is(customSes, defaultSes))

  ses.clearStorageData();

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html') 
  thirdWindow.loadFile('third.html') 
  // secondaryWindow.loadFile('secondary.html')
  secondaryWindow.loadURL('https://httpbin.org/basic-auth/user/passwd')
  // mainWindow.loadURL('https://google.com')

  winState.manage(mainWindow)

  let wc = mainWindow.webContents
  let swc = secondaryWindow.webContents
  let twc = thirdWindow.webContents

  swc.on('login', (e, req, authInfo, cb) => {
    console.log('Loggin in...')
    cb('user', 'passwd')
  })

  swc.on('did-navigate', (e, url, statusCode, msg) => {
    console.log(`navigated to url: ${url}, with status code: ${statusCode}`)
    console.log("message: ", msg)
  })

  // console.log("AllWebContents: ", webContents.getAllWebContents())
  wc.on('before-input-event', (e, input) => {
    console.log(`${input.key}: ${input.type}`)
  })

  wc.on('new-window', (e, url) => {
    console.log(`creating new window for ${url}`)
  })

  wc.on('did-finish-load', () => {
    console.log('content fully loaded')
  })
  wc.on('dom-ready', () => {
    console.log('DOM ready')
  })

  twc.on('context-menu', (e, params) => {
    console.log(`context menu opened on; ${params.mediaTye} ay x:${params.x} y:${params.y}`);
  })

  twc.on('context-menu', (e, params) => {
    console.log(`user selected text: ${params.selectionText}`);
    console.log(`selection can be copied: ${params.editFlags.canCopy}`);
  })

  twc.on('media-started-playing', () => {
    console.log('video started');
  })
  twc.on('media-paused', () => {
    console.log('video paused');
  })

  mainWindow.on('focus', () => {
    console.log('Main window focus')
  })

  secondaryWindow.on('focus', () => {
    console.log('Secondary window focus')
  })


  // console.log("AllWindows: ",BrowserWindow.getAllWindows())

  // setTimeout(() => {
  //   secondaryWindow.show();
  //   setTimeout(() => {
  //     secondaryWindow.close();
  //     secondaryWindow = null;
  //   }, 2000)
  // },1000)

  mainWindow.once('ready-to-show', mainWindow.show)
  secondaryWindow.once('ready-to-show', secondaryWindow.show)

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })

  secondaryWindow.on('closed',  () => {
    mainWindow.maximize();
    secondaryWindow = null
  })

  thirdWindow.on('closed',  () => {
    thirdWindow = null
  })
}

app.on('before-quit', (e) => {
  console.log('Preventing app from quitting!');
  e.preventDefault();
  console.log('command to save user work');
  app.quit();
});

app.on('browser-window-blur', () => {
  console.log('App is unfocused!');
});

app.on('browser-window-focus', () => {
  console.log('App is focused!');
});

// Electron `app` is ready
app.on('ready', () => {
  console.log('App is ready');

  console.log(app.getPath('desktop'));
  console.log(app.getPath('music'));
  console.log(app.getPath('temp'));
  console.log(app.getPath('userData'));

  createWindow();
})

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

