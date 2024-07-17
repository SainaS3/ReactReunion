# Getting Started

## Step 1: Install Dependencies Using Node.js Script

To streamline the installation of dependencies, run the provided Node.js script. From the root of your project, execute the following command:

```bash
node setupReactNative.js
```

## Step 2: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
npm start
```

## Step 3: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your application:

### For macOS (Catalyst)

> **Note**: Make sure you have the iOS SDK installed since this project targets macOS Catalyst.

```bash
npx react-native run-ios --device "My Mac"
```

### For Windows

> **Note**: This project uses UWP (Universal Windows Platform). Make sure you have your Windows development environment set up accordingly.

```bash
npx react-native run-windows
```

If everything is set up _correctly_, you should see your new app running in your macOS Catalyst or Windows environment shortly, provided you have set up your system correctly.

This is one way to run your app — you can also run it directly from within Xcode and Visual Studio respectively.

## Step 4: Modifying your App

Now that you have successfully run the app, let's modify it.

### Using VS Code

1. Open your application's folder in VS Code.
2. Install the React Native Tools plugin for VS Code.
3. Open `App.tsx` in your text editor of choice and edit some lines.
4. Create a new file in the application's root directory, `.vscode/launch.json`, and paste the following configuration:

    ```json
    {
      "version": "0.2.0",
      "configurations": [
        {
          "name": "Debug macOS",
          "cwd": "${workspaceFolder}",
          "type": "reactnative",
          "request": "launch",
          "platform": "ios",
          "target": "My Mac"
        },
        {
          "name": "Debug Windows",
          "cwd": "${workspaceFolder}",
          "type": "reactnative",
          "request": "launch",
          "platform": "windows"
        }
      ]
    }
    ```

5. Press F5 or navigate to the debug menu (alternatively press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd>) and in the Debug drop-down select "Debug macOS" or "Debug Windows" and press the green arrow to run the application.

### Reloading to See Your Changes

For **macOS (Catalyst)**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your macOS application to reload the app and see your changes!

For **Windows**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Windows and Linux)) to see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:
