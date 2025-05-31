import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Switch,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock data for foods/recipes
const FOOD_DATABASE = [
    { id: '1', name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'protein' },
    { id: '2', name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8, category: 'carbs' },
    { id: '3', name: 'Avocado', calories: 234, protein: 2.9, carbs: 12, fat: 21, category: 'fat' },
    { id: '4', name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6, category: 'vegetable' },
    { id: '5', name: 'Sweet Potato', calories: 112, protein: 2, carbs: 26, fat: 0.1, category: 'carbs' },
    { id: '6', name: 'Salmon Fillet', calories: 206, protein: 22, carbs: 0, fat: 13, category: 'protein' },
    { id: '7', name: 'Quinoa', calories: 222, protein: 8, carbs: 39, fat: 3.6, category: 'carbs' },
    { id: '8', name: 'Greek Yogurt', calories: 100, protein: 10, carbs: 4, fat: 2.5, category: 'protein' },
];

// Mock client data
const CLIENTS = [
    { id: '1', name: 'Sarah Johnson', age: 28, goals: 'Weight loss, muscle toning' },
    { id: '2', name: 'Michael Chen', age: 35, goals: 'Diabetes management' },
    { id: '3', name: 'Emily Rodriguez', age: 42, goals: 'Athletic performance' },
    { id: '4', name: 'David Lee', age: 31, goals: 'Muscle gain' },
];

