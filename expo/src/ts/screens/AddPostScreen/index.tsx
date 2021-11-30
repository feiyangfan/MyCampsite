import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import * as Types from "../../types";
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useNavigation } from '@react-navigation/core';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

export default function AddPost(props) {
    const navigation = useNavigation();
    const [image, setImage] = useState(null);

    const generateThumbnail = async () => {
        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(
                props.route.params.source,
                {
                    time: 2,
                }
            );
            setImage(uri);
        } catch (e) {
            console.warn(e);
        }
    };
    generateThumbnail()

    console.log(props.route.params.source)

    return (
        <View style={styles.container}>
            <View style={styles.descriptionContainer}>
                {image && <Image source={{ uri: image }} style={styles.thumbnail} />}
                <TextInput placeholder="Add Post Description"
                    multiline
                    maxLength={150} style={styles.description} />
            </View>
            <View style={styles.spacer} />
            <KeyboardAvoidingView 
            behavior={Platform.OS === "android" ? "height" : "padding"}>
                <View style={styles.btnsContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}
                        style={styles.backButton}>
                        <Feather name="x" size={24} color="black" />
                        <Text style={styles.backButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.goBack()}
                        style={styles.postButton}>
                        <Ionicons name="send-outline" size={24} color="white" />
                        <Text style={styles.PostButtonText}>Post</Text>
                    </TouchableOpacity>
                </View>
            </ KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    descriptionContainer: {
        margin: 20,
        flexDirection: 'column',
        alignItems: 'center',
    },
    description: {
        paddingVertical: 10,
        marginRight: 20,
        fontSize: 22,
    },
    thumbnail: {
        aspectRatio: 9 / 16,
        backgroundColor: 'black',
        width: 300,
        height: 300,
    },
    btnsContainer: {
        flexDirection: "row",
        marginHorizontal: 5,
        marginBottom: 30,
    },
    backButton: {
        alignItems: 'center',
        flex: 1,
        borderColor: '#4C9A2A',
        borderWidth: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderRadius: 7,
        margin: 5,

    },

    postButton: {
        alignItems: 'center',
        flex: 1,
        borderColor: '#4C9A2A',
        backgroundColor: '#4C9A2A',
        borderWidth: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderRadius: 7,
        margin: 5,
    },
    backButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'black',
        margin: 5,
    },
    PostButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
        margin: 5,
    },
    spacer: {
        flex: 1,
    }

});