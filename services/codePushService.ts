import codePush from 'react-native-code-push';
import { Alert } from 'react-native';

export interface CodePushOptions {
  checkFrequency?: any;
  installMode?: any;
  updateDialog?: boolean | any;
}

// Default CodePush options with custom update dialog
export const defaultCodePushOptions: CodePushOptions = {
  checkFrequency: codePush?.CheckFrequency?.ON_APP_START || 0,
  installMode: codePush?.InstallMode?.IMMEDIATE || 0,
  updateDialog: {
    appendReleaseDescription: true,
    title: 'An update is available!',
    mandatoryUpdateMessage: 'An update is required to continue using the app.',
    mandatoryContinueButtonLabel: 'Install now',
    optionalUpdateMessage: 'An update is available. Would you like to install it?',
    optionalIgnoreButtonLabel: 'Later',
    optionalInstallButtonLabel: 'Install now',
  },
};

// Manual update check function
export const checkForUpdates = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!codePush || !codePush.sync) {
      console.warn('CodePush is not available');
      Alert.alert('CodePush Error', 'CodePush is not properly configured.');
      reject(new Error('CodePush not available'));
      return;
    }

    codePush.sync({
      updateDialog: true,
      installMode: codePush?.InstallMode?.IMMEDIATE || 0
    },
    (status) => {
      switch(status) {
        case codePush?.SyncStatus?.CHECKING_FOR_UPDATE:
          console.log('CodePush: Checking for updates...');
          break;
        case codePush?.SyncStatus?.DOWNLOADING_PACKAGE:
          console.log('CodePush: Downloading update package...');
          break;
        case codePush?.SyncStatus?.INSTALLING_UPDATE:
          console.log('CodePush: Installing update...');
          break;
        case codePush?.SyncStatus?.UP_TO_DATE:
          console.log('CodePush: App is up to date!');
          Alert.alert('Update Status', 'Your app is up to date!');
          resolve();
          break;
        case codePush?.SyncStatus?.UPDATE_INSTALLED:
          console.log('CodePush: Update installed!');
          Alert.alert('Update Status', 'Update installed successfully!');
          resolve();
          break;
        case codePush?.SyncStatus?.SYNC_IN_PROGRESS:
          console.log('CodePush: Sync in progress...');
          break;
        case codePush?.SyncStatus?.UNKNOWN_ERROR:
          console.error('CodePush: Unknown error occurred');
          Alert.alert('Update Error', 'An error occurred while checking for updates.');
          reject(new Error('CodePush sync failed'));
          break;
      }
    },
    (progress) => {
      console.log(`CodePush: Download progress: ${progress.receivedBytes} of ${progress.totalBytes} bytes`);
    });
  });
};

// Get current CodePush information
export const getCodePushInfo = async (): Promise<any> => {
  try {
    if (!codePush || !codePush.getUpdateMetadata) {
      console.warn('CodePush getUpdateMetadata is not available');
      return null;
    }
    
    const update = await codePush.getUpdateMetadata();
    if (update) {
      console.log('CodePush: Current package info:', {
        appVersion: update.appVersion,
        deploymentKey: update.deploymentKey,
        description: update.description,
        label: update.label,
        packageHash: update.packageHash,
        packageSize: update.packageSize,
      });
    }
    return update;
  } catch (error) {
    console.error('CodePush: Error getting current package info:', error);
    return null;
  }
};

// Check for updates silently (no UI)
export const checkForUpdatesSilently = async (): Promise<boolean> => {
  try {
    if (!codePush || !codePush.checkForUpdate) {
      console.warn('CodePush checkForUpdate is not available');
      return false;
    }
    
    const update = await codePush.checkForUpdate();
    if (update) {
      console.log('CodePush: Update available:', {
        appVersion: update.appVersion,
        description: update.description,
        label: update.label,
        isMandatory: update.isMandatory,
        packageSize: update.packageSize,
      });
      return true;
    } else {
      console.log('CodePush: No update available');
      return false;
    }
  } catch (error) {
    console.error('CodePush: Error checking for updates:', error);
    return false;
  }
};

// Download and install update
export const downloadAndInstallUpdate = async (update: any): Promise<void> => {
  try {
    if (!update || !update.download) {
      throw new Error('Invalid update object');
    }
    
    const localPackage = await update.download((progress: any) => {
      console.log(`CodePush: Download progress: ${progress.receivedBytes} of ${progress.totalBytes} bytes`);
    });
    
    if (!localPackage || !localPackage.install) {
      throw new Error('Failed to download update package');
    }
    
    await localPackage.install(codePush?.InstallMode?.IMMEDIATE || 0);
    console.log('CodePush: Update installed successfully');
  } catch (error) {
    console.error('CodePush: Error downloading/installing update:', error);
    throw error;
  }
};
