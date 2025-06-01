# Leaky Bucket Visualizer

A visual implementation of the Leaky Bucket Algorithm for network traffic shaping and rate limiting.

## Overview

The Leaky Bucket Visualizer is an interactive tool that demonstrates how the Leaky Bucket Algorithm works in controlling data flow rates. This algorithm is commonly used in telecommunications and network traffic management to regulate data transmission and prevent network congestion.

## Features

-   Real-time visualization of the Leaky Bucket Algorithm
-   Adjustable parameters (bucket size, leak rate, input rate)
-   Visual representation of packet flow, drops, and processing
-   Educational tool for understanding network traffic shaping concepts

## How It Works

The Leaky Bucket Algorithm works on a simple principle:

1. Incoming packets are placed into a bucket (buffer) of fixed capacity
2. Packets leak out of the bucket at a constant rate
3. If the bucket overflows, incoming packets are dropped
4. This ensures a consistent output rate regardless of input bursts

## Usage

1. Install dependencies for both client and server:

    ```bash
    # Install client dependencies
    cd client
    npm install

    # Install server dependencies
    cd ../server
    npm install
    ```

2. Start the client development server:

    ```bash
    cd client
    npm run dev
    ```

3. Start the backend server:
    ```bash
    cd server
    npm start
    ```
