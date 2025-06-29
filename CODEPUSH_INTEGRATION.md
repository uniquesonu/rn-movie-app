# Movie App - CodePush Integration with DOTA Server

This React Native application demonstrates a complete integration with CodePush using a custom DOTA (DevOps Tools for Applications) server.

## 📋 Prerequisites

Before testing the CodePush integration, ensure you have:

1. **DOTA Server Running**: Your DOTA server should be running and accessible
2. **Deployment Key**: Valid deployment key configured in your DOTA server
3. **Network Access**: Device/emulator can reach your DOTA server
4. **React Native Environment**: Properly set up React Native development environment

## 🔧 Configuration

### Android Configuration

The app is configured to use your DOTA server through the following files:

#### `android/app/src/main/res/values/strings.xml`
```xml
<resources>
  <string name="app_name">AppName</string>
  <string moduleConfig="true" name="CodePushDeploymentKey">QnuqjcHr5G5dlF4Ud2JwpcJBMWz6id_0</string>
  <string moduleConfig="true" name="CodePushServerUrl">http://localhost:3010/</string>
  <!-- Other Expo configurations -->
</resources>
```

#### `android/app/src/main/java/com/uniquesonu/movieapp/MainApplication.kt`
- Added CodePush import and JS bundle configuration
- Configured to use custom DOTA server endpoint

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start DOTA Server
Ensure your DOTA server is running on the configured URL (http://localhost:3010/)

### 3. Run the Application
```bash
# For Android
npm run android

# For iOS (additional iOS configuration required)
npm run ios
```

## 🧪 Testing Your DOTA Integration

The app includes comprehensive testing tools accessible from the main screen:

### Built-in Test Features

1. **Check for Updates**: Manually trigger a CodePush update check
2. **Test DOTA Server**: Comprehensive connectivity and configuration tests
3. **Show Configuration**: Display current DOTA server settings
4. **Refresh Status**: Reload current app version information

### Test Scenarios

#### 1. Server Connectivity Test
- Tests basic HTTP connectivity to your DOTA server
- Verifies server health endpoint is accessible
- Validates network configuration

#### 2. Deployment Key Validation
- Tests deployment key authentication
- Verifies key is accepted by DOTA server
- Checks update endpoint accessibility

#### 3. Update Flow Testing
- Tests complete update discovery process
- Validates update download and installation
- Verifies app restart and version verification

### Manual Testing Steps

1. **Launch the App**
   - Open the app on your device/emulator
   - Verify the app loads successfully
   - Check that status shows current version

2. **Test DOTA Server Connection**
   - Tap "Test DOTA Server" button
   - Wait for connectivity tests to complete
   - Verify all tests pass (✅)

3. **Test Update Check**
   - Ensure you have a newer version deployed to DOTA
   - Tap "Check for Updates"
   - Confirm update dialog appears if update is available
   - Test both "Install" and "Later" options

4. **Verify Update Installation**
   - If update is available, choose "Install"
   - Monitor installation progress in logs
   - Verify app restarts with new version
   - Check status reflects updated version info

## 📱 App Features

### CodePush Service (`services/codePushService.ts`)
- **Automatic Updates**: Configurable update checking on app start
- **Manual Updates**: On-demand update checking
- **Custom Dialogs**: Branded update dialogs with user-friendly messaging
- **Progress Tracking**: Download and installation progress monitoring
- **Error Handling**: Comprehensive error handling and user feedback

### DOTA Test Utilities (`utils/dotaTestUtils.ts`)
- **Server Connectivity**: Tests basic HTTP connectivity
- **Authentication**: Validates deployment keys
- **Configuration Display**: Shows current DOTA settings
- **Error Diagnostics**: Detailed error reporting for troubleshooting

### CodePush Wrapper (`components/CodePushWrapper.tsx`)
- **HOC Integration**: Higher-order component for easy integration
- **Development Tools**: Debug controls visible in development mode
- **Status Monitoring**: Real-time update status display
- **User Interface**: Clean, intuitive update management UI

## 🔍 Monitoring and Debugging

### Console Logs
The app provides detailed console logs for:
- CodePush sync status changes
- Download progress updates
- Server connectivity tests
- Error diagnostics
- Configuration validation

### Log Categories
- `CodePush:` - All CodePush-related operations
- `DOTA:` - DOTA server communication
- `Config:` - Configuration loading and validation

### Common Issues and Solutions

#### 1. "Server Connection Failed"
- Verify DOTA server is running
- Check server URL in strings.xml
- Ensure device can reach server (network connectivity)
- Verify firewall/security settings

#### 2. "Deployment Key Invalid"
- Check deployment key in strings.xml matches DOTA server
- Verify key has correct permissions
- Ensure key is active and not expired

#### 3. "Update Check Failed"
- Verify server endpoints are correct
- Check for SSL/TLS configuration issues
- Ensure server is responding to update requests

#### 4. "Installation Failed"
- Check device storage space
- Verify app has necessary permissions
- Look for JavaScript bundle compatibility issues

## 📋 Production Checklist

Before deploying to production:

- [ ] Replace localhost URLs with production DOTA server URLs
- [ ] Use production deployment keys
- [ ] Test update flow thoroughly in staging environment
- [ ] Verify SSL/TLS certificates for production servers
- [ ] Configure appropriate update check frequency
- [ ] Set up monitoring and alerting for update failures
- [ ] Test rollback procedures
- [ ] Validate update size limits and download timeouts
- [ ] Ensure proper error handling and user messaging
- [ ] Test on various device types and network conditions

## 🔧 Advanced Configuration

### Custom Update Dialogs
Modify `defaultCodePushOptions` in `codePushService.ts` to customize:
- Update dialog text and buttons
- Installation timing (immediate vs restart)
- Update check frequency
- Mandatory vs optional update handling

### Server Endpoints
The app expects these DOTA server endpoints:
- `GET /health` - Server health check
- `POST /updateCheck` - Update availability check
- Standard CodePush API endpoints for download/install

### Environment Configuration
Consider using environment variables or configuration files for:
- Server URLs (development vs production)
- Deployment keys
- Update check intervals
- Debug mode settings

## 📞 Support

For issues with:
- **CodePush Integration**: Check React Native CodePush documentation
- **DOTA Server**: Refer to your DOTA server documentation
- **App-specific Issues**: Check console logs and follow debugging steps above

## 🎯 Next Steps

1. **Set up CI/CD Pipeline**: Automate deployments to your DOTA server
2. **Monitoring**: Implement update success/failure monitoring
3. **Analytics**: Track update adoption rates and performance
4. **Rollback Strategy**: Implement automated rollback for failed updates
5. **A/B Testing**: Use CodePush labels for feature flags and gradual rollouts
