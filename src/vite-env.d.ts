/// <reference types="vite/client" />

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
};

declare module '*.svg' {
import { Component } from 'vue'
const src: Component
export default src
}

