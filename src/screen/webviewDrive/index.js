import React from "react";
import { View, StatusBar } from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewDrive({ route }) {
  const { url } = route.params;
  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
    url
  )}`;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <WebView source={{ uri: viewerUrl }} style={{ flex: 1 }} />
    </View>
  );
}
