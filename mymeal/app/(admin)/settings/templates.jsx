import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Sample template data
const initialTemplates = [
    {
        id: '1',
        name: 'Weight Loss Plan',
        description: 'Standard 1500-calorie diet plan for weight loss',
        type: 'Meal Plan',
        lastModified: '2023-10-12',
        active: true,
    },
    {
        id: '2',
        name: 'Muscle Gain',
        description: 'High protein plan for building muscle mass',
        type: 'Meal Plan',
        lastModified: '2023-09-28',
        active: true,
    },
    {
        id: '3',
        name: 'Diabetic Diet',
        description: 'Low-carb meal plan for diabetic users',
        type: 'Meal Plan',
        lastModified: '2023-10-05',
        active: true,
    },
    {
        id: '4',
        name: 'Welcome Email',
        description: 'Email sent to new users upon registration',
        type: 'Email',
        lastModified: '2023-08-15',
        active: true,
    },
    {
        id: '5',
        name: 'Meal Plan Approval',
        description: 'Email sent when nutritionist approves a meal plan',
        type: 'Email',
        lastModified: '2023-09-10',
        active: true,
    }
];

const TemplatesManagement = () => {
    const [templates, setTemplates] = useState(initialTemplates);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');
    const router = useRouter();

    // Filter templates based on search and type filter
    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'All' || template.type === filterType;
        return matchesSearch && matchesType;
    });

    // Toggle template active status
    const toggleActive = (id) => {
        setTemplates(templates.map(template =>
            template.id === id ? { ...template, active: !template.active } : template
        ));
    };

    // Delete template
    const deleteTemplate = (id) => {
        // In a real app, this would call an API first
        setTemplates(templates.filter(template => template.id !== id));
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Templates</Text>
                <Text style={styles.headerSubtitle}>Manage meal plans and email templates</Text>
            </View>

            {/* Search and filter bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search-outline" size={20} color="#718096" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.filterButtonsContainer}>
                    <TouchableOpacity
                        style={[styles.filterButton, filterType === 'All' && styles.activeFilterButton]}
                        onPress={() => setFilterType('All')}
                    >
                        <Text style={[styles.filterButtonText, filterType === 'All' && styles.activeFilterText]}>All</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterButton, filterType === 'Meal Plan' && styles.activeFilterButton]}
                        onPress={() => setFilterType('Meal Plan')}
                    >
                        <Text style={[styles.filterButtonText, filterType === 'Meal Plan' && styles.activeFilterText]}>Meal Plans</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterButton, filterType === 'Email' && styles.activeFilterButton]}
                        onPress={() => setFilterType('Email')}
                    >
                        <Text style={[styles.filterButtonText, filterType === 'Email' && styles.activeFilterText]}>Emails</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Create new template button */}
            <TouchableOpacity
                style={styles.createButton}
                onPress={() => console.log('Navigate to create template')}
            >
                <Ionicons name="add-outline" size={20} color="#fff" />
                <Text style={styles.createButtonText}>Create New Template</Text>
            </TouchableOpacity>

            {/* Templates list */}
            <View style={styles.templatesContainer}>
                {filteredTemplates.length === 0 ? (
                    <Text style={styles.noResultsText}>No templates found</Text>
                ) : (
                    filteredTemplates.map((template) => (
                        <Card key={template.id} style={styles.templateCard}>
                            <Card.Content>
                                <View style={styles.cardHeader}>
                                    <View style={styles.templateTypeContainer}>
                                        <Ionicons
                                            name={template.type === 'Meal Plan' ? 'restaurant-outline' : 'mail-outline'}
                                            size={18}
                                            color="#3F836E"
                                        />
                                        <Text style={styles.templateType}>{template.type}</Text>
                                    </View>
                                    <View style={styles.statusContainer}>
                                        <View style={[styles.statusDot, { backgroundColor: template.active ? '#3F836E' : '#cbd5e0' }]} />
                                        <Text style={styles.statusText}>{template.active ? 'Active' : 'Inactive'}</Text>
                                    </View>
                                </View>

                                <Text style={styles.templateName}>{template.name}</Text>
                                <Text style={styles.templateDescription}>{template.description}</Text>

                                <View style={styles.templateMeta}>
                                    <Text style={styles.templateDate}>
                                        Last modified: {template.lastModified}
                                    </Text>
                                </View>

                                <View style={styles.actionButtonsContainer}>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => console.log('Edit template', template.id)}
                                    >
                                        <Ionicons name="create-outline" size={18} color="#4a5568" />
                                        <Text style={styles.actionButtonText}>Edit</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => toggleActive(template.id)}
                                    >
                                        <Ionicons name={template.active ? "eye-off-outline" : "eye-outline"} size={18} color="#4a5568" />
                                        <Text style={styles.actionButtonText}>
                                            {template.active ? 'Deactivate' : 'Activate'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.dangerButton]}
                                        onPress={() => deleteTemplate(template.id)}
                                    >
                                        <Ionicons name="trash-outline" size={18} color="#e53e3e" />
                                        <Text style={[styles.actionButtonText, styles.dangerText]}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </Card.Content>
                        </Card>
                    ))
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7fafc',
        paddingHorizontal: 15,
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
    searchContainer: {
        marginBottom: 16,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 14,
        color: '#4a5568',
        fontFamily: 'kregular',
    },
    filterButtonsContainer: {
        flexDirection: 'row',
        marginTop: 12,
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
    },
    activeFilterButton: {
        backgroundColor: '#3F836E',
    },
    filterButtonText: {
        fontSize: 14,
        color: '#718096',
        fontFamily: 'kregular',
    },
    activeFilterText: {
        color: '#fff',
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3F836E',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    createButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'kbold',
    },
    templatesContainer: {
        marginBottom: 20,
    },
    templateCard: {
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    templateTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    templateType: {
        fontSize: 14,
        color: '#3F836E',
        marginLeft: 6,
        fontFamily: 'kbold',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        color: '#718096',
        fontFamily: 'kregular',
    },
    templateName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 4,
        fontFamily: 'kbold',
    },
    templateDescription: {
        fontSize: 14,
        color: '#718096',
        marginBottom: 10,
        fontFamily: 'kregular',
    },
    templateMeta: {
        marginBottom: 12,
    },
    templateDate: {
        fontSize: 12,
        color: '#a0aec0',
        fontFamily: 'kregular',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
        marginTop: 6,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    actionButtonText: {
        fontSize: 14,
        color: '#4a5568',
        marginLeft: 6,
        fontFamily: 'kregular',
    },
    dangerText: {
        color: '#e53e3e',
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#718096',
        paddingVertical: 30,
        fontFamily: 'kregular',
    },
});

export default TemplatesManagement;