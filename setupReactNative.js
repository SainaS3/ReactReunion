const execSh = require('exec-sh');
const os = require('os');
const WinReg = require('winreg');
const fs = require('fs-extra');

// Utility to run a command and get output
const runCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    execSh(cmd, true, (err, stdout, stderr) => {
      if (err) {
        reject(stderr);
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

// Check Node.js version
const checkNodeVersion = async () => {
  try {
    const nodeVersion = await runCommand('node --version');
    console.log(`Node.js version: ${nodeVersion}`);
    const [major, minor] = nodeVersion.replace('v', '').split('.');
    return parseInt(major) >= 18;
  } catch (error) {
    console.error('Node.js is not installed');
    return false;
  }
};

// Check if on Windows
const isWindows = os.platform() === 'win32';

// Windows specific functions
const checkInstalledMemoryWindows = () => {
  const totalMemory = os.totalmem();
  console.log(`Total Memory: ${(totalMemory / (1024 ** 3)).toFixed(2)} GB`);
  return totalMemory >= 16 * 1024 ** 3;
};

const checkFreeSpaceWindows = async () => {
  try {
    const { free } = await fs.statvfsSync('/');
    const freeSpaceGB = free / (1024 ** 3);
    console.log(`Free space: ${freeSpaceGB.toFixed(2)} GB`);
    return freeSpaceGB > 15;
  } catch (error) {
    console.error('Failed to check free space:', error);
    return false;
  }
};

const checkGitWindows = async () => {
  try {
    const gitVersion = await runCommand('git --version');
    console.log(`Git version: ${gitVersion}`);
    return true;
  } catch (error) {
    console.error('Git is not installed');
    return false;
  }
};

const checkYarnWindows = async () => {
  try {
    const yarnVersion = await runCommand('yarn --version');
    console.log(`Yarn version: ${yarnVersion}`);
    return true;
  } catch (error) {
    console.error('Yarn is not installed');
    return false;
  }
};

const enableDeveloperModeWindows = async () => {
  const key = new WinReg({
    hive: WinReg.HKLM,
    key: '\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AppModelUnlock'
  });

  return new Promise((resolve, reject) => {
    key.set('AllowDevelopmentWithoutDevLicense', WinReg.REG_DWORD, 1, (err) => {
      if (err) {
        console.error('Failed to enable developer mode:', err);
        reject(err);
      } else {
        console.log('Developer mode enabled');
        resolve(true);
      }
    });
  });
};

const checkVisualStudioWindows = async () => {
  try {
    const vsWhere = `${process.env['ProgramFiles(x86)']}\\Microsoft Visual Studio\\Installer\\vswhere.exe`;
    if (await fs.pathExists(vsWhere)) {
      const vsPath = await runCommand(`${vsWhere} -latest -property installationPath`);
      console.log(`Visual Studio installed at: ${vsPath}`);
      return true;
    } else {
      console.error('Visual Studio not found');
      return false;
    }
  } catch (error) {
    console.error('Failed to check Visual Studio installation:', error);
    return false;
  }
};

// macOS specific functions
const installHomebrewMac = async () => {
  try {
    await runCommand('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"');
    console.log('Homebrew installed successfully');
  } catch (error) {
    console.error('Failed to install Homebrew:', error);
  }
};

const installNodeMac = async () => {
  try {
    await runCommand('brew install node');
    console.log('Node.js installed successfully');
  } catch (error) {
    console.error('Failed to install Node.js:', error);
  }
};

const installWatchmanMac = async () => {
  try {
    await runCommand('brew install watchman');
    console.log('Watchman installed successfully');
  } catch (error) {
    console.error('Failed to install Watchman:', error);
  }
};

const checkXcodeMac = async () => {
  try {
    const xcodeVersion = await runCommand('xcode-select -p');
    console.log(`Xcode is installed at: ${xcodeVersion}`);
    return true;
  } catch (error) {
    console.error('Xcode is not installed');
    return false;
  }
};

const installCocoaPodsMac = async () => {
  try {
    await runCommand('sudo gem install cocoapods');
    console.log('CocoaPods installed successfully');
  } catch (error) {
    console.error('Failed to install CocoaPods:', error);
  }
};

// Main function to setup React Native environment
const setupReactNativeEnvironment = async () => {
  console.log('Checking Node.js version...');
  const isNodeInstalled = await checkNodeVersion();
  if (!isNodeInstalled) {
    if (isWindows) {
      console.log('Node.js version is outdated or not installed. Please update Node.js manually.');
    } else {
      console.log('Installing Node.js...');
      await installNodeMac();
    }
  }

  if (isWindows) {
    console.log('Installing Watchman on Windows...');
    await installWatchmanMac();

    console.log('Checking installed memory...');
    const memoryCheck = checkInstalledMemoryWindows();
    console.log(`Installed memory check ${memoryCheck ? 'passed' : 'failed'}`);

    console.log('Checking free space...');
    const freeSpaceCheck = await checkFreeSpaceWindows();
    console.log(`Free space check ${freeSpaceCheck ? 'passed' : 'failed'}`);

    console.log('Checking Git installation...');
    const gitCheck = await checkGitWindows();
    console.log(`Git check ${gitCheck ? 'passed' : 'failed'}`);

    console.log('Checking Yarn installation...');
    const yarnCheck = await checkYarnWindows();
    console.log(`Yarn check ${yarnCheck ? 'passed' : 'failed'}`);

    console.log('Enabling developer mode...');
    const devModeCheck = await enableDeveloperModeWindows();
    console.log(`Developer mode ${devModeCheck ? 'enabled' : 'not enabled'}`);

    console.log('Checking Visual Studio installation...');
    const vsCheck = await checkVisualStudioWindows();
    console.log(`Visual Studio check ${vsCheck ? 'passed' : 'failed'}`);
  } else {
    console.log('Installing Homebrew...');
    await installHomebrewMac();

    console.log('Installing Watchman...');
    await installWatchmanMac();

    console.log('Checking Xcode installation...');
    const xcodeCheck = await checkXcodeMac();
    if (!xcodeCheck) {
      console.log('Please install Xcode from the Mac App Store and run this script again.');
      return;
    }

    console.log('Installing CocoaPods...');
    await installCocoaPodsMac();
  }

  console.log('React Native environment setup complete.');
};

// Run the setup
setupReactNativeEnvironment().catch((error) => {
  console.error('Error during setup:', error);
});
