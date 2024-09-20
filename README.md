# ultravox-demo-template-vercel
Template for creating Ultravox demo that gets deployed to Vercel.

This was bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Set-up
1. Add API key to .env.local
1. Configure settings in demo-config.ts

## Deployment TODO
1. Clone
1. Vercel set env vars

## Query Params
1. **Debug Loggin**: `showDebugMessages=true` to turn on some additional console logging.
1. **Speaker Mute Toggle**: `showSpeakerMute=true`
1. **Change Model**: `model=ultravox-70B`. Note: the app will prepend `fixie-ai/` in front of the model name passed in.
1. **Enable User Transcripts**: `showUserTranscripts=true` will display user transcripts. Otherwise, only Ultravox/agent transcripts are shown.