import React, { Component } from 'react';
import {
  Button,
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { Permissions, ImagePicker } from 'expo';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import  CNRichTextEditor, {
  CNToolbar,
  getInitialObject,
  getDefaultStyles,
  convertToHtmlString
} from 'react-native-cn-richtext-editor';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuContext,
  MenuProvider,
  renderers,
} from 'react-native-popup-menu';

const { SlideInMenu } = renderers;

const IS_IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');
const defaultStyles = getDefaultStyles();

class App extends Component {
  editor = null;
  state = {
    selectedTag : 'body',
    selectedStyles : [],
    value: [getInitialObject()],
    showInputModalType: null,
    newInputLabel: '',
  }

  onStyleKeyPress = (toolType) => {
    if (toolType == 'image') {
      return;
    }
    else {
      this.editor.applyToolbar(toolType);
    }
  }

  onSelectedTagChanged = (tag) => {
    this.setState({
      selectedTag: tag,
    });
  }

  onSelectedStyleChanged = (styles) => { 
    this.setState({
      selectedStyles: styles,
    });
  }

  onValueChanged = (value) => {
    this.setState({
      value: value,
    });
    console.log(convertToHtmlString(value));
  }

  onImageSelectorClicked = (value) => {
    if(value == 1) {
      // Short text input
      // this.editor.insertInput('text');
      this.setState({
        showInputModalType: 'text',
      });
    }
    else if(value == 2) {
      // Textarea
    }
  }

  onRemoveImage = ({url, id}) => {        
    // console.log(`image removed (url : ${url})`);
  }

  handleAddInputButton = () => {
    this.editor.insertInput('text', this.state.newInputLabel);
    this.setState({
      showInputModalType: null,
    })
  }

  renderImageSelector() {
    return (
      <Menu renderer={SlideInMenu} onSelect={this.onImageSelectorClicked}>
        <MenuTrigger>
          <AntDesign name="form" size={28} color="#737373" />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption value={1}>
            <Text style={styles.menuOptionText}>
              Text (short)
            </Text>
          </MenuOption>
          <View style={styles.divider}/>
          <MenuOption value={2} >
            <Text style={styles.menuOptionText}>
              Text (long)
            </Text>
          </MenuOption> 
          <View style={styles.divider}/>
          <MenuOption value={3}>
            <Text style={styles.menuOptionText}>
              Cancel
            </Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  }

  render() {
    let customStyles = {...defaultStyles, body: {fontSize: 16, lineHeight: 20, color: '#434343'}, heading : {fontSize: 16}, title : {fontSize: 20}};
    
    return (
      <KeyboardAvoidingView 
        behavior="padding" 
        enabled
        keyboardVerticalOffset={IS_IOS ? 0 : 0}
        style={styles.root}
      >
        <MenuProvider style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} >             
            <View style={styles.main}>
              <CNRichTextEditor                   
                ref={input => this.editor = input}
                onSelectedTagChanged={this.onSelectedTagChanged}
                onSelectedStyleChanged={this.onSelectedStyleChanged}
                value={this.state.value}
                style={styles.editor}
                styleList={customStyles}
                foreColor='dimgray' // optional (will override default fore-color)
                onValueChanged={this.onValueChanged}
                onRemoveImage={this.onRemoveImage}
              />                        
            </View>
          </TouchableWithoutFeedback>

          <View style={styles.toolbarContainer}>
            <CNToolbar
              size={28}
              bold={<MaterialCommunityIcons name="format-bold" />}
              italic={<MaterialCommunityIcons name="format-italic" />}
              underline={<MaterialCommunityIcons name="format-underline" />}
              body={<MaterialCommunityIcons name="format-text" />}
              title={<MaterialCommunityIcons name="format-header-1" />}
              heading={<MaterialCommunityIcons name="format-header-3" />}
              ul={<MaterialCommunityIcons name="format-list-bulleted" />}
              image={this.renderImageSelector()}
              selectedTag={this.state.selectedTag}
              selectedStyles={this.state.selectedStyles}
              onStyleKeyPress={this.onStyleKeyPress} 
              backgroundColor="aliceblue" // optional (will override default backgroundColor)
              color="white" // optional (will override default color)
              selectedColor='white' // optional (will override default selectedColor)
              selectedBackgroundColor='deepskyblue' // optional (will override default selectedBackgroundColor)
            /> 
          </View>
        </MenuProvider>

        <Modal
          onRequestClose={() => this.setState({showInputModalType: null})}
          visible={!!this.state.showInputModalType}
          transparent
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'rgba(0, 0, 0, 0.1)'}}>
            <View
              style={{width: '100%', height: 100, backgroundColor: 'white', shadowOffset: {height: 5}, shadowColor: '#000', shadowOpacity: 0.4, padding: 20}}
            >
              <View>
                <Text>Label:</Text>
              </View>
              <View>
                <TextInput
                  placeholder='Label'
                  style={{borderBottomWidth: 2, borderColor: '#000'}}
                  onChangeText={(val) => this.setState({newInputLabel: val})}
                  value={this.state.newInputLabel}
                />
              </View>
              <View>
                <Button
                  title='Add input'
                  onPress={this.handleAddInputButton}
                />
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }

}

var styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor:'#f3f3f3',
    flexDirection: 'column', 
    justifyContent: 'flex-end', 
    paddingVertical: 30,
  },
  main: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 1,
    alignItems: 'stretch',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {height: 5},
    shadowOpacity: 0.3,
    marginBottom: 10,
  },
  editor: { 
    backgroundColor : '#fff'
  },
  toolbarContainer: {
    minHeight: 35
  },
  menuOptionText: {
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  divider: {
    marginVertical: 0,
    marginHorizontal: 0,
    borderBottomWidth: 1,
    borderColor: '#eee'
  }
});

const optionsStyles = {
  optionsContainer: {
   backgroundColor: 'yellow',
   padding: 0,   
   width: 40,
   marginLeft: width - 40 - 30,
   alignItems: 'flex-end',
  },
  optionsWrapper: {
   //width: 40,
   backgroundColor: 'white',
  },
  optionWrapper: {
   //backgroundColor: 'yellow',
   margin: 2,
  },
  optionTouchable: {
   underlayColor: 'gold',
   activeOpacity: 70,
  },
  // optionText: {
  //   color: 'brown',
  // },
 };

export default App;
