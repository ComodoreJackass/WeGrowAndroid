import React, { Component, useState } from 'react';
import { View, Text } from 'react-native';

/*
POST http://localhost:3000/progress/byId
content-type: application/json
authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoia29yaXNuaWsiLCJpYXQiOjE1ODYzOTMwODJ9.mGC4iKLRuul3fpFYEvEr6AmnshvqlTXFYYhKW4pHwbE

{
    "userId": 1
}
*/

//TODO update server so it returns user id upon login before continuing
export default function HomeScreen() {
  return (
    <View>
        <Text>
            Wellcome
        </Text>
    </View>
  );
}
