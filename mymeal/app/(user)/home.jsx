/*import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import API, { authAPI, userAPI, trackingAPI } from '../../lib/api';
import { useGlobalContext } from '../../context/GlobalProvider';

export default function Home() {
  const { user, getSafeMeals, getNutritionSummary } = useGlobalContext();

  const [todayStats, setTodayStats] = useState({
    calories: 0,
    caloriesGoal: 2000,
    protein: 0,
    proteinGoal: 120,
    carbs: 0,
    carbsGoal: 180,
    fat: 0,
    fatGoal: 65,
  });

  const [recommendedMeals, setRecommendedMeals] = useState([]);

  const calculateProgress = (current, goal) => {
    return (current / goal) * 100;
  };

  const navigateToMealDetail = (mealId) => {
    router.push(`/meal-plan/${mealId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const meals = await getSafeMeals(user.id);
          setRecommendedMeals(meals);

          const today = new Date().toISOString().split('T')[0];
          const stats = await getNutritionSummary(today, today);

          setTodayStats({
            calories: stats.total.calories,
            caloriesGoal: user.goalCalories || 2000,
            protein: stats.total.protein,
            proteinGoal: user.goalProtein || 120,
            carbs: stats.total.carbs,
            carbsGoal: user.goalCarbs || 180,
            fat: stats.total.fats,
            fatGoal: user.goalFats || 65,
          });
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header }
        <View className="px-5 pt-4 pb-2 flex-row justify-between items-center">
          <View>
            <Text className="text-slate-500 text-base font-kregular">Welcome back</Text>
            <Text className="text-slate-800 text-2xl font-kbold">{user?.username || 'User'}</Text>
          </View>
          <TouchableOpacity
            className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center"
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="notifications-outline" size={22} color="#3F836E" />
          </TouchableOpacity>
        </View>

        {/* Today's progress }
        <View className="mx-5 mt-4 p-5 bg-slate-50 rounded-2xl">
          <Text className="text-slate-800 text-lg font-kbold mb-3">Today's Progress</Text>

          {/* Calories }
          <View className="mb-4">
            <View className="flex-row justify-between mb-1">
              <Text className="text-slate-700 font-kmedium">Calories</Text>
              <Text className="text-slate-700 font-kmedium">
                {todayStats.calories} / {todayStats.caloriesGoal} kcal
              </Text>
            </View>
            <View className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${calculateProgress(todayStats.calories, todayStats.caloriesGoal)}%` }}
              />
            </View>
          </View>

          {/* Macronutrients }
          <View className="flex-row justify-between">
            {/* Protein }
            <View className="flex-1 mr-2">
              <View className="flex-row justify-between mb-1">
                <Text className="text-slate-700 font-kmedium text-sm">Protein</Text>
                <Text className="text-slate-700 text-sm">{todayStats.protein}g</Text>
              </View>
              <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${calculateProgress(todayStats.protein, todayStats.proteinGoal)}%` }}
                />
              </View>
            </View>

            {/* Carbs }
            <View className="flex-1 mx-1">
              <View className="flex-row justify-between mb-1">
                <Text className="text-slate-700 font-kmedium text-sm">Carbs</Text>
                <Text className="text-slate-700 text-sm">{todayStats.carbs}g</Text>
              </View>
              <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${calculateProgress(todayStats.carbs, todayStats.carbsGoal)}%` }}
                />
              </View>
            </View>

            {/* Fat }
            <View className="flex-1 ml-2">
              <View className="flex-row justify-between mb-1">
                <Text className="text-slate-700 font-kmedium text-sm">Fat</Text>
                <Text className="text-slate-700 text-sm">{todayStats.fat}g</Text>
              </View>
              <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${calculateProgress(todayStats.fat, todayStats.fatGoal)}%` }}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="mt-4 bg-white py-3 rounded-xl flex-row justify-center items-center"
            onPress={() => router.push('/tracking')}
          >
            <Ionicons name="add-circle-outline" size={20} color="#3F836E" className="mr-2" />
            <Text className="text-base font-kbold text-[#3F836E] ml-1">Log Food</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Meals }
        <View className="px-5 mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-slate-800 text-lg font-kbold">Recommended For You</Text>
            <TouchableOpacity onPress={() => router.push('/meal-plan')}>
              <Text className="text-[#3F836E] font-kmedium">See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pb-2"
          >
            {recommendedMeals.map((meal) => (
              <TouchableOpacity
                key={meal.id}
                className="mr-4 bg-white rounded-2xl shadow-sm overflow-hidden"
                style={styles.mealCard}
                onPress={() => navigateToMealDetail(meal.id)}
              >
                <Image
                  source={{ uri: meal.image || 'https://placehold.co/200x150' }}
                  className="w-full h-24 rounded-t-2xl"
                />
                <View className="p-3">
                  <Text className="text-slate-700 font-kbold">{meal.name}</Text>
                  <View className="flex-row items-center mt-2">
                    <View className="flex-row items-center mr-3">
                      <Ionicons name="flame-outline" size={14} color="#f97316" />
                      <Text className="text-slate-600 text-xs ml-1">{meal.calories} kcal</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="time-outline" size={14} color="#64748b" />
                      <Text className="text-slate-600 text-xs ml-1">{meal.time}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Water Tracking }
        <View className="mx-5 mt-6 p-5 bg-blue-50 rounded-2xl mb-24">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-slate-800 text-lg font-kbold">Water Intake</Text>
              <Text className="text-slate-600 text-sm">4 of 8 glasses</Text>
            </View>
            <View className="w-12 h-12 justify-center items-center">
              <Ionicons name="water-outline" size={28} color="#3b82f6" />
            </View>
          </View>

          <View className="h-3 bg-white rounded-full overflow-hidden mt-3">
            <View className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }} />
          </View>

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity className="flex-1 mr-2 bg-white py-3 rounded-xl flex-row justify-center items-center">
              <Ionicons name="remove-outline" size={20} color="#3F836E" />
              <Text className="text-sm font-kbold text-[#3F836E] ml-1">Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 ml-2 bg-[#3F836E] py-3 rounded-xl flex-row justify-center items-center">
              <Ionicons name="add-outline" size={20} color="white" />
              <Text className="text-sm font-kbold text-white ml-1">Add Glass</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mealCard: {
    width: 200,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});*/
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';

