import {
  app,
  BrowserWindow, globalShortcut, ipcMain,
  Menu, MenuItemConstructorOptions, protocol, Tray
} from 'electron';
import { readFile, watch } from 'fs';
import { normalize, resolve } from 'path';
import { getAbsolutePath } from "./Components/getAbsolutePath";
import { ROOT_PATH } from './env';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindowIfNotExists = () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}

let mainWindow: BrowserWindow = null;
const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      plugins: true,
      enableRemoteModule: true,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.on("blur", () => {
    // mainWindow.hide();
  });
  // mainWindow.setPosition()
};


let tray: Tray = null;

const focusWindow = () => {
  if (!mainWindow.isDestroyed()) {
    if (mainWindow.isFocused()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  } else {
    createWindowIfNotExists()
  }
  const bounds = tray.getBounds();
  mainWindow.setPosition(bounds.x - 400, bounds.y)
  // mainWindow.webContents.openDevTools()
}
app.whenReady().then(() => {

  tray = new Tray(resolve(__dirname, 'assets/icon_2.png'));
  tray.on('click', focusWindow)
  tray.setPressedImage(resolve(__dirname, 'assets/icon_pressed.png'))
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    const callback = () => {
      mainWindow.webContents.send("globalSearch");
    }
    if (mainWindow.isDestroyed()) {
      mainWindow.webContents.once("did-finish-load", callback);
    } else {
      mainWindow.once("focus", callback);
    }
    focusWindow();
  })


  protocol.registerFileProtocol('cabinet', (request, callback) => {
    const url = request.url.substr('cabinet://'.length);
    const req = `${ROOT_PATH}${url}`;
    callback(normalize(req));
  })
})
app.dock.setIcon(resolve(__dirname, 'assets/dock_icon.png'));

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  var inputPath = getAbsolutePath('input.txt');
  const cb = () => {
    readFile(inputPath, (err, data) => {
      const stringData = data.toString();
      const count = stringData.split("\n").length;
      if (stringData.length > 2) {
        app.dock.setBadge("" + count);
      } else {
        app.dock.setBadge("");
      }
    })
  };
  watch(inputPath, (e: "rename" | "change", filename: string) => cb());
  cb();
  createWindow();
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  createWindowIfNotExists()
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


ipcMain.on('show-context-menu', (event, args: { label: string, type: string }[]) => {
  const template: MenuItemConstructorOptions[] = [
    { role: 'copy' },
    { role: 'selectAll' },
    ...args.map(({ label, type }) => ({
      label,
      click: () => {
        event.sender.send("context-menu-click", type);
      }
    })),
    { role: 'toggleDevTools' }
  ];

  const menu = Menu.buildFromTemplate(template)
  menu.popup()
  menu.on("menu-will-close", () => event.sender.send("menu-closed"));
})

ipcMain.on("hide", (event, arg) => {
  mainWindow.hide();
})

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('CommandOrControl+X')

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})
