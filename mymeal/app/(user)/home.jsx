import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";
import { Link } from "expo-router";


const home = () => {

  return (
    <SafeAreaView >
      <Text>welcome home</Text>

      <Link href="/(user)/store">View Store</Link>


      <Link href="/(user)/favori">View Favorites</Link>



    </SafeAreaView>
  );
};

export default home;
