import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled: false,
      light_theme: true,
      profile_image: "",
      name: ""
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();    
    this.fetchUser();
  }

  async fetchUser () {
    let name,theme,image
    await firebase 
    .database()
    .ref("/users/"+firebase.auth().currentUser.uid)
    .on("value",function(snapshot){
      theme=snapshot.val().current_theme
      name='${snapshot.val().first_name} ${snapshot.val().last_name}'
      image=snapshot.val().profile_picture
    })
    this.setState({
      light_theme: theme==="light" ?true:false,
      isEnabled: theme==="light" ?false:true,
      name:name,
      profile_image: image
    })
  }

  toggleSwitch() {
    const previous_state=this.state.isEnabled
    var updates={}
    
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />
    } else {
      return (
        <View style={styles.container}>
         <SafeAreaView style={styles.droidSafeArea}></SafeAreaView>
         <View style={styles.appTitle}>
           <View style={styles.appIcon}>
             <Image style={styles.iconImage} source={require("../assets/logo.png")}></Image>
           </View>
          <View style={styles.appTitleTextContainer}>
            <Text style={styles.appTitleText}>
              Story Telling App
            </Text>
          </View>
           </View>
           <View style={styles.screenContainer}>
             <View style={styles.profileImageContainer}>
        <Image style={styles.profileImage} source={{uri:this.state.profile_image}}></Image>
        <Text style={styles.nameText}>{this.state.name}</Text>
             </View>
             <View style={styles.themeContainer}>
               <Text style={styles.themeText}>
              Dark Theme
               </Text>
               <Switch style={{transform:[{scaleX:1.3},{scaleY:1.3}]}} trackColor={{false:"#0000FF",true:"white"}} thumbColor={this.state.isEnabled?"#EE8249":"#f4f3f4"} onValueChange={()=>this.toggleSwitch()} value={this.state.isEnabled}></Switch>
             </View>
           </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});