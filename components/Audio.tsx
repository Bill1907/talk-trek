import {useEffect, useState} from "react";
import { View, StyleSheet, Button } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util'
import { Audio } from 'expo-av';

// import { WebSocketService } from "@/services/apiService";
import { OpenAiService } from "@/services/openai";
import {Sound} from "expo-av/build/Audio/Sound";

export default function AudioComponent() {
    // let wss: WebSocketService;
    let client: OpenAiService | null;
    const [recording, setRecording] = useState<any>();
    const [sound, setSound] = useState<Sound>();
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    async function startRecording() {
        try {
            if (permissionResponse?.status !== 'granted') {
                console.log('Requesting permission..');
                await requestPermission();
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY);
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync(
            {
                allowsRecordingIOS: false,
            }
        );
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
    }

    async function playTTS() {
        try {
            if (!client) {
                console.error('OpenAI client not initialized');
                return;
            }
            const mp3 = await client.createTTS('Hello, how are you doing today?');
            if (!mp3 || !mp3._bodyBlob) {
                throw new Error('Failed to receive TTS data');
            }

            const { sound } = await Audio.Sound.createAsync({ uri:  });
            setSound(sound);
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing TTS:', error);
        }
    }

    // useEffect(() => {
    //     wss = new WebSocketService();
    //     wss.open(() => console.log('Connection opened'));
    //     wss.onerror(() => console.log('Error occurred'));
    //     return () => {
    //         wss.close();
    //     }
    // });

    useEffect(() => {
        client = new OpenAiService(process.env.EXPO_PUBLIC_OPENAI_API_KEY!);
        return () => {
            client = null;
        }
    });

    return (
        <>
        <View style={styles.container}>
            <Button
                title={recording ? 'Stop Recording' : 'Start Recording'}
                onPress={recording ? stopRecording : startRecording}
            />
        </View>
        <View style={styles.container}>
            <Button title="Play Sound" onPress={playTTS} />
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 10,
    },
});