const MealPlanCreate = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Plan metadata
    const [planTitle, setPlanTitle] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedDuration, setSelectedDuration] = useState(7); // days
    const [planNotes, setPlanNotes] = useState('');
    const [isTemplate, setIsTemplate] = useState(false);

    // Search and filtering
    const [showClientSelector, setShowClientSelector] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFoodSelector, setShowFoodSelector] = useState(false);
    const [currentMealIndex, setCurrentMealIndex] = useState(0);
    const [currentDayIndex, setCurrentDayIndex] = useState(0);

    // Plan structure - adapted for Sequelize models
    const [mealPlan, setMealPlan] = useState([
        {
            dayOfWeek: 'Monday',
            meals: [
                { mealType: 'breakfast', name: '', calories: 0, protein: 0, carbs: 0, fats: 0, foods: [] },
                { mealType: 'lunch', name: '', calories: 0, protein: 0, carbs: 0, fats: 0, foods: [] },
                { mealType: 'dinner', name: '', calories: 0, protein: 0, carbs: 0, fats: 0, foods: [] },
                { mealType: 'snacks', name: '', calories: 0, protein: 0, carbs: 0, fats: 0, foods: [] },
            ]
        }
    ]);

    // Days of week for meal plan
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Generate empty days based on selected duration
    useEffect(() => {
        const newMealPlan = Array(selectedDuration).fill().map((_, index) => {
            // Keep existing data if available
            if (mealPlan[index]) {
                return mealPlan[index];
            }

            // Create new day
            return {
                dayOfWeek: daysOfWeek[index % 7],
                meals: [
                    { mealType: 'breakfast', name: '', calories: 0, protein: 0, carbs: 0, fats: 0, foods: [] },
                    { mealType: 'lunch', name: '', calories: 0, protein: 0, carbs: 0, fats: 0, foods: [] },
                    { mealType: 'dinner', name: '', calories: 0, protein: 0, carbs: 0, fats: 0, foods: [] },
                    { mealType: 'snacks', name: '', calories: 0, protein: 0, carbs: 0, fats: 0, foods: [] },
                ]
            };
        });

        setMealPlan(newMealPlan);
    }, [selectedDuration]);

    // Set end date based on start date and duration
    useEffect(() => {
        if (startDate && selectedDuration) {
            const start = new Date(startDate);
            const end = new Date(start);
            end.setDate(start.getDate() + selectedDuration - 1);
            setEndDate(end.toISOString().split('T')[0]);
        }
    }, [startDate, selectedDuration]);

    // Filter foods based on search and category
    const filteredFoods = FOOD_DATABASE.filter(food => {
        const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Calculate nutritional totals for a meal
    const calculateMealNutrition = (foods) => {
        return foods.reduce((totals, food) => {
            return {
                calories: totals.calories + food.calories,
                protein: totals.protein + food.protein,
                carbs: totals.carbs + food.carbs,
                fat: totals.fat + food.fat
            };
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    };

    // Calculate day totals
    const calculateDayNutrition = (day) => {
        const allFoods = day.meals.flatMap(meal => meal.foods);
        return calculateMealNutrition(allFoods);
    };

    // Add food to a specific meal and update meal totals
    const addFoodToMeal = (food) => {
        const updatedMealPlan = [...mealPlan];
        const currentMeal = updatedMealPlan[currentDayIndex].meals[currentMealIndex];

        // Add food to the foods array
        currentMeal.foods.push(food);

        // Update meal totals
        const mealNutrition = calculateMealNutrition(currentMeal.foods);
        currentMeal.calories = mealNutrition.calories;
        currentMeal.protein = mealNutrition.protein;
        currentMeal.carbs = mealNutrition.carbs;
        currentMeal.fats = mealNutrition.fat;

        // Generate meal name if empty
        if (!currentMeal.name) {
            currentMeal.name = `${currentMeal.mealType.charAt(0).toUpperCase() + currentMeal.mealType.slice(1)} - ${updatedMealPlan[currentDayIndex].dayOfWeek}`;
        }

        setMealPlan(updatedMealPlan);
        setShowFoodSelector(false);
    };

    // Remove food from a meal and update totals
    const removeFood = (dayIndex, mealIndex, foodIndex) => {
        const updatedMealPlan = [...mealPlan];
        const currentMeal = updatedMealPlan[dayIndex].meals[mealIndex];

        // Remove food
        currentMeal.foods.splice(foodIndex, 1);

        // Update meal totals
        const mealNutrition = calculateMealNutrition(currentMeal.foods);
        currentMeal.calories = mealNutrition.calories;
        currentMeal.protein = mealNutrition.protein;
        currentMeal.carbs = mealNutrition.carbs;
        currentMeal.fats = mealNutrition.fat;

        setMealPlan(updatedMealPlan);
    };

    // Open food selector for a specific meal
    const openFoodSelector = (dayIndex, mealIndex) => {
        setCurrentDayIndex(dayIndex);
        setCurrentMealIndex(mealIndex);
        setShowFoodSelector(true);
    };

    // Handle client selection
    const selectClient = (client) => {
        setSelectedClient(client);
        setShowClientSelector(false);
    };

    // Prepare data for Sequelize models
    const prepareMealPlanData = () => {
        // MealPlan data
        const mealPlanData = {
            startDate: startDate,
            endDate: endDate,
            // Add client relationship if needed
            ...(selectedClient && { clientId: selectedClient.id })
        };

        // Meals data
        const mealsData = [];
        mealPlan.forEach(day => {
            day.meals.forEach(meal => {
                if (meal.foods.length > 0) { // Only save meals with foods
                    mealsData.push({
                        dayOfWeek: day.dayOfWeek,
                        mealType: meal.mealType,
                        name: meal.name || `${meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)} - ${day.dayOfWeek}`,
                        calories: meal.calories,
                        protein: meal.protein,
                        carbs: meal.carbs,
                        fats: meal.fats,
                    });
                }
            });
        });

        return { mealPlanData, mealsData };
    };

    // Handle plan saving
    const saveMealPlan = () => {
        // Validate required fields
        if (!planTitle) {
            Alert.alert('Missing Information', 'Please provide a title for the meal plan.');
            return;
        }

        if (!startDate) {
            Alert.alert('Missing Information', 'Please provide a start date for the meal plan.');
            return;
        }

        if (!selectedClient && !isTemplate) {
            Alert.alert('Missing Information', 'Please select a client for this meal plan.');
            return;
        }

        // Check if at least one meal has foods
        const hasAnyMeals = mealPlan.some(day =>
            day.meals.some(meal => meal.foods.length > 0)
        );

        if (!hasAnyMeals) {
            Alert.alert('Missing Information', 'Please add at least one meal to the plan.');
            return;
        }

        setSaving(true);

        // Prepare data for backend
        const { mealPlanData, mealsData } = prepareMealPlanData();

        console.log('MealPlan Data:', mealPlanData);
        console.log('Meals Data:', mealsData);

        // Here you would make API calls to create the meal plan and meals
        // Example:
        // 1. Create MealPlan record
        // 2. Create Meal records with mealPlanId foreign key

        // Simulate API call
        setTimeout(() => {
            setSaving(false);
            Alert.alert(
                'Success',
                `Meal plan "${planTitle}" has been ${isTemplate ? 'saved as a template' : 'assigned to ' + selectedClient.name}.`,
                [
                    { text: 'OK', onPress: () => router.push('/meal-planner/index') }
                ]
            );
        }, 1500);
    };

    // Render a single day's meal plan
    const renderDay = (day, index) => (
        <View style={styles.dayContainer} key={`day-${index}`}>
            <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{day.dayOfWeek}</Text>
                <View style={styles.nutritionSummary}>
                    <Text style={styles.summaryText}>
                        Calories: {calculateDayNutrition(day).calories} |
                        P: {calculateDayNutrition(day).protein}g |
                        C: {calculateDayNutrition(day).carbs}g |
                        F: {calculateDayNutrition(day).fat}g
                    </Text>
                </View>
            </View>

            {day.meals.map((meal, mealIndex) => (
                <View key={`meal-${index}-${mealIndex}`} style={styles.mealContainer}>
                    <Text style={styles.mealTitle}>
                        {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                    </Text>

                    {meal.foods.length > 0 ? (
                        <>
                            {meal.foods.map((food, foodIndex) => (
                                <View key={`food-${index}-${mealIndex}-${foodIndex}`} style={styles.foodItem}>
                                    <Text style={styles.foodName}>{food.name}</Text>
                                    <Text style={styles.foodNutrition}>
                                        {food.calories} cal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => removeFood(index, mealIndex, foodIndex)}
                                    >
                                        <Ionicons name="close-circle" size={18} color="#e53e3e" />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            <View style={styles.mealNutrition}>
                                <Text style={styles.mealNutritionText}>
                                    Total: {meal.calories} calories | P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g
                                </Text>
                            </View>
                        </>
                    ) : (
                        <Text style={styles.emptyMealText}>No foods added</Text>
                    )}

                    <TouchableOpacity
                        style={styles.addFoodButton}
                        onPress={() => openFoodSelector(index, mealIndex)}
                    >
                        <Ionicons name="add-circle-outline" size={18} color="#3F836E" />
                        <Text style={styles.addFoodText}>Add Food</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Create Meal Plan</Text>
                </View>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveMealPlan}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Plan</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Plan Settings */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Plan Settings</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Plan Title</Text>
                        <TextInput
                            style={styles.textInput}
                            value={planTitle}
                            onChangeText={setPlanTitle}
                            placeholder="Enter plan title"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Start Date</Text>
                        <TextInput
                            style={styles.textInput}
                            value={startDate}
                            onChangeText={setStartDate}
                            placeholder="YYYY-MM-DD"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>End Date</Text>
                        <TextInput
                            style={[styles.textInput, { backgroundColor: '#F7FAFC' }]}
                            value={endDate}
                            editable={false}
                            placeholder="Auto-calculated"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Client</Text>
                        {selectedClient ? (
                            <TouchableOpacity
                                style={styles.clientSelector}
                                onPress={() => setShowClientSelector(true)}
                            >
                                <Text style={styles.selectedClientText}>{selectedClient.name}</Text>
                                <Ionicons name="chevron-down" size={20} color="#3F836E" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.clientSelector}
                                onPress={() => setShowClientSelector(true)}
                            >
                                <Text style={styles.placeholderText}>Select client</Text>
                                <Ionicons name="chevron-down" size={20} color="#3F836E" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Duration (days)</Text>
                        <View style={styles.durationSelector}>
                            {[3, 7, 14, 28].map(days => (
                                <TouchableOpacity
                                    key={`duration-${days}`}
                                    style={[
                                        styles.durationOption,
                                        selectedDuration === days && styles.selectedDuration
                                    ]}
                                    onPress={() => setSelectedDuration(days)}
                                >
                                    <Text style={[
                                        styles.durationText,
                                        selectedDuration === days && styles.selectedDurationText
                                    ]}>
                                        {days}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Notes</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            value={planNotes}
                            onChangeText={setPlanNotes}
                            placeholder="Add notes about this meal plan"
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.switchContainer}>
                            <Text style={styles.inputLabel}>Save as template</Text>
                            <Switch
                                value={isTemplate}
                                onValueChange={setIsTemplate}
                                trackColor={{ false: '#D1D5DB', true: '#9dcfc1' }}
                                thumbColor={isTemplate ? '#3F836E' : '#f4f3f4'}
                            />
                        </View>
                        {isTemplate && (
                            <Text style={styles.helperText}>
                                This plan will be saved as a template and can be used for multiple clients.
                            </Text>
                        )}
                    </View>
                </View>

                {/* Meal Plan Content */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Meal Plan</Text>

                    {mealPlan.map((day, index) => renderDay(day, index))}
                </View>
            </ScrollView>

            {/* Client Selector Modal */}
            {showClientSelector && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Client</Text>
                            <TouchableOpacity onPress={() => setShowClientSelector(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={CLIENTS}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.clientItem}
                                    onPress={() => selectClient(item)}
                                >
                                    <View>
                                        <Text style={styles.clientName}>{item.name}</Text>
                                        <Text style={styles.clientDetails}>
                                            Age: {item.age} | Goals: {item.goals}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#3F836E" />
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            )}

            {/* Food Selector Modal */}
            {showFoodSelector && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Food</Text>
                            <TouchableOpacity onPress={() => setShowFoodSelector(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="#6B7280" />
                            <TextInput
                                style={styles.searchInput}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Search foods..."
                            />
                        </View>

                        <View style={styles.categoryFilter}>
                            {['all', 'protein', 'carbs', 'fat', 'vegetable'].map(category => (
                                <TouchableOpacity
                                    key={`category-${category}`}
                                    style={[
                                        styles.categoryOption,
                                        selectedCategory === category && styles.selectedCategory
                                    ]}
                                    onPress={() => setSelectedCategory(category)}
                                >
                                    <Text style={[
                                        styles.categoryText,
                                        selectedCategory === category && styles.selectedCategoryText
                                    ]}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <FlatList
                            data={filteredFoods}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.foodSelectorItem}
                                    onPress={() => addFoodToMeal(item)}
                                >
                                    <View>
                                        <Text style={styles.foodSelectorName}>{item.name}</Text>
                                        <Text style={styles.foodSelectorNutrition}>
                                            {item.calories} cal | P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                                        </Text>
                                    </View>
                                    <Ionicons name="add-circle" size={24} color="#3F836E" />
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyResultsText}>No foods match your search</Text>
                            }
                        />
                    </View>
                </View>
            )}
        </View>
    );

};

// Complete StyleSheet for the MealPlanCreate component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A202C',
        fontFamily: 'kbold',
    },
    saveButton: {
        backgroundColor: '#3F836E',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'kbold',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    sectionContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A202C',
        marginBottom: 16,
        fontFamily: 'kbold',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4A5568',
        marginBottom: 8,
        fontFamily: 'kregular',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        fontFamily: 'kregular',
    },
    textArea: {
        height: 80,
    },
    clientSelector: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    selectedClientText: {
        fontSize: 16,
        color: '#1A202C',
        fontFamily: 'kregular',
    },
    placeholderText: {
        fontSize: 16,
        color: '#A0AEC0',
        fontFamily: 'kregular',
    },
    durationSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    durationOption: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginHorizontal: 4,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
    },
    selectedDuration: {
        backgroundColor: '#f0faf8',
        borderColor: '#3F836E',
    },
    durationText: {
        fontSize: 16,
        color: '#4A5568',
        fontFamily: 'kregular',
    },
    selectedDurationText: {
        color: '#3F836E',
        fontWeight: '500',
        fontFamily: 'kbold',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    helperText: {
        fontSize: 12,
        color: '#718096',
        marginTop: 4,
        fontFamily: 'kregular',
        fontStyle: 'italic',
    },
    dayContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    dayHeader: {
        backgroundColor: '#f0faf8',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    dayTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3F836E',
        fontFamily: 'kbold',
    },
    nutritionSummary: {
        marginTop: 4,
    },
    summaryText: {
        fontSize: 12,
        color: '#4A5568',
        fontFamily: 'kregular',
    },
    mealContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    mealTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1A202C',
        marginBottom: 8,
        fontFamily: 'kbold',
    },
    foodItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: '#F7FAFC',
        borderRadius: 6,
        marginBottom: 8,
    },
    foodName: {
        fontSize: 14,
        color: '#1A202C',
        flex: 1,
        fontFamily: 'kregular',
    },
    foodNutrition: {
        fontSize: 12,
        color: '#718096',
        marginLeft: 8,
        fontFamily: 'kregular',
    },
    removeButton: {
        padding: 4,
        marginLeft: 8,
    },
    mealNutrition: {
        backgroundColor: '#EDF2F7',
        padding: 8,
        borderRadius: 6,
        marginTop: 8,
    },
    mealNutritionText: {
        fontSize: 12,
        color: '#4A5568',
        fontWeight: '500',
        fontFamily: 'kbold',
    },
    emptyMealText: {
        fontSize: 14,
        color: '#A0AEC0',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 12,
        fontFamily: 'kregular',
    },
    addFoodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f0faf8',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#3F836E',
        borderStyle: 'dashed',
        marginTop: 8,
    },
    addFoodText: {
        fontSize: 14,
        color: '#3F836E',
        marginLeft: 6,
        fontWeight: '500',
        fontFamily: 'kbold',
    },
    // Modal styles
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        margin: 20,
        maxHeight: '80%',
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A202C',
        fontFamily: 'kbold',
    },
    // Client selector modal styles
    clientItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F7FAFC',
    },
    clientName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1A202C',
        fontFamily: 'kbold',
    },
    clientDetails: {
        fontSize: 14,
        color: '#718096',
        marginTop: 2,
        fontFamily: 'kregular',
    },
    // Food selector modal styles
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        backgroundColor: '#F7FAFC',
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#1A202C',
        fontFamily: 'kregular',
    },
    categoryFilter: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    categoryOption: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: '#F7FAFC',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    selectedCategory: {
        backgroundColor: '#f0faf8',
        borderColor: '#3F836E',
    },
    categoryText: {
        fontSize: 12,
        color: '#4A5568',
        fontWeight: '500',
        fontFamily: 'kregular',
    },
    selectedCategoryText: {
        color: '#3F836E',
        fontFamily: 'kbold',
    },
    foodSelectorItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F7FAFC',
    },
    foodSelectorName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1A202C',
        fontFamily: 'kbold',
    },
    foodSelectorNutrition: {
        fontSize: 14,
        color: '#718096',
        marginTop: 2,
        fontFamily: 'kregular',
    },
    emptyResultsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#A0AEC0',
        paddingVertical: 32,
        fontFamily: 'kregular',
        fontStyle: 'italic',
    },
});

export default MealPlanCreate;