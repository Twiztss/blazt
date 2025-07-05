import { useAuth } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import React from 'react'
import "react-native-get-random-values"

const Home = () => {

  const { isSignedIn } = useAuth() 

  if (isSignedIn) {
    return ( 
    <Redirect href="./(tabs)/home"/> 
  )
  }

  return (
    <Redirect href="./(auth)/welcome"/>
  )
}

export default Home
