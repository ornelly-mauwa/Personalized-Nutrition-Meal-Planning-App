import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, COLORS } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';

const MOCK_CLIENTS = [
    {
        id: '1',
        name: 'Emma Wilson',
        photo: require('../../assets/images/placeholder-profile.png'),
        progress: {
            weight: [81, 80, 79, 78, 77.5, 77],
            bodyFat: [24, 23.5, 23, 22.6, 22.4, 22],
            dates: ['Apr 12', 'Apr 19', 'Apr 26', 'May 3', 'May 10', 'May 17']
        }
    },
    {
        id: '2',
        name: 'Michael Taylor',
        photo: require('../../assets/images/placeholder-profile.png'),
        progress: {
            weight: [92, 91, 90.5, 89, 88, 87],
            bodyFat: [28, 27.5, 27, 26.5, 26, 25.5],
            dates: ['Apr 12', 'Apr 19', 'Apr 26', 'May 3', 'May 10', 'May 17']
        }
    },
    {
        id: '3',
        name: 'Sophia Chen',
        photo: require('../../assets/images/placeholder-profile.png'),
        progress: {
            weight: [65, 64.5, 64, 63.5, 63, 62.5],
            bodyFat: [22, 21.5, 21, 20.8, 20.5, 20.2],
            dates: ['Apr 12', 'Apr 19', 'Apr 26', 'May 3', 'May 10', 'May 17']
        }
    }
];

const ProgressTracking = () => {
    const { userInfo } = useGlobalContext();
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeMetric, setActiveMetric] = useState('weight');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setTimeout(() => {
                    setClients(MOCK_CLIENTS);
                    setSelectedClient(MOCK_CLIENTS[0]);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Failed to fetch clients:", error);
                setIsLoading(false);
            }
        };

        fetchClients();
    }, []);

    const screenWidth = Dimensions.get("window").width - 48;

    const progressChartData = selectedClient ? {
        labels: selectedClient.progress.dates,
        datasets: [
            {
                data: activeMetric === 'weight'
                    ? selectedClient.progress.weight
                    : selectedClient.progress.bodyFat,
                strokeWidth: 2
            }
        ]
    } : null;

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text className="mt-4 font-kmedium text-gray-600">Loading client progress...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ headerShown: false }} />

            <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-100">
                <View>
                    <Text className="font-kbold text-2xl text-gray-800">Progress Tracking</Text>
                    <Text className="font-kregular text-sm text-gray-500">Monitor your clients' progress</Text>
                </View>
                <TouchableOpacity>
                    <Image source={icons.notification} className="w-6 h-6" resizeMode="contain" />
                </TouchableOpacity>
            </View>

            <View className="px-6 py-4">
                <Text className="font-kbold text-lg text-gray-800 mb-2">Select Client</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
                    {clients.map((client) => (
                        <TouchableOpacity
                            key={client.id}
                            onPress={() => setSelectedClient(client)}
                            className={`mr-4 items-center ${selectedClient?.id === client.id ? 'opacity-100' : 'opacity-60'}`}
                        >
                            <View className={`w-16 h-16 rounded-full overflow-hidden border-2 ${selectedClient?.id === client.id ? 'border-green-500' : 'border-gray-200'}`}>
                                <Image source={client.photo} className="w-full h-full" resizeMode="cover" />
                            </View>
                            <Text className="font-kmedium text-xs mt-1 text-center">{client.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {selectedClient && (
                <ScrollView className="flex-1 px-6">
                    <View className="mt-2 bg-white rounded-xl p-4 shadow-sm">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="font-kbold text-lg text-gray-800">Progress Chart</Text>
                            <View className="flex-row bg-gray-100 rounded-lg overflow-hidden">
                                <TouchableOpacity
                                    onPress={() => setActiveMetric('weight')}
                                    className={`px-4 py-2 ${activeMetric === 'weight' ? 'bg-green-500' : ''}`}
                                >
                                    <Text className={`font-kmedium text-xs ${activeMetric === 'weight' ? 'text-white' : 'text-gray-600'}`}>Weight</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setActiveMetric('bodyFat')}
                                    className={`px-4 py-2 ${activeMetric === 'bodyFat' ? 'bg-green-500' : ''}`}
                                >
                                    <Text className={`font-kmedium text-xs ${activeMetric === 'bodyFat' ? 'text-white' : 'text-gray-600'}`}>Body Fat %</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <LineChart
                            data={progressChartData}
                            width={screenWidth}
                            height={220}
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                decimalPlaces: 1,
                                color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                propsForDots: {
                                    r: '4',
                                    strokeWidth: '2',
                                    stroke: '#22c55e'
                                }
                            }}
                            bezier
                            style={{ borderRadius: 16 }}
                        />

                        <View className="mt-4 flex-row justify-between">
                            <View>
                                <Text className="font-kregular text-xs text-gray-500">Starting</Text>
                                <Text className="font-kbold text-lg text-gray-800">
                                    {activeMetric === 'weight'
                                        ? `${selectedClient.progress.weight[0]} kg`
                                        : `${selectedClient.progress.bodyFat[0]}%`}
                                </Text>
                            </View>
                            <View>
                                <Text className="font-kregular text-xs text-gray-500">Current</Text>
                                <Text className="font-kbold text-lg text-gray-800">
                                    {activeMetric === 'weight'
                                        ? `${selectedClient.progress.weight.at(-1)} kg`
                                        : `${selectedClient.progress.bodyFat.at(-1)}%`}
                                </Text>
                            </View>
                            <View>
                                <Text className="font-kregular text-xs text-gray-500">Change</Text>
                                <Text className="font-kbold text-lg text-green-500">
                                    {activeMetric === 'weight'
                                        ? `${(selectedClient.progress.weight[0] - selectedClient.progress.weight.at(-1)).toFixed(1)} kg`
                                        : `${(selectedClient.progress.bodyFat[0] - selectedClient.progress.bodyFat.at(-1)).toFixed(1)}%`}
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default ProgressTracking;
