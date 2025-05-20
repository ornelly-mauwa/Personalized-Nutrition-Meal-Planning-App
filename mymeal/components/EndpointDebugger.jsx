// EndpointDebugger.js
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    FlatList,
    Keyboard
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const EndpointDebugger = () => {
    const [url, setUrl] = useState('http://192.168.10.160:8000/api');
    const [method, setMethod] = useState('GET');
    const [headers, setHeaders] = useState('{}');
    const [body, setBody] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    // Parse headers from string to object
    const parseHeaders = () => {
        try {
            return JSON.parse(headers);
        } catch (err) {
            setError('Invalid JSON headers format');
            return {};
        }
    };

    // Parse body if it's JSON
    const parseBody = () => {
        if (!body) return null;
        try {
            return JSON.parse(body);
        } catch (err) {
            // If it's not valid JSON, return as is
            return body;
        }
    };

    const handleRequest = async () => {
        Keyboard.dismiss();
        setLoading(true);
        setError(null);
        setResponse(null);

        const requestHeaders = parseHeaders();
        const requestBody = parseBody();
        const startTime = Date.now();

        try {
            const requestOptions = {
                method,
                headers: requestHeaders,
            };

            // Add body for non-GET requests
            if (method !== 'GET' && requestBody) {
                if (typeof requestBody === 'object') {
                    requestOptions.body = JSON.stringify(requestBody);
                    // Set content-type if not already set
                    if (!requestOptions.headers['Content-Type']) {
                        requestOptions.headers['Content-Type'] = 'application/json';
                    }
                } else {
                    requestOptions.body = requestBody;
                }
            }

            const res = await fetch(url, requestOptions);
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            // Try to parse JSON, but fall back to text if it fails
            let data;
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            } else {
                data = await res.text();
            }

            const responseData = {
                status: res.status,
                statusText: res.statusText || getStatusText(res.status),
                headers: Object.fromEntries([...res.headers.entries()]),
                data,
                responseTime,
            };

            setResponse(responseData);

            // Save to history
            const newHistoryItem = {
                id: Date.now().toString(),
                timestamp: new Date().toLocaleTimeString(),
                url,
                method,
                status: res.status,
                responseTime,
            };

            setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));

        } catch (err) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            setError(`Request failed: ${err.message}`);

            // Also save errors to history
            const newHistoryItem = {
                id: Date.now().toString(),
                timestamp: new Date().toLocaleTimeString(),
                url,
                method,
                status: 'Error',
                responseTime,
            };

            setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get status text for codes
    const getStatusText = (status) => {
        const statusTexts = {
            200: 'OK',
            201: 'Created',
            204: 'No Content',
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            500: 'Internal Server Error',
        };
        return statusTexts[status] || '';
    };

    // Load a history item
    const loadHistoryItem = (item) => {
        setUrl(item.url);
        setMethod(item.method);
    };

    // Get color for status
    const getStatusColor = (status) => {
        if (status === 'Error') return '#FF6B6B';
        if (status >= 200 && status < 300) return '#4CAF50';
        if (status >= 400) return '#FF6B6B';
        return '#FFC107';
    };

    // Get color for method
    const getMethodColor = (method) => {
        const colors = {
            GET: '#4CAF50',
            POST: '#2196F3',
            PUT: '#FF9800',
            DELETE: '#F44336',
            PATCH: '#9C27B0',
        };
        return colors[method] || '#757575';
    };

    // Render history item
    const renderHistoryItem = ({ item }) => (
        <View style={styles.historyItem}>
            <View style={styles.historyItemHeader}>
                <Text style={styles.historyItemTime}>{item.timestamp}</Text>
                <TouchableOpacity
                    style={styles.loadButton}
                    onPress={() => loadHistoryItem(item)}
                >
                    <Text style={styles.loadButtonText}>Load</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.historyItemDetails}>
                <View style={[styles.methodBadge, { backgroundColor: getMethodColor(item.method) + '20' }]}>
                    <Text style={[styles.methodText, { color: getMethodColor(item.method) }]}>{item.method}</Text>
                </View>

                <Text numberOfLines={1} style={styles.urlText}>{item.url}</Text>
            </View>

            <View style={styles.historyItemFooter}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status} {item.status !== 'Error' ? getStatusText(item.status) : ''}
                </Text>
                <Text style={styles.responseTimeText}>{item.responseTime}ms</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.title}>API Endpoint Debugger</Text>

                {/* Request Form */}
                <View style={styles.formContainer}>
                    <View style={styles.urlContainer}>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={method}
                                onValueChange={(value) => setMethod(value)}
                                style={styles.methodPicker}
                                mode="dropdown"
                            >
                                <Picker.Item label="GET" value="GET" />
                                <Picker.Item label="POST" value="POST" />
                                <Picker.Item label="PUT" value="PUT" />
                                <Picker.Item label="DELETE" value="DELETE" />
                                <Picker.Item label="PATCH" value="PATCH" />
                            </Picker>
                        </View>

                        <TextInput
                            style={styles.urlInput}
                            value={url}
                            onChangeText={setUrl}
                            placeholder="Enter API URL"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Headers (JSON format)</Text>
                        <TextInput
                            style={styles.headersInput}
                            value={headers}
                            onChangeText={setHeaders}
                            placeholder='{"Content-Type": "application/json"}'
                            multiline
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    {method !== 'GET' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Body</Text>
                            <TextInput
                                style={styles.bodyInput}
                                value={body}
                                onChangeText={setBody}
                                placeholder='{"key": "value"}'
                                multiline
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.sendButton, loading && styles.sendButtonDisabled]}
                        onPress={handleRequest}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.sendButtonText}>Send Request</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Response Section */}
                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorTitle}>Error</Text>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {response && (
                    <View style={styles.responseContainer}>
                        <View style={styles.responseHeader}>
                            <View style={[styles.statusBadge, {
                                backgroundColor: getStatusColor(response.status) + '20'
                            }]}>
                                <Text style={[styles.statusBadgeText, {
                                    color: getStatusColor(response.status)
                                }]}>
                                    {response.status} {response.statusText}
                                </Text>
                            </View>
                            <Text style={styles.responseTimeInfo}>
                                Response time: {response.responseTime}ms
                            </Text>
                        </View>

                        <View style={styles.responseSection}>
                            <Text style={styles.responseSectionTitle}>Response Headers</Text>
                            <ScrollView horizontal style={styles.codeScrollView}>
                                <Text style={styles.codeText}>
                                    {JSON.stringify(response.headers, null, 2)}
                                </Text>
                            </ScrollView>
                        </View>

                        <View style={styles.responseSection}>
                            <Text style={styles.responseSectionTitle}>Response Body</Text>
                            <ScrollView horizontal style={styles.codeScrollView}>
                                <Text style={styles.codeText}>
                                    {typeof response.data === 'object'
                                        ? JSON.stringify(response.data, null, 2)
                                        : response.data}
                                </Text>
                            </ScrollView>
                        </View>
                    </View>
                )}

                {/* History Section */}
                <TouchableOpacity
                    style={styles.historyToggle}
                    onPress={() => setShowHistory(!showHistory)}
                >
                    <Text style={styles.historyToggleText}>
                        {showHistory ? 'Hide History' : 'Show History'} ({history.length})
                    </Text>
                </TouchableOpacity>

                {showHistory && history.length > 0 && (
                    <View style={styles.historyContainer}>
                        <FlatList
                            data={history}
                            renderItem={renderHistoryItem}
                            keyExtractor={item => item.id}
                            scrollEnabled={false} // Because we're already in a ScrollView
                        />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    urlContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    pickerContainer: {
        width: 110,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        justifyContent: 'center',
        marginRight: 8,
    },
    methodPicker: {
        height: 50,
        width: 110,
    },
    urlInput: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
        color: '#666',
    },
    headersInput: {
        height: 80,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 8,
        textAlignVertical: 'top',
    },
    bodyInput: {
        height: 120,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 8,
        textAlignVertical: 'top',
    },
    sendButton: {
        backgroundColor: '#2196F3',
        borderRadius: 4,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#B0BEC5',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    errorContainer: {
        backgroundColor: '#FFEBEE',
        borderWidth: 1,
        borderColor: '#FFCDD2',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    errorTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#D32F2F',
        marginBottom: 8,
    },
    errorText: {
        color: '#D32F2F',
    },
    responseContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        overflow: 'hidden',
    },
    responseHeader: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    responseTimeInfo: {
        fontSize: 12,
        color: '#666',
    },
    responseSection: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    responseSectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#666',
    },
    codeScrollView: {
        backgroundColor: '#f5f5f5',
        padding: 8,
        borderRadius: 4,
    },
    codeText: {
        fontFamily: 'monospace',
        fontSize: 12,
    },
    historyToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    historyToggleText: {
        color: '#2196F3',
        fontSize: 14,
        fontWeight: '500',
    },
    historyContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    historyItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    historyItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    historyItemTime: {
        fontSize: 12,
        color: '#666',
    },
    loadButton: {
        paddingVertical: 2,
        paddingHorizontal: 8,
        backgroundColor: '#E3F2FD',
        borderRadius: 4,
    },
    loadButtonText: {
        color: '#2196F3',
        fontSize: 12,
        fontWeight: '500',
    },
    historyItemDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    methodBadge: {
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 8,
    },
    methodText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    urlText: {
        flex: 1,
        fontSize: 13,
        color: '#333',
    },
    historyItemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    responseTimeText: {
        fontSize: 12,
        color: '#666',
    },
});

export default EndpointDebugger;