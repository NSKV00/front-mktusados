declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
};
declare module 'vue-select' {
  import { DefineComponent } from 'vue';
  const VueSelect: DefineComponent<{}, {}, any>;
  export default VueSelect;
}