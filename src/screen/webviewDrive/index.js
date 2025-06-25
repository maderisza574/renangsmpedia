import React from "react";
import { View, StatusBar } from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewDrive() {
  const hardcodedUrl =
    "https://smpedia.creativeku.my.id/file/sub_sub_menu/d13f47f51c9c2e804e0ad44e36dfb73c.pdf";

  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
    hardcodedUrl
  )}`;

  return (
    <View style={{ flex: 1 }}>
      
      <WebView
        source={{ uri: viewerUrl }}
        style={{ flex: 1 }}
        startInLoadingState={true}
      />
    </View>
  );
}
