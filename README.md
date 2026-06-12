# Autobattler

## Run Locally

Double-click `run-game.bat`, then open:

```text
http://127.0.0.1:4173
```

You can also run this from a terminal in the project folder:

```powershell
py -m http.server 4173
```

The game can be served locally or hosted as static files. Running a local server is still the simplest way to test the full project consistently.

## Graphics

The current build uses a 2.5D presentation: transparent PNG hero sprites in `assets/heroes`, a painted arena backdrop in `assets/arena/arcane-ruins-25d.png`, and DOM-based spell effects. The older inline SVG hero bodies remain as a fallback if a hero image fails to load.
