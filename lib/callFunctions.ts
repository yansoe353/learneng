'use client';
import { UltravoxSession, UltravoxSessionStatus, Transcript, UltravoxSessionStateChangeEvent, UltravoxSessionState, UltravoxExperimentalMessageEvent, Role } from 'ultravox-client';
import { JoinUrlResponse, CallConfig } from '@/lib/types';

let UVState: UltravoxSessionState | null;
let UVSession: UltravoxSession | null = null;
const debugMessages: Set<string> = new Set(["debug"]);

interface CallCallbacks {
  onStatusChange: (status: UltravoxSessionStatus) => void;
  onTranscriptChange: (transcripts: Transcript[]) => void;
  onDebugMessage?: (message: UltravoxExperimentalMessageEvent ) => void;
}

export function toggleMute(role: Role): void {

  if (UVSession) {
    // Toggle (user) Mic
    if (role == Role.USER) {
      UVSession.isMicMuted ? UVSession.unmuteMic() : UVSession.muteMic();
    } 
    // Mute (agent) Speaker
    else {
      UVSession.isSpeakerMuted ? UVSession.unmuteSpeaker() : UVSession.muteSpeaker();
    }
  } else {
    console.error('UVSession is not initialized.');
  }
}

async function createCall(callConfig: CallConfig, showDebugMessages?: boolean): Promise<JoinUrlResponse> {

  try {
    if(showDebugMessages) {
      console.log(`Using model ${callConfig.model}`);
    }

    const response = await fetch(`/api/ultravox`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...callConfig }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data: JoinUrlResponse = await response.json();

    if(showDebugMessages) {
      console.log(`Call created. Join URL: ${data.joinUrl}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error creating call:', error);
    throw error;
  }
}

export async function startCall(callbacks: CallCallbacks, callConfig: CallConfig, showDebugMessages?: boolean): Promise<void> {
  const callData = await createCall(callConfig, showDebugMessages);
  const joinUrl = callData.joinUrl;

  if (!joinUrl && !UVSession) {
    console.error('Join URL is required');
    return;
  } else {
    console.log('Joining call:', joinUrl);

    // Start up our Ultravox Session
    UVSession = new UltravoxSession({ experimentalMessages: debugMessages });

    if(showDebugMessages) {
      console.log('UVSession created:', UVSession);
      console.log('UVSession methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(UVSession)));
    }

    if (UVSession) {
      UVState = UVSession.joinCall(joinUrl);
      console.log('Session status:', UVState.getStatus());
    } else {
      return;
    }

    UVState.addEventListener('ultravoxSessionStatusChanged', (event: any) => {
      callbacks.onStatusChange(event.state);
    });

    UVState.addEventListener('ultravoxTranscriptsChanged', (event: any) => {
      let te: UltravoxSessionStateChangeEvent = event;
      callbacks.onTranscriptChange(te.transcripts);
    });

    UVState.addEventListener('ultravoxExperimentalMessage', (msg: any) => {
      callbacks?.onDebugMessage?.(msg);
    });
  }

  console.log('Call started!'); 
}

export async function endCall(): Promise<void> {
  console.log('Call ended.');

  if (UVSession) {
    UVSession.leaveCall();
    UVState = null;
    UVSession = null;
  }  
}