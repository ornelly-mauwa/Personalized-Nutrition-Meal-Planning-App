import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Home() {
  const [userName, setUserName] = useState('Sarah');
  const [todayStats, setTodayStats] = useState({
    calories: 1250,
    caloriesGoal: 2000,
    protein: 45,
    proteinGoal: 120,
    carbs: 95,
    carbsGoal: 180,
    fat: 42,
    fatGoal: 65,
  });

  const [recommendedMeals, setRecommendedMeals] = useState([
    {
      id: '1',
      name: 'Greek Yogurt Bowl',
      image: 'https://placehold.co/200x150',
      calories: 320,
      protein: 24,
      time: '10 min',
      type: 'breakfast'
    },
    {
      id: '2',
      name: 'Chicken & Quinoa Salad',
      image: 'https://placehold.co/200x150',
      calories: 450,
      protein: 38,
      time: '15 min',
      type: 'lunch'
    },
    {
      id: '3',
      name: 'Grilled Salmon',
      image: 'https://placehold.co/200x150',
      calories: 380,
      protein: 42,
      time: '25 min',
      type: 'dinner'
    },
  ]);

  const calculateProgress = (current, goal) => {
    return (current / goal) * 100;
  };

  const navigateToMealDetail = (mealId) => {
    router.push(`/meal-plan/${mealId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2 flex-row justify-between items-center">
          <View>
            <Text className="text-slate-500 text-base font-kregular">Welcome back</Text>
            <Text className="text-slate-800 text-2xl font-kbold">{userName}</Text>
          </View>
          <TouchableOpacity
            className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center"
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="notifications-outline" size={22} color="#3F836E" />
          </TouchableOpacity>
        </View>

        {/* Today's progress */}
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

        {/* Recommended Meals */}
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
                  source={{ uri: meal.image }}
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

        {/* Water Tracking */}
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});