const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;

const mainMenuTemplate = [
    {},
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Customer',
                click: () => {
                    addWindow = new BrowserWindow({
                        width: 200,
                        height: 300,
                        title: 'Add Customer'
                    });

                    addWindow.loadURL(url.format({
                        pathname: path.join(__dirname, 'form-window.html'),
                        protocol: 'file:',
                        slashes: true
                    }));

                    addWindow.on('close', () => {
                        addWindow = null;
                    });
                },
            },
            {
                label: 'Clear Customers',
                click() {
                    mainWindow.webContents.send('customer:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main-window.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', () => {
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('customer:add', (e, item) => {
    mainWindow.webContents.send('customer:add', item);
    addWindow.close();
});

if (process.platform === 'darwin') {
    mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toogle DevTools',
                accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role: 'reload'
            }
        ],
    })
}