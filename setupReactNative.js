const exec = require('child_process').exec;
const os = require('os');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const execPromise = promisify(exec);
const osType = os.type();
const isWindows = osType === 'Windows_NT';

const runCommand = async (command) => {
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stderr) {
      console.error(`Error: ${stderr}`);
    }
    return stdout.trim();
  } catch (error) {
    console.error(`Error running command "${command}": ${error}`);
    throw error;
  }
};

const installHomebrewMac = async () => {
  try {
    await runCommand('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"');
    console.log('Homebrew installed successfully');
  } catch (error) {
    console.error('Failed to install Homebrew:', error);
  }
};

const installChocolateyWindows = async () => {
  try {
    const executionPolicy = await runCommand('powershell -Command "Get-ExecutionPolicy"');
    if (executionPolicy === 'Restricted') {
      await runCommand('powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force"');
    }
    await runCommand('powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(\'https://community.chocolatey.org/install.ps1\'))"');
    console.log('Chocolatey installed successfully');
  } catch (error) {
    console.error('Failed to install Chocolatey:', error);
  }
};

const checkFreeSpace = async () => {
  const freeSpaceGB = os.freemem() / (1024 ** 3);
  console.log(`Free space: ${freeSpaceGB.toFixed(2)} GB`);
  return freeSpaceGB > 15;
};

const checkInstalledMemory = async () => {
  const totalMemory = os.totalmem();
  console.log(`Total Memory: ${(totalMemory / (1024 ** 3)).toFixed(2)} GB`);
  return totalMemory >= 16 * 1024 ** 3;
};

const checkNodeVersion = async () => {
  try {
    const nodeVersion = await runCommand('node --version');
    console.log(`Node.js version: ${nodeVersion}`);
    const [major] = nodeVersion.replace('v', '').split('.');
    return parseInt(major) >= 18;
  } catch (error) {
    console.error('Node.js is not installed');
    return false;
  }
};

