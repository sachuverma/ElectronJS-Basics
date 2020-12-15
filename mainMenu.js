module.exports = [
  { 
    label: 'Electron',
    submenu: [
      {label: 'Item 1'},
      {
        label: 'Item 2',
        submenu: [
          {label: 'Sub item 1'},
          {label: 'Sub item 2'}
        ]
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {role: 'copy'},
      {role: 'paste'}
    ]
  },
  {
    label: 'Actions',
    submenu: [
      {
        label: 'Action 1',
        enabled: false
      },
      {
        label: 'Greet',
        click: ()=>{console.log('Hello from actions menu!')},
        accelerator: 'Shift+Alt+G'
      },
      {
        label: 'DevTools',
        role: 'toggleDevTools'
      },
      {
        role: 'toggleFullScreen'
      }
    ]
  }
]