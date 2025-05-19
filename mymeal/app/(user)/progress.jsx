import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit'; // ✅ use this instead of recharts

const screenWidth = Dimensions.get("window").width;

export default function Progress() {
    const [activeTimeframe, setActiveTimeframe] = useState('week');
    const [activeMetric, setActiveMetric] = useState('weight');

    const weightData = [
        { name: 'Mon', value: 165 },
        { name: 'Tue', value: 164.5 },
        { name: 'Wed', value: 164.2 },
        { name: 'Thu', value: 163.7 },
        { name: 'Fri', value: 163.5 },
        { name: 'Sat', value: 163.3 },
        { name: 'Sun', value: 163 },
    ];

    const calorieData = [
        { name: 'Mon', value: 1950 },
        { name: 'Tue', value: 1850 },
        { name: 'Wed', value: 2100 },
        { name: 'Thu', value: 1750 },
        { name: 'Fri', value: 1900 },
        { name: 'Sat', value: 2200 },
        { name: 'Sun', value: 1800 },
    ];

    const proteinData = [
        { name: 'Mon', value: 110 },
        { name: 'Tue', value: 95 },
        { name: 'Wed', value: 120 },
        { name: 'Thu', value: 90 },
        { name: 'Fri', value: 105 },
        { name: 'Sat', value: 125 },
        { name: 'Sun', value: 100 },
    ];

    const getChartData = () => {
        switch (activeMetric) {
            case 'weight':
                return weightData;
            case 'calories':
                return calorieData;
            case 'protein':
                return proteinData;
            default:
                return weightData;
        }
    };

    const chartData = {
        labels: getChartData().map(item => item.name),
        datasets: [
            {
                data: getChartData().map(item => item.value),
                strokeWidth: 2,
            },
        ],
    };

    const chartConfig = {
        backgroundColor: "#fff",
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(63, 131, 110, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#3F836E",
        },
    };

    const TimeframePill = ({ title, value }) => (
        <TouchableOpacity
            className={`px-4 py-2 rounded-full ${activeTimeframe === value ? 'bg-[#3F836E]' : 'bg-slate-100'}`}
            onPress={() => setActiveTimeframe(value)}
        >
            <Text
                className={`text-sm font-kmedium ${activeTimeframe === value ? 'text-white' : 'text-slate-600'}`}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );

    const MetricButton = ({ title, value, icon }) => (
        <TouchableOpacity
            className={`flex-1 p-3 rounded-xl items-center ${activeMetric === value ? 'bg-[#3F836E]' : 'bg-slate-100'}`}
            onPress={() => setActiveMetric(value)}
        >
            <Ionicons
                name={icon}
                size={22}
                color={activeMetric === value ? 'white' : '#64748b'}
            />
            <Text
                className={`text-sm font-kmedium mt-1 ${activeMetric === value ? 'text-white' : 'text-slate-600'}`}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-5 pt-4 pb-2">
                    <Text className="text-slate-800 text-2xl font-kbold">Progress</Text>
                    <Text className="text-slate-500 text-base font-kregular">Track your health and fitness journey</Text>
                </View>

                {/* Timeframe */}
                <View className="px-5 mt-2">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
                        <View className="flex-row space-x-2 py-2">
                            <TimeframePill title="Week" value="week" />
                            <TimeframePill title="Month" value="month" />
                            <TimeframePill title="3 Months" value="3months" />
                            <TimeframePill title="Year" value="year" />
                            <TimeframePill title="All Time" value="all" />
                        </View>
                    </ScrollView>
                </View>

                {/* Metric Buttons */}
                <View className="px-5 mt-3 flex-row space-x-3">
                    <MetricButton title="Weight" value="weight" icon="scale-outline" />
                    <MetricButton title="Calories" value="calories" icon="flame-outline" />
                    <MetricButton title="Protein" value="protein" icon="fitness-outline" />
                </View>

                {/* Chart */}
                <View className="mx-5 mt-6 p-5 bg-slate-50 rounded-2xl">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-slate-800 text-lg font-kbold">
                            {activeMetric === 'weight' ? 'Weight Trend' :
                                activeMetric === 'calories' ? 'Calorie Intake' : 'Protein Intake'}
                        </Text>
                        <View className="flex-row items-center">
                            <Text className="text-slate-500 text-sm font-kmedium">
                                {activeMetric === 'weight' ? '-2 lbs' :
                                    activeMetric === 'calories' ? 'Avg: 1936 kcal' : 'Avg: 106g'}
                            </Text>
                            <Ionicons
                                name={activeMetric === 'weight' ? 'arrow-down-outline' : 'analytics-outline'}
                                size={16}
                                color={activeMetric === 'weight' ? '#3F836E' : '#64748b'}
                                style={{ marginLeft: 4 }}
                            />
                        </View>
                    </View>

                    <LineChart
                        data={chartData}
                        width={screenWidth - 60}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={{ borderRadius: 16 }}
                    />
                </View>

                {/* Rest of your stats cards (unchanged) */}
                {/* ... */}
            </ScrollView>
        </SafeAreaView>
    );
}
