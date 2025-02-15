import { Cases, run } from "../ruleTester";
import rule from "../../src/rules/prefer-for";

export const cases: Cases = {
  valid: [
    `let Component = (props) => <ol><For each={props.data}>{d => <li>{d.text}</li>}</For></ol>;`,
    `let abc = x.map(y => y + z);`,
    `let Component = (props) => {
      let abc = x.map(y => y + z);
      return <div>Hello, world!</div>;
    }`,
  ],
  invalid: [
    // fixes to add <For />, which can be auto-imported in jsx-no-undef
    {
      code: `let Component = (props) => <ol>{props.data.map(d => <li>{d.text}</li>)}</ol>;`,
      errors: [{ messageId: "preferFor" }],
      output: `let Component = (props) => <ol><For each={props.data}>{d => <li>{d.text}</li>}</For></ol>;`,
    },
    {
      code: `let Component = (props) => <ol>{props.data.map(d => <li key={d.id}>{d.text}</li>)}</ol>;`,
      errors: [{ messageId: "preferFor" }],
      output: `let Component = (props) => <ol><For each={props.data}>{d => <li key={d.id}>{d.text}</li>}</For></ol>;`,
    },
    {
      code: `
      function Component(props) {
        return <ol>{props.data.map(d => <li>{d.text}</li>)}</ol>;
      }`,
      errors: [{ messageId: "preferFor" }],
      output: `
      function Component(props) {
        return <ol><For each={props.data}>{d => <li>{d.text}</li>}</For></ol>;
      }`,
    },
    // deopts
    {
      code: `let Component = (props) => <ol>{props.data.map(() => <li />)}</ol>;`,
      errors: [{ messageId: "preferForOrIndex" }],
    },
    {
      code: `let Component = (props) => <ol>{props.data.map((...args) => <li>{args[0].text}</li>)}</ol>;`,
      errors: [{ messageId: "preferForOrIndex" }],
    },
  ],
};

run("prefer-for", rule, cases);
