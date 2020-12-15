// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const remote = require('electron').remote
const { dialog, BrowserWindow, app } = remote

const button = document.getElementById('test-button');
const quitButton = document.getElementById('quit-button');

button.addEventListener('click', e=>{
  dialog.showMessageBox({
    message: 'Dialog invoked from renderrer process'
  })

  let secWin = new BrowserWindow({
    width: 400, height: 350
  })
  secWin.loadFile('index.html')
  console.log(remote.getGlobal('myglob'))
})

quitButton.addEventListener('click', e => {
  app.quit();
})





