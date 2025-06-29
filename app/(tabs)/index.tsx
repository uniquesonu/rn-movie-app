
import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Alert, ScrollView } from "react-native";
import { 
  checkForUpdates, 
  getCodePushInfo, 
  checkForUpdatesSilently 
} from "../../services/codePushService";
import { 
  runDOTATests, 
  getCurrentDOTAConfig, 
  logAppConfiguration 
} from "../../utils/dotaTestUtils";

export default function Index() {
  const [updateStatus, setUpdateStatus] = useState<string>('Ready');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize CodePush info and log configuration
    initializeCodePush();
    logAppConfiguration();
  }, []);

  const initializeCodePush = async () => {
    try {
      setUpdateStatus('Initializing...');
      const info = await getCodePushInfo();
      if (info) {
        setUpdateStatus(`Running v${info.appVersion} - ${info.label || 'Original'}`);
      } else {
        setUpdateStatus('Ready - Original Version');
      }
      setLastChecked(new Date());
    } catch (error) {
      console.error('Failed to initialize CodePush:', error);
      setUpdateStatus('Error initializing');
    }
  };

  const handleCheckForUpdates = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setUpdateStatus('Checking for updates...');
      const hasUpdate = await checkForUpdatesSilently();
      if (hasUpdate) {
        Alert.alert(
          'Update Available',
          'A new update is available. Would you like to install it now?',
          [
            { text: 'Later', style: 'cancel' },
            { 
              text: 'Install', 
              onPress: async () => {
                setUpdateStatus('Installing update...');
                await checkForUpdates();
                await initializeCodePush();
              }
            }
          ]
        );
      } else {
        setUpdateStatus('Up to date!');
        Alert.alert('No Updates', 'Your app is up to date!');
      }
      setLastChecked(new Date());
    } catch (error) {
      console.error('Update check failed:', error);
      setUpdateStatus('Update check failed');
      Alert.alert('Error', 'Failed to check for updates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDOTATest = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const config = getCurrentDOTAConfig();
      await runDOTATests(config);
    } catch (error) {
      console.error('DOTA tests failed:', error);
      Alert.alert('Test Error', 'Failed to run DOTA tests');
    } finally {
      setIsLoading(false);
    }
  };

  const showConfiguration = () => {
    const config = getCurrentDOTAConfig();
    Alert.alert(
      'DOTA Configuration',
      `Server URL: ${config.url}\n\nDeployment Key: ${config.deploymentKey.substring(0, 20)}...\n\nThis configuration is set in your Android strings.xml file.`
    );
  };

  return (
    <ScrollView className="flex-1 bg-green-500">
      <View className="flex-1 items-center justify-center px-4 py-8">
        <Text className="text-white text-2xl text-light-100 font-bold mb-8">
          Welcome to Movie app
        </Text>
        
        {/* CodePush Status Section */}
        <View className="bg-white/10 rounded-lg p-4 mb-6 w-full max-w-sm">
          <Text className="text-white text-lg font-semibold mb-2 text-center">
            App Status
          </Text>
          <Text className="text-white/80 text-sm text-center mb-2">
            {updateStatus}
          </Text>
          {lastChecked && (
            <Text className="text-white/60 text-xs text-center">
              Last checked: {lastChecked.toLocaleTimeString()}
            </Text>
          )}
        </View>

        {/* Control Buttons */}
        <View className="w-full max-w-sm space-y-3">
          <TouchableOpacity
            onPress={handleCheckForUpdates}
            className={`px-6 py-3 rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-semibold">
              {isLoading ? 'Loading...' : 'Check for Updates'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDOTATest}
            className={`px-6 py-3 rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-purple-600'}`}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-semibold">
              Test DOTA Server
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={showConfiguration}
            className="bg-indigo-600 px-6 py-3 rounded-lg"
            activeOpacity={0.7}
          >
            <Text className="text-white text-center font-semibold">
              Show Configuration
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={initializeCodePush}
            className="bg-gray-600 px-6 py-2 rounded-lg"
            activeOpacity={0.7}
          >
            <Text className="text-white text-center text-sm">
              Refresh Status
            </Text>
          </TouchableOpacity>
        </View>

        {/* Information Section */}
        <View className="bg-white/5 rounded-lg p-4 mt-6 w-full max-w-sm">
          <Text className="text-white text-sm font-medium mb-2">
            🔧 Development Tools
          </Text>
          <Text className="text-white/70 text-xs leading-relaxed">
            • Check for Updates: Manually trigger CodePush update check{'\n'}
            • Test DOTA Server: Verify connection to your DOTA server{'\n'}
            • Show Configuration: View current deployment settings{'\n'}
            • Refresh Status: Reload current app version info
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
