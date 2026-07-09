import React from 'react';
import { StyleSheet, Text, type TextStyle } from 'react-native';
import { ThemedText, type ThemedTextProps } from './themed-text';

export type FormattedTextProps = ThemedTextProps & {
  children?: string;
  boldStyle?: TextStyle;
};

export function FormattedText({
  children = '',
  style,
  boldStyle,
  ...rest
}: FormattedTextProps) {
  if (typeof children !== 'string') {
    return <ThemedText style={style} {...rest}>{children}</ThemedText>;
  }

  // Parse markdown bold '**bold**' and bullet points '- ' or '* '
  const lines = children.split('\n');

  return (
    <ThemedText style={style} {...rest}>
      {lines.map((line, lineIndex) => {
        // Handle basic bullet point formatting (trimmed to support leading spaces)
        let processedLine = line;
        const trimmed = line.trimStart();
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const indent = line.substring(0, line.length - trimmed.length);
          processedLine = indent + '• ' + trimmed.substring(2);
        }

        const parts = processedLine.split('**');

        return (
          <React.Fragment key={lineIndex}>
            {parts.map((part, partIndex) => {
              const isBold = partIndex % 2 === 1;
              return (
                <Text
                  key={partIndex}
                  style={isBold ? [styles.bold, boldStyle] : undefined}
                >
                  {part}
                </Text>
              );
            })}
            {lineIndex < lines.length - 1 ? '\n' : ''}
          </React.Fragment>
        );
      })}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
});
