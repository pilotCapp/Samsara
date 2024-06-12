import { View, Pressable, StyleSheet , Dimensions} from 'react-native';
import React, { useState } from 'react';





import { ThemedText } from '@/components/ThemedText';
import { transform } from '@babel/core';
import Svg, { Path, Text as SvgText, Defs, TextPath } from 'react-native-svg';

import { VictoryPie } from "victory-native";



const SamsaraWheel = () => {
  const [pressedIndex, setPressedIndex] = useState<number>(-1);
  const dimensions = Dimensions.get('window');
  const radius = dimensions.width/4;
  const circle = 2 * Math.PI * radius;

  const sections: Section[] = [
    { index: 0, name: 'Netflix', color: 'red'},
    { index: 1, name: 'Disney', color: 'blue'},
    { index: 2, name: "Roku", color: 'green'},
  ];
  
  interface Section {
    index: number;
    name: string;
    color: string;
  }

  const anglePerSection = Math.PI/4 //180 / sections.length;

  
  function onPress(section:Section) {
    setPressedIndex(section.index);
  }

  const styles = StyleSheet.create({
    container: {
      fontSize: 28,
      lineHeight: 32,
      marginTop: -6,
    },
    section: {
      //width: circle/sections.length,
    },
    pressedStyle: {
      opacity: 0.5,
    },
  });

  
  const graphicData= []
    for (let i = 0; i < sections.length; i++) {
      graphicData.push({ y: 100/sections.length, x: sections[i].name});
    }
  const colorScale = sections.map(section => section.color);

  return (
    <VictoryPie
      data={graphicData}
      width={2*radius}
      height={2*radius}
      innerRadius={radius*0.8}
      style={{
        labels: {
          fill: 'white',
          fontSize: 15,
          padding: 7,
        },
      }}
      colorScale={colorScale}
    />
  );
  
};

export default SamsaraWheel;

// <View style={styles.container}>
// {sections.map((section) => (
        
//   <Pressable
//     key={section.index}
//     onPress={() => onPress(section)}
//     style={() => [
//       (section.index == pressedIndex) && styles.pressedStyle // Optional: Style when pressed
//     ]}
//   >
// </Pressable>
// ))}
// </View>