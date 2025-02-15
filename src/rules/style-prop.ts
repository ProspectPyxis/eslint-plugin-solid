import type { Rule } from "eslint";
import type { Property } from "estree-jsx";
import { propName } from "jsx-ast-utils";
import kebabCase from "kebab-case";
import { getPropertyName, getStaticValue } from "eslint-utils";
import { all as allCssProperties } from "known-css-properties";
import parse from "style-to-object";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require CSS properties in the `style` prop to be valid and kebab-cased (ex. 'font-size'), not camel-cased (ex. 'fontSize') like in React, " +
        "and that property values are strings, not numbers with implicit 'px' units.",
      url: "https://github.com/joshwilsonvu/eslint-plugin-solid/blob/main/docs/style-prop.md",
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          // an array of prop names to treat as a CSS style object, defaults to ["style"]
          styleProps: {
            type: "array",
            items: {
              type: "string",
              minItems: 1,
              uniqueItems: true,
            },
          },
          // if allowString is set to true, this rule will not convert a style string literal into a style object (not recommended for performance)
          allowString: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidStyleProp: "{{ name }} is not a valid CSS property.",
      numericStyleValue:
        'CSS property values should be strings only, but {{ value }} is a number; convert to string and add a unit like "px" if appropriate.',
      zeroStyleValue: 'A CSS property value of 0 should be passed as the string "0".',
      stringStyle: "Use an object for the style prop instead of a string.",
    },
  },
  create(context): Rule.RuleListener {
    const allCssPropertiesSet: Set<string> = new Set(allCssProperties);
    const allowString = Boolean(context.options[0]?.allowString);
    const styleProps = context.options[0]?.styleProps || ["style"];

    return {
      JSXAttribute(node) {
        if (styleProps.indexOf(propName(node)) === -1) {
          return;
        }
        const style =
          node.value.type === "JSXExpressionContainer" ? node.value.expression : node.value;

        if (style.type === "Literal" && typeof style.value === "string" && !allowString) {
          // Convert style="font-size: 10px" to style={{ "font-size": "10px" }}
          let objectStyles: Record<string, string> | null = null;
          try {
            objectStyles = parse(style.value);
          } catch (e) {} // eslint-disable-line no-empty

          context.report({
            node: style,
            messageId: "stringStyle",
            // replace full prop value, wrap in JSXExpressionContainer, more fixes may be applied below
            fix:
              objectStyles != null
                ? (fixer) => fixer.replaceText(node.value, `{${JSON.stringify(objectStyles)}}`)
                : undefined,
          });
        } else if (style.type === "TemplateLiteral" && !allowString) {
          context.report({
            node: style,
            messageId: "stringStyle",
          });
        } else if (style.type === "ObjectExpression") {
          const properties: Array<Property> = style.properties.filter(
            (prop) => prop.type === "Property"
          );
          properties.forEach((prop) => {
            const name: string | null = getPropertyName(prop, context.getScope());
            if (name && !name.startsWith("--") && !allCssPropertiesSet.has(name)) {
              const kebabName: string = kebabCase(name);
              context.report({
                node: prop.key,
                messageId: "invalidStyleProp",
                data: { name },
                // if it's not valid simply because it's camelCased instead of kebab-cased, provide a fix
                fix: allCssPropertiesSet.has(kebabName)
                  ? (fixer) => fixer.replaceText(prop.key, `"${kebabName}"`) // wrap kebab name in quotes to be a valid object key
                  : undefined,
              });
            }
            // catches numeric values (ex. { "font-size": 12 }) and suggests quoting or appending 'px'
            const value: unknown = getStaticValue(prop.value)?.value;
            if (typeof value === "number") {
              if (value === 0) {
                context.report({
                  node: prop.value,
                  messageId: "zeroStyleValue",
                  fix: (fixer) => fixer.replaceText(prop.value, '"0"'),
                });
              } else {
                context.report({
                  node: prop.value,
                  messageId: "numericStyleValue",
                  data: {
                    value: String(value),
                  },
                });
              }
            }
          });
        }
      },
    };
  },
};

export default rule;
