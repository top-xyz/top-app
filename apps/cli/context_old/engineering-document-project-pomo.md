# Technical Documentation for pomo

## Architecture Overview

pomo is a macOS pomodoro timer widget built with SwiftUI and Metal. It features a clean and minimal interface with four dots that use Metal-driven animations to indicate progress and completion. The widget also includes simple start and complete break buttons.

## Technical Requirements

* macOS 13.0+
* Xcode 14.0+
* Swift 5.7+

## Implementation Details

### SwiftUI Views

The main view of the widget is a `VStack` containing the four progress dots, the start button, and the complete break button. Each dot is a `Circle` with a custom `MetalAnimation` view that animates its glow based on the progress of the timer.

### Metal Animation

The `MetalAnimation` view uses Metal to create a glowing animation effect. The animation is driven by a timer that updates the glow intensity based on the progress of the pomodoro timer.

### Timer Logic

The timer logic is implemented using a `Timer` object. The timer fires every second and updates the progress of the pomodoro timer. When the timer reaches the end of a pomodoro session, it triggers a notification and resets the timer.

## API Documentation

The pomo widget does not have a public API.

## Development Setup

1. Clone the pomo repository.
2. Open the pomo.xcodeproj file in Xcode.
3. Build and run the project.

## Additional Notes

* The pomo widget is still under development.
* The widget is not currently available on the App Store.
* The widget is open source and available on GitHub.

## Example Usage

To use the pomo widget, simply add it to your macOS menu bar. You can then start and stop the timer, and take breaks as needed.

## Diagrams

### Architecture Diagram

```
+----------------+
|  pomo Widget  |
+----------------+
     |
     v
+----------------+
| SwiftUI Views |
+----------------+
     |
     v
+----------------+
| Metal Animation |
+----------------+
     |
     v
+----------------+
| Timer Logic    |
+----------------+
```

### Glow Animation Diagram

```
+----------------+
|  Progress Dot  |
+----------------+
     |
     v
+----------------+
| Metal Animation |
+----------------+
     |
     v
+----------------+
| Glow Intensity |
+----------------+
```