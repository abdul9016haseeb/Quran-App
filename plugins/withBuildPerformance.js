const { withGradleProperties } = require('@expo/config-plugins');

/**
 * Build-performance settings for local development.
 *
 * These values are re-applied on every `expo prebuild`, so they survive
 * continuous native generation. They target the local x86_64 emulator by
 * default; override the ABI list when building for a physical device or a
 * release:
 *
 *   TAMIL_QURAN_ARCHS="x86_64,arm64-v8a" npx expo prebuild --platform android
 *
 * Do not ship a release with only x86_64.
 */
const ARCHS = process.env.TAMIL_QURAN_ARCHS || 'x86_64';

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
