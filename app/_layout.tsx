import { Stack } from "expo-router";
import CodePushWrapper from "../components/CodePushWrapper";
import "./globals.css";

export default function RootLayout() {
  return (
    <CodePushWrapper>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        <Stack.Screen name="movies/[id]" options={{headerShown: false}} />
      </Stack>
    </CodePushWrapper>
  );
}
