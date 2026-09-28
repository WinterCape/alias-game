const fs = require('fs');
const path = require('path');
const { withDangerousMod } = require('expo/config-plugins');

// Some pods (RevenueCat, PurchasesHybridCommon, AsyncStorage) still declare
// iOS 13.0 in their podspecs. Xcode 26+ only accepts 15.0 and above, so the
// build fails unless every pod target is raised to the app's minimum.
const MIN_IOS = '15.1';
const MARKER = '# withPodsDeploymentTarget';

const snippet = `
    ${MARKER}
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        if config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'].to_f < ${MIN_IOS}
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${MIN_IOS}'
        end
      end
    end
`;

module.exports = function withPodsDeploymentTarget(config) {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');
      if (!podfile.includes(MARKER)) {
        const anchor = 'post_install do |installer|';
        if (!podfile.includes(anchor)) {
          throw new Error('withPodsDeploymentTarget: post_install hook not found in Podfile');
        }
        podfile = podfile.replace(anchor, `${anchor}${snippet}`);
        fs.writeFileSync(podfilePath, podfile);
      }
      return cfg;
    },
  ]);
};
