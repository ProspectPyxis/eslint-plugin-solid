/* eslint-disable */
import { run } from "../ruleTester";
// import rule from "../../src/rules/props";

test.todo("test reactivity rule");

// ruleTester.run("props", rule, {
//   valid: [
//     // Examples straight from the Solid docs
//     `let BasicComponent = props => {
//       return <div>{props.value || "default"}</div>;
//     };`,
//     `let BasicComponent = props => {
//       const value = () => props.value || "default";

//       return <div>{value()}</div>;
//     };`,
//     `let BasicComponent = props => {
//       const value = createMemo(() => props.value || "default");
//       return <div>{value()}</div>;
//     };`,
//     `let BasicComponent = props => {
//       props = mergeProps({ value: "default" }, props);
//       return <div>{props.value}</div>;
//     };`,
//   ],
//   invalid: [
//     {
//       code: `
//       const BasicComponent = props => {
//         const { value: valueProp } = props;
//         const value = createMemo(() => valueProp || "default");
//         return <div>{value()}</div>;
//       };`,
//       errors: [""],
//     },
//     {
//       code: `
//       const BasicComponent = props => {
//         const valueProp = prop.value;
//         const value = createMemo(() => valueProp || "default");
//         return <div>{value()}</div>;
//       };`,
//       errors: [""],
//     },
//   ],
// });
