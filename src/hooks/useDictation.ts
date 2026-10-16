import { useCallback, useEffect, useRef, useState } from "react";

type SpeechResultList = ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { resultIndex: number; results: SpeechResultList }) => void) | null;
  onstart: (() => void) | null;
  onaudiostart: (() => void) | null;
  onaudioend: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getRecognition(): SpeechRecognitionConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  const scope = window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition;
}

export function appendDictation(current: string, addition: string) {
  const base = current.replace(/\s+$/, "");
  return base ? `${base} ${addition}` : addition;
}

export function useDictation(onText: (text: string) => void) {
  const supported = Boolean(getRecognition());
  const [listening, setListening] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onTextRef = useRef(onText);

  useEffect(() => {
    onTextRef.current = onText;
  }, [onText]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Recognition = getRecognition();
    if (!Recognition || recognitionRef.current) return;
    const recognition = new Recognition();
    recognition.lang = navigator.language || "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      let text = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) text += result[0].transcript;
      }
      if (text.trim()) onTextRef.current(text.trim());
    };
    const finish = () => {
      recognitionRef.current = null;
      setListening(false);
      setCapturing(false);
    };
    recognition.onstart = () => setCapturing(true);
    recognition.onaudiostart = () => setCapturing(true);
    recognition.onaudioend = () => setCapturing(false);
    recognition.onend = finish;
    recognition.onerror = finish;
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }, []);

  const toggle = useCallback(() => {
    if (recognitionRef.current) stop();
    else start();
  }, [start, stop]);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  return { supported, listening, capturing, start, stop, toggle };
}
