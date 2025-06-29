import { Alert } from 'react-native';

export interface DOTAServerConfig {
  url: string;
  deploymentKey: string;
}

// Test DOTA server connectivity
export const testDOTAConnection = async (config: DOTAServerConfig): Promise<boolean> => {
  try {
    console.log(`Testing DOTA server connection to: ${config.url}`);
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Test basic server connectivity
    const response = await fetch(`${config.url}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      console.log('DOTA server connection successful');
      return true;
    } else {
      console.error(`DOTA server responded with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('DOTA server connection failed:', error);
    return false;
  }
};

// Test CodePush deployment key validation
export const testDeploymentKey = async (config: DOTAServerConfig): Promise<boolean> => {
  try {
    console.log('Testing deployment key validation...');
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${config.url}/updateCheck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CodePush-Key': config.deploymentKey,
      },
      body: JSON.stringify({
        deploymentKey: config.deploymentKey,
        appVersion: '1.0.0',
        packageHash: 'test',
        isCompanion: false,
        label: 'test',
        clientUniqueId: 'test-client',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 200 || response.status === 204) {
      console.log('Deployment key validation successful');
      return true;
    } else {
      console.error(`Deployment key validation failed with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('Deployment key validation error:', error);
    return false;
  }
};

// Comprehensive DOTA server test
export const runDOTATests = async (config: DOTAServerConfig): Promise<void> => {
  Alert.alert('DOTA Server Test', 'Starting connectivity tests...');
  
  const results = {
    serverConnection: false,
    deploymentKeyValidation: false,
  };

  try {
    // Test 1: Server connectivity
    results.serverConnection = await testDOTAConnection(config);
    
    // Test 2: Deployment key validation
    if (results.serverConnection) {
      results.deploymentKeyValidation = await testDeploymentKey(config);
    }
    
    // Show results
    const successCount = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    let message = `Tests completed: ${successCount}/${totalTests} passed\n\n`;
    message += `• Server Connection: ${results.serverConnection ? '✅' : '❌'}\n`;
    message += `• Deployment Key: ${results.deploymentKeyValidation ? '✅' : '❌'}\n`;
    
    if (successCount === totalTests) {
      message += '\n🎉 All tests passed! Your DOTA integration is working correctly.';
    } else {
      message += '\n⚠️ Some tests failed. Please check your DOTA server configuration.';
    }
    
    Alert.alert('DOTA Test Results', message);
    
  } catch (error) {
    console.error('DOTA tests failed:', error);
    Alert.alert('Test Error', 'Failed to run DOTA tests. Please check your configuration and try again.');
  }
};

// Get current DOTA configuration from app
export const getCurrentDOTAConfig = (): DOTAServerConfig => {
  // In a real app, these would come from your app's configuration
  return {
    url: 'http://localhost:3010', // This should match your strings.xml
    deploymentKey: 'QnuqjcHr5G5dlF4Ud2JwpcJBMWz6id_0', // This should match your strings.xml
  };
};

// Log current app configuration for debugging
export const logAppConfiguration = () => {
  const config = getCurrentDOTAConfig();
  console.log('=== DOTA Configuration ===');
  console.log(`Server URL: ${config.url}`);
  console.log(`Deployment Key: ${config.deploymentKey}`);
  console.log('========================');
};
