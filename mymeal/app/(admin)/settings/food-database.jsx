import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Card, Divider, Button, Menu, Checkbox } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Sample food data - in a real app, you would fetch this from an API
const sampleFoodData = [
    { id: '1', name: 'Apple', category: 'Fruits', calories: '52', protein: '0.3', carbs: '14', fat: '0.2', status: 'Active' },
    { id: '2', name: 'Chicken Breast', category: 'Meat', calories: '165', protein: '31', carbs: '0', fat: '3.6', status: 'Active' },
    { id: '3', name: 'Brown Rice', category: 'Grains', calories: '112', protein: '2.6', carbs: '24', fat: '0.8', status: 'Active' },
    { id: '4', name: 'Spinach', category: 'Vegetables', calories: '23', protein: '2.9', carbs: '3.6', fat: '0.4', status: 'Active' },
    { id: '5', name: 'Salmon', category: 'Fish', calories: '208', protein: '20', carbs: '0', fat: '13', status: 'Active' },
    { id: '6', name: 'Greek Yogurt', category: 'Dairy', calories: '59', protein: '10', carbs: '3.6', fat: '0.4', status: 'Active' },
    { id: '7', name: 'Avocado', category: 'Fruits', calories: '160', protein: '2', carbs: '8.5', fat: '14.7', status: 'Active' },
    { id: '8', name: 'Olive Oil', category: 'Oils', calories: '884', protein: '0', carbs: '0', fat: '100', status: 'Active' },
    { id: '9', name: 'Quinoa', category: 'Grains', calories: '120', protein: '4.4', carbs: '21.3', fat: '1.9', status: 'Active' },
    { id: '10', name: 'Almonds', category: 'Nuts', calories: '579', protein: '21.2', carbs: '21.7', fat: '49.9', status: 'Pending' },
];

// Food categories
const categories = [
    'All Categories',
    'Fruits',
    'Vegetables',
    'Meat',
    'Fish',
    'Dairy',
    'Grains',
    'Nuts',
    'Oils',
    'Other'
];

