# LemonChallenge
Sr Frontend Dev Lemon Challenge Christian Juhal

## Descripción
LemonChallenge es una aplicación móvil desarrollada en **React Native** que forma parte del desafío técnico de Lemon Cash.  
La app incluye funcionalidades de:
- Integración con **Google Sign-In**.
- Gestión de criptomonedas (validación de direcciones, selección de cripto y fiat).
- Navegación con **React Navigation** (stack y bottom tabs).
- Manejo de estado global con **Zustand**.
- Consumo de APIs usando **axios** y **React Query**.
- Escaneo de códigos de barra y QR con **react-native-vision-camera**.
- Interfaz con componentes de **React Native Paper** y soporte para dispositivos con safe area.

La aplicación fue desarrollada en **React Native 0.80.2** y está preparada para **Android e iOS**.

---

## Setup del proyecto

1. Clonar el repositorio:

- git clone <REPO_URL>
- cd LemonChallenge
- utilizar branch master

2. Instalar dependencias:
yarn install

3. Limpiar builds anteriores (opcional pero recomendado en caso de errores):
yarn reset

4. Instalar pods para iOS:
cd ios && pod install && cd ..

# Librerías utilizadas
## Navegación

- @react-navigation/native

- @react-navigation/native-stack

- @react-navigation/bottom-tabs

- react-native-screens

- react-native-safe-area-context

- react-native-gesture-handler

## UI y componentes

- react-native-paper

- react-native-vector-icons

## Estado y datos

- zustand — manejo de estado global

- @tanstack/react-query — manejo de datos remotos y caching

- axios — requests HTTP

## Funcionalidades adicionales

- @react-native-async-storage/async-storage — almacenamiento local

- @react-native-google-signin/google-signin — autenticación con Google

- multicoin-address-validator — validación de direcciones de criptomonedas

- react-native-vision-camera — escaneo de códigos de barra y QR

## Herramientas de desarrollo

- typescript — tipado estático

- eslint y prettier — linting y formateo

- jest y react-test-renderer — testing

# Instrucciones para correrlo
Ejecutar en modo desarrollo / Metro Bundler (se testeo en android conectado usb al celular)

## Android

yarn android

## iOS

yarn ios

## Bundler
yarn start o yarn start --reset-cache

## Requisitos

Node >=20 (desarrollado con 20.19.4)

Yarn o npm

Android Studio (para Android)

Xcode (para iOS)

Dispositivo o emulador para pruebas

Conexión a internet

# Ejemplos
En assets/qr_examples se pueden encontrar ejemplos de QR para escanear que se probaron como caso de éxito al detectar redes con libreria.