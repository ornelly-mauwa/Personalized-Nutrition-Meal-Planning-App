/*import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // Important for React Native

// Initialize Supabase client
const supabaseUrl = 'https://jygkhetecyfdvyfgxuer.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5Z2toZXRlY3lmZHZ5Zmd4dWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDYxOTIsImV4cCI6MjA2MzI4MjE5Mn0.z63Ggm5QwvxXFoosYwdIrYs94JuzM7WFcAAIj3gymi0';

// Create Supabase client with AsyncStorage for React Native
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Create context
const GlobalContext = createContext({
  // User state
  user: null,
  isLogged: false,
  userRole: null,
  loading: true,
  session: null,

  // Helper functions
  hasRole: () => false,
  isAuthenticated: false,
  refreshUserData: async () => { },
  clearAllData: () => { },

  // Auth functions
  SignIn: async () => { },
  SignUp: async () => { },
  logout: async () => { },
});

export const GlobalProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  // Clear all user data
  const clearAllData = () => {
    setUser(null);
    setUserRole(null);
    setSession(null);
    setIsLogged(false);
  };

  // Main fetch function (used on login and app reload)
  const refreshUserData = async () => {
    try {
      setLoading(true);

      // Get current session
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (data?.session) {
        setSession(data.session);

        // Get user data
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (userData?.user) {
          setUser(userData.user);
          setIsLogged(true);

          // Get user role from user metadata
          if (userData.user.user_metadata?.role) {
            setUserRole(userData.user.user_metadata.role);
          }
        }
      } else {
        // No active session
        clearAllData();
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      clearAllData();
    } finally {
      setLoading(false);
    }
  };

  // ==================== AUTH FUNCTIONS ====================

  const handleSignIn = async (email, password) => {
    try {
      setLoading(true);

      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data?.session) {
        setSession(data.session);
        setUser(data.user);
        setIsLogged(true);

        // Get user role from metadata
        if (data.user.user_metadata?.role) {
          setUserRole(data.user.user_metadata.role);
        }

        return { success: true, user: data.user };
      }

      return { success: false, error: 'No session returned' };
    } catch (error) {
      console.error("Login failed:", error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async ({ username, email, password, role }) => {
    try {
      setLoading(true);

      if (!username || !email || !password || !role) {
        return { success: false, error: 'All fields are required' };
      }

      // Sign up the user with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            role: role
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        // With email confirmation enabled, session might be null
        if (data.session) {
          setSession(data.session);
          setUser(data.user);
          setUserRole(role);
          setIsLogged(true);
        }

        return {
          success: true,
          user: data.user,
          message: data.session ? 'Account created successfully!' : 'Please check your email to confirm your account.'
        };
      }

      return { success: false, error: 'Failed to create account' };
    } catch (error) {
      console.error("Signup failed:", error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear local state
      clearAllData();

      return { success: true };
    } catch (error) {
      console.error("Logout failed:", error.message);

      // Still clear local data even if API call fails
      clearAllData();

      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Role check helper
  const hasRole = (roleOrRoles) => {
    if (!userRole) return false;

    if (Array.isArray(roleOrRoles)) {
      return roleOrRoles.includes(userRole);
    }

    return userRole === roleOrRoles;
  };

  // Check for session on mount and setup auth listener
  useEffect(() => {
    // Initial session check
    refreshUserData();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth event: ${event}`);

        if (session) {
          setSession(session);
          setUser(session.user);
          setIsLogged(true);

          // Get user role from metadata
          if (session.user.user_metadata?.role) {
            setUserRole(session.user.user_metadata.role);
          }
        } else {
          clearAllData();
        }
      }
    );

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const value = {
    // User state
    user,
    isLogged,
    userRole,
    loading,
    session,
    isAuthenticated: isLogged,

    // Helper functions
    hasRole,
    refreshUserData,
    clearAllData,

    // Auth functions
    SignIn: handleSignIn,
    SignUp: handleSignUp,
    logout: handleLogout,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);*/

import React, { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})