/* eslint-disable prettier/prettier */
module.exports = {
    react : {
        // autoStart: false,
        debug : true,
        lifecycle : {
            /**
             * Decide if you want to see Update Cycles as well
             */
            includeUpdate: false,

            /**
             * Filter for Instrumenting Lifecycle of Components / True = Will be instrumented
             */
            instrument: (filename) => {
                return false;
            },
        },

        input : {
            /**
             * Allows you to filter the instrumentation for touch events, refresh events and picker events in certain files
             * True = Will be instrumented
             */
            instrument: (filename) => {
                return true;
            }
        }
    },
    android : {
        // Those configs are copied 1:1
        config : `
        dynatrace {
            configurations {
                defaultConfig {
                    autoStart {
                        applicationId 'b3183e4d-3d33-48e6-8623-16099930be8c'
                        beaconUrl 'https://byu472.dynatrace-managed.com:9999/mbeacon/070660a5-3c78-4689-b26a-14fb7a656604'
                    }
                    userOptIn false
                }
            }
        }
        `
    },
    ios : {
        // Those configs are copied 1:1
        config : `
        <key>DTXApplicationID</key>
        <string>b3183e4d-3d33-48e6-8623-16099930be8c</string>
        <key>DTXBeaconURL</key>
        <string>https://byu472.dynatrace-managed.com:9999/mbeacon/070660a5-3c78-4689-b26a-14fb7a656604</string>
        <key>DTXLogLevel</key>
        <string>ALL</string>
        <key>DTXUserOptIn</key>
        <false/>
        `
    }
}
