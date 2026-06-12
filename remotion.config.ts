import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Sandboxed CI environments may block Remotion's Chrome download mirror;
// point this at a locally installed Chrome / chrome-headless-shell instead.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}

// Sandboxes with a TLS-intercepting egress proxy break Google Fonts loading
// unless Chrome is told to skip certificate validation.
if (process.env.REMOTION_IGNORE_CERT_ERRORS === '1') {
  Config.setChromiumIgnoreCertificateErrors(true);
}
