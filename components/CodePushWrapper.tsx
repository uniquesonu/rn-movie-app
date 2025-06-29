import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import codePush from 'react-native-code-push';
import { 
  checkForUpdates, 
  getCodePushInfo,
  checkForUpdatesSilently 
} from '../services/codePushService';

interface CodePushWrapperProps {
  children: React.ReactNode;
}

const CodePushWrapper: React.FC<CodePushWrapperProps> = ({ children }) => {
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCodePushAvailable, setIsCodePushAvailable] = useState(false);

  useEffect(() => {
    // Check if CodePush is available
    const checkCodePushAvailability = async () => {
      if (codePush && typeof codePush === 'object') {
        setIsCodePushAvailable(true);
        console.log('CodePush is available');
        // Get current CodePush info on mount
        try {
          const info = await getCodePushInfo();
          setUpdateInfo(info);
        } catch (error) {
          console.error('Failed to load CodePush info:', error);
        }
        // Check for updates silently on app start
        checkForUpdatesSilently();
      } else {
        setIsCodePushAvailable(false);
        console.warn('CodePush is not available or not properly configured');
      }
    };

    checkCodePushAvailability();
  }, []);

  const loadCodePushInfo = async () => {
    if (!isCodePushAvailable) return;
    
    try {
      const info = await getCodePushInfo();
      setUpdateInfo(info);
    } catch (error) {
      console.error('Failed to load CodePush info:', error);
    }
  };

  const handleManualUpdateCheck = async () => {
    if (isChecking || !isCodePushAvailable) return;
    
    if (!isCodePushAvailable) {
      Alert.alert('CodePush Error', 'CodePush is not properly configured.');
      return;
    }
    
    setIsChecking(true);
    try {
      await checkForUpdates();
      // Refresh the update info after checking
      await loadCodePushInfo();
    } catch (error) {
      console.error('Manual update check failed:', error);
      Alert.alert('Update Error', 'Failed to check for updates. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const showUpdateInfo = () => {
    if (!isCodePushAvailable) {
      Alert.alert('CodePush Status', 'CodePush is not properly configured in this build.');
      return;
    }
    
    if (updateInfo) {
      Alert.alert(
        'App Version Info',
        `App Version: ${updateInfo.appVersion}\n` +
        `CodePush Label: ${updateInfo.label || 'Not set'}\n` +
        `Description: ${updateInfo.description || 'No description'}\n` +
        `Package Hash: ${updateInfo.packageHash ? updateInfo.packageHash.substring(0, 10) + '...' : 'Not available'}`
      );
    } else {
      Alert.alert('App Version Info', 'No CodePush update information available.');
    }
  };

  return (
    <View style={styles.container}>
      {children}
      
      {/* Development/Debug Controls */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <TouchableOpacity 
            style={[
              styles.button, 
              (isChecking || !isCodePushAvailable) && styles.buttonDisabled
            ]} 
            onPress={handleManualUpdateCheck}
            disabled={isChecking || !isCodePushAvailable}
          >
            <Text style={styles.buttonText}>
              {isChecking ? 'Checking...' : 'Check Updates'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={showUpdateInfo}>
            <Text style={styles.buttonText}>App Info</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  debugContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 0.48,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
});

// Create a safe wrapper that doesn't require HOC to work
const CodePushApp: React.FC<CodePushWrapperProps> = (props) => {
  // For now, just return the wrapper without CodePush HOC
  // This ensures the app works even if CodePush isn't fully setup
  return <CodePushWrapper {...props} />;
};

export default CodePushApp;
