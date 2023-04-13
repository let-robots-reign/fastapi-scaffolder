import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import "./assets/main.css"
import "ant-design-vue/dist/antd.css"
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  import("ant-design-vue/dist/antd.dark.css");
}

import {
  Button,
  Layout,
  Row,
  Col,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Empty,
  Table,
  Alert
} from "ant-design-vue";

const app = createApp(App)
app.use(Button);
app.use(Layout);
app.use(Row);
app.use(Col);
app.use(Card);
app.use(Checkbox);
app.use(DatePicker);
app.use(Form);
app.use(Input);
app.use(Radio);
app.use(Select);
app.use(Empty);
app.use(Table);
app.use(Alert);
app.use(router);

app.mount('#app');
