const { withGradleProperties } = require('@expo/config-plugins');

/**
 * Build-performance settings for local development.
 *
 * These values are re-applied on every `expo prebuild`, so they survive
 * continuous native generation. The default ABI list covers both the local
 * x86_64 emulator and an arm64-v8a phone, so one Debug APK installs on either:
 * the native C++ for each ABI is compiled once and then cached, and only a
 * clean build pays for the second ABI. Override with TAMIL_QURAN_ARCHS when a
 * different target is needed.
 *
 *   TAMIL_QURAN_ARCHS="arm64-v8a" npx expo prebuild --platform android
 *
 * Do not ship a release with only x86_64 or arm64-v8a: `npm run apk:release`
 * passes all four ABIs explicitly.
 */
const ARCHS = process.env.TAMIL_QURAN_ARCHS || 'x86_64,arm64-v8a';

const PROPERTIES = {
  'org.gradle.jvmargs': '-Xmx3072m -XX:MaxMetaspaceSize=1024m',
  'org.gradle.parallel': 'true',
  'org.gradle.workers.max': '6',
  'org.gradle.caching': 'true',
  'android.enablePngCrunchInReleaseBuilds': 'false',
  'android.enableMinifyInReleaseBuilds': 'false',
  reactNativeArchitectures: ARCHS,
};

module.exports = function withBuildPerformance(config) {
  return withGradleProperties(config, (gradleConfig) => {
    for (const [key, value] of Object.entries(PROPERTIES)) {
      const existing = gradleConfig.modResults.find(
        (item) => item.type === 'property' && item.key === key,
      );

      if (existing) {
        existing.value = value;
      } else {
        gradleConfig.modResults.push({ type: 'property', key, value });
      }
    }

    return gradleConfig;
  });
};