export default function Home() {
  const {
    user,
    isLogged,
    loading,
    userProfile,
    healthProfile,
    mealPlans,
    waterLogs,
    getProfile,
    getHealthProfile,
    getMealPlans,
    getNutritionSummary,
    getWaterLogs,
    logWater,
    searchFoods
  } = useGlobalContext();

  const [todayStats, setTodayStats] = useState({
    calories: 0,
    caloriesGoal: 2000,
    protein: 0,
    proteinGoal: 120,
    carbs: 0,
    carbsGoal: 180,
    fat: 0,
    fatGoal: 65,
  });

  const [recommendedMeals, setRecommendedMeals] = useState([]);
  const [waterIntake, setWaterIntake] = useState({
    current: 0,
    goal: 8,
    logs: []
  });
  const [refreshing, setRefreshing] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState('');

  // Generate greeting based on time of day
  const generateGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Calculate progress percentage
  const calculateProgress = useCallback((current, goal) => {
    if (!goal || goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  }, []);

  // Fetch nutrition data for today
  const fetchTodayNutrition = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const nutritionData = await getNutritionSummary(today, today);

      // Use health profile goals if available, otherwise use defaults
      const caloriesGoal = healthProfile?.daily_calorie_goal || userProfile?.goal_calories || 2000;
      const proteinGoal = healthProfile?.daily_protein_goal || userProfile?.goal_protein || 120;
      const carbsGoal = healthProfile?.daily_carb_goal || userProfile?.goal_carbs || 180;
      const fatGoal = healthProfile?.daily_fat_goal || userProfile?.goal_fats || 65;

      setTodayStats({
        calories: Math.round(nutritionData?.total_calories || 0),
        caloriesGoal,
        protein: Math.round(nutritionData?.total_protein || 0),
        proteinGoal,
        carbs: Math.round(nutritionData?.total_carbs || 0),
        carbsGoal,
        fat: Math.round(nutritionData?.total_fat || 0),
        fatGoal,
      });
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      // Set default values on error
      setTodayStats(prev => ({
        ...prev,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }));
    }
  }, [getNutritionSummary, healthProfile, userProfile]);

  // Fetch recommended meals
  const fetchRecommendedMeals = useCallback(async () => {
    try {
      const plans = await getMealPlans();

      // Get meals from current meal plan or latest plan
      const currentPlan = plans?.find(plan => plan.is_active) || plans?.[0];

      if (currentPlan?.meals) {
        // Filter for today's meals or upcoming meals
        const today = new Date().getDay();
        const todayMeals = currentPlan.meals
          .filter(meal => meal.day_of_week === today || !meal.day_of_week)
          .slice(0, 3) // Limit to 3 recommendations
          .map(meal => ({
            id: meal.id,
            name: meal.name || meal.meal_name,
            image: meal.image_url || meal.image || 'https://placehold.co/200x150',
            calories: Math.round(meal.calories || meal.total_calories || 0),
            time: meal.meal_time || meal.time || '30 min',
            type: meal.meal_type || 'meal'
          }));

        setRecommendedMeals(todayMeals);
      } else {
        // Fallback: generate some sample recommendations
        setRecommendedMeals([
          {
            id: 'sample-1',
            name: 'Healthy Breakfast Bowl',
            image: 'https://placehold.co/200x150',
            calories: 350,
            time: '15 min',
            type: 'breakfast'
          },
          {
            id: 'sample-2',
            name: 'Grilled Chicken Salad',
            image: 'https://placehold.co/200x150',
            calories: 420,
            time: '20 min',
            type: 'lunch'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching recommended meals:', error);
      setRecommendedMeals([]);
    }
  }, [getMealPlans]);

  // Fetch water intake data
  const fetchWaterIntake = useCallback(async () => {
    try {
      const today = new Date();
      const logs = await getWaterLogs(today);

      const totalGlasses = logs?.reduce((sum, log) => sum + (log.glasses || log.amount / 250), 0) || 0;
      const goal = healthProfile?.daily_water_goal || userProfile?.water_goal || 8;

      setWaterIntake({
        current: Math.round(totalGlasses),
        goal,
        logs: logs || []
      });
    } catch (error) {
      console.error('Error fetching water intake:', error);
      setWaterIntake(prev => ({ ...prev, current: 0, logs: [] }));
    }
  }, [getWaterLogs, healthProfile, userProfile]);

  // Handle water logging
  const handleWaterLog = useCallback(async (increment = true) => {
    try {
      const amount = increment ? 250 : -250; // 250ml per glass
      await logWater(amount);

      setWaterIntake(prev => ({
        ...prev,
        current: Math.max(0, prev.current + (increment ? 1 : -1))
      }));

      // Refresh water data
      await fetchWaterIntake();
    } catch (error) {
      console.error('Error logging water:', error);
      Alert.alert('Error', 'Failed to update water intake. Please try again.');
    }
  }, [logWater, fetchWaterIntake]);

  // Main data fetching function
  const fetchHomeData = useCallback(async () => {
    if (!user?.id || !isLogged) return;

    try {
      await Promise.all([
        getProfile().catch(() => null),
        getHealthProfile().catch(() => null),
        fetchTodayNutrition().catch(() => null),
        fetchRecommendedMeals().catch(() => null),
        fetchWaterIntake().catch(() => null)
      ]);
    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  }, [user?.id, isLogged]); // Remove getProfile from dependencies

  // Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHomeData();
    setRefreshing(false);
  }, [fetchHomeData]);

  // Navigation handlers
  const navigateToMealDetail = useCallback((mealId) => {
    if (mealId.startsWith('sample-')) {
      router.push('/meal-plan');
    } else {
      router.push(`/meal-plan/${mealId}`);
    }
  }, []);

  const navigateToProfile = useCallback(() => {
    router.push('/profile');
  }, []);

  const navigateToTracking = useCallback(() => {
    router.push('/tracking');
  }, []);

  const navigateToMealPlan = useCallback(() => {
    router.push('/meal-plan');
  }, []);

  // Initialize component
  useEffect(() => {
    setGreetingMessage(generateGreeting());
    if (user?.id && isLogged) {
      fetchHomeData();
    }
  }, [user, isLogged, generateGreeting, fetchHomeData]);

  // Show loading state
  if (loading && !user) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-slate-500 text-base font-kregular">Loading...</Text>
      </SafeAreaView>
    );
  }

  // Show login prompt if not authenticated
  if (!isLogged || !user) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-5">
        <Text className="text-slate-800 text-xl font-kbold mb-2">Welcome to NutriTrack</Text>
        <Text className="text-slate-500 text-base font-kregular text-center mb-4">
          Please sign in to view your dashboard
        </Text>
        <TouchableOpacity
          className="bg-[#3F836E] px-6 py-3 rounded-xl"
          onPress={() => router.push('/sign-in')}
        >
          <Text className="text-white font-kbold">Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3F836E']} />
        }
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-2 flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-slate-500 text-base font-kregular">{greetingMessage}</Text>
            <Text className="text-slate-800 text-2xl font-kbold" numberOfLines={1}>
              {user?.username || user?.name || 'User'}
            </Text>
          </View>
          <TouchableOpacity
            className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center ml-3"
            onPress={navigateToProfile}
          >
            <Ionicons name="person-outline" size={22} color="#3F836E" />
          </TouchableOpacity>
        </View>

        {/* Today's Progress */}
        <View className="mx-5 mt-4 p-5 bg-slate-50 rounded-2xl">
          <Text className="text-slate-800 text-lg font-kbold mb-3">Today's Progress</Text>

          {/* Calories */}
          <View className="mb-4">
            <View className="flex-row justify-between mb-1">
              <Text className="text-slate-700 font-kmedium">Calories</Text>
              <Text className="text-slate-700 font-kmedium">
                {todayStats.calories} / {todayStats.caloriesGoal} kcal
              </Text>
            </View>
            <View className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${calculateProgress(todayStats.calories, todayStats.caloriesGoal)}%` }}
              />
            </View>
            <Text className="text-xs text-slate-500 mt-1">
              {todayStats.caloriesGoal - todayStats.calories > 0
                ? `${todayStats.caloriesGoal - todayStats.calories} kcal remaining`
                : 'Goal reached!'}
            </Text>
          </View>

          {/* Macronutrients */}
          <View className="flex-row justify-between">
            {/* Protein */}
            <View className="flex-1 mr-2">
              <View className="flex-row justify-between mb-1">
                <Text className="text-slate-700 font-kmedium text-sm">Protein</Text>
                <Text className="text-slate-700 text-sm">{todayStats.protein}g</Text>
              </View>
              <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${calculateProgress(todayStats.protein, todayStats.proteinGoal)}%` }}
                />
              </View>
              <Text className="text-xs text-slate-500 mt-1">
                {todayStats.proteinGoal - todayStats.protein > 0
                  ? `${todayStats.proteinGoal - todayStats.protein}g left`
                  : 'Complete'}
              </Text>
            </View>

            {/* Carbs */}
            <View className="flex-1 mx-1">
              <View className="flex-row justify-between mb-1">
                <Text className="text-slate-700 font-kmedium text-sm">Carbs</Text>
                <Text className="text-slate-700 text-sm">{todayStats.carbs}g</Text>
              </View>
              <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${calculateProgress(todayStats.carbs, todayStats.carbsGoal)}%` }}
                />
              </View>
              <Text className="text-xs text-slate-500 mt-1">
                {todayStats.carbsGoal - todayStats.carbs > 0
                  ? `${todayStats.carbsGoal - todayStats.carbs}g left`
                  : 'Complete'}
              </Text>
            </View>

            {/* Fat */}
            <View className="flex-1 ml-2">
              <View className="flex-row justify-between mb-1">
                <Text className="text-slate-700 font-kmedium text-sm">Fat</Text>
                <Text className="text-slate-700 text-sm">{todayStats.fat}g</Text>
              </View>
              <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${calculateProgress(todayStats.fat, todayStats.fatGoal)}%` }}
                />
              </View>
              <Text className="text-xs text-slate-500 mt-1">
                {todayStats.fatGoal - todayStats.fat > 0
                  ? `${todayStats.fatGoal - todayStats.fat}g left`
                  : 'Complete'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="mt-4 bg-white py-3 rounded-xl flex-row justify-center items-center shadow-sm"
            onPress={navigateToTracking}
          >
            <Ionicons name="add-circle-outline" size={20} color="#3F836E" />
            <Text className="text-base font-kbold text-[#3F836E] ml-1">Log Food</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Meals */}
        <View className="px-5 mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-slate-800 text-lg font-kbold">Recommended For You</Text>
            <TouchableOpacity onPress={navigateToMealPlan}>
              <Text className="text-[#3F836E] font-kmedium">See All</Text>
            </TouchableOpacity>
          </View>

          {recommendedMeals.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="pb-2"
            >
              {recommendedMeals.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  className="mr-4 bg-white rounded-2xl shadow-sm overflow-hidden"
                  style={styles.mealCard}
                  onPress={() => navigateToMealDetail(meal.id)}
                >
                  <Image
                    source={{ uri: meal.image }}
                    className="w-full h-24 rounded-t-2xl"
                    defaultSource={{ uri: 'https://placehold.co/200x150' }}
                  />
                  <View className="p-3">
                    <Text className="text-slate-700 font-kbold" numberOfLines={2}>
                      {meal.name}
                    </Text>
                    <View className="flex-row items-center mt-2">
                      <View className="flex-row items-center mr-3">
                        <Ionicons name="flame-outline" size={14} color="#f97316" />
                        <Text className="text-slate-600 text-xs ml-1">{meal.calories} kcal</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={14} color="#64748b" />
                        <Text className="text-slate-600 text-xs ml-1">{meal.time}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View className="bg-slate-50 rounded-2xl p-4 items-center">
              <Ionicons name="restaurant-outline" size={40} color="#94a3b8" />
              <Text className="text-slate-500 font-kmedium mt-2">No meal plans yet</Text>
              <Text className="text-slate-400 text-sm text-center mt-1">
                Create your first meal plan to see recommendations
              </Text>
            </View>
          )}
        </View>

        {/* Water Tracking */}
        <View className="mx-5 mt-6 p-5 bg-blue-50 rounded-2xl mb-24">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-slate-800 text-lg font-kbold">Water Intake</Text>
              <Text className="text-slate-600 text-sm">
                {waterIntake.current} of {waterIntake.goal} glasses
              </Text>
            </View>
            <View className="w-12 h-12 justify-center items-center">
              <Ionicons name="water-outline" size={28} color="#3b82f6" />
            </View>
          </View>

          <View className="h-3 bg-white rounded-full overflow-hidden mt-3">
            <View
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${calculateProgress(waterIntake.current, waterIntake.goal)}%` }}
            />
          </View>

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              className="flex-1 mr-2 bg-white py-3 rounded-xl flex-row justify-center items-center"
              onPress={() => handleWaterLog(false)}
              disabled={waterIntake.current <= 0}
            >
              <Ionicons name="remove-outline" size={20} color="#3F836E" />
              <Text className="text-sm font-kbold text-[#3F836E] ml-1">Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 ml-2 bg-[#3F836E] py-3 rounded-xl flex-row justify-center items-center"
              onPress={() => handleWaterLog(true)}
            >
              <Ionicons name="add-outline" size={20} color="white" />
              <Text className="text-sm font-kbold text-white ml-1">Add Glass</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mealCard: {
    width: 200,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});