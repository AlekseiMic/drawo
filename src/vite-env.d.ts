/// <reference types="vite/client" />

declare module '*.vue';

declare module '*.svg' {
import { Component } from 'vue'
const src: Component
export default src
}

