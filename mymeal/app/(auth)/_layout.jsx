import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const AuthLayout = () => {
  const { loading, isLogged, userRole } = useGlobalContext();

  // Redirect to appropriate screen based on user role if logged in
  if (!loading && isLogged) {
    if (userRole === 'admin') {
      return <Redirect href="/adindex" />;
    } else if (userRole === 'nutritionist') {
      return <Redirect href="/nuindex" />;
    } else {
      // Default for regular users
      return <Redirect href="/home" />;
    }
  }

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;