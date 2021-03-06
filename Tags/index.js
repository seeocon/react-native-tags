import React from "react";
import PropTypes from "prop-types";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import Tag from "./Tag";
import styles from "./styles";

class Tags extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: props.initialTags,
      text: props.initialText
    };
  }

  componentWillReceiveProps(props) {
    const { initialTags = [], initialText = " " } = props;

    this.setState({
      tags: initialTags,
      text: initialText
    });
  }

  onChangeText = text => {
    if (text.length === 0) {
      // `onKeyPress` isn't currently supported on Android; I've placed an extra
      //  space character at the start of `TextInput` which is used to determine if the
      //  user is erasing.
      this.setState(
        {
          tags: this.state.tags.slice(0, -1),
          text: this.state.tags.slice(-1)[0] || " "
        },
        () =>
          this.props.onChangeTags && this.props.onChangeTags(this.state.tags)
      );
    } else if (
      text.length > 1 &&
      (text.slice(-1) === " " || text.slice(-1) === ",") && !(this.state.tags.indexOf(text.slice(0, -1).trim()) > -1)
    ) {
      this.setState(
        {
          tags: [...this.state.tags, text.slice(0, -1).trim()],
          text: " "
        },
        () =>
          this.props.onChangeTags && this.props.onChangeTags(this.state.tags)
      );
    } else {
      this.setState({ text });
    }
  };


  /**
   * void arraySplice(tag)
   * uses the array.filter() method provided in Javascript to remove the specific tag from the list.
   * 
   * @param {string} tag 
   */
  arraySplice(tag) {
    if (this.props.deleteOnPress == true){
    this.setState({
      tags: this.state.tags.filter(e => e !== tag)
    });
  }
}
  

  render() {
    return (
      <View
        style={[styles.container, this.props.containerStyle, this.props.style]}
      >
        {this.state.tags.map((tag, i) => (
          <Tag
            key={i}
            label={tag}
            onPress={e => {
                     this.arraySplice(tag)
                     this.props.onTagPress(i, tag, e)
                    }}
            readonly={this.props.readonly}
            tagContainerStyle={this.props.tagContainerStyle}
            tagTextStyle={this.props.tagTextStyle}
          />
        ))}

        {!this.props.readonly && (this.props.maxNumberOfTags > this.state.tags.length) && (
          <View style={[styles.textInputContainer]}>
            <TextInput
              value={this.state.text}
              style={[styles.textInput, this.props.inputStyle]}
              onChangeText={this.onChangeText}
              underlineColorAndroid="transparent"
            />
          </View>
        )}
      </View>
    );
  }
}

Tags.defaultProps = {
  initialTags: [],
  initialText: " ",
  readonly: false
};

Tags.propTypes = {
  initialText: PropTypes.string,
  initialTags: PropTypes.arrayOf(PropTypes.string),
  onChangeTags: PropTypes.func,
  containerStyle: PropTypes.object,
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  tagContainerStyle: PropTypes.object,
  tagTextStyle: PropTypes.object,
  readonly: PropTypes.bool,
  maxNumberOfTags: PropTypes.number,
  deleteOnPress: PropTypes.bool
};

export { Tag };
export default Tags;
