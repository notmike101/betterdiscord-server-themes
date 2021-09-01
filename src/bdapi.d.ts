import * as ReactInstance from 'react';
import * as ReactDOMInstance from 'react-dom';

export interface Plugin {
  getName(): string;
  getAuthor(): string;
  getDescription(): string;
  getVersion(): string;
  start(): Function;
  stop(): Function;
}

export interface Theme {
  added?: number;
  author: string;
  authorId?: string;
  css: string;
  description: string;
  filename: string;
  format?: string;
  id: string;
  invite?: string;
  modified?: number;
  size?: number;
  source?: string;
  version: string;
  website?: string;
}

interface ModuleFilter {
  (module: any): boolean;
}

interface PatcherOptions {
  displayName?: string;
  type: 'before' | 'instead' | 'after';
  forcePatch: boolean;
}

interface PatcherCallback {
  (
    thisObject: ThisType<Patcher>,
    methodArguments: Parameters<() => any>,
    returnValue: any
  ): void;
}

export interface Patcher {
  patch(
    caller: string,
    module: object | Function,
    moduleName: string,
    callback: PatcherCallback,
    options: PatcherOptions
  ): Function;
  before(
    caller: string,
    module: object | Function,
    moduleName: string,
    callback: PatcherCallback,
    options?: PatcherOptions
  ): Function;
  instead(
    caller: string,
    module: object | Function,
    moduleName: string,
    callback: PatcherCallback,
    options?: PatcherOptions
  ): Function;
  after(
    caller: string,
    module: object | Function,
    moduleName: string,
    callback: PatcherCallback,
    options?: PatcherOptions
  ): Function;
}

interface Themes {
  get(name: string): Theme;
  getAll(): Theme[];
  disable(name: string): void;
  enable(name: string): void;
  isEnabled(name: string): boolean;
  reload(name: string): void;
  toggle(name: string): void;
  folder: string;
}

interface Plugins {
  get(name: string): Plugin;
  getAll(): Plugin[];
  disable(name: string): void;
  enable(name: string): void;
  isEnabled(name: string): boolean;
  reload(name: string): void;
  toggle(name: string): void;
  folder: string;
}

interface ConfirmModalOptions {
  onConfirm?: () => void;
  onCancel?: () => void;
  danger?: boolean;
  confirmText?: string;
  cancelText?: string;
}

declare namespace BdApi {
  function saveData(pluginName: string, key: string, data: any): void;
  function loadData(pluginName: string, key: string): any;
  function setData(pluginName: string, key: string, data: any): void;
  function getData(pluginName: string, key: string): any;
  function deleteData(pluginName: string, key: string): void;
  function injectCSS(styleId: string, css: string): void;
  function clearCSS(styleId: string): void;
  function alert(title: string | any, body: string | any): string;
  function findModule(filter: ModuleFilter): any | void;
  function findAllModules(filter: ModuleFilter): any[];
  function findModuleByDisplayName(displayName: string): any;
  function findModuleByProps(...properties: string[]): any | void;
  function findModuleByPrototypes(...prototypes: string[]): any | void;
  function showConfirmationModal(
    title: any,
    body: any,
    options: ConfirmModalOptions
  ): string;
  function monkeyPatch(
    module: any,
    functionName: string,
    options: {
      before: ({
        returnValue,
        methodArguments,
      }: {
        returnValue: any;
        methodArguments: IArguments;
      }) => any;
      after: ({
        returnValue,
        methodArguments,
      }: {
        returnValue: any;
        methodArguments: IArguments;
      }) => any;
      instead: ({
        returnValue,
        methodArguments,
      }: {
        returnValue: any;
        methodArguments: IArguments;
      }) => any;
    }
  ): () => void;

  const Patcher: Patcher;
  const Plugins: Plugins;
  const Themes: Themes;
  const React: typeof ReactInstance;
  const ReactDOM: typeof ReactDOMInstance;
  const version: string;
  const WindowConfigFile: string;
}

declare module 'betterdiscord/api' {
  export default BdApi;
}