const installNodeWindows = async () => {
  try {
    await runCommand('choco install nodejs-lts -y');
    console.log('Node.js installed successfully');
  } catch (error) {
    console.error('Failed to install Node.js:', error);
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

const checkYarnInstallation = async () => {
  try {
    const yarnVersion = await runCommand('yarn --version');
    console.log(`Yarn version: ${yarnVersion}`);
    return true;
  } catch (error) {
    console.error('Yarn is not installed');
    return false;
  }
};

const installYarnWindows = async () => {
  try {
    await runCommand('choco install yarn -y');
    console.log('Yarn installed successfully');
  } catch (error) {
    console.error('Failed to install Yarn:', error);
  }
};

const installYarnMac = async () => {
  try {
    await runCommand('brew install yarn');
    console.log('Yarn installed successfully');
  } catch (error) {
    console.error('Failed to install Yarn:', error);
  }
};

const checkGitInstallation = async () => {
  try {
    const gitVersion = await runCommand('git --version');
    console.log(`Git version: ${gitVersion}`);
    return true;
  } catch (error) {
    console.error('Git is not installed');
    return false;
  }
};

const installGitWindows = async () => {
  try {
    await runCommand('choco install git -y');
    console.log('Git installed successfully');
  } catch (error) {
    console.error('Failed to install Git:', error);
  }
};

const installGitMac = async () => {
  try {
    await runCommand('brew install git');
    console.log('Git installed successfully');
  } catch (error) {
    console.error('Failed to install Git:', error);
  }
};

const enableDeveloperModeWindows = async () => {
  try {
    await runCommand('powershell -Command "Set-ItemProperty -Path HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AppModelUnlock -Name AllowDevelopmentWithoutDevLicense -Value 1"');
    console.log('Developer mode enabled');
  } catch (error) {
    console.error('Failed to enable developer mode:', error);
  }
};

const enableLongPathSupportWindows = async () => {
  try {
    await runCommand('powershell -Command "Set-ItemProperty -Path HKLM:\\SYSTEM\\CurrentControlSet\\Control\\FileSystem -Name LongPathsEnabled -Value 1 -Type DWord"');
    console.log('Long path support enabled');
  } catch (error) {
    console.error('Failed to enable long path support:', error);
  }
};

const checkVisualStudioInstallation = async () => {
  try {
    const vsWhere = `${process.env['ProgramFiles(x86)']}\\Microsoft Visual Studio\\Installer\\vswhere.exe`;
    if (fs.existsSync(vsWhere)) {
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

const installVisualStudioWindows = async () => {
  try {
    const vsComponents = [
      'Microsoft.Component.MSBuild',
      'Microsoft.VisualStudio.Component.VC.Tools.x86.x64',
      'Microsoft.VisualStudio.ComponentGroup.UWP.Support',
      'Microsoft.VisualStudio.ComponentGroup.NativeDesktop.Core',
      'Microsoft.VisualStudio.Component.Windows10SDK.19041',
      'Microsoft.VisualStudio.Component.Windows11SDK.22621',
      'Microsoft.VisualStudio.ComponentGroup.UWP.VC',
      'Microsoft.VisualStudio.Workload.ManagedDesktop',
      'Microsoft.VisualStudio.Workload.NativeDesktop',
      'Microsoft.VisualStudio.Workload.Universal'
    ];
    await runCommand(`choco install visualstudio2019community --params "--add ${vsComponents.join(' --add ')} --quiet --includeRecommended" -y`);
    console.log('Visual Studio installed successfully');
  } catch (error) {
    console.error('Failed to install Visual Studio:', error);
  }
};

const checkDotNetCoreInstallation = async () => {
  try {
    const dotnetVersion = await runCommand('dotnet --list-sdks');
    console.log(`.NET SDKs installed: ${dotnetVersion}`);
    return dotnetVersion.includes('6.0');
  } catch (error) {
    console.error('.NET SDK is not installed');
    return false;
  }
};

const installDotNetCoreWindows = async () => {
  try {
    await runCommand('choco install dotnetcore-sdk --version=6.0 -y');
    console.log('.NET Core SDK installed successfully');
  } catch (error) {
    console.error('Failed to install .NET Core SDK:', error);
  }
};

const checkWinAppDriverInstallation = async () => {
  const WADPath = `${process.env['ProgramFiles(x86)']}\\Windows Application Driver\\WinAppDriver.exe`;
  if (fs.existsSync(WADPath)) {
    const version = (await runCommand(`powershell -Command "(Get-Command ${WADPath}).FileVersionInfo.FileVersion"`)).trim();
    console.log(`WinAppDriver version found: ${version}`);
    return version >= "1.2.1";
  }
  return false;
};

const installWinAppDriverWindows = async () => {
  try {
    await runCommand('powershell -Command "Invoke-WebRequest -Uri https://github.com/microsoft/WinAppDriver/releases/download/v1.2.1/WindowsApplicationDriver_1.2.1.msi -OutFile $env:TEMP\\WinAppDriver.msi; Start-Process msiexec.exe -ArgumentList \'/i\', `"$env:TEMP\\WinAppDriver.msi`", \'/quiet\' -NoNewWindow -Wait"');
    console.log('WinAppDriver installed successfully');
  } catch (error) {
    console.error('Failed to install WinAppDriver:', error);
  }
};

const installCppWinRTVSIX = async () => {
  try {
    const url = "https://marketplace.visualstudio.com/_apis/public/gallery/publishers/CppWinRTTeam/vsextensions/cppwinrt101804264/2.0.210304.5/vspackage";
    const downloadPath = path.join(os.tmpdir(), 'Microsoft.Windows.CppWinRT.vsix');
    await runCommand(`powershell -Command "Invoke-WebRequest -Uri ${url} -OutFile ${downloadPath}"`);
    const vsWhere = `${process.env['ProgramFiles(x86)']}\\Microsoft Visual Studio\\Installer\\vswhere.exe`;
    const vsPath = (await runCommand(`${vsWhere} -latest -property installationPath`)).trim();
    const vsixInstaller = path.join(vsPath, 'Common7', 'IDE', 'VSIXInstaller.exe');
    await runCommand(`"${vsixInstaller}" /a /q "${downloadPath}"`);
    console.log('CppWinRT VSIX installed successfully');
  } catch (error) {
    console.error('Failed to install CppWinRT VSIX:', error);
  }
};

const checkWindowsVersion = async () => {
  const version = os.release();
  const major = parseInt(version.split('.')[0], 10);
  const minor = parseInt(version.split('.')[1], 10);
  const build = parseInt(version.split('.')[2], 10);
  const isCompatible = major >= 10 && minor >= 0 && build >= 17763;
  console.log(`Windows version: ${version}`);
  return isCompatible;
};

const setupReactNativeEnvironment = async () => {
  console.log('Checking Windows version...');
  const windowsVersionCheck = await checkWindowsVersion();
  console.log(`Windows version check ${windowsVersionCheck ? 'passed' : 'failed'}`);
  if (!windowsVersionCheck) {
    console.error('Windows version is not compatible. Please update your Windows to version 10.0.17763.0 or higher.');
    return;
  }

  if (isWindows) {
    console.log('Checking Chocolatey installation...');
    let chocoInstalled = false;
    try {
      await runCommand('choco -v');
      chocoInstalled = true;
    } catch {
      console.log('Chocolatey is not installed. Installing Chocolatey...');
      await installChocolateyWindows();
    }
    if (!chocoInstalled) {
      console.error('Chocolatey is not installed correctly.');
      return;
    }
  } else {
    console.log('Checking Homebrew installation...');
    let brewInstalled = false;
    try {
      await runCommand('brew -v');
      brewInstalled = true;
    } catch {
      console.log('Homebrew is not installed. Installing Homebrew...');
      await installHomebrewMac();
    }
    if (!brewInstalled) {
      console.error('Homebrew is not installed correctly.');
      return;
    }
  }

  console.log('Checking Node.js version...');
  let isNodeInstalled = await checkNodeVersion();
  if (!isNodeInstalled) {
    if (isWindows) {
      console.log('Node.js version is outdated or not installed. Installing Node.js...');
      await installNodeWindows();
    } else {
      console.log('Installing Node.js...');
      await installNodeMac();
    }
  }

  console.log('Checking installed memory...');
  const memoryCheck = await checkInstalledMemory();
  console.log(`Installed memory check ${memoryCheck ? 'passed' : 'failed'}`);
  if (!memoryCheck) {
    console.error('Not enough memory installed. At least 16 GB is required.');
    return;
  }

  console.log('Checking free space...');
  const freeSpaceCheck = await checkFreeSpace();
  console.log(`Free space check ${freeSpaceCheck ? 'passed' : 'failed'}`);
  if (!freeSpaceCheck) {
    console.error('Not enough free space. At least 15 GB is required.');
    return;
  }

  console.log('Checking Git installation...');
  let gitCheck = await checkGitInstallation();
  if (!gitCheck) {
    if (isWindows) {
      console.log('Installing Git...');
      await installGitWindows();
    } else {
      console.log('Installing Git...');
      await installGitMac();
    }
  }

  console.log('Checking Yarn installation...');
  let yarnCheck = await checkYarnInstallation();
  if (!yarnCheck) {
    if (isWindows) {
      console.log('Installing Yarn...');
      await installYarnWindows();
    } else {
      console.log('Installing Yarn...');
      await installYarnMac();
    }
  }

  if (isWindows) {
    console.log('Enabling developer mode...');
    await enableDeveloperModeWindows();

    console.log('Enabling long path support...');
    await enableLongPathSupportWindows();

    console.log('Checking Visual Studio installation...');
    const vsCheck = await checkVisualStudioInstallation();
    if (!vsCheck) {
      console.log('Installing Visual Studio...');
      await installVisualStudioWindows();
    }

    console.log('Checking .NET Core SDK installation...');
    const dotNetCoreCheck = await checkDotNetCoreInstallation();
    if (!dotNetCoreCheck) {
      console.log('Installing .NET Core SDK...');
      await installDotNetCoreWindows();
    }

    console.log('Checking WinAppDriver installation...');
    const winAppDriverCheck = await checkWinAppDriverInstallation();
    if (!winAppDriverCheck) {
      console.log('Installing WinAppDriver...');
      await installWinAppDriverWindows();
    }

    console.log('Installing CppWinRT VSIX...');
    await installCppWinRTVSIX();
  }

  console.log('React Native environment setup complete.');
};

// Check if running on Windows
if (isWindows) {
  setupReactNativeEnvironment().catch((error) => {
    console.error('Error during setup:', error);
  });
} else {
  console.log('Checking Homebrew installation...');
  setupReactNativeEnvironment().catch((error) => {
    console.error('Error during setup:', error);
  });
}
