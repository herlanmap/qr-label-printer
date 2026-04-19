const { app, BrowserWindow, shell, ipcMain } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

let win

function createWindow() {
  win = new BrowserWindow({
    width: 480,
    height: 680,
    minWidth: 400,
    minHeight: 500,
    title: 'QR Label Printer — SVLK',
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
    backgroundColor: '#020617',
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

// Return list of installed printers
ipcMain.handle('get-printers', async () => {
  if (!win) return []
  try {
    return await win.webContents.getPrintersAsync()
  } catch {
    return []
  }
})

// Print the main window with selected settings
ipcMain.handle('do-print', (event, { deviceName, copies, silent, pageSize }) => {
  if (!win) return
  return new Promise((resolve) => {
    win.webContents.print(
      {
        deviceName,
        copies: copies || 1,
        silent: silent || false,
        printBackground: true,
        color: false,
        ...(pageSize ? { pageSize } : {}),
      },
      (success, errorType) => resolve({ success, errorType })
    )
  })
})

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