const FoodDatabase = () => {
    const router = useRouter();
    const [foodData, setFoodData] = useState(sampleFoodData);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isCategoryMenuVisible, setIsCategoryMenuVisible] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    // New food item form state
    const [newFoodItem, setNewFoodItem] = useState({
        name: '',
        category: 'Fruits',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        status: 'Active'
    });

    // Handle search
    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    // Filter foods based on search and category
    const filteredFoods = foodData.filter(food => {
        const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All Categories' || food.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Toggle item selection
    const toggleItemSelection = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    // Handle adding new food item
    const handleAddFood = () => {
        // Basic validation
        if (!newFoodItem.name.trim() || !newFoodItem.calories.trim()) {
            Alert.alert('Validation Error', 'Please enter at least the food name and calories.');
            return;
        }

        const newItem = {
            id: (foodData.length + 1).toString(),
            ...newFoodItem
        };

        setFoodData([newItem, ...foodData]);

        // Reset form
        setNewFoodItem({
            name: '',
            category: 'Fruits',
            calories: '',
            protein: '',
            carbs: '',
            fat: '',
            status: 'Active'
        });

        setIsAddModalVisible(false);
        Alert.alert('Success', `${newItem.name} has been added to the database.`);
    };

    // Handle deleting selected items
    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) {
            return;
        }

        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to delete ${selectedItems.length} selected item(s)?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        const updatedData = foodData.filter(item => !selectedItems.includes(item.id));
                        setFoodData(updatedData);
                        setSelectedItems([]);
                        Alert.alert('Success', 'Selected items have been deleted.');
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    // Handle bulk status change
    const handleBulkStatusChange = (newStatus) => {
        if (selectedItems.length === 0) {
            return;
        }

        const updatedData = foodData.map(item => {
            if (selectedItems.includes(item.id)) {
                return { ...item, status: newStatus };
            }
            return item;
        });

        setFoodData(updatedData);
        Alert.alert('Success', `Status updated for ${selectedItems.length} item(s).`);
        setSelectedItems([]);
    };

    // Render food item
    const renderFoodItem = ({ item }) => {
        const isSelected = selectedItems.includes(item.id);

        return (
            <TouchableOpacity
                onPress={() => toggleItemSelection(item.id)}
                style={[styles.foodItemContainer, isSelected && styles.selectedItem]}
            >
                <View style={styles.foodItemCheckbox}>
                    <Checkbox
                        status={isSelected ? 'checked' : 'unchecked'}
                        onPress={() => toggleItemSelection(item.id)}
                        color="#3F836E"
                    />
                </View>
                <View style={styles.foodItemContent}>
                    <View style={styles.foodNameRow}>
                        <Text style={styles.foodName}>{item.name}</Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: item.status === 'Active' ? '#e6fffa' : '#fef3c7' }
                        ]}>
                            <Text style={[
                                styles.statusText,
                                { color: item.status === 'Active' ? '#3F836E' : '#d97706' }
                            ]}>
                                {item.status}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.categoryText}>{item.category}</Text>
                    <View style={styles.nutrientsContainer}>
                        <View style={styles.nutrientItem}>
                            <Text style={styles.nutrientValue}>{item.calories}</Text>
                            <Text style={styles.nutrientLabel}>Calories</Text>
                        </View>
                        <View style={styles.nutrientItem}>
                            <Text style={styles.nutrientValue}>{item.protein}g</Text>
                            <Text style={styles.nutrientLabel}>Protein</Text>
                        </View>
                        <View style={styles.nutrientItem}>
                            <Text style={styles.nutrientValue}>{item.carbs}g</Text>
                            <Text style={styles.nutrientLabel}>Carbs</Text>
                        </View>
                        <View style={styles.nutrientItem}>
                            <Text style={styles.nutrientValue}>{item.fat}g</Text>
                            <Text style={styles.nutrientLabel}>Fat</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => Alert.alert('Edit', `Edit ${item.name}`)}
                >
                    <Ionicons name="create-outline" size={18} color="#3F836E" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Food Database Management</Text>
                    <Text style={styles.headerSubtitle}>Manage and organize food items for meal plans</Text>
                </View>

                {/* Actions Bar */}
                <View style={styles.actionsBar}>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search-outline" size={20} color="#718096" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search food items..."
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>

                    <View style={styles.actionsRight}>
                        <TouchableOpacity
                            style={styles.categoryFilterButton}
                            onPress={() => setIsCategoryMenuVisible(true)}
                        >
                            <Text style={styles.categoryFilterText}>{selectedCategory}</Text>
                            <Ionicons name="chevron-down-outline" size={16} color="#3F836E" />
                        </TouchableOpacity>

                        <Menu
                            visible={isCategoryMenuVisible}
                            onDismiss={() => setIsCategoryMenuVisible(false)}
                            anchor={<View />}
                            style={styles.categoryMenu}
                        >
                            {categories.map((category, index) => (
                                <Menu.Item
                                    key={index}
                                    onPress={() => {
                                        setSelectedCategory(category);
                                        setIsCategoryMenuVisible(false);
                                    }}
                                    title={category}
                                    titleStyle={selectedCategory === category ? styles.selectedCategoryText : null}
                                />
                            ))}
                        </Menu>

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => setIsAddModalVisible(true)}
                        >
                            <Ionicons name="add-outline" size={20} color="#fff" />
                            <Text style={styles.addButtonText}>Add Food</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Selected items actions */}
                {selectedItems.length > 0 && (
                    <View style={styles.selectedItemsBar}>
                        <Text style={styles.selectedItemsText}>{selectedItems.length} items selected</Text>
                        <View style={styles.selectedItemsActions}>
                            <TouchableOpacity
                                style={styles.bulkActionButton}
                                onPress={() => handleBulkStatusChange('Active')}
                            >
                                <Text style={styles.bulkActionText}>Set Active</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.bulkActionButton}
                                onPress={() => handleBulkStatusChange('Pending')}
                            >
                                <Text style={styles.bulkActionText}>Set Pending</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.bulkActionButton, styles.deleteButton]}
                                onPress={handleDeleteSelected}
                            >
                                <Ionicons name="trash-outline" size={16} color="#ef4444" />
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Food items list */}
                <View style={styles.listContainer}>
                    <Card style={styles.listCard}>
                        <FlatList
                            data={filteredFoods}
                            renderItem={renderFoodItem}
                            keyExtractor={item => item.id}
                            ItemSeparatorComponent={() => <Divider style={styles.divider} />}
                            contentContainerStyle={styles.listContent}
                            scrollEnabled={false} // Disable FlatList's own scrolling
                            nestedScrollEnabled={true}
                        />
                    </Card>
                </View>

                {/* Add Food Modal */}
                {isAddModalVisible && (
                    <View style={styles.modalOverlay}>
                        <Card style={styles.modalCard}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Add New Food Item</Text>
                                <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                                    <Ionicons name="close-outline" size={24} color="#2d3748" />
                                </TouchableOpacity>
                            </View>
                            <Divider style={styles.divider} />

                            <ScrollView style={styles.modalContent}>
                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Food Name *</Text>
                                    <TextInput
                                        style={styles.formInput}
                                        value={newFoodItem.name}
                                        onChangeText={(text) => setNewFoodItem({ ...newFoodItem, name: text })}
                                        placeholder="Enter food name"
                                    />
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Category</Text>
                                    <TouchableOpacity
                                        style={styles.categorySelector}
                                        onPress={() => Alert.alert('Category', 'Category selector would open here')}
                                    >
                                        <Text style={styles.categorySelectorText}>{newFoodItem.category}</Text>
                                        <Ionicons name="chevron-down-outline" size={16} color="#3F836E" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.formRow}>
                                    <View style={[styles.formGroup, styles.formGroupHalf]}>
                                        <Text style={styles.formLabel}>Calories *</Text>
                                        <TextInput
                                            style={styles.formInput}
                                            value={newFoodItem.calories}
                                            onChangeText={(text) => setNewFoodItem({ ...newFoodItem, calories: text })}
                                            placeholder="kcal"
                                            keyboardType="numeric"
                                        />
                                    </View>

                                    <View style={[styles.formGroup, styles.formGroupHalf]}>
                                        <Text style={styles.formLabel}>Protein (g)</Text>
                                        <TextInput
                                            style={styles.formInput}
                                            value={newFoodItem.protein}
                                            onChangeText={(text) => setNewFoodItem({ ...newFoodItem, protein: text })}
                                            placeholder="grams"
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                <View style={styles.formRow}>
                                    <View style={[styles.formGroup, styles.formGroupHalf]}>
                                        <Text style={styles.formLabel}>Carbs (g)</Text>
                                        <TextInput
                                            style={styles.formInput}
                                            value={newFoodItem.carbs}
                                            onChangeText={(text) => setNewFoodItem({ ...newFoodItem, carbs: text })}
                                            placeholder="grams"
                                            keyboardType="numeric"
                                        />
                                    </View>

                                    <View style={[styles.formGroup, styles.formGroupHalf]}>
                                        <Text style={styles.formLabel}>Fat (g)</Text>
                                        <TextInput
                                            style={styles.formInput}
                                            value={newFoodItem.fat}
                                            onChangeText={(text) => setNewFoodItem({ ...newFoodItem, fat: text })}
                                            placeholder="grams"
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Status</Text>
                                    <View style={styles.statusToggleContainer}>
                                        <TouchableOpacity
                                            style={[
                                                styles.statusToggleButton,
                                                newFoodItem.status === 'Active' && styles.statusToggleActive
                                            ]}
                                            onPress={() => setNewFoodItem({ ...newFoodItem, status: 'Active' })}
                                        >
                                            <Text style={[
                                                styles.statusToggleText,
                                                newFoodItem.status === 'Active' && styles.statusToggleTextActive
                                            ]}>Active</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[
                                                styles.statusToggleButton,
                                                newFoodItem.status === 'Pending' && styles.statusTogglePending
                                            ]}
                                            onPress={() => setNewFoodItem({ ...newFoodItem, status: 'Pending' })}
                                        >
                                            <Text style={[
                                                styles.statusToggleText,
                                                newFoodItem.status === 'Pending' && styles.statusToggleTextPending
                                            ]}>Pending</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>

                            <Divider style={styles.divider} />
                            <View style={styles.modalFooter}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setIsAddModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={handleAddFood}
                                >
                                    <Text style={styles.saveButtonText}>Add Food Item</Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#f7fafc',
    },
    container: {
        flex: 1,
        backgroundColor: '#f7fafc',
        paddingHorizontal: 15,
        paddingBottom: 30, // Add bottom padding for better scrolling experience
    },
    header: {
        paddingVertical: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#718096',
        marginTop: 4,
        fontFamily: 'kregular',
    },
    actionsBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 46,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontFamily: 'kregular',
        fontSize: 14,
        color: '#4a5568',
    },
    actionsRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    categoryFilterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 46,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginRight: 10,
    },
    categoryFilterText: {
        fontSize: 14,
        color: '#4a5568',
        marginRight: 8,
        fontFamily: 'kregular',
    },
    categoryMenu: {
        marginTop: 50,
        minWidth: 180,
    },
    selectedCategoryText: {
        color: '#3F836E',
        fontWeight: '600',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3F836E',
        borderRadius: 10,
        paddingHorizontal: 16,
        height: 46,
    },
    addButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
        marginLeft: 6,
        fontFamily: 'kbold',
    },
    selectedItemsBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    selectedItemsText: {
        fontSize: 14,
        color: '#4a5568',
        fontFamily: 'kbold',
    },
    selectedItemsActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bulkActionButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginLeft: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    bulkActionText: {
        fontSize: 12,
        color: '#4a5568',
        fontFamily: 'kregular',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#fecaca',
    },
    deleteButtonText: {
        fontSize: 12,
        color: '#ef4444',
        marginLeft: 4,
        fontFamily: 'kregular',
    },
    listContainer: {
        flex: 1,
        marginBottom: 20,
    },
    listCard: {
        borderRadius: 15,
        overflow: 'hidden',
    },
    listContent: {
        paddingVertical: 4,
    },
    divider: {
        backgroundColor: '#f0f0f0',
        height: 1,
    },
    foodItemContainer: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
    },
    selectedItem: {
        backgroundColor: 'rgba(63, 131, 110, 0.05)',
    },
    foodItemCheckbox: {
        marginRight: 12,
    },
    foodItemContent: {
        flex: 1,
    },
    foodNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    foodName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'kbold',
    },
    categoryText: {
        fontSize: 13,
        color: '#718096',
        marginBottom: 8,
        fontFamily: 'kregular',
    },
    nutrientsContainer: {
        flexDirection: 'row',
    },
    nutrientItem: {
        marginRight: 16,
        alignItems: 'flex-start',
    },
    nutrientValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4a5568',
        fontFamily: 'kbold',
    },
    nutrientLabel: {
        fontSize: 12,
        color: '#a0aec0',
        fontFamily: 'kregular',
    },
    editButton: {
        padding: 8,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 1000,
    },
    modalCard: {
        width: '100%',
        maxWidth: 500,
        borderRadius: 15,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2d3748',
        fontFamily: 'kbold',
    },
    modalContent: {
        padding: 16,
        maxHeight: 400,
    },
    formGroup: {
        marginBottom: 16,
    },
    formRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    formGroupHalf: {
        width: '48%',
    },
    formLabel: {
        fontSize: 14,
        color: '#4a5568',
        marginBottom: 6,
        fontFamily: 'kbold',
    },
    formInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        fontFamily: 'kregular',
    },
    categorySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        padding: 12,
    },
    categorySelectorText: {
        fontSize: 14,
        color: '#4a5568',
        fontFamily: 'kregular',
    },
    statusToggleContainer: {
        flexDirection: 'row',
    },
    statusToggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    statusToggleActive: {
        backgroundColor: 'rgba(63, 131, 110, 0.1)',
        borderColor: '#3F836E',
    },
    statusTogglePending: {
        backgroundColor: 'rgba(217, 119, 6, 0.1)',
        borderColor: '#d97706',
    },
    statusToggleText: {
        fontSize: 14,
        color: '#718096',
        fontFamily: 'kregular',
    },
    statusToggleTextActive: {
        color: '#3F836E',
        fontWeight: '600',
    },
    statusToggleTextPending: {
        color: '#d97706',
        fontWeight: '600',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginRight: 10,
    },
    cancelButtonText: {
        fontSize: 14,
        color: '#4a5568',
        fontFamily: 'kregular',
    },
    saveButton: {
        backgroundColor: '#3F836E',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    saveButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
        fontFamily: 'kbold',
    },
});

export default FoodDatabase;